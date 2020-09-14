// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import { ActionLogger, PacAccess } from '../../lib';

core.startGroup('who-am-i');
const envUrl = core.getInput('environment-url', { required: true });
const username = core.getInput('user-name', { required: true });
core.info(`environmentUrl: ${envUrl}; login as user: ${username}`);

const password = core.getInput('password-secret', { required: true });
if (!password || password.length === 0) {
    core.setFailed('Missing password! Specify one by setting input: \'password-secret\'');
}
const workingDir = process.cwd();
const logger = new ActionLogger();

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
(async () => {
    const pac = new PacAccess(workingDir, logger);
    await pac.run(['auth', 'clear']);
    await pac.run(['auth', 'create', '--url', envUrl, '--username', username, '--password', password]);

    const whoArgs = ['org', 'who'];
    await pac.run(whoArgs);
    core.endGroup();

})().catch(error => {
    core.setFailed(`failed: ${error}`);
    core.endGroup();
});
