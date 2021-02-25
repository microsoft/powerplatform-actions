// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import { ActionLogger, AuthHandler, AuthKind, getInputAsBool, getWorkingDirectory, PacRunner } from '../../lib';
import path = require('path');
import fs = require('fs-extra');
import { exit } from 'process';

core.startGroup('import-solution:');

const workingDir = getWorkingDirectory('working-directory', false);
const solutionFileCandidate = core.getInput('solution-file', { required: true });
const solutionFile = path.isAbsolute(solutionFileCandidate) ? solutionFileCandidate : path.resolve(workingDir, solutionFileCandidate);
if (!fs.existsSync(solutionFile)) {
    core.setFailed(`Solution file "${solutionFile}" does not exist`);
    exit();
}

const activatePlugins = getInputAsBool('activate-plugins', false, true);
const forceOverwrite = getInputAsBool('force-overwrite', false, true);
const skipDepCheck = getInputAsBool('skip-dependency-check', false, false);
const importAsHolding = getInputAsBool('import-as-holding', false, false);
const publishChanges = getInputAsBool('publish-changes', false, false);
const isAsync = getInputAsBool('run-asynchronously', false, false);

core.info(`  solution import: ${solutionFile}`);
core.info(`  activatePlugins: ${activatePlugins} - forceOverwrite: ${forceOverwrite}`);
core.info(`  skipDependencyCheck: ${skipDepCheck} - importAsHolding: ${importAsHolding}`);
core.info(`  publishChanges: ${publishChanges}`);

const logger = new ActionLogger();

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
(async () => {
    const pac = new PacRunner(workingDir, logger);
    await new AuthHandler(pac).authenticate(AuthKind.CDS);

    const importArgs = ['solution', 'import', '--path', solutionFile];
    if (activatePlugins) { importArgs.push('--activate-plugins'); }
    if (forceOverwrite) { importArgs.push('--force-overwrite'); }
    if (skipDepCheck) { importArgs.push('--skip-dependency-check'); }
    if (importAsHolding) { importArgs.push('--import-as-holding'); }
    if (publishChanges) { importArgs.push('--publish-changes'); }
    if (isAsync) {  importArgs.push('--async'); }

    await pac.run(importArgs);
    core.info(`imported solution from: ${solutionFile}`);
    core.endGroup();

})().catch(error => {
    core.setFailed(`failed: ${error}`);
    core.endGroup();
});
