// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// src/actions/ms-app-deploy/index.ts
//
// Orchestrates the MAAF dogfood publish flow:
//   1. ms app build       --commit <sha>           → start server-side build
//   2. ms app build-status --operation-id <opId>   → poll until terminal status
//   3. ms app deploy      --commit <sha>           → deploy built bits
//
// Reads appId and environmentId from ms.config.json in the working directory.
//
// Auth: optionally sets MS_CLI_SP_* + MS_CLI_USE_SP_AUTH=true when all three
// SPN inputs are supplied. SPN auth is currently rejected by the Power Apps
// RP for MAAF operations — see action.yml for the known blocker.

import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { MsInstalledEnvVarName } from '../install-ms-cli/index';

const CLI_ENV_VARS = {
    useSpAuth: 'MS_CLI_USE_SP_AUTH',
    spClientId: 'MS_CLI_SP_CLIENT_ID',
    spClientSecret: 'MS_CLI_SP_CLIENT_SECRET',
    spTenantId: 'MS_CLI_SP_TENANT_ID',
    cloudInstance: 'MS_CLI_CLOUD_INSTANCE',
} as const;

const argName = {
    appName: 'app-name',
    commitSha: 'commit-sha',
    cloud: 'cloud',
    workingDirectory: 'working-directory',
    buildTimeoutSeconds: 'build-timeout-seconds',
    buildPollIntervalSeconds: 'build-poll-interval-seconds',
    skipBuild: 'skip-build',
    appId: 'app-id',
    clientSecret: 'client-secret',
    tenantId: 'tenant-id',
} as const;

const MS_CONFIG_FILE = 'ms.config.json';

// Terminal build statuses (case-insensitive match). Anything not in these
// sets is treated as in-progress and polled again.
const TERMINAL_SUCCESS = new Set(['succeeded']);
const TERMINAL_FAILURE = new Set(['failed', 'cancelled', 'canceled']);

interface BuildStartResult {
    operationId?: string;
    cached?: boolean;
    retryAfterMs?: number;
}

interface BuildStatusResult {
    status: string;
    [key: string]: unknown;
}

interface DeployResult {
    id?: string;
    displayName?: string;
    environmentId?: string;
    commitHash?: string;
    [key: string]: unknown;
}

(async () => {
    if (process.env.GITHUB_ACTIONS) {
        await main();
    }
})().catch(error => {
    core.error(`ms-app-deploy failed: ${error}`);
    core.setFailed(error instanceof Error ? error.message : String(error));
    core.endGroup();
});

export async function main(): Promise<void> {
    core.startGroup('ms-app-deploy:');

    const appNameOverride = core.getInput(argName.appName, { required: false });
    const cloud = core.getInput(argName.cloud, { required: false }) || 'test';
    const skipBuild = core.getInput(argName.skipBuild, { required: false }) === 'true';
    const buildTimeoutSeconds = parseIntInput(argName.buildTimeoutSeconds, 1200);
    const pollIntervalSeconds = parseIntInput(argName.buildPollIntervalSeconds, 10);

    const commitSha = resolveCommitSha(core.getInput(argName.commitSha, { required: false }));

    const appId = core.getInput(argName.appId, { required: false });
    const clientSecret = core.getInput(argName.clientSecret, { required: false });
    const tenantId = core.getInput(argName.tenantId, { required: false });

    const workingDirectory = resolveWorkingDirectory(
        core.getInput(argName.workingDirectory, { required: false })
    );

    if (clientSecret) core.setSecret(clientSecret);

    if (process.env[MsInstalledEnvVarName] !== 'true') {
        throw new Error(
            'ms CLI is not installed. Add the install-ms-cli action before ms-app-deploy:\n' +
            '  - uses: microsoft/powerplatform-actions/install-ms-cli@v1'
        );
    }

    await validateAppDirectory(workingDirectory);

    const cliEnv = buildCliEnv({
        cloud,
        appNameOverride,
        commitSha,
        appId,
        clientSecret,
        tenantId,
    });

    core.setOutput('commit-sha', commitSha);

    // ── 1. Build ──────────────────────────────────────────────────────────
    let operationId: string | undefined;
    if (skipBuild) {
        core.info('Skipping build (skip-build=true)');
    } else {
        const buildResult = await runBuild(workingDirectory, cliEnv, commitSha);
        operationId = buildResult.operationId;

        if (buildResult.cached) {
            core.info(`Build already up to date for commit ${commitSha}; skipping poll.`);
        } else if (operationId) {
            core.setOutput('build-operation-id', operationId);
            await pollBuildStatus(
                workingDirectory,
                cliEnv,
                operationId,
                buildTimeoutSeconds,
                pollIntervalSeconds
            );
        } else {
            throw new Error('`ms app build` returned no operation ID and was not cached.');
        }
    }

    // ── 2. Deploy ─────────────────────────────────────────────────────────
    const deployResult = await runDeploy(workingDirectory, cliEnv, commitSha);
    if (deployResult.id) core.setOutput('app-id', deployResult.id);
    if (deployResult.environmentId) core.setOutput('environment-id', deployResult.environmentId);

    core.info(
        `App '${deployResult.displayName ?? '(unknown)'}' deployed (id: ${deployResult.id ?? 'unknown'}).`
    );

    core.endGroup();
}

// ────────────────────────────────────────────────────────────────────────────
// CLI invocations
// ────────────────────────────────────────────────────────────────────────────

async function runBuild(
    cwd: string,
    env: Record<string, string>,
    commitSha: string
): Promise<BuildStartResult> {
    core.info(`Triggering server-side build for commit ${commitSha}...`);
    const args = ['app', 'build', '--non-interactive', '--json', '--commit', commitSha];
    const result = await exec.getExecOutput('ms', args, { cwd, env, ignoreReturnCode: true });

    if (result.exitCode !== 0) {
        throw new Error(`ms app build failed (exit ${result.exitCode}):\n${result.stderr || result.stdout}`);
    }

    const parsed = parseJsonOutput<BuildStartResult>(result.stdout, 'ms app build');
    return parsed;
}

async function pollBuildStatus(
    cwd: string,
    env: Record<string, string>,
    operationId: string,
    timeoutSeconds: number,
    pollIntervalSeconds: number
): Promise<void> {
    core.info(`Polling build status (operation ${operationId}, timeout ${timeoutSeconds}s)...`);
    const deadline = Date.now() + timeoutSeconds * 1000;

    while (Date.now() < deadline) {
        const args = [
            'app', 'build-status',
            '--non-interactive', '--json',
            '--operation-id', operationId,
        ];
        const result = await exec.getExecOutput('ms', args, { cwd, env, ignoreReturnCode: true });

        if (result.exitCode !== 0) {
            throw new Error(
                `ms app build-status failed (exit ${result.exitCode}):\n${result.stderr || result.stdout}`
            );
        }

        const parsed = parseJsonOutput<BuildStatusResult>(result.stdout, 'ms app build-status');
        const status = (parsed.status ?? '').toLowerCase();
        core.info(`Build status: ${parsed.status}`);

        if (TERMINAL_SUCCESS.has(status)) {
            return;
        }
        if (TERMINAL_FAILURE.has(status)) {
            throw new Error(
                `Build reached terminal failure state '${parsed.status}'. Full payload:\n` +
                JSON.stringify(parsed, null, 2)
            );
        }

        await sleep(pollIntervalSeconds * 1000);
    }

    throw new Error(
        `Build did not reach a terminal state within ${timeoutSeconds}s. ` +
        `Last operation ID: ${operationId}`
    );
}

async function runDeploy(
    cwd: string,
    env: Record<string, string>,
    commitSha: string
): Promise<DeployResult> {
    core.info(`Deploying commit ${commitSha}...`);
    const args = ['app', 'deploy', '--non-interactive', '--json', '--commit', commitSha];
    const result = await exec.getExecOutput('ms', args, { cwd, env, ignoreReturnCode: true });

    if (result.exitCode !== 0) {
        throw new Error(`ms app deploy failed (exit ${result.exitCode}):\n${result.stderr || result.stdout}`);
    }

    return parseJsonOutput<DeployResult>(result.stdout, 'ms app deploy');
}

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

function resolveCommitSha(input: string): string {
    if (input) return input;
    const githubSha = process.env['GITHUB_SHA'];
    if (githubSha) return githubSha;
    throw new Error(
        'No commit SHA available. Provide `commit-sha` input or run inside a GitHub Actions checkout.'
    );
}

function resolveWorkingDirectory(input: string): string {
    if (!input) {
        return process.env['GITHUB_WORKSPACE'] || process.cwd();
    }
    return path.isAbsolute(input)
        ? input
        : path.resolve(process.env['GITHUB_WORKSPACE'] || process.cwd(), input);
}

async function validateAppDirectory(dir: string): Promise<void> {
    const configPath = path.join(dir, MS_CONFIG_FILE);
    await fs.access(configPath).catch(() => {
        throw new Error(
            `${MS_CONFIG_FILE} not found in working-directory: ${dir}\n` +
            'Ensure working-directory points to a MAAF app created via `ms app create`.'
        );
    });
    core.info(`App directory validated: ${dir}`);
}

function buildCliEnv(opts: {
    cloud: string;
    appNameOverride: string;
    commitSha: string;
    appId: string;
    clientSecret: string;
    tenantId: string;
}): Record<string, string> {
    const env: Record<string, string> = {};
    for (const [k, v] of Object.entries(process.env)) {
        if (typeof v === 'string') env[k] = v;
    }
    env[CLI_ENV_VARS.cloudInstance] = opts.cloud;

    // Only enable SPN auth when all three inputs are present together. Partial
    // configuration would leave MS_CLI_USE_SP_AUTH=true with missing creds and
    // produce a confusing error.
    const hasFullSpn = opts.appId && opts.clientSecret && opts.tenantId;
    if (hasFullSpn) {
        env[CLI_ENV_VARS.useSpAuth] = 'true';
        env[CLI_ENV_VARS.spClientId] = opts.appId;
        env[CLI_ENV_VARS.spClientSecret] = opts.clientSecret;
        env[CLI_ENV_VARS.spTenantId] = opts.tenantId;
        core.info('Service Principal auth enabled.');
        core.warning(
            'Note: the Power Apps RP currently rejects SPN identities for MAAF operations. ' +
            'This call will likely fail with ServicePrincipalNotSupportedForMaafOperations ' +
            'until the RP enables SPN or the CLI adds federated auth.'
        );
    } else if (opts.appId || opts.clientSecret || opts.tenantId) {
        core.warning(
            'Partial SPN inputs supplied (need all of app-id, client-secret, tenant-id). ' +
            'Falling back to whatever identity is already cached by the CLI.'
        );
    }

    return env;
}

function parseJsonOutput<T>(stdout: string, label: string): T {
    const trimmed = stdout.trim();
    if (!trimmed) {
        throw new Error(`${label} produced no JSON output.`);
    }
    // The CLI may print log lines before the JSON. Take the last JSON object.
    const match = trimmed.match(/\{[\s\S]*\}\s*$/);
    const payload = match ? match[0] : trimmed;
    try {
        return JSON.parse(payload) as T;
    } catch (e) {
        throw new Error(
            `Failed to parse ${label} JSON output: ${e instanceof Error ? e.message : e}\n` +
            `Raw stdout:\n${stdout}`
        );
    }
}

function parseIntInput(name: string, defaultValue: number): number {
    const raw = core.getInput(name, { required: false });
    if (!raw) return defaultValue;
    const parsed = Number.parseInt(raw, 10);
    if (Number.isNaN(parsed) || parsed <= 0) {
        throw new Error(`Input '${name}' must be a positive integer, got '${raw}'.`);
    }
    return parsed;
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
