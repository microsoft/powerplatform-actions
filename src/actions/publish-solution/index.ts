// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import { publishSolution } from "@microsoft/powerplatform-cli-wrapper/dist/actions";
import { YamlParser } from '../../lib/parser/YamlParser';
import getCredentials from "../../lib/auth/getCredentials";
import getEnvironmentUrl from "../../lib/auth/getEnvironmentUrl";
import { ActionsHost } from '../../lib/host/ActionsHost';
import { runnerParameters } from "../../lib/runnerParameters";

(async () => {
    if (process.env.GITHUB_ACTIONS) {
        await main();
    }
})();

export async function main(): Promise<void> {
    try {
        const taskParser = new YamlParser();
        const parameterMap = taskParser.getHostParameterEntries('publish-solution');

        core.startGroup('publish-solution:');
        await publishSolution({
            credentials: getCredentials(),
            environmentUrl: getEnvironmentUrl(),
            async: parameterMap['run-asynchronously'],
            maxAsyncWaitTimeInMin: parameterMap['max-async-wait-time'],
            logToConsole: false,
        }, runnerParameters, new ActionsHost);
        core.endGroup();
    } catch (error) {
        const logger = runnerParameters.logger;
        logger.error(`failed: ${error}`);
        core.endGroup();
    }
}
