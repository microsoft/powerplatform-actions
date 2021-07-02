// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import { AuthKind, AuthHandler, DefaultRunnerFactory, RunnerFactory} from '../../lib';

(async () => {
    if (process.env.GITHUB_ACTIONS) {
        await main(DefaultRunnerFactory);
    }
})();

export async function main(factory: RunnerFactory): Promise<void> {
    try {
        core.startGroup('delete-environment:');
        const pac = factory.getRunner('pac', process.cwd());
        const envUrl = core.getInput('environment-url', { required: false });
        const envId = core.getInput('environment-id', { required: false });
        await new AuthHandler(pac).authenticate(AuthKind.ADMIN);

        let deleteEnvArgs;
        if (envUrl) {
            deleteEnvArgs = ['admin', 'delete', '--url', envUrl];
        } else if (envId) {
            deleteEnvArgs = ['admin', 'delete', '-id', envId];
        } else {
            throw new Error(
                "Must provide either environment-id or environment-url!"
            );
        }

        await pac.run(deleteEnvArgs);
        core.info('environment deleted');
        core.endGroup();
    } catch (error) {
        core.setFailed(`failed: ${error.message}`);
        throw error;
    }
}
