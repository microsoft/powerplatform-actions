
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import path = require('path');
import { expect } from 'chai';
import { GitRunner } from '../lib';
import { TestLog } from './testLog';


describe('git', () => {
    const workDir = path.resolve(__dirname, '..', '..', 'out', 'test');
    const logger = new TestLog('git-tests.log');
    const git = new GitRunner(workDir, logger);

    it('can launch git log', async() => {
        const logs = await git.run(['log']);

        // DEBUGGING - appears to be a difference in Git output between Windows and Linux
        // revert prior to merge to main
        //const firstCommit = logs.pop()?.trimStart();
        //expect(firstCommit).to.match(/commit\s+[0-9a-z]{7,}/);
        logger.info("DEBUGGING: Git logs array: ", ...logs);
        const pop = logs.pop();
        logger.info("DEBUGGING: pop: ", pop ? pop : "empty");
        const trimmed = pop?.trimStart();
        logger.info("DEBUGGING:  trimmed: ", trimmed ? trimmed : "empty");
        expect(trimmed).to.match(/commit\s+[0-9a-z]{7,}/);
    });
});
