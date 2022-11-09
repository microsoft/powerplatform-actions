// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import {assignGroup} from "@microsoft/powerplatform-cli-wrapper/dist/actions";
import * as core from '@actions/core';
import { YamlParser } from '../../lib/parser/YamlParser';
import { ActionsHost } from '../../lib/host/ActionsHost';
import getCredentials from "../../lib/auth/getCredentials";
import { runnerParameters } from '../../lib/runnerParameters';

(async () => {
    if (process.env.GITHUB_ACTIONS) await main();
})().catch(error => {
    const logger = runnerParameters.logger;
    logger.error(`failed: ${error}`);
    core.endGroup();
});

export async function main (): Promise<void> {
    const taskParser = new YamlParser();
    const parameterMap = taskParser.getHostParameterEntries('assign-group');
    core.startGroup('assign-group:');
    await assignGroup({
        credentials: getCredentials(),
        environment: parameterMap['environment'],
        azureAadGroup: parameterMap['group'],
        groupName: parameterMap['group-name'],
        role: parameterMap['role'],
        teamType: parameterMap['team-type'],
        membershipType: parameterMap['membership-type'],
        businessUnit: parameterMap['business-unit'],
     }, runnerParameters, new ActionsHost());
     core.endGroup();
}
