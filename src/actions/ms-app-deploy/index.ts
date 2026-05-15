// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// src/actions/ms-app-deploy/index.ts
//
// Deploys a MAAF code app for the given commit by invoking `ms app deploy`.
//
// Per the MAAF Git Inner Loop spec (§7.1), builds are JIT — `ms app deploy`
// auto-triggers a server-side build for a commit if one doesn't exist. The
// older `ms app build` verb is deprecated and rejected by the CLI; this
// action no longer calls it.
//
// Config file: tries `power.config.json` first (current CLI), then falls back
// to legacy `ms.config.json` for older CLIs.
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
    appId: 'app-id',
    clientSecret: 'client-secret',
    tenantId: 'tenant-id',
} as const;

// Try the new filename first; fall back to the legacy one.
const CONFIG_CANDIDATES = ['power.config.json', 'ms.config.json'];

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
        appId,
        clientSecret,
        tenantId,
    });

    core.setOutput('commit-sha', commitSha);

    const deployResult = await runDeploy(workingDirectory, cliEnv, commitSha);
    if (deployResult.id) core.setOutput('app-id', deployResult.id);
    if (deployResult.environmentId) core.setOutput('environment-id', deployResult.environmentId);

    core.info(
        `App '${deployResult.displayName ?? '(unknown)'}' deployed (id: ${deployResult.id ?? 'unknown'}).`
    );

    core.endGroup();
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
    for (const filename of CONFIG_CANDIDATES) {
        const candidate = path.join(dir, filename);
        try {
            await fs.access(candidate);
            core.info(`App directory validated (config: ${filename}): ${dir}`);
            return;
        } catch {
            // try next candidate
        }
    }
    throw new Error(
        `Neither ${CONFIG_CANDIDATES.join(' nor ')} found in working-directory: ${dir}\n` +
        'Ensure working-directory points to a MAAF app created via `ms app create`.'
    );
}

function buildCliEnv(opts: {
    cloud: string;
    appNameOverride: string;
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
