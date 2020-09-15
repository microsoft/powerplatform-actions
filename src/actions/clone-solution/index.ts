// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import { ActionLogger, getWorkingDirectory, PacAccess } from '../../lib';
import path = require('path');
import fs = require('fs-extra');

core.startGroup('clone-solution:');
const envUrl = core.getInput('environment-url', { required: true });
const username = core.getInput('user-name', { required: true });
core.info(`environmentUrl: ${envUrl}; login as user: ${username}`);

const password = core.getInput('password-secret', { required: true });
if (!password || password.length === 0) {
    core.setFailed('Missing password! Specify one by setting input: \'password-secret\'');
}
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
    const pac = new PacAccess(workingDir, logger);
    await pac.run(['auth', 'clear']);
    await pac.run(['auth', 'create', '--url', envUrl, '--username', username, '--password', password]);

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
