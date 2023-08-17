// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { cloneSolution } from "@microsoft/powerplatform-cli-wrapper/dist/actions";
import * as core from '@actions/core';
import { YamlParser } from '../../lib/parser/YamlParser';
import { ActionsHost } from '../../lib/host/ActionsHost';
import getCredentials from "../../lib/auth/getCredentials";
import getEnvironmentUrl from "../../lib/auth/getEnvironmentUrl";
import { runnerParameters } from '../../lib/runnerParameters';

(async () => {
    const taskParser = new YamlParser();
    const parameterMap = taskParser.getHostParameterEntries('export-solution');
    const actionsHost = new ActionsHost();
    const workingDir = actionsHost.getInput({ name: "working-directory", required: false });
    if (workingDir) {
        runnerParameters.workingDir = workingDir;
    }

    core.startGroup('clone-solution:');
    await cloneSolution({
        credentials: getCredentials(),
        environmentUrl: getEnvironmentUrl(),
        name: parameterMap['solution-name'],
        outputDirectory: parameterMap['target-folder'],
        async: parameterMap['async'],
        maxAsyncWaitTimeInMin: parameterMap['max-async-wait-time'],
        logToConsole: false,
    }, runnerParameters, actionsHost);

    core.endGroup();
})().catch(error => {
    const logger = runnerParameters.logger;
    logger.error(`failed: ${error}`);
    core.endGroup();
});
