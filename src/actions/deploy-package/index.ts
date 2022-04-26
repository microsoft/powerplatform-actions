// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import { deployPackage } from "@microsoft/powerplatform-cli-wrapper/dist/actions";
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
        core.startGroup('deploy-package:');
        const taskParser = new YamlParser();
        const parameterMap = taskParser.getHostParameterEntries('deploy-package');

        await deployPackage({
            credentials: getCredentials(),
            environmentUrl: getEnvironmentUrl(),
            packagePath: parameterMap["package"],
        }, runnerParameters, new ActionsHost())
        core.info('package deployed.');
        core.endGroup();
    } catch (error) {
        core.setFailed(`failed: ${error}`);
        throw error;
    }
}
