// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import { ActionLogger, AuthHandler, AuthKind, getWorkingDirectory, PacRunner, Runner } from '../../lib';


core.startGroup('upload-paportal:');
const uploadPath = core.getInput('upload-path', { required: true });
core.info(`upload: path:${uploadPath} `);
const deploymentProfile = core.getInput('deployment-profile', { required: false });
core.info(`deploymentProfile: ${deploymentProfile} `);

const workingDir = getWorkingDirectory('working-directory', false);

const logger = new ActionLogger();
let pac: Runner;
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
(async () => {
    pac = new PacRunner(workingDir, logger);
    await new AuthHandler(pac).authenticate(AuthKind.CDS);

    const exportArgs = ['paportal', 'upload', '--path', uploadPath];
    if (deploymentProfile) { exportArgs.push('--deploymentProfile', deploymentProfile); }

    await pac.run(exportArgs);
    core.info(`uploading portal data to current profile from: ${uploadPath}`);
    core.endGroup();

})().catch(error => {
    core.setFailed(`failed: ${error}`);
    core.endGroup();
}).finally(async () => {
    await pac?.run(["auth", "clear"]);
});
