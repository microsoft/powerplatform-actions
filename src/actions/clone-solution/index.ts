// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import { ActionLogger, AuthHandler, AuthKind, getWorkingDirectory, PacRunner } from '../../lib';
import path = require('path');
import fs = require('fs-extra');

core.startGroup('clone-solution:');
const solutionName = core.getInput('solution-name', { required: true });
const solutionVersion = core.getInput('solution-version', { required: false });
core.info(`solution: ${solutionName} (${solutionVersion})`);

const workingDir = getWorkingDirectory('working-directory', false);
const targetFolderCandidate = core.getInput('target-folder', { required: false }) || `${solutionName}_${!solutionVersion ? '0.1.0' : solutionVersion}`;
const targetFolder = path.isAbsolute(targetFolderCandidate) ? targetFolderCandidate : path.resolve(workingDir, targetFolderCandidate);
fs.ensureDirSync(targetFolder);

const logger = new ActionLogger();

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
(async () => {
    const pac = new PacRunner(workingDir, logger);
    await new AuthHandler(pac).authenticate(AuthKind.CDS);

    const cloneArgs = ['solution', 'clone', '--name', solutionName, '--outputDirectory', targetFolder];
    if (solutionVersion) {
        cloneArgs.push('--targetVersion', solutionVersion);
    }
    await pac.run(cloneArgs);
    core.info(`cloned solution into folder: ${targetFolder}`);
    core.endGroup();

})().catch(error => {
    core.setFailed(`failed: ${error}`);
    core.endGroup();
});
