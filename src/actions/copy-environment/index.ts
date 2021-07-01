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

        const sourceUrl = core.getInput('source-url', { required: false});
        const sourceId = core.getInput('source-id', { required: false});
        const targetUrl = core.getInput('target-url', { required: false});
        const targetId = core.getInput('target-id', { required: false});

        let copyEnvironmentArgs;
        if (sourceUrl && targetUrl) {
            copyEnvironmentArgs = ['admin', 'copy', '--source-url', sourceUrl, '--target-url', targetUrl];
        } else if (sourceId && targetId) {
            copyEnvironmentArgs = ['admin', 'copy', '--source-id', sourceId, '--target-id', targetId];
        } else {
            throw new Error(
                "Must provide either environment-id or environment-url for source and target environments!"
            );
        }

        const pac = factory.getRunner('pac', process.cwd());
        await new AuthHandler(pac).authenticate(AuthKind.ADMIN);
        await pac.run(copyEnvironmentArgs);
        core.endGroup();
    } catch (error) {
        core.setFailed(`failed: ${error.message}`);
        throw error;
    }
}
