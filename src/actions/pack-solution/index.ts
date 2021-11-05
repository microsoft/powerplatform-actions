// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import { packSolution } from "@microsoft/powerplatform-cli-wrapper/dist/actions";
import { YamlParser } from '../../lib/parser/YamlParser';
import { ActionsHost } from '../../lib/host/ActionsHost';
import getCredentials from "../../lib/auth/getCredentials";
import getEnvironmentUrl from "../../lib/auth/getEnvironmentUrl";
import { runnerParameters } from '../../lib/runnerParameters';

(async () => {
    core.startGroup('pack-solution:');
    const taskParser = new YamlParser();
    const parameterMap = taskParser.getHostParameterEntries(runnerParameters.workingDir, "pack-solution");

    await packSolution({
      credentials: getCredentials(),
      environmentUrl: getEnvironmentUrl(),
      solutionZipFile: parameterMap['solution-file'],
      sourceFolder: parameterMap['solution-folder'],
      solutionType: parameterMap['solution-type'],
    }, runnerParameters, new ActionsHost());

    core.endGroup();
  })().catch(error => {
    const logger = runnerParameters.logger;
    logger.error(`failed: ${error}`);
    core.endGroup();
});
