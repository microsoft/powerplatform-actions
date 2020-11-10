// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import { DefaultRunnerFactory, getInputAsBool, RunnerFactory } from '../../lib';

(async () => {
    if (process.env.GITHUB_ACTIONS) {
        await main(DefaultRunnerFactory);
    }
})();

export async function main(factory: RunnerFactory): Promise<void> {
    try {
        core.startGroup('upgrade-solution:');
        const envUrl = core.getInput('environment-url', { required: true });
        const username = core.getInput('user-name', { required: true });
        core.info(`environmentUrl: ${envUrl}; login as user: ${username}`);

        const password = core.getInput('password-secret', { required: true });
        if (!password || password.length === 0) {
            return core.setFailed('Missing password! Specify one by setting input: \'password-secret\'');
        }

        const solutionName = core.getInput('solution-name', { required: true });
        core.info(`solution: ${solutionName}`);

        const performAsync = getInputAsBool('async', false, false);
        const maxAsyncWaitTime = core.getInput('max-async-wait-time', { required: false });

        const pac = factory.getRunner('pac', process.cwd());
        await pac.run(['auth', 'clear']);
        await pac.run(['auth', 'create', '--url', envUrl, '--username', username, '--password', password]);

        const upgradeArgs = ['solution', 'upgrade', '--solution-name', solutionName];
        if (performAsync) { upgradeArgs.push('--async'); }
        if (maxAsyncWaitTime) { upgradeArgs.push('--max-async-wait-time', maxAsyncWaitTime); }

        await pac.run(upgradeArgs);
        core.info('upgraded solution');
        core.endGroup();
    } catch (error) {
        core.setFailed(`failed: ${error.message}`);
        throw error;
    }
}
