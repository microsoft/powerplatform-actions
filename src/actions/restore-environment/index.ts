// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import { DefaultRunnerFactory, RunnerFactory} from '../../lib';

(async () => {
    if (process.env.GITHUB_ACTIONS) {
        await main(DefaultRunnerFactory);
    }
})();

export async function main(factory: RunnerFactory): Promise<void> {
    try {
        core.startGroup('restore-environment:');
        const sourceUrl = core.getInput('source-url', { required: true});
        const targetUrl = core.getInput('target-url', { required: true});
        const selectedBackup = core.getInput('selected-backup', { required: true});
        const username = core.getInput('user-name', { required: true });

        const password = core.getInput('password-secret', { required: true });
        if (!password || password.length === 0) {
            return core.setFailed('Missing password! Specify one by setting input: \'password-secret\'');
        }

        const pac = factory.getRunner('pac', process.cwd());
        await pac.run(['auth', 'clear']);
        await pac.run(['auth', 'create', '--kind', 'ADMIN', '--username', username, '--password', password]);

        const restoreEnvArgs = ['admin', 'restore', '--source-url', sourceUrl, '--target-url', targetUrl, '--selected-backup', selectedBackup];
        await pac.run(restoreEnvArgs);
        core.info('environment restored');
        core.endGroup();
    } catch (error) {
        core.setFailed(`failed: ${error.message}`);
        throw error;
    }
}
