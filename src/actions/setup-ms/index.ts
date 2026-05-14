// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// src/actions/setup-ms/index.ts
//
// Installs the MAAF `ms` CLI (@microsoft/apps-cli) on the GitHub Actions runner
// via npm. The package's `bin` field maps to the `ms` executable.

import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as io from '@actions/io';
import * as os from 'node:os';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';

const MS_CLI_BINARY = 'ms';

export const MsInstalledEnvVarName = 'POWERPLATFORMTOOLS_MSINSTALLED';
export const MsPathEnvVarName = 'POWERPLATFORMTOOLS_MSPATH';

const argName = {
    version: 'version',
    registryUrl: 'registry-url',
    registryAuthToken: 'registry-auth-token',
    npmPackageName: 'npm-package-name',
};

(async () => {
    if (process.env.GITHUB_ACTIONS) {
        await main();
    }
})().catch(error => {
    core.error(`setup-ms failed: ${error}`);
    core.setFailed(error instanceof Error ? error.message : String(error));
    core.endGroup();
});

export async function main(): Promise<void> {
    core.startGroup('setup-ms:');

    const version = core.getInput(argName.version, { required: false }) || 'latest';
    const registryUrl = core.getInput(argName.registryUrl, { required: false }) || 'https://registry.npmjs.org';
    const registryAuthToken = core.getInput(argName.registryAuthToken, { required: false });
    const npmPackageName = core.getInput(argName.npmPackageName, { required: false }) || '@microsoft/apps-cli';

    // Mask the auth token so it never appears in logs
    if (registryAuthToken) {
        core.setSecret(registryAuthToken);
    }

    // Skip if already installed
    if (process.env[MsInstalledEnvVarName] === 'true') {
        core.warning('ms CLI is already installed. Skipping installation.');
        core.endGroup();
        return;
    }

    core.info(`Installing ${npmPackageName}@${version} from ${registryUrl}`);

    // Write a temporary .npmrc if a private registry + token is supplied
    let tmpNpmrc: string | undefined;
    try {
        if (registryAuthToken && registryUrl !== 'https://registry.npmjs.org') {
            tmpNpmrc = await writeTempNpmrc(registryUrl, registryAuthToken);
        }

        await installPackage(npmPackageName, version, registryUrl, tmpNpmrc);

        const cliPath = await resolveCliBinPath();
        core.exportVariable(MsInstalledEnvVarName, 'true');
        core.exportVariable(MsPathEnvVarName, cliPath);
        core.addPath(path.dirname(cliPath));

        const installedVersion = await getInstalledVersion(cliPath);
        core.setOutput('cli-version', installedVersion);
        core.info(`✅ ms CLI installed at ${cliPath} (version: ${installedVersion})`);

    } finally {
        if (tmpNpmrc) {
            await fs.rm(tmpNpmrc, { force: true });
        }
    }

    core.endGroup();
}

async function installPackage(
    packageName: string,
    version: string,
    registryUrl: string,
    npmrcPath?: string
): Promise<void> {
    const pkg = version === 'latest' ? packageName : `${packageName}@${version}`;
    const installArgs = ['install', '-g', pkg, `--registry=${registryUrl}`];

    if (npmrcPath) {
        installArgs.push(`--userconfig=${npmrcPath}`);
    }

    const result = await exec.getExecOutput('npm', installArgs, { ignoreReturnCode: true });
    if (result.exitCode !== 0) {
        throw new Error(`npm install failed with exit code ${result.exitCode}:\n${result.stderr}`);
    }
}

async function resolveCliBinPath(): Promise<string> {
    try {
        const binPath = await io.which(MS_CLI_BINARY, true);
        return binPath;
    } catch {
        // Fallback: find via npm prefix
        const npmPrefix = await getNpmPrefix();
        const binaryName = os.platform() === 'win32' ? `${MS_CLI_BINARY}.cmd` : MS_CLI_BINARY;
        const binDir = os.platform() === 'win32' ? npmPrefix : path.join(npmPrefix, 'bin');
        const fullPath = path.join(binDir, binaryName);

        await fs.access(fullPath).catch(() => {
            throw new Error(
                `ms CLI binary not found at ${fullPath}. ` +
                `Ensure ${MS_CLI_BINARY} is in PATH after npm global install.`
            );
        });
        return fullPath;
    }
}

async function getNpmPrefix(): Promise<string> {
    const result = await exec.getExecOutput('npm', ['prefix', '-g'], { silent: true });
    return result.stdout.trim();
}

async function getInstalledVersion(cliPath: string): Promise<string> {
    try {
        const result = await exec.getExecOutput(cliPath, ['--version'], {
            silent: true,
            ignoreReturnCode: true
        });
        return result.stdout.trim() || 'unknown';
    } catch {
        return 'unknown';
    }
}

async function writeTempNpmrc(registryUrl: string, authToken: string): Promise<string> {
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'setup-ms-'));
    const npmrcPath = path.join(tmpDir, '.npmrc');

    // Strip protocol from registry URL for the auth entry. Azure DevOps
    // Artifacts feeds also need always-auth=true.
    const registryHost = registryUrl.replace(/^https?:/, '');
    const content =
        `registry=${registryUrl}\n` +
        `always-auth=true\n` +
        `${registryHost}:_authToken=${authToken}\n`;
    await fs.writeFile(npmrcPath, content, { mode: 0o600 });

    core.info(`Using private registry: ${registryUrl}`);
    return npmrcPath;
}
