// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import { ActionLogger, AuthHandler, AuthKind, getInputAsBool, getWorkingDirectory, PacRunner } from '../../lib';
import path = require('path');
import fs = require('fs-extra');

core.startGroup('export-solution:');
const solutionName = core.getInput('solution-name', { required: true });
const solutionVersion = core.getInput('solution-version', { required: false });
const isManaged = getInputAsBool('managed', false, false);
const isAsync = getInputAsBool('run-asynchronously', false, false);
core.info(`solution: ${solutionName} (${solutionVersion}) - managed: ${isManaged}`);

const workingDir = getWorkingDirectory('working-directory', false);
const outputFileCandidate = core.getInput('solution-output-file', { required: true });
const outputFile = path.isAbsolute(outputFileCandidate) ? outputFileCandidate : path.resolve(workingDir, outputFileCandidate);
fs.ensureDirSync(path.dirname(outputFile));

const logger = new ActionLogger();

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
(async () => {
    const pac = new PacRunner(workingDir, logger);
    await new AuthHandler(pac).authenticate(AuthKind.CDS);

    const exportArgs = ['solution', 'export', '--name', solutionName, '--path', outputFile];
    if (solutionVersion) { exportArgs.push('--targetVersion', solutionVersion); }
    if (isManaged) { exportArgs.push('--managed'); }
    if (isAsync) { exportArgs.push('--async'); }
    await pac.run(exportArgs);
    core.info(`exported solution to: ${outputFile}`);
    core.endGroup();

})().catch(error => {
    core.setFailed(`failed: ${error}`);
    core.endGroup();
});
