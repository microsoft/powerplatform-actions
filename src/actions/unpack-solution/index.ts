// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import { ActionLogger, SopaRunner } from '../../lib';
import path = require('path');
import fs = require('fs-extra');
import { exit } from 'process';

const validSolutionTypes = new Set(['unmanaged', 'managed', 'both']);

core.startGroup('unpack-solution:');
const solutionZipFile = core.getInput('solution-file', { required: true });
const solutionType = core.getInput('solution-type', { required: false }) || 'Unmanaged';
if (!validSolutionTypes.has(solutionType.toLowerCase())) {
    core.setFailed(`Unknown solution type "${solutionType}"; must be one of: "Unmanaged", "Managed", "Both"`);
    exit();
}

const workingDir = process.cwd();
const targetFolderCand = core.getInput('solution-folder', { required: true });
const targetFolder = path.isAbsolute(targetFolderCand) ? targetFolderCand : path.resolve(workingDir, targetFolderCand);
core.info(`unpack solution: ${solutionZipFile} (${solutionType}) into: ${targetFolder}`);
fs.ensureDirSync(targetFolder);

const overwrite = core.getInput('overwrite-files', { required: false }) || true;
if (!overwrite || overwrite.toString().toLowerCase() !== 'true') {
    const files = fs.readdirSync(targetFolder);
    if (files.length > 0) {
        core.setFailed(`solution-folder "${targetFolder}" is not empty, cannot overwrite files unless "overwrite-files" input parameter is set to "true"`);
        exit();
    }
}

const logger = new ActionLogger();

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
(async () => {
    const sopa = new SopaRunner(workingDir, logger);

    const unpackArgs = ['/action:extract', `/packageType:${solutionType}`, `/zipFile:${solutionZipFile}`, `/folder:${targetFolder}`, '/clobber', '/allowDelete:yes', '/allowWrite:yes'];
    await sopa.run(unpackArgs);
    core.info(`unpacked solution to: ${targetFolder}`);
    core.endGroup();

})().catch(error => {
    core.setFailed(`failed: ${error}`);
    core.endGroup();
});
