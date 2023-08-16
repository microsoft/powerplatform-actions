// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as os from "node:os";
import { resolve } from 'node:path';
import * as fs from 'node:fs/promises';
import getExePath from '../../lib/getExePath';
import { ActionLogger } from '../../lib/actionLogger';
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
    const packageVersion = '1.25.5';
    core.startGroup('actions-install:');
    core.info(`Installing pac ${packageVersion}...`);

    if (process.env[PacInstalledEnvVarName] === 'true') {
        core.warning('PAC is already installed. Skipping installation.');
        core.endGroup();
        return;
    }

    const runnersDir = getExePath();

    if (os.platform() === 'win32') {
        const packageName = 'Microsoft.PowerApps.CLI';
        core.info(`Installing PAC package ${packageName}.${packageVersion} via nuget.exe`);

        const installDir = resolve(runnersDir);
        core.debug(`Installing to ${installDir}`);

        await exec.getExecOutput('nuget', ['install', packageName,
            '-Version', packageVersion,
            '-DependencyVersion', 'ignore', // There are no dependencies, so don't waste that time checking
            '-OutputDirectory', installDir]);

        // Nuget.exe installs to [PackageName].[PackageVersion], but we need this to be 'pac' to match
        // the cli-wrapper logic.
        const original = resolve(installDir, packageName + '.' + packageVersion);
        const target = resolve(installDir, 'pac');
        core.debug(`Renaming ${original} to ${target}`);
        await fs.rename(original, target);

    } else {
        const packageName = 'Microsoft.PowerApps.CLI.Tool';
        const installDir = resolve(runnersDir, 'pac_linux', 'tools');
        core.info(`Installing PAC package ${packageName}.${packageVersion} via dotnet tool install`);

        await exec.getExecOutput('dotnet', ['tool', 'install', packageName,
            '--version', packageVersion,
            '--tool-path', installDir]);
    }

    core.exportVariable(PacInstalledEnvVarName, 'true');
    core.endGroup();
}
