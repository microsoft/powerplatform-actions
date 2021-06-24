// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import { ActionLogger, AuthHandler, AuthKind, getWorkingDirectory, PacRunner } from '../../lib';
import path = require('path');
import fs = require('fs-extra');

core.startGroup('check-solution:');
const workingDir = getWorkingDirectory('working-directory', false);
const solutionPathCandidate = core.getInput('path', { required: true });
const solutionPath = path.isAbsolute(solutionPathCandidate) ? solutionPathCandidate : path.resolve(workingDir, solutionPathCandidate);
fs.ensureFileSync(solutionPath);
core.info(`solution path: ${solutionPath}`);

const outputDirectoryCandidate = core.getInput('output-directory', { required: true });
const outputDirectory = path.isAbsolute(outputDirectoryCandidate) ? outputDirectoryCandidate : path.resolve(workingDir, outputDirectoryCandidate);
fs.ensureDirSync(outputDirectory);
core.info(`output directory: ${solutionPath}`);

const geo = core.getInput('geo', { required: false });
const ruleLevelOverride = core.getInput('rule-level-override', { required: false });

const logger = new ActionLogger();

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
(async () => {
    const pac = new PacRunner(workingDir, logger);
    await new AuthHandler(pac).authenticate(AuthKind.CDS);

    const checkArgs = ['solution', 'check', '--path', solutionPath, '--outputDirectory', outputDirectory];
    if (geo) {
        checkArgs.push('--geo', geo);
    }
    if (ruleLevelOverride) {
        checkArgs.push('--ruleLevelOverride', ruleLevelOverride);
    }
    await pac.run(checkArgs);
    core.info(`checked solution results in folder: ${outputDirectory}`);
    core.endGroup();

})().catch(error => {
    core.setFailed(`failed: ${error}`);
    core.endGroup();
});