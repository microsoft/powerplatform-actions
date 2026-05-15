// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// src/actions/ms-app-pack/index.ts
//
// Packs a MAAF code app via `ms app pack`. Pack runs the `buildCommand` from
// ms.config.json (default: `npm run build`) and copies the result into the
// canonical packed layout `<projectRoot>/.ms/packed/apps/<appId>/client/`.
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

    if (process.env[MsInstalledEnvVarName] !== 'true') {
        throw new Error(
            'ms CLI is not installed. Add the install-ms-cli action before ms-app-pack:\n' +
            '  - uses: microsoft/powerplatform-actions/install-ms-cli@v1'
        );
    }

    await validateAppDirectory(workingDirectory);

    core.info('Running `ms app pack` (runs configured build command internally)...');
    const result = await exec.getExecOutput(
        'ms',
        ['app', 'pack', '--non-interactive', '--json'],
        { cwd: workingDirectory, ignoreReturnCode: true }
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
