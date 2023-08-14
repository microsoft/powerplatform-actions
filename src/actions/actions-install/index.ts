// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as os from "node:os";
import { resolve } from 'node:path';
// import { YamlParser } from '../../lib/parser/YamlParser';
// import { ActionsHost } from '../../lib/host/ActionsHost';
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
    // const taskParser = new YamlParser();
    // const actionsHost = new ActionsHost();
    // const parameterMap = taskParser.getHostParameterEntries('actions-install');

    core.startGroup('actions-install:');

    if (os.platform() === 'win32') {
        // Download net48 zip
        // const installDir = resolve(runnerParameters.runnersDir, 'pac', 'tools');
    } else {
        const installDir = resolve(runnerParameters.runnersDir, 'pac_linux', 'tools');
        await exec.getExecOutput('pwd');
        await exec.exec('pwd');

        await exec.getExecOutput('dotnet', ['tool', 'install', 'Microsoft.PowerApps.CLI.Tool',
            '--version', '1.25.5',
            '--tool-path', installDir]);
        await exec.exec('dotnet', ['tool', 'install', 'Microsoft.PowerApps.CLI.Tool',
            '--version', '1.25.5',
            '--tool-path', (installDir + "2")]);

    }
    core.endGroup();
}
