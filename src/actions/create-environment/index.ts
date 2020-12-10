// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import os = require('os');
import { DefaultRunnerFactory, RunnerFactory } from '../../lib';

(async () => {
    if (process.env.GITHUB_ACTIONS) {
        await main(DefaultRunnerFactory);
    }
})();

export async function main(factory: RunnerFactory): Promise<void> {
    try {
        core.startGroup('create-environment:');
        const username = core.getInput('user-name', { required: true });
        const password = core.getInput('password-secret', { required: true });
        if (!password || password.length === 0) {
            return core.setFailed('Missing password! Specify one by setting input: \'password-secret\'');
        }

        const envName = core.getInput('name', { required: true});
        const envRegion = core.getInput('region', {required: true});
        const envType = core.getInput('type', {required: true});
        const domain = core.getInput('domain', {required: false});

        const pac = factory.getRunner('pac', process.cwd());
        await pac.run(['auth', 'clear']);
        await pac.run(['auth', 'create', '--kind', 'ADMIN', '--username', username, '--password', password]);

        const createEnvironmentArgs = ['admin', 'create', '--name', envName, '--region', envRegion, '--type', envType, '--domain', domain];
        const result = await pac.run(createEnvironmentArgs);
        // HACK TODO: Need structured output from pac CLI to make parsing out of the resulting env URL more robust
        const envUrl = result
            .filter(l => l.length > 0)
            .pop()
            ?.trim()
            .split(/\s+/)
            .shift();
        core.info(result.join(os.EOL));
        core.setOutput('environment-url', envUrl);
        core.endGroup();
    } catch (error) {
        core.setFailed(`failed: ${error.message}`);
        throw error;
    }
}
