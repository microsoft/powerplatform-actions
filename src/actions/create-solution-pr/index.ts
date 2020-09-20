// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import { ActionLogger, getWorkingDirectory, GitRunner } from '../../lib';
import { format } from 'date-fns';
import fs = require('fs-extra');
import path = require('path');

core.startGroup('create-solution-pr:');
const workingDir = getWorkingDirectory('working-directory', false);

const solutionFolderCand = core.getInput('solution-folder', { required: true });
const solutionFolder = path.isAbsolute(solutionFolderCand) ? solutionFolderCand : path.resolve(workingDir, solutionFolderCand);
const solutionTargetFolder = core.getInput('solution-target-folder', { required: true });
const repoUrl = core.getInput('repo-url', { required: true });
const token = core.getInput('token', { required: true });

const branchNameCand = core.getInput('branch-name', { required: true });
const branchName = `${branchNameCand}-${format(Date.now(), 'yyyyMMdd-HHmm')}`;

const stagingDir = path.resolve(workingDir, 'staging');
fs.ensureDirSync(stagingDir);
fs.emptyDirSync(stagingDir);

core.info(`create solution pullrequest: into branch ${branchName} from folder: ${solutionFolder} (staged in: ${stagingDir})`);

const logger = new ActionLogger();
const currDir = process.cwd();

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
(async () => {
    process.chdir(stagingDir);
    core.startGroup('prepare staging with git repo');
    const git = new GitRunner(stagingDir, logger);
    await git.run(['init']);
    await git.run(['remote', 'add', 'origin', repoUrl]);
    await git.run(['config', '--local', 'user.email', "davidjen@davidjend365.onmicrosoft.com"]);
    await git.run(['config', '--local', 'user.name', "David"]);
    await git.run(['config', '--local', 'http.https://github.com/.extraheader', `AUTHORIZATION: basic ${Buffer.from(`PAT:${token}`).toString('base64')}`]);
    await git.run(['fetch', '--no-tags', '--prune', '--depth=1', 'origin']);
    const remotes = await git.run(['remote', 'show', 'origin']);
    const head = remotes.map(line => {
        const branch = line.match(/HEAD branch:\s*(\S+)/);
        if (branch && branch.length >= 2) {
            return branch[1];
        }
    });
    if (!head || head.length < 1 || head.length > 1 || !head[0]) {
        throw Error(`Cannot determine HEAD from remote: ${repoUrl}`);
    }
    const headBranch = head[0];
    await git.run(['checkout', '--progress', '--force', headBranch]);

    core.startGroup(`stage solution into branch ${branchName}`);
    await git.run(['checkout', '-B', branchName]);
    core.info(`creating branch for solution: ${branchName}...`);

    fs.emptyDirSync(solutionTargetFolder);
    fs.copySync(solutionFolder, solutionTargetFolder, { recursive: true });
    await git.run(['add', solutionTargetFolder]);
    await git.run(['status', '--branch', '--short']);

    core.startGroup(`commit solution into ${branchName} and push for pull request to ${repoUrl}`);
    await git.run(['commit', '-m', `PR for exported solution ${branchName}`]);
    await git.run(['push', 'origin', branchName]);

    // https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token

    process.chdir(currDir);
    core.endGroup();

})().catch(error => {
    process.chdir(currDir);
    core.setFailed(`failed: ${error}`);
    core.endGroup();
});
