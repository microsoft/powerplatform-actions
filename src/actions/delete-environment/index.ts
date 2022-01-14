// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { deleteEnvironment } from "@microsoft/powerplatform-cli-wrapper/dist/actions";
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
    const parameterMap = taskParser.getHostParameterEntries('delete-environment');

    core.startGroup('delete-environment:');
    await deleteEnvironment({
        credentials: getCredentials(),
        environmentUrl: parameterMap['environment-url'],
        environment: parameterMap['environment'],
        environmentId: parameterMap['environment-id']
    }, runnerParameters, new ActionsHost());
    core.info('environment deleted');
    core.endGroup();
}
