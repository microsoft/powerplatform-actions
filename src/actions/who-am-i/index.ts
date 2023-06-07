// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { whoAmI } from "@microsoft/powerplatform-cli-wrapper/dist/actions";
import * as core from '@actions/core';
import getCredentials from "../../lib/auth/getCredentials";
import getEnvironmentUrl from "../../lib/auth/getEnvironmentUrl";
import { runnerParameters } from "../../lib/runnerParameters";
import { EnvIdVariableName } from "../../host/OutputVariables";
import { ActionsHost } from '../../lib/host/ActionsHost';

(async () => {
    core.startGroup('who-am-i:');
    const result = await whoAmI({
        credentials: getCredentials(),
        environmentUrl: getEnvironmentUrl(),
    }, runnerParameters, new ActionsHost()
    );

    core.setOutput(EnvIdVariableName, result.environmentId);
    core.endGroup();
})().catch(error => {
    const logger = runnerParameters.logger;
    logger.error(`failed: ${error}`);
    core.endGroup();
});
