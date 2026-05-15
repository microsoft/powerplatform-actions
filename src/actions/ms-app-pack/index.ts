// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// src/actions/ms-app-pack/index.ts
//
// Packs a MAAF code app via `ms app pack`. Pack runs the `buildCommand` from
// ms.config.json (default: `npm run build`) and copies the result into the
// canonical packed layout `<projectRoot>/.ms/packed/apps/<appId>/client/`.
//
// SPN env vars are forwarded even though pack does not make any RP calls
// itself — the CLI auto-activates SP auth in CI (CI=true is set by GitHub
// Actions) and validates that MS_CLI_SP_* env vars are present at startup.
//
// This action is transitional. Once `ms app deploy --artifact` ships and
// deploy auto-packs for repoType:'none' apps, drop the `ms-app-pack` step
// from your workflow.

import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { MsInstalledEnvVarName } from '../install-ms-cli/index';

const MS_CONFIG_FILE = 'ms.config.json';

const CLI_ENV_VARS = {
    useSpAuth: 'MS_CLI_USE_SP_AUTH',
    spClientId: 'MS_CLI_SP_CLIENT_ID',
    spClientSecret: 'MS_CLI_SP_CLIENT_SECRET',
    spTenantId: 'MS_CLI_SP_TENANT_ID',
} as const;

(async () => {
    if (process.env.GITHUB_ACTIONS) {
        await main();
    }
})().catch(error => {
    core.error(`ms-app-pack failed: ${error}`);
    core.setFailed(error instanceof Error ? error.message : String(error));
    core.endGroup();
});

export async function main(): Promise<void> {
    core.startGroup('ms-app-pack:');

    const workingDirectory = resolveWorkingDirectory(
        core.getInput('working-directory', { required: false })
    );
    const appId = core.getInput('app-id', { required: false });
    const clientSecret = core.getInput('client-secret', { required: false });
    const tenantId = core.getInput('tenant-id', { required: false });

    if (clientSecret) core.setSecret(clientSecret);

    if (process.env[MsInstalledEnvVarName] !== 'true') {
        throw new Error(
            'ms CLI is not installed. Add the install-ms-cli action before ms-app-pack:\n' +
            '  - uses: microsoft/powerplatform-actions/install-ms-cli@v1'
        );
    }

    await validateAppDirectory(workingDirectory);

    const cliEnv = buildCliEnv({ appId, clientSecret, tenantId });

    core.info('Running `ms app pack` (runs configured build command internally)...');
    const result = await exec.getExecOutput(
        'ms',
        ['app', 'pack', '--non-interactive', '--json'],
        { cwd: workingDirectory, env: cliEnv, ignoreReturnCode: true }
    );

    if (result.exitCode !== 0) {
        throw new Error(
            `ms app pack failed (exit ${result.exitCode}):\n${result.stderr || result.stdout}`
        );
    }

    core.info('App packed. Artifact ready under .ms/packed/.');
    core.endGroup();
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
    appId: string;
    clientSecret: string;
    tenantId: string;
}): Record<string, string> {
    const env: Record<string, string> = {};
    for (const [k, v] of Object.entries(process.env)) {
        if (typeof v === 'string') env[k] = v;
    }

    // Only enable SP auth when all three inputs are present together.
    const hasFullSpn = opts.appId && opts.clientSecret && opts.tenantId;
    if (hasFullSpn) {
        env[CLI_ENV_VARS.useSpAuth] = 'true';
        env[CLI_ENV_VARS.spClientId] = opts.appId;
        env[CLI_ENV_VARS.spClientSecret] = opts.clientSecret;
        env[CLI_ENV_VARS.spTenantId] = opts.tenantId;
        core.info('Service Principal auth env vars forwarded.');
    } else if (opts.appId || opts.clientSecret || opts.tenantId) {
        core.warning(
            'Partial SPN inputs supplied (need all of app-id, client-secret, tenant-id). ' +
            'Pack will likely fail because the CLI auto-activates SP auth in CI.'
        );
    }

    return env;
}
