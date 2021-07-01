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
        const envUrl = core.getInput('environment-url', { required: false });
        const envId = core.getInput('environment-id', { required: false });
        const backupLabel = core.getInput('backup-label', {required: true });

        let backupEnvArgs;
        if (envUrl) {
            backupEnvArgs = ['admin', 'backup', '--url', envUrl, '--label', backupLabel];
        } else if (envId) {
            backupEnvArgs = ['admin', 'backup', '-id', envId, '--label', backupLabel];
        } else {
            throw new Error(
                "Must provide either environment-id or environment-url!"
            );
        }

        const pac = factory.getRunner('pac', process.cwd());
        await new AuthHandler(pac).authenticate(AuthKind.ADMIN);
        await pac.run(backupEnvArgs);
        core.info('environment backup complete');
        core.endGroup();
    } catch (error) {
        core.setFailed(`failed: ${error.message}`);
        throw error;
    }
}
