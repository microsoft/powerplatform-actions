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
        core.startGroup('restore-environment:');
        const sourceUrl = core.getInput('source-url', { required: false});
        const sourceId = core.getInput('source-id', { required: false});
        const targetUrl = core.getInput('target-url', { required: false});
        const targetId = core.getInput('target-id', { required: false});
        const selectedBackup = core.getInput('selected-backup', { required: true});

        let restoreEnvArgs;
        if (sourceUrl && targetUrl) {
            restoreEnvArgs = ['admin', 'restore', '--source-url', sourceUrl, '--target-url', targetUrl, '--selected-backup', selectedBackup];
        } else if (sourceId && targetId) {
            restoreEnvArgs = ['admin', 'restore', '--source-id', sourceId, '--target-id', targetId, '--selected-backup', selectedBackup];
        } else {
            throw new Error(
                "Must provide either environment-id or environment-url of both source and target environments!"
            );
        }

        const pac = factory.getRunner('pac', process.cwd());
        await new AuthHandler(pac).authenticate(AuthKind.ADMIN);
        await pac.run(restoreEnvArgs);
        core.info('environment restored');
        core.endGroup();
    } catch (error) {
        core.setFailed(`failed: ${error.message}`);
        throw error;
    }
}
