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
        core.startGroup('who-am-i');

        const pac = factory.getRunner('pac', process.cwd());
        await new AuthHandler(pac).authenticate(AuthKind.CDS);

        const whoArgs = ['org', 'who'];
        await pac.run(whoArgs);
        core.endGroup();
    } catch (error) {
        core.setFailed(`failed: ${error.message}`);
        throw error;
    }
}
