// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { restoreEnvironment } from "@microsoft/powerplatform-cli-wrapper/dist/actions";
import * as core from '@actions/core';
import { YamlParser } from '../../lib/parser/YamlParser';
import { ActionsHost } from '../../lib/host/ActionsHost';
import getCredentials from "../../lib/auth/getCredentials";
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
    const taskParser = new YamlParser();
    const parameterMap = taskParser.getHostParameterEntries('restore-environment');

    core.startGroup('restore-environment:');
    await restoreEnvironment({
        credentials: getCredentials(),
        sourceEnvironmentUrl: parameterMap['source-url'],
        targetEnvironmentUrl: parameterMap['target-url'],
        sourceEnvironment: parameterMap['source-env'],
        targetEnvironment: parameterMap['target-env'],
        restoreLatestBackup: parameterMap['latest-backup'],
        backupDateTime: parameterMap['selected-backup'],
        targetEnvironmentName: parameterMap['friendly-name'],
        logToConsole: false,
    }, runnerParameters, new ActionsHost());
    core.endGroup();
}
