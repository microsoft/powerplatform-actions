// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as os from "node:os";
import { dirname, resolve } from 'node:path';
import * as fs from 'node:fs/promises';
import getExePath from '../../lib/getExePath';
import { ActionLogger } from '../../lib/actionLogger';
import { PacDotnetToolName, PacInstalledEnvVarName, PacPackageName, PacPackageVersion } from '../../lib/pacInstallInfo.js';

(async () => {
    if (process.env.GITHUB_ACTIONS) {
        await main();
    }
})().catch(error => {
    const logger = new ActionLogger();
    logger.error(`failed: ${error}`);
    core.endGroup();
});

export async function main(): Promise<void> {
    const packageVersion = PacPackageVersion;
    core.startGroup('actions-install:');
    core.info(`Installing pac ${packageVersion}...`);

    if (process.env[PacInstalledEnvVarName] === 'true') {
        core.warning('PAC is already installed. Skipping installation.');
        core.endGroup();
        return;
    }

    const runnersDir = getExePath();

    if (os.platform() === 'win32') {
        const installDir = resolve(runnersDir, 'pac');
        await nugetInstall(PacPackageName, packageVersion, installDir);
    } else {
        const installDir = resolve(runnersDir, 'pac_linux', 'tools');
        await dotnetInstall(PacDotnetToolName, packageVersion, installDir);
    }

    core.exportVariable(PacInstalledEnvVarName, 'true');
    core.endGroup();
}

async function nugetInstall(packageName: string, packageVersion: string, installDir: string): Promise<void> {
    core.info(`Installing PAC package ${packageName}.${packageVersion} via nuget.exe`);
    core.debug(`Installing to ${installDir}`);

    const outputDirectory = dirname(installDir);

    await exec.getExecOutput('nuget', ['install', packageName,
        '-Version', packageVersion,
        '-DependencyVersion', 'ignore', // There are no dependencies, so don't waste that time checking
        '-OutputDirectory', outputDirectory]);

    // Nuget.exe installs to [PackageName].[PackageVersion], but we need this to be 'pac' to match
    // the cli-wrapper logic.
    core.debug(`Renaming ${outputDirectory} to ${installDir}`);
    await fs.rename(outputDirectory, installDir);
}

async function dotnetInstall(packageName: string, packageVersion: string, installDir: string): Promise<void> {
    core.info(`Installing PAC package ${PacDotnetToolName}.${packageVersion} via dotnet tool install`);

    await exec.getExecOutput('dotnet', ['tool', 'install', packageName,
        '--version', packageVersion,
        '--tool-path', installDir]);
}
