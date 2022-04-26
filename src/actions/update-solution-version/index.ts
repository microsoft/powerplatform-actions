// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import { updateVersionSolution } from "@microsoft/powerplatform-cli-wrapper/dist/actions";
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
        core.startGroup('update-solution-version:');
        const taskParser = new YamlParser();
        const parameterMap = taskParser.getHostParameterEntries('update-solution-version');

        await updateVersionSolution({
            credentials: getCredentials(),
            environmentUrl: getEnvironmentUrl(),
            buildVersion: parameterMap['build-version'],
            revisionVersion: parameterMap['revision-version'],
            patchVersion: parameterMap['patch-version'],
            strategy: parameterMap['strategy'],
            fileName: parameterMap['tracker-file'],
        }, runnerParameters, new ActionsHost());
        core.endGroup();
    } catch (error) {
        const logger = runnerParameters.logger;
        logger.error(`failed: ${error}`);
        core.endGroup();
    }
}
