// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { exportSolution } from "@microsoft/powerplatform-cli-wrapper/dist/actions";
import * as core from '@actions/core';
import { YamlParser } from '../../lib/parser/YamlParser';
import { ActionsHost } from '../../lib/host/ActionsHost';
import getCredentials from "../../lib/auth/getCredentials";
import getEnvironmentUrl from "../../lib/auth/getEnvironmentUrl";
import { runnerParameters } from '../../lib/runnerParameters';

(async () => {
    const taskParser = new YamlParser();
    const parameterMap = taskParser.getHostParameterEntries(runnerParameters.workingDir, "export-solution");
    const actionsHost = new ActionsHost();
    const workingDir = actionsHost.getInput({ name: "working-directory", required: false });
    if (workingDir) {
        runnerParameters.workingDir = workingDir;
    }

    core.startGroup('export-solution:');
    await exportSolution({
        credentials: getCredentials(),
        environmentUrl: getEnvironmentUrl(),
        name: parameterMap['solution-name'],
        path: parameterMap['solution-output-file'],
        managed: parameterMap['managed'],
        targetVersion: parameterMap['solution-version'],
        async: parameterMap['run-asynchronously'],
        maxAsyncWaitTimeInMin: parameterMap['max-async-wait-time'],
        autoNumberSettings: parameterMap['export-auto-numbering-settings'],
        calenderSettings: parameterMap['export-calendar-settings'],
        customizationSettings: parameterMap['export-customization-settings'],
        emailTrackingSettings: parameterMap['export-email-tracking-settings'],
        externalApplicationSettings: parameterMap['export-external-applications-settings'],
        generalSettings: parameterMap['export-general-settings'],
        isvConfig: parameterMap['export-isv-config'],
        marketingSettings: parameterMap['export-marketing-settings'],
        outlookSynchronizationSettings: parameterMap['export-outlook-synchronization-settings'],
        relationshipRoles: parameterMap['export-relationship-roles'],
        sales: parameterMap['export-sales'],
    }, runnerParameters, actionsHost);

    core.endGroup();
})().catch(error => {
    const logger = runnerParameters.logger;
    logger.error(`failed: ${error}`);
    core.endGroup();
});
