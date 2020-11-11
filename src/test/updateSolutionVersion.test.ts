// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import path = require('path');
import { forEachOf } from 'async';
import { expect } from 'chai';

import { main as updateSolutionVersion } from '../actions/update-solution-version';
import { MockedRunners } from './mockedRunners';
import { ActionInputsEmulator } from './actionInputsEmulator';

describe('update-solution-version#input validation', () => {
    const workDir = path.resolve(__dirname, '..', '..', 'out', 'test');
    const mockFactory: MockedRunners = new MockedRunners(workDir);
    // TODO: read in params and their required state from the action.yml
    const inputParams = [
        { Name: 'solution-patch-version', Value: '10' },
        { Name: 'solution-version-update-strategy', Value: 'solution' }
    ];
    const actionInputs = new ActionInputsEmulator(inputParams);

    forEachOf(inputParams, (inputParam) => {
        it(`required parameter - ${inputParam.Name}`, async() => {
            actionInputs.defineInputsExcept(inputParam.Name);
            let res, err;
            try {
                res = await updateSolutionVersion(mockFactory);
            }
            catch (error) {
                err = error;
            }
            expect(res).to.be.undefined;
            expect(err.message).to.match(new RegExp(`required and not supplied: ${inputParam.Name}`));
        });
    });

    it('call action', async() => {
        actionInputs.defineInputs();
        let err;
        try {
            await updateSolutionVersion(mockFactory);
        }
        catch (error) {
            err = error;
        }
        expect(err).to.be.undefined;
        const loggedCommands = mockFactory.loggedCommands;
        expect(loggedCommands).to.deep.include({ RunnerName: 'pac', Arguments: [ 'solution', 'version', '--patchversion', '10', '--strategy', 'solution' ] });
    });
});
