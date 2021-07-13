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
    let pac;
    try {
        core.startGroup('publish-solution:');
        pac = factory.getRunner('pac', process.cwd());
        await new AuthHandler(pac).authenticate(AuthKind.CDS);

        const publishArgs = ['solution', 'publish'];
        await pac.run(publishArgs);
        core.info('published solution customizations');
        core.endGroup();
    } catch (error) {
        core.setFailed(`failed: ${error.message}`);
        throw error;
    }  finally {
        await pac?.run(["auth", "clear"]);
    }
}
