
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
        const logs = await git.run(['log', '-1']);
        const line = logs.find(item => item && item.startsWith('commit'));
        expect(line).to.match(/commit\s+[0-9a-z]{7,}/);
    });
});
