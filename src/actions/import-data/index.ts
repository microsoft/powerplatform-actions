// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { dataImport } from "@microsoft/powerplatform-cli-wrapper/dist/actions";
import * as core from '@actions/core';
import { YamlParser } from '../../lib/parser/YamlParser';
import { ActionsHost } from '../../lib/host/ActionsHost';
import getCredentials from "../../lib/auth/getCredentials";
import getEnvironmentUrl from "../../lib/auth/getEnvironmentUrl";
import { runnerParameters } from '../../lib/runnerParameters';

(async () => {
    const taskParser = new YamlParser();
    const parameterMap = taskParser.getHostParameterEntries('import-data');
    const actionsHost = new ActionsHost();
    const workingDir = actionsHost.getInput({ name: "working-directory", required: false });
    if (workingDir) {
        runnerParameters.workingDir = workingDir;
    }

    core.startGroup('import-data:');
    await dataImport({
        credentials: getCredentials(),
        environmentUrl: getEnvironmentUrl(),
        dataFile: parameterMap['data-file'],
        verbose: {
            name: "verbose",
            required: false,
            defaultValue: false
        }
    }, runnerParameters, actionsHost);

    core.endGroup();
})().catch(error => {
    const logger = runnerParameters.logger;
    logger.error(`failed: ${error}`);
    core.endGroup();
});
