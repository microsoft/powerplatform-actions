// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// src/actions/ms-app-deploy/index.ts
//
// Deploys a MAAF code app via `ms app deploy`. Three modes:
//
//   1. repoType:'none' + artifact-path supplied → --artifact <zip>
//      Uploads a pre-built zip and deploys it.
//   2. repoType:'none' + no artifact-path → no extra flags
//      CLI runs pack internally, zips, uploads, and deploys.
//   3. repoType:'native'/'github' → --commit <sha>
//      Server-side build for the commit, then deploy.
//
// Requires @microsoft/managed-apps-cli >= 0.7.0 for --artifact support.
//
// Reads `appId`, `environmentId`, `repoType` from ms.config.json (written
// by `ms app create`).
//
// Auth: optionally sets MS_CLI_SP_* + MS_CLI_USE_SP_AUTH=true when all
// three SPN inputs are supplied.

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
    artifactPath: 'artifact-path',
    cloud: 'cloud',
    workingDirectory: 'working-directory',
    appId: 'app-id',
    clientSecret: 'client-secret',
    tenantId: 'tenant-id',
} as const;

const MS_CONFIG_FILE = 'ms.config.json';

interface MsConfig {
    appId?: string;
    environmentId?: string;
    repoType?: string;
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
    const commitShaInput = core.getInput(argName.commitSha, { required: false });
    const artifactPathInput = core.getInput(argName.artifactPath, { required: false });

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

    // Read repoType from ms.config.json — repoType:'none' apps deploy via
    // pack/upload (with or without --artifact) and must NOT receive --commit.
    const msConfig = await readMsConfig(workingDirectory);
    const isEscapeHatch = msConfig.repoType === 'none';

    // Mutual exclusion mirrors the CLI's UsageError:
    //   --commit + --artifact is ambiguous and rejected up-front.
    if (commitShaInput && artifactPathInput) {
        throw new Error(
            'commit-sha and artifact-path are mutually exclusive. ' +
            'Use commit-sha for git-backed apps and artifact-path for repoType:\'none\' byoBuild deploys.'
        );
    }
    if (artifactPathInput && !isEscapeHatch) {
        throw new Error(
            "artifact-path is only valid for apps created with repoType:'none'. " +
            'For git-backed apps (native/github), deploy via commit-sha.'
        );
    }

    const artifactPath = artifactPathInput
        ? resolveArtifactPath(artifactPathInput, workingDirectory)
        : undefined;
    const commitSha = isEscapeHatch ? undefined : resolveCommitSha(commitShaInput);

    if (commitSha) core.setOutput('commit-sha', commitSha);

    if (artifactPath) {
        core.info(`Using pre-built artifact: ${artifactPath}`);
    } else if (isEscapeHatch) {
        core.info('repoType is "none" — CLI will pack and upload (no --commit).');
    }

    const cliEnv = buildCliEnv({
        cloud,
        appNameOverride,
        appId,
        clientSecret,
        tenantId,
    });

    const deployResult = await runDeploy(workingDirectory, cliEnv, { commitSha, artifactPath });
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
    opts: { commitSha?: string; artifactPath?: string }
): Promise<DeployResult> {
    const args = ['app', 'deploy', '--non-interactive', '--json'];
    if (opts.artifactPath) {
        core.info(`Deploying artifact at ${opts.artifactPath}...`);
        args.push('--artifact', opts.artifactPath);
    } else if (opts.commitSha) {
        core.info(`Deploying commit ${opts.commitSha}...`);
        args.push('--commit', opts.commitSha);
    } else {
        core.info('Deploying (CLI will pack + upload)...');
    }
    const result = await exec.getExecOutput('ms', args, { cwd, env, ignoreReturnCode: true });

    if (result.exitCode !== 0) {
        throw new Error(`ms app deploy failed (exit ${result.exitCode}):\n${result.stderr || result.stdout}`);
    }

    return parseJsonOutput<DeployResult>(result.stdout, 'ms app deploy');
}

function resolveArtifactPath(input: string, cwd: string): string {
    return path.isAbsolute(input) ? input : path.resolve(cwd, input);
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

async function readMsConfig(dir: string): Promise<MsConfig> {
    const configPath = path.join(dir, MS_CONFIG_FILE);
    try {
        const raw = await fs.readFile(configPath, 'utf-8');
        return JSON.parse(raw) as MsConfig;
    } catch {
        return {};
    }
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
