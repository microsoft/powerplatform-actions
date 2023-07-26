// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import { onlineVersionSolution } from "@microsoft/powerplatform-cli-wrapper/dist/actions";
import { YamlParser } from '../../lib/parser/YamlParser';
import { ActionsHost } from '../../lib/host/ActionsHost';
import getCredentials from "../../lib/auth/getCredentials";
import getEnvironmentUrl from "../../lib/auth/getEnvironmentUrl";
import { runnerParameters } from "../../lib/runnerParameters";

(async () => {
    if (process.env.GITHUB_ACTIONS) {
        await main();
    }
})();

export async function main(): Promise<void> {
    try {
        core.startGroup('set-online-solution-version:');
        const taskParser = new YamlParser();
        const parameterMap = taskParser.getHostParameterEntries('set-online-solution-version');

        await onlineVersionSolution({
            credentials: getCredentials(),
            environmentUrl: getEnvironmentUrl(),
            name: parameterMap['name'],
            version: parameterMap['version'],
        }, runnerParameters, new ActionsHost());
        core.endGroup();
    } catch (error) {
        const logger = runnerParameters.logger;
        logger.error(`failed: ${error}`);
        core.endGroup();
    }
}
