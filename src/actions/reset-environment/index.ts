// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import { AuthHandler, AuthKind, DefaultRunnerFactory, RunnerFactory } from '../../lib';

(async () => {
    if (process.env.GITHUB_ACTIONS) {
        await main(DefaultRunnerFactory);
    }
})();

export async function main(factory: RunnerFactory): Promise<void> {
    try {
        core.startGroup('reset-environment:');
        const envUrl = core.getInput('environment-url', { required: false });
        const envId = core.getInput('environment-id', { required: false });

        let resetEnvArgs;
        if (envUrl) {
            resetEnvArgs = ['admin', 'reset', '--url', envUrl];
        } else if (envId) {
            resetEnvArgs = ['admin', 'reset', '-id', envId];
        } else {
            throw new Error(
                "Must provide either environment-id or environment-url to reset the environment!"
            );
        }

        const pac = factory.getRunner('pac', process.cwd());
        await new AuthHandler(pac).authenticate(AuthKind.ADMIN);
        await pac.run(resetEnvArgs);
        core.info('environment reset');
        core.endGroup();
    } catch (error) {
        core.setFailed(`failed: ${error.message}`);
        throw error;
    }
}
