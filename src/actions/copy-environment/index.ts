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
        core.startGroup('copy-environment:');

        const sourceUrl = core.getInput('source-url', { required: true});
        const targetUrl = core.getInput('target-url', { required: true});

        const pac = factory.getRunner('pac', process.cwd());
        await new AuthHandler(pac).authenticate(AuthKind.ADMIN);

        const copyEnvironmentArgs = ['admin', 'copy', '--source-url', sourceUrl, '--target-url', targetUrl];
        await pac.run(copyEnvironmentArgs);
        core.endGroup();
    } catch (error) {
        core.setFailed(`failed: ${error.message}`);
        throw error;
    }
}
