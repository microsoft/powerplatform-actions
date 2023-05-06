// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import {catalogStatus} from "@microsoft/powerplatform-cli-wrapper/dist/actions";
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
    const parameterMap = taskParser.getHostParameterEntries('catalog-status');
    core.startGroup('catalog-status:');
    await catalogStatus({
        credentials: getCredentials(),
        trackingId: parameterMap['tracking-id'],
        requestType: parameterMap['type']
     }, runnerParameters, new ActionsHost());
     core.endGroup();
}
