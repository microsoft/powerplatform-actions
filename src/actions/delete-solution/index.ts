// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import { deleteSolution } from "@microsoft/powerplatform-cli-wrapper/dist/actions";
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
        core.startGroup('delete-solution:');
        const taskParser = new YamlParser();
        const parameterMap = taskParser.getHostParameterEntries(runnerParameters.workingDir, "delete-solution");

        core.info("solution name: " + parameterMap["solution-name"]);
        await deleteSolution({
            credentials: getCredentials(),
            environmentUrl: getEnvironmentUrl(),
            name: parameterMap["solution-name"]
        }, runnerParameters, new ActionsHost());
        core.endGroup();
    } catch (error) {
        core.setFailed(`failed: ${error}`);
        core.endGroup();
    }
}
