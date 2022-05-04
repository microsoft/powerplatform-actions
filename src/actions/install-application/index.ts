// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { installApplication } from "@microsoft/powerplatform-cli-wrapper/dist/actions";
import * as core from '@actions/core';
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
        core.startGroup('install-application:');
        const taskParser = new YamlParser();
        const parameterMap = taskParser.getHostParameterEntries('install-application');
        const actionsHost = new ActionsHost();
        const workingDir = actionsHost.getInput({ name: "working-directory", required: false });
        if (workingDir) {
            runnerParameters.workingDir = workingDir;
        }

        await installApplication({
            credentials: getCredentials(),
            environmentUrl: getEnvironmentUrl(),
            environmentId: parameterMap['environment-id'],
            applicationName: parameterMap['application-name'],
            applicationList: parameterMap['application-list']
        }, runnerParameters, actionsHost);
        core.endGroup();
    } catch (error) {
        core.setFailed(`failed: ${error}`);
        throw error;
    }
}
