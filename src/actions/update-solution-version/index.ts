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
        const solutionPatchVersion = core.getInput('solution-patch-version', { required: false });
        const solutionVersionUpdateStrategy = core.getInput('solution-version-update-strategy', { required: false });

        if (!!solutionPatchVersion === !!solutionVersionUpdateStrategy) {
            const error = new Error('Either provide solution-patch-version or solution-version-update-strategy');
            core.setFailed(error);
            throw error;
        }

        const pac = factory.getRunner('pac', process.cwd());
        const updateSolutionVersionArgs = ['solution', 'version'];

        if (solutionPatchVersion) {
            updateSolutionVersionArgs.push('--patchversion', solutionPatchVersion);
        }

        if (solutionVersionUpdateStrategy) {
            updateSolutionVersionArgs.push('--strategy', solutionVersionUpdateStrategy);
        }

        const workingDir = getWorkingDirectory('working-directory', false);
        const solutionPatchVersionFileCandidate = core.getInput('solution-patch-version-file', { required: false });
        if (solutionPatchVersionFileCandidate) {
            const solutionPatchVersionFile = path.isAbsolute(solutionPatchVersionFileCandidate)
                ? solutionPatchVersionFileCandidate
                : path.resolve(workingDir, solutionPatchVersionFileCandidate);

            updateSolutionVersionArgs.push('--filename', solutionPatchVersionFile);
        }

        await pac.run(updateSolutionVersionArgs);
        core.info('updated solution version');
        core.endGroup();
    } catch (error) {
        core.setFailed(`failed: ${error.message}`);
        throw error;
    }
}
