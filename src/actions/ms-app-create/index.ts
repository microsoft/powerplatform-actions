// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// src/actions/ms-app-create/index.ts
//
// Provisions a new MAAF code app via `ms app create` and scaffolds the
// project. Hardcodes `--repo none` (escape-hatch / byoBuild) for the
// GitHub Actions context.
//
// Writes ms.config.json with the assigned appId and environmentId for
// downstream ms-app-pack and ms-app-deploy actions.

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
    displayName: 'display-name',
    appIdentifier: 'app-identifier',
    workingDirectory: 'working-directory',
    cloud: 'cloud',
    force: 'force',
    appId: 'app-id',
    clientSecret: 'client-secret',
    tenantId: 'tenant-id',
} as const;

const MS_CONFIG_FILE = 'ms.config.json';

interface CreateResult {
    id?: string;
    displayName?: string;
    environmentId?: string;
    appId?: string;
    [key: string]: unknown;
}

(async () => {
    if (process.env.GITHUB_ACTIONS) {
        await main();
    }
})().catch(error => {
    core.error(`ms-app-create failed: ${error}`);
    core.setFailed(error instanceof Error ? error.message : String(error));
    core.endGroup();
});

export async function main(): Promise<void> {
    core.startGroup('ms-app-create:');

    const displayName = core.getInput(argName.displayName, { required: true });
    const appIdentifier = core.getInput(argName.appIdentifier, { required: false });
    const cloud = core.getInput(argName.cloud, { required: false }) || 'test';
    const force = core.getInput(argName.force, { required: false }) === 'true';

    const appId = core.getInput(argName.appId, { required: false });
    const clientSecret = core.getInput(argName.clientSecret, { required: false });
    const tenantId = core.getInput(argName.tenantId, { required: false });

    const workingDirectory = resolveWorkingDirectory(
        core.getInput(argName.workingDirectory, { required: false })
    );

    if (clientSecret) core.setSecret(clientSecret);

    if (process.env[MsInstalledEnvVarName] !== 'true') {
        throw new Error(
            'ms CLI is not installed. Add the install-ms-cli action before ms-app-create:\n' +
            '  - uses: microsoft/powerplatform-actions/install-ms-cli@v1'
        );
    }

    await fs.mkdir(workingDirectory, { recursive: true });

    const cliEnv = buildCliEnv({ cloud, appId, clientSecret, tenantId });
    const args = buildCliArgs({ displayName, appIdentifier, force });

    core.info(`Running: ms ${args.join(' ')} (cwd: ${workingDirectory})`);
    const result = await exec.getExecOutput('ms', args, {
        cwd: workingDirectory,
        env: cliEnv,
        ignoreReturnCode: true,
    });

    if (result.exitCode !== 0) {
        throw new Error(
            `ms app create failed (exit ${result.exitCode}):\n${result.stderr || result.stdout}`
        );
    }

    const parsed = parseJsonOutput<CreateResult>(result.stdout, 'ms app create');

    const configPath = path.join(workingDirectory, MS_CONFIG_FILE);
    if (parsed.id) core.setOutput('app-id', parsed.id);
    if (parsed.environmentId) core.setOutput('environment-id', parsed.environmentId);
    core.setOutput('config-path', configPath);

    core.info(`App '${parsed.displayName ?? displayName}' created (id: ${parsed.id ?? 'unknown'}).`);
    core.info(`Config written to: ${configPath}`);
    core.endGroup();
}

function buildCliArgs(opts: {
    displayName: string;
    appIdentifier: string;
    force: boolean;
}): string[] {
    // `.` is the positional [directory] arg — scaffold into cwd.
    // `--repo none` is hardcoded for the GitHub Actions / escape-hatch context.
    const args: string[] = [
        'app', 'create', '.',
        '--non-interactive', '--json',
        '--display-name', opts.displayName,
        '--repo', 'none',
    ];
    if (opts.appIdentifier) {
        args.push('--app-id', opts.appIdentifier);
    }
    if (opts.force) {
        args.push('--force');
    }
    return args;
}

function resolveWorkingDirectory(input: string): string {
    if (!input) {
        return process.env['GITHUB_WORKSPACE'] || process.cwd();
    }
    return path.isAbsolute(input)
        ? input
        : path.resolve(process.env['GITHUB_WORKSPACE'] || process.cwd(), input);
}

function buildCliEnv(opts: {
    cloud: string;
    appId: string;
    clientSecret: string;
    tenantId: string;
}): Record<string, string> {
    const env: Record<string, string> = {};
    for (const [k, v] of Object.entries(process.env)) {
        if (typeof v === 'string') env[k] = v;
    }
    env[CLI_ENV_VARS.cloudInstance] = opts.cloud;

    const hasFullSpn = opts.appId && opts.clientSecret && opts.tenantId;
    if (hasFullSpn) {
        env[CLI_ENV_VARS.useSpAuth] = 'true';
        env[CLI_ENV_VARS.spClientId] = opts.appId;
        env[CLI_ENV_VARS.spClientSecret] = opts.clientSecret;
        env[CLI_ENV_VARS.spTenantId] = opts.tenantId;
        core.info('Service Principal auth enabled.');
    } else if (opts.appId || opts.clientSecret || opts.tenantId) {
        core.warning(
            'Partial SPN inputs supplied (need all of app-id, client-secret, tenant-id). ' +
            'Create will likely fail because the CLI auto-activates SP auth in CI.'
        );
    }

    return env;
}

function parseJsonOutput<T>(stdout: string, label: string): T {
    const trimmed = stdout.trim();
    if (!trimmed) {
        throw new Error(`${label} produced no JSON output.`);
    }
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
