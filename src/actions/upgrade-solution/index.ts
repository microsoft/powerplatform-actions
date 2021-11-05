// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import { upgradeSolution } from "@microsoft/powerplatform-cli-wrapper/dist/actions";
import { YamlParser } from '../../lib/parser/YamlParser';
import { ActionsHost } from '../../lib/host/ActionsHost';
import getCredentials from "../../lib/auth/getCredentials";
import getEnvironmentUrl from "../../lib/auth/getEnvironmentUrl";
import { runnerParameters } from '../../lib/runnerParameters';

(async () => {
    if (process.env.GITHUB_ACTIONS) {
        await main();
    }
})();

export async function main(): Promise<void> {
    try {
        core.startGroup('upgrade-solution:');
        const taskParser = new YamlParser();
        const parameterMap = taskParser.getHostParameterEntries(runnerParameters.workingDir, "upgrade-solution");

        await upgradeSolution({
            credentials: getCredentials(),
            environmentUrl: getEnvironmentUrl(),
            name: parameterMap["solution-name"],
            async: parameterMap["async"],
            maxAsyncWaitTimeInMin: parameterMap["max-async-wait-time"],
        }, runnerParameters, new ActionsHost());
        core.endGroup();
    } catch (error) {
        const logger = runnerParameters.logger;
        logger.error(`failed: ${error}`);
        core.endGroup();
    }
}
