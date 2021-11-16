// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { copyEnvironment } from "@microsoft/powerplatform-cli-wrapper/dist/actions";
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
    const parameterMap = taskParser.getHostParameterEntries(runnerParameters.workingDir, "copy-environment");

    core.startGroup('copy-environment:');
    const sourceUrl = core.getInput('source-url', { required: true});
    await copyEnvironment({
        credentials: getCredentials(),
        sourceEnvironmentUrl: sourceUrl,
        targetEnvironmentUrl: parameterMap['target-url'],
        copyType: parameterMap['copy-type'],
        overrideFriendlyName: parameterMap['override-friendly-name'],
        friendlyTargetEnvironmentName: parameterMap['friendly-name']
      }, runnerParameters, new ActionsHost());
    core.endGroup();
}
