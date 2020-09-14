// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import { ActionLogger, PacAccess } from '../../lib';
import path = require('path');
import fs = require('fs-extra');

core.startGroup('export-solution:');
const envUrl = core.getInput('environment-url', { required: true });
const username = core.getInput('user-name', { required: true });
core.info(`environmentUrl: ${envUrl}; login as user: ${username}`);

const password = core.getInput('password-secret', { required: true });
if (!password || password.length === 0) {
    core.setFailed('Missing password! Specify one by setting input: \'password-secret\'');
}
const solutionName = core.getInput('solution-name', { required: true });
const solutionVersion = core.getInput('solution-version', { required: false });
const isManaged = core.getInput('managed', { required: false });
core.info(`solution: ${solutionName} (${solutionVersion}) - managed: ${isManaged ?? false}`);

const workingDir = core.getInput('working-directory', { required: false }) || process.cwd();
const outputFileCandidate = core.getInput('solution-output-file', { required: true });
const outputFile = path.isAbsolute(outputFileCandidate) ? outputFileCandidate : path.resolve(workingDir, outputFileCandidate);
fs.ensureDirSync(path.dirname(outputFile));

const logger = new ActionLogger();

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
(async () => {
    const pac = new PacAccess(workingDir, logger);
    await pac.run(['auth', 'clear']);
    await pac.run(['auth', 'create', '--url', envUrl, '--username', username, '--password', password]);

    const exportArgs = ['solution', 'export', '--name', solutionName, '--path', outputFile];
    if (solutionVersion) {
        exportArgs.push('--targetVersion', solutionVersion);
    }
    if (isManaged) {
        exportArgs.push('--managed');
    }
    await pac.run(exportArgs);
    core.info(`exported solution to: ${outputFile}`);
    core.endGroup();

})().catch(error => {
    core.setFailed(`failed: ${error}`);
    core.endGroup();
});
