// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import { checkSolution } from "@microsoft/powerplatform-cli-wrapper/dist/actions";
import { HostParameterEntry } from "@microsoft/powerplatform-cli-wrapper/dist/host/IHostAbstractions";
import { YamlParser } from '../../lib/parser/YamlParser';
import { ActionsHost } from '../../lib/host/ActionsHost';
import getCredentials from "../../lib/auth/getCredentials";
import getEnvironmentUrl from "../../lib/auth/getEnvironmentUrl";
import { runnerParameters } from '../../lib/runnerParameters';

(async () => {
    core.startGroup('check-solution:');
    const taskParser = new YamlParser();
    const parameterMap = taskParser.getHostParameterEntries('check-solution');

    await checkSolution({
        credentials: getCredentials(),
        environmentUrl: getEnvironmentUrl(),
        solutionPath: parameterMap["path"],
        geoInstance: parameterMap["geo"],
        ruleLevelOverride: parameterMap["rule-level-override"],
        artifactStoreName: parameterMap["checker-logs-artifact-name"],
        failOnAnalysisError: parameterMap["fail-on-analysis-error"],
        fileLocation: createEntry("fileLocation", "localFiles"),
        solutionUrl: createEntry("solutionUrl", ""),
        useDefaultPAEndpoint: createEntry("useDefaultPAEndpoint", true),
        customPAEndpoint: createEntry("customPAEndpoint", "https://unitedstates.api.advisor.powerapps.com/"),
        ruleSet: createEntry("ruleSet", "Solution Checker"),
        errorLevel: createEntry("errorLevel", "HighIssueCount"),
        errorThreshold: createEntry("errorThreshold", "0"),
        filesExcluded: createEntry("filesExcluded", ""),
        saveResults: createEntry("saveResults", false)
    }, runnerParameters, new ActionsHost('PowerAppsChecker'));
    core.endGroup();
})().catch(error => {
    const logger = runnerParameters.logger;
    logger.error(`failed: ${error}`);
    core.endGroup();
});

function createEntry(name: string, defaultValue?: string | boolean): HostParameterEntry {
    return {
        name: name,
        required: false,
        defaultValue: defaultValue
    };
}
