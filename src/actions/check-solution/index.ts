// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import { checkSolution } from "@microsoft/powerplatform-cli-wrapper/dist/actions";
import { YamlParser } from '../../lib/parser/YamlParser';
import { ActionsHost } from '../../lib/host/ActionsHost';
import getCredentials from "../../lib/auth/getCredentials";
import getEnvironmentUrl from "../../lib/auth/getEnvironmentUrl";
import { runnerParameters } from '../../lib/runnerParameters';

(async () => {
    core.startGroup('check-solution:');
    const taskParser = new YamlParser();
    const parameterMap = taskParser.getHostParameterEntries(runnerParameters.workingDir, "check-solution");

    await checkSolution({
        credentials: getCredentials(),
        environmentUrl: getEnvironmentUrl(),
        solutionPath: parameterMap["path"],
        geoInstance: parameterMap["geo"],
        ruleLevelOverride: parameterMap["rule-level-override"],
    }, runnerParameters, new ActionsHost());
    core.endGroup();
})().catch(error => {
    core.setFailed(`failed: ${error}`);
    core.endGroup();
});
