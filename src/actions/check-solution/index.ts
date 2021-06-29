// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import * as artifact from '@actions/artifact';
import { glob } from 'glob';
import { ActionLogger, AuthHandler, AuthKind, getWorkingDirectory, PacRunner } from '../../lib';
import path = require('path');
import fs = require('fs-extra');

core.startGroup('check-solution:');
const workingDir = getWorkingDirectory('working-directory', false);
const solutionPathCandidate = core.getInput('path', { required: true });
const solutionPath = path.isAbsolute(solutionPathCandidate) ? solutionPathCandidate : path.resolve(workingDir, solutionPathCandidate);
core.info(`solution path: ${solutionPath}`);

const outputDirectory = path.join(process.env['RUNNER_TEMP'] || workingDir, "checker-output");
fs.ensureDirSync(outputDirectory);
core.info(`output directory: ${outputDirectory}`);

const geo = core.getInput('geo', { required: false });
const ruleLevelOverride = core.getInput('rule-level-override', { required: false });
const artifactName = core.getInput('checker-logs-artifact-name', {required: false}) || 'CheckSolutionLogs';

const logger = new ActionLogger();

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
(async () => {
    if (!fs.existsSync(solutionPath)) {
        throw new Error(`The solution file could not be found at ${solutionPath}`);
    }

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

    const artifactClient = artifact.create();
    const files = glob.sync('**/*', { cwd: outputDirectory });
    const options = { continueOnError: true };
    await artifactClient.uploadArtifact(artifactName, files, outputDirectory, options);
    core.info(`checked solution results in folder [${outputDirectory}] and uploaded as artifacts.`);
    core.endGroup();

})().catch(error => {
    core.setFailed(`failed: ${error}`);
    core.endGroup();
});