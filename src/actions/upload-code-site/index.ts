// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import { uploadCodeSite } from "@microsoft/powerplatform-cli-wrapper/dist/actions";
import { YamlParser } from '../../lib/parser/YamlParser';
import { ActionsHost } from '../../lib/host/ActionsHost';
import getCredentials from "../../lib/auth/getCredentials";
import getEnvironmentUrl from "../../lib/auth/getEnvironmentUrl";
import { runnerParameters } from '../../lib/runnerParameters';

(async () => {
    const taskParser = new YamlParser();
    const parameterMap = taskParser.getHostParameterEntries('upload-code-site');

    await uploadCodeSite({
        credentials: getCredentials(),
        environmentUrl: getEnvironmentUrl(),
        rootPath: parameterMap['root-path'],
        compiledPath: parameterMap['compiled-path'],
        siteName: parameterMap['site-name'],
    }, runnerParameters, new ActionsHost());
    core.endGroup();
})().catch(error => {
    const logger = runnerParameters.logger;
    logger.error(`failed: ${error}`);
    core.endGroup();
});
