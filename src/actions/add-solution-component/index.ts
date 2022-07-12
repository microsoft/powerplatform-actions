// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { addSolutionComponent } from "@microsoft/powerplatform-cli-wrapper/dist/actions";
import * as core from '@actions/core';
import { YamlParser } from '../../lib/parser/YamlParser';
import { ActionsHost } from '../../lib/host/ActionsHost';
import getCredentials from "../../lib/auth/getCredentials";
import { runnerParameters } from '../../lib/runnerParameters';
import getEnvironmentUrl from "../../lib/auth/getEnvironmentUrl";

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
    const parameterMap = taskParser.getHostParameterEntries('add-solution-component');

    core.startGroup('add-solution-component:');

    await addSolutionComponent({
        credentials: getCredentials(),
        environmentUrl: getEnvironmentUrl(),
        solutionName: parameterMap['solution-name'],
        component: parameterMap['component'],
        componentType: parameterMap['component-type'],
        addRequiredComponents: parameterMap['add-required-components'],
    }, runnerParameters, new ActionsHost());
    core.endGroup();
}
