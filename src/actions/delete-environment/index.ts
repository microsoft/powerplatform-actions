// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { deleteEnvironment } from "@microsoft/powerplatform-cli-wrapper/dist/actions";
import * as core from '@actions/core';
import getCredentials from "../../lib/auth/getCredentials";
import getEnvironmentUrl from "../../lib/auth/getEnvironmentUrl";
import { runnerParameters } from '../../lib/runnerParameters';

(async () => {
    if (process.env.GITHUB_ACTIONS) {
        await main();
    }
})().catch(error => {
    const logger = runnerParameters.logger;
    logger.error(`failed: ${error}`);
    core.endGroup();
});

export async function main(): Promise<void> {
    core.startGroup('delete-environment:');

    await deleteEnvironment({
        credentials: getCredentials(),
        environmentUrl: getEnvironmentUrl(),
    }, runnerParameters);

    core.info('environment deleted');
    core.endGroup();
}
