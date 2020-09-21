
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import path = require('path');
import { expect } from 'chai';
import { GitRunner } from '../lib';
import { TestLog } from './testLog';


describe('git', () => {
    const workDir = path.resolve(__dirname, '..', '..', 'out', 'test');
    const git = new GitRunner(workDir, new TestLog('git-tests.log'));

    it('can launch git log', async() => {
        const logs = await git.run(['log']);
        const firstCommit = logs.pop()?.trimStart();
        expect(firstCommit).to.match(/commit\s+[0-9a-z]{7,}/);
    });
});
