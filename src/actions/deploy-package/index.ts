// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import os = require('os');
import { AuthKind, AuthHandler, DefaultRunnerFactory, RunnerFactory} from '../../lib';

(async () => {
    if (process.env.GITHUB_ACTIONS) {
        await main(DefaultRunnerFactory);
    }
})();

export async function main(factory: RunnerFactory): Promise<void> {
    try {
        core.startGroup('deploy-package:');
        const platform = os.platform();
        if (platform !== 'win32') {
            throw Error(`Unsupported runner os: '${platform}'; package deployer is only available on Windows`);
        }
        const pac = factory.getRunner('pac', process.cwd());
        const packagePath = core.getInput('package', { required: true });
        const logToConsole = core.getInput('log-console', { required: false });
        const LogToFile = core.getInput('log-file', { required: false });
        await new AuthHandler(pac).authenticate(AuthKind.CDS);

        const deployPackageArgs = ['package', 'deploy', '--package', packagePath, '--logFile', LogToFile, '--logConsole', logToConsole];
        await pac.run(deployPackageArgs);
        core.info('package deployed.');
        core.endGroup();
    } catch (error) {
        core.setFailed(`failed: ${error.message}`);
        throw error;
    }
}
