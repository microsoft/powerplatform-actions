// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import { packSolution } from "@microsoft/powerplatform-cli-wrapper/dist/actions";
import { YamlParser } from '../../lib/parser/YamlParser';
import { ActionsHost } from '../../lib/host/ActionsHost';
import { runnerParameters } from '../../lib/runnerParameters';
import { HostParameterEntry } from '@microsoft/powerplatform-cli-wrapper/dist/host/IHostAbstractions';

(async () => {
    core.startGroup('pack-solution:');
    const taskParser = new YamlParser();
    const parameterMap = taskParser.getHostParameterEntries('pack-solution');

    const errorLevel: HostParameterEntry = {
        name: 'errorLevel',
        required: false,
        defaultValue: core.isDebug() ? 'Verbose' : 'Info',
    }

    await packSolution({
        solutionZipFile: parameterMap['solution-file'],
        sourceFolder: parameterMap['solution-folder'],
        solutionType: parameterMap['solution-type'],
        errorLevel: errorLevel,
        singleComponent: parameterMap['single-component'],
        mapFile: parameterMap['map-file'],
        localeTemplate: parameterMap['locale-template'],
        localize: parameterMap['localize'],
        useLcid: parameterMap['use-lcid'],
        useUnmanagedFileForManaged: parameterMap['use-unmanaged-file-for-missing-managed'],
        disablePluginRemap: parameterMap['disable-plugin-remap'],
        processCanvasApps: parameterMap['process-canvas-apps'],
        logToConsole: false,
    }, runnerParameters, new ActionsHost());

    core.endGroup();
})().catch(error => {
    const logger = runnerParameters.logger;
    logger.error(`failed: ${error}`);
    core.endGroup();
});
