// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import { AuthHandler, AuthKind, DefaultRunnerFactory, RunnerFactory} from '../../lib';

(async () => {
    if (process.env.GITHUB_ACTIONS) {
        await main(DefaultRunnerFactory);
    }
})();

export async function main(factory: RunnerFactory): Promise<void> {
    try {
        core.startGroup('backup-environment:');
        const envUrl = core.getInput('environment-url', { required: true });
        const backupLabel = core.getInput('backup-label', {required: true });

        const pac = factory.getRunner('pac', process.cwd());
        await new AuthHandler(pac).authenticate(AuthKind.ADMIN);
        const backupEnvArgs = ['admin', 'backup', '--url', envUrl, '--label', backupLabel];
        await pac.run(backupEnvArgs);
        core.info('environment backup complete');
        core.endGroup();
    } catch (error) {
        core.setFailed(`failed: ${error.message}`);
        throw error;
    }
}
