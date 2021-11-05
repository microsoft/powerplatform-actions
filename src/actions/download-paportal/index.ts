// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import { downloadPaportal } from "@microsoft/powerplatform-cli-wrapper/dist/actions";
import { YamlParser } from '../../lib/parser/YamlParser';
import { ActionsHost } from '../../lib/host/ActionsHost';
import getCredentials from "../../lib/auth/getCredentials";
import getEnvironmentUrl from "../../lib/auth/getEnvironmentUrl";
import { runnerParameters } from '../../lib/runnerParameters';

(async () => {
    const taskParser = new YamlParser();
    const parameterMap = taskParser.getHostParameterEntries(runnerParameters.workingDir, "download-paportal");

    await downloadPaportal({
        credentials: getCredentials(),
        environmentUrl: getEnvironmentUrl(),
        path: parameterMap['download-path'],
        websiteId: parameterMap['website-id'],
    }, runnerParameters, new ActionsHost());
    core.endGroup();
})().catch(error => {
    const logger = runnerParameters.logger;
    logger.error(`failed: ${error}`);
    core.endGroup();
});
