// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { expect } from 'chai';
import { PacAccess } from '../lib'
import path = require('path');
import fs = require('fs-extra');
import { TestLog } from './testLog';

describe('PacAccess', () => {
    const workDir = path.resolve(__dirname, '..', '..', 'out', 'test');
    const pac = new PacAccess(workDir, new TestLog());

    before(() => {
        fs.emptyDirSync(workDir);
    });

    it('can launch pac help screen', async() => {
        expect(pac.workingDir).to.be.equal(workDir);

        const res = await pac.run([]);
        expect(res).to.be.not.null;
        expect(res).to.be.not.empty;
    }).timeout(10*1000);

    it.skip('can clone emptySolution, implicit login', async() => {
        expect(pac.workingDir).to.be.equal(workDir);

        const res = await pac.run([ 'solution', 'clone', '--name', 'emptySolution' ]);
        expect(res).to.be.not.empty;
    }).timeout(30*1000);
});
