// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as os from "node:os";
import { resolve } from 'node:path';
import * as fs from 'node:fs/promises';
import { runnerParameters } from '../../lib/runnerParameters';

(async () => {
    if (process.env.GITHUB_ACTIONS) {
        await main();
    }
})().catch(error => {
    const logger = runnerParameters.logger;
    logger.error(`failed: ${error}`);
    core.endGroup();
});

export async function main(): Promise<void> {
    const packageVersion = '1.25.5';
    core.startGroup('actions-install:');

    if (os.platform() === 'win32') {
        const packageName = 'Microsoft.PowerApps.CLI';

        const installDir = resolve(runnerParameters.runnersDir);

        await exec.getExecOutput('nuget', ['install', packageName,
            '-Version', packageVersion,
            '-OutputDirectory', installDir]);
        // Nuget.exe installs to [PackageName].[PackageVersion], but we need this to be 'pac' to match
        // the cli-wrapper logic.
        await fs.rename(resolve(installDir, packageName + '.' + packageVersion), resolve(installDir, 'pac'));

    } else {
        const installDir = resolve(runnerParameters.runnersDir, 'pac_linux', 'tools');

        await exec.getExecOutput('dotnet', ['tool', 'install', 'Microsoft.PowerApps.CLI.Tool',
            '--version', packageVersion,
            '--tool-path', installDir]);

    }
    core.endGroup();
}
