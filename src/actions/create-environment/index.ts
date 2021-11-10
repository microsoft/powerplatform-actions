// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { createEnvironment } from "@microsoft/powerplatform-cli-wrapper/dist/actions";
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
    const parameterMap = taskParser.getHostParameterEntries(runnerParameters.workingDir, "create-environment");

    core.startGroup('create-environment:');
    await createEnvironment({
        credentials: getCredentials(),
        environmentName: parameterMap['name'],
        environmentType: parameterMap['type'],
        region: parameterMap['region'],
        currency: parameterMap['currency'],
        language: parameterMap['language'],
        templates: parameterMap['templates'],
        domainName: parameterMap['domain']
    }, runnerParameters, new ActionsHost());
    core.endGroup();
}
