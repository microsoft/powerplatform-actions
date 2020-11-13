// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import { DefaultRunnerFactory, getWorkingDirectory, RunnerFactory } from '../../lib';
import path = require('path');

(async () => {
    if (process.env.GITHUB_ACTIONS) {
        await main(DefaultRunnerFactory);
    }
})();

export async function main(factory: RunnerFactory): Promise<void> {
    try {
        core.startGroup('update-solution-version:');
        const patchVersion = core.getInput('patch-version', { required: false });
        const strategy = core.getInput('strategy', { required: false });

        if (!!patchVersion === !!strategy) {
            const error = new Error("Input 'patch-version': not allowed with input 'strategy'");
            core.setFailed(error);
            throw error;
        }

        const pac = factory.getRunner('pac', process.cwd());
        const updateSolutionVersionArgs = ['solution', 'version'];

        if (patchVersion) {
            updateSolutionVersionArgs.push('--patchversion', patchVersion);
        }

        if (strategy) {
            updateSolutionVersionArgs.push('--strategy', strategy);
        }

        const workingDir = getWorkingDirectory('working-directory', false);
        const trackerFileCandidate = core.getInput('tracker-file', { required: false });
        if (trackerFileCandidate) {
            const trackerFile = path.isAbsolute(trackerFileCandidate)
                ? trackerFileCandidate
                : path.resolve(workingDir, trackerFileCandidate);

            updateSolutionVersionArgs.push('--filename', trackerFile);
        }

        await pac.run(updateSolutionVersionArgs);
        core.info('updated solution version');
        core.endGroup();
    } catch (error) {
        core.setFailed(`failed: ${error.message}`);
        throw error;
    }
}
