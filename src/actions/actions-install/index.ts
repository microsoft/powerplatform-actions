// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as os from "node:os";
import { dirname, resolve } from 'node:path';
import * as fs from 'node:fs/promises';
import getExePath from '../../lib/getExePath';
import { ActionLogger } from '../../lib/actionLogger';
import * as PacInfo from "../../pacPackageInfo.json";
import { PacInstalledEnvVarName } from '../../lib/runnerParameters';

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
    const packageVersion = PacInfo.PacPackageVersion;
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
        await nugetInstall(PacInfo.PacPackageName, packageVersion, installDir);
    } else {
        const installDir = resolve(runnersDir, 'pac_linux', 'tools');
        await dotnetInstall(PacInfo.DotnetToolName, packageVersion, installDir);
    }

    core.exportVariable(PacInstalledEnvVarName, 'true');
    core.endGroup();
}

async function nugetInstall(packageName: string, packageVersion: string, installDir: string): Promise<void> {
    core.info(`Installing ${packageName}.${packageVersion} via nuget.exe`);
    core.debug(`Installing to ${installDir}`);

    const outputDirectory = dirname(installDir);

    await exec.getExecOutput('nuget', ['install', packageName,
        '-Version', packageVersion,
        '-DependencyVersion', 'ignore', // There are no dependencies, so don't waste that time checking
        '-OutputDirectory', outputDirectory]);

    // Nuget.exe installs to [PackageName].[PackageVersion], but we need this to be 'pac' to match
    // the cli-wrapper logic.
    const initialInstallDirectory = resolve(outputDirectory, packageName + '.' + packageVersion);
    core.debug(`Renaming ${initialInstallDirectory} to ${installDir}`);
    await fs.rename(initialInstallDirectory, installDir);
}

async function dotnetInstall(packageName: string, packageVersion: string, installDir: string): Promise<void> {
    core.info(`Installing ${packageName}.${packageVersion} via dotnet tool install`);

    await exec.getExecOutput('dotnet', ['tool', 'install', packageName,
        '--version', packageVersion,
        '--tool-path', installDir]);
}
