// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import { AuthKind, AuthHandler, DefaultRunnerFactory, RunnerFactory } from '../../lib';

(async () => {
    if (process.env.GITHUB_ACTIONS) {
        await main(DefaultRunnerFactory);
    }
})();

export async function main(factory: RunnerFactory): Promise<void> {
    try {
        core.startGroup('create-environment:');
        const pac = factory.getRunner('pac', process.cwd());

        const envName = core.getInput('name', { required: true});
        const envType = core.getInput('type', {required: true});
        const envRegion = core.getInput('region', {required: false});
        const domain = core.getInput('domain', {required: false});

        await new AuthHandler(pac).authenticate(AuthKind.ADMIN);

        const createEnvironmentArgs = ['admin', 'create', '--name', envName, '--region', envRegion, '--type', envType, '--domain', domain];
        const result = await pac.run(createEnvironmentArgs);
        // HACK TODO: Need structured output from pac CLI to make parsing out of the resulting env URL more robust
        const newEnvDetailColumns = result
                                    .filter(l => l.length > 0)
                                    .pop()
                                    ?.trim()
                                    .split(/\s+/);

        const envUrl = newEnvDetailColumns?.shift();
        const envId = newEnvDetailColumns?.shift();
        core.setOutput('environment-url', envUrl);
        core.setOutput('environment-id', envId);
        core.endGroup();
    } catch (error) {
        core.setFailed(`failed: ${error.message}`);
        throw error;
    }
}
