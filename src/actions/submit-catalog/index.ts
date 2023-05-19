// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import {submitCatalog} from "@microsoft/powerplatform-cli-wrapper/dist/actions";
import * as core from '@actions/core';
import { YamlParser } from '../../lib/parser/YamlParser';
import { ActionsHost } from '../../lib/host/ActionsHost';
import getCredentials from "../../lib/auth/getCredentials";
import getEnvironmentUrl from "../../lib/auth/getEnvironmentUrl";
import { runnerParameters } from '../../lib/runnerParameters';

(async () => {
    if (process.env.GITHUB_ACTIONS) await main();
})().catch(error => {
    const logger = runnerParameters.logger;
    logger.error(`failed: ${error}`);
    core.endGroup();
});

export async function main (): Promise<void> {
    const taskParser = new YamlParser();
    const parameterMap = taskParser.getHostParameterEntries('submit-catalog');
    core.startGroup('submit-catalog:');
    await submitCatalog({
        credentials: getCredentials(),
        environmentUrl: getEnvironmentUrl(),
        path: parameterMap['path'],
        packageSolutionZipFile: parameterMap['package-or-solution-zip-file'],
        solutionZip: parameterMap['solution-zip'],
        packageZip: parameterMap['package-zip'],
        pollStatus: parameterMap['poll-status']
     }, runnerParameters, new ActionsHost());
     core.endGroup();
}
