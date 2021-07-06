// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import { ActionLogger, AuthHandler, AuthKind, getWorkingDirectory, PacRunner } from '../../lib';


core.startGroup('download-paportal:');
const downloadPath = core.getInput('download-path', { required: true });
const websiteId = core.getInput('website-id', { required: true });
core.info(`downloadPath: path:${downloadPath} websiteId: ${websiteId} `);

const workingDir = getWorkingDirectory('working-directory', false);

const logger = new ActionLogger();

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
(async () => {
    const pac = new PacRunner(workingDir, logger);
    await new AuthHandler(pac).authenticate(AuthKind.CDS);

    const exportArgs = ['paportal', 'download', '--path', downloadPath, '--websiteId', websiteId];

    await pac.run(exportArgs);
    core.info(`downloading portal data for websiteId: ${websiteId} at location : ${downloadPath}`);
    core.endGroup();

})().catch(error => {
    core.setFailed(`failed: ${error}`);
    core.endGroup();
});
