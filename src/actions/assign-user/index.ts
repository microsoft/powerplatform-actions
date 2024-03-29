// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { assignUser } from "@microsoft/powerplatform-cli-wrapper/dist/actions";
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
    const parameterMap = taskParser.getHostParameterEntries('assign-user');

    core.startGroup('assign-user:');

    await assignUser({
        credentials: getCredentials(),
        environment: parameterMap['environment'],
        user: parameterMap['user'],
        role: parameterMap['role'],
        applicationUser: parameterMap['application-user'],
        businessUnit: parameterMap['business-unit'],
        logToConsole: false,
    }, runnerParameters, new ActionsHost());
    core.endGroup();
}
