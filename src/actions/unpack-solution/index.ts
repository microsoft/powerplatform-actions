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
    const parameterMap = taskParser.getHostParameterEntries('unpack-solution');

    await unpackSolution({
      solutionZipFile: parameterMap['solution-file'],
      sourceFolder: parameterMap['solution-folder'],
      solutionType: parameterMap['solution-type'],
      overwriteFiles: parameterMap['overwrite-files'],
      errorLevel:  { name: 'error-level', required: false, defaultValue: core.isDebug() ? 'Verbose' : 'Info' },
      singleComponent: parameterMap['single-component'],
      mapFile: parameterMap['map-file'],
      localeTemplate: parameterMap['locale-template'],
      localize: parameterMap['localize'],
      useLcid: parameterMap['use-lcid'],
      useUnmanagedFileForManaged: parameterMap['use-unmanaged-file-for-missing-managed'],
      disablePluginRemap: parameterMap['disable-plugin-remap'],
    }, runnerParameters, new ActionsHost());

    core.endGroup();
  })().catch(error => {
    const logger = runnerParameters.logger;
    logger.error(`failed: ${error}`);
    core.endGroup();
});
