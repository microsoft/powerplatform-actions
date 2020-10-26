// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import { DefaultRunnerFactory, RunnerFactory } from '../../lib';

(async () => {
    if (process.env.GITHUB_ACTIONS) {
        await main(DefaultRunnerFactory);
    }
})();

export async function main(factory: RunnerFactory): Promise<void> {
    try {
        core.startGroup('who-am-i');
        const envUrl = core.getInput('environment-url', { required: true });
        const username = core.getInput('user-name', { required: true });
        core.info(`environmentUrl: ${envUrl}; login as user: ${username}`);

        const password = core.getInput('password-secret', { required: true });
        if (!password || password.length === 0) {
            return core.setFailed('Missing password! Specify one by setting input: \'password-secret\'');
        }

        const pac = factory.getRunner('pac', process.cwd());
        await pac.run(['auth', 'clear']);
        await pac.run(['auth', 'create', '--url', envUrl, '--username', username, '--password', password]);

        const whoArgs = ['org', 'who'];
        await pac.run(whoArgs);
        core.endGroup();
    } catch (error) {
        core.setFailed(`failed: ${error.message}`);
        throw error;
    }
}
