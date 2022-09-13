// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { dataExport } from "@microsoft/powerplatform-cli-wrapper/dist/actions";
import * as core from '@actions/core';
import { YamlParser } from '../../lib/parser/YamlParser';
import { ActionsHost } from '../../lib/host/ActionsHost';
import getEnvironmentUrl from "../../lib/auth/getEnvironmentUrl";
import getCredentials from "../../lib/auth/getCredentials";
import { runnerParameters } from '../../lib/runnerParameters';

(async () => {
    const taskParser = new YamlParser();
    const parameterMap = taskParser.getHostParameterEntries('export-data');
    const actionsHost = new ActionsHost();
    const workingDir = actionsHost.getInput({ name: "working-directory", required: false });
    if (workingDir) {
        runnerParameters.workingDir = workingDir;
    }

    core.startGroup('export-data:');
    await dataExport({
        credentials: getCredentials(),
        environmentUrl: getEnvironmentUrl(),
        schemaFile: parameterMap['schema-file'],
        dataFile: parameterMap['data-file'],
        overwrite: parameterMap['overwrite'],
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
