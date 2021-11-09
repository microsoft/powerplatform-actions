// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import { cloneSolution } from "@microsoft/powerplatform-cli-wrapper/dist/actions";
import { YamlParser } from '../../lib/parser/YamlParser';
import { ActionsHost } from '../../lib/host/ActionsHost';
import getCredentials from "../../lib/auth/getCredentials";
import getEnvironmentUrl from "../../lib/auth/getEnvironmentUrl";
import { runnerParameters } from "../../lib/runnerParameters";

(async () => {
    core.startGroup('clone-solution:');
    const taskParser = new YamlParser();
    const parameterMap = taskParser.getHostParameterEntries(runnerParameters.workingDir, "clone-solution");

    await cloneSolution({
        credentials: getCredentials(),
        environmentUrl: getEnvironmentUrl(),
        name: parameterMap['solution-name'],
        targetVersion: parameterMap['solution-version'],
        outputDirectory: parameterMap['target-folder'],
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
    }, runnerParameters, new ActionsHost());
    core.endGroup();
})().catch(error => {
    const logger = runnerParameters.logger;
    logger.error(`failed: ${error}`);
    core.endGroup();
});
