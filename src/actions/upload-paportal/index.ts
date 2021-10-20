// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import { uploadPaportal } from "@microsoft/powerplatform-cli-wrapper/dist/actions";
import { YamlParser } from '../../lib/parser/YamlParser';
import { ActionsHost } from '../../lib/host/ActionsHost';
import getCredentials from "../../lib/auth/getCredentials";
import getEnvironmentUrl from "../../lib/auth/getEnvironmentUrl";
import { runnerParameters } from '../../lib/runnerParameters';

(async () => {
    const taskParser = new YamlParser();
    const parameterMap = taskParser.getHostParameterEntries(runnerParameters.workingDir, "upload-paportal");

    await uploadPaportal({
        credentials: getCredentials(),
        environmentUrl: getEnvironmentUrl(),
        path: parameterMap['upload-path'],
        deploymentProfile: parameterMap['deployment-profile'],
    }, runnerParameters, new ActionsHost());
})().catch(error => {
    core.setFailed(`failed: ${error}`);
    core.endGroup();
});
