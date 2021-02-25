// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import { AuthHandler, AuthKind, DefaultRunnerFactory, getInputAsBool, RunnerFactory } from '../../lib';

(async () => {
    if (process.env.GITHUB_ACTIONS) {
        await main(DefaultRunnerFactory);
    }
})();

export async function main(factory: RunnerFactory): Promise<void> {
    try {
        core.startGroup('upgrade-solution:');
        const solutionName = core.getInput('solution-name', { required: true });
        core.info(`solution: ${solutionName}`);

        const performAsync = getInputAsBool('async', false, false);

        const pac = factory.getRunner('pac', process.cwd());
        await new AuthHandler(pac).authenticate(AuthKind.CDS);
        const upgradeArgs = ['solution', 'upgrade', '--solution-name', solutionName];
        if (performAsync) {
            upgradeArgs.push('--async');

            const maxAsyncWaitTime = core.getInput('max-async-wait-time', { required: false });
            if (maxAsyncWaitTime) { upgradeArgs.push('--max-async-wait-time', maxAsyncWaitTime); }
        }

        await pac.run(upgradeArgs);
        core.info('upgraded solution');
        core.endGroup();
    } catch (error) {
        core.setFailed(`failed: ${error.message}`);
        throw error;
    }
}
