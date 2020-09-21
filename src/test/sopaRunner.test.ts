// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import path = require('path');
import fs = require('fs-extra');
import { expect } from 'chai';
import { SopaRunner } from '../lib';
import { TestLog } from './testLog';


describe('SoPa', () => {
    const workDir = path.resolve(__dirname, '..', '..', 'out', 'test');
    const sopa = new SopaRunner(workDir, new TestLog('sopa-tests.log'));

    before(() => {
        fs.emptyDirSync(workDir);
    });

    it('can launch SoPa help screen', async() => {

        sopa.run([]).then(() => {
            chai.assert.fail();
        })
        .catch(err => {
            expect(err).to.be.a('Error')
                .with.property('exitCode', 2);
        });
    });

    it('can pack solution', async() => {
        const solutionPath = path.resolve(workDir, 'emptySolution');
        const stagedDir = path.resolve(__dirname, 'data', 'emptySolution');

        const res = await sopa.run([ '/nologo', '/action:pack', `/zipFile:${solutionPath}`, `/folder:${stagedDir}`]);
        expect(res).to.contain('Unmanaged Pack complete.');
    }).timeout(20*1000);
});
