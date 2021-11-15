// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import { unpackSolution } from "@microsoft/powerplatform-cli-wrapper/dist/actions";
import { YamlParser } from '../../lib/parser/YamlParser';
import { ActionsHost } from '../../lib/host/ActionsHost';
import { runnerParameters } from '../../lib/runnerParameters';

(async () => {
    core.startGroup('unpack-solution:');
    const taskParser = new YamlParser();
    const parameterMap = taskParser.getHostParameterEntries(runnerParameters.workingDir, "unpack-solution");

    await unpackSolution({
      solutionZipFile: parameterMap['solution-file'],
      sourceFolder: parameterMap['solution-folder'],
      solutionType: parameterMap['solution-type'],
      overwriteFiles: parameterMap['overwrite-files'],
    }, runnerParameters, new ActionsHost());

    core.endGroup();
  })().catch(error => {
    const logger = runnerParameters.logger;
    logger.error(`failed: ${error}`);
    core.endGroup();
});
