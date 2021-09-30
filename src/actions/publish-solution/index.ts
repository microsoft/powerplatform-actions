// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import { publishSolution } from "@microsoft/powerplatform-cli-wrapper/dist/actions";
import getCredentials from "../../lib/auth/getCredentials";
import getEnvironmentUrl from "../../lib/auth/getEnvironmentUrl";
import { runnerParameters } from "../../lib/runnerParameters";

(async () => {
    if (process.env.GITHUB_ACTIONS) {
        await main();
    }
})();

export async function main(): Promise<void> {
    try {
        core.startGroup('publish-solution:');
        await publishSolution({
            credentials: getCredentials(),
            environmentUrl: getEnvironmentUrl(),
        }, runnerParameters);
        core.info('published solution customizations');
        core.endGroup();
    } catch (error) {
        core.setFailed(`failed: ${error}`);
        core.endGroup();
    }
}
