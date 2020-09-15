// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import { ActionLogger, SopaRunner } from '../../lib';
import path = require('path');
import { exit } from 'process';

const validSolutionTypes = new Set(['unmanaged', 'managed', 'both']);

core.startGroup('pack-solution:');
const solutionZipFile = core.getInput('solution-file', { required: true });
const solutionType = core.getInput('solution-type', { required: false }) || 'Unmanaged';
if (!validSolutionTypes.has(solutionType.toLowerCase())) {
    core.setFailed(`Unknown solution type "${solutionType}"; must be one of: "Unmanaged", "Managed", "Both"`);
    exit();
}

const workingDir = process.cwd();
const solutionFolderCand = core.getInput('solution-folder', { required: true });
const solutionFolder = path.isAbsolute(solutionFolderCand) ? solutionFolderCand : path.resolve(workingDir, solutionFolderCand);
core.info(`pack solution: ${solutionZipFile} (${solutionType}) from: ${solutionFolder}`);

const logger = new ActionLogger();

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
(async () => {
    const sopa = new SopaRunner(workingDir, logger);

    const packArgs = ['/action:pack', `/packageType:${solutionType}`, `/zipFile:${solutionZipFile}`, `/folder:${solutionFolder}`];
    await sopa.run(packArgs);
    core.info(`packed solution into: ${solutionZipFile}`);
    core.endGroup();

})().catch(error => {
    core.setFailed(`failed: ${error}`);
    core.endGroup();
});
