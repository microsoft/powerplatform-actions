// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { importSolution } from "@microsoft/powerplatform-cli-wrapper/dist/actions";
import * as core from '@actions/core';
import { YamlParser } from '../../lib/parser/YamlParser';
import { ActionsHost } from '../../lib/host/ActionsHost';
import getCredentials from "../../lib/auth/getCredentials";
import getEnvironmentUrl from "../../lib/auth/getEnvironmentUrl";
import { runnerParameters } from '../../lib/runnerParameters';

(async () => {
    const taskParser = new YamlParser();
    const parameterMap = taskParser.getHostParameterEntries('import-solution');
    const actionsHost = new ActionsHost();
    const workingDir = actionsHost.getInput({ name: "working-directory", required: false });
    if (workingDir) {
        runnerParameters.workingDir = workingDir;
    }

    core.startGroup('import-solution:');
    await importSolution({
        credentials: getCredentials(),
        environmentUrl: getEnvironmentUrl(),
        path: parameterMap['solution-file'],
        useDeploymentSettingsFile: parameterMap['use-deployment-settings-file'],
        deploymentSettingsFile: parameterMap['deployment-settings-file'],
        async: parameterMap['run-asynchronously'],
        maxAsyncWaitTimeInMin: parameterMap['max-async-wait-time'],
        importAsHolding: parameterMap['import-as-holding'],
        forceOverwrite: parameterMap['force-overwrite'],
        publishChanges: parameterMap['publish-changes'],
        skipDependencyCheck: parameterMap['skip-dependency-check'],
        convertToManaged: parameterMap['convert-to-managed'],
        activatePlugins: parameterMap['activate-plugins']
    }, runnerParameters, new ActionsHost());

    core.endGroup();
})().catch(error => {
    const logger = runnerParameters.logger;
    logger.error(`failed: ${error}`);
    core.endGroup();
});
