// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import path = require('path');
import { forEachOf, parallel } from 'async';
import { expect } from 'chai';

import { main as deleteEnvironment } from '../actions/delete-environment';
import { MockedRunners } from './mockedRunners';
import { ActionInputsEmulator } from './actionInputsEmulator';

describe('delete-environment#input validation', () => {
    const workDir = path.resolve(__dirname, '..', '..', 'out', 'test');
    const mockFactory: MockedRunners = new MockedRunners(workDir);
    // TODO: read in params and their required state from the action.yml
    const inputParams = [
        { Name: 'environment-url', Value: 'aUrl' },
        { Name: 'user-name', Value: 'aUserName' },
        { Name: 'password-secret', Value: 'aSecret' },
    ];
    const actionInputs = new ActionInputsEmulator(inputParams);

    forEachOf(inputParams, (inputParam) => {
        it(`required parameter - ${inputParam.Name}`, async() => {
            actionInputs.defineInputsExcept(inputParam.Name);
            let res, err;
            try {
                 res = await deleteEnvironment(mockFactory);
            }
            catch (error) {
                err = error;
            }
            expect(res).to.be.undefined;
        });
    });

    it('call action', async() => {
        actionInputs.defineInputs();
        let err;
        try {
            await deleteEnvironment(mockFactory);
        }
        catch (error) {
            err = error;
        }
        expect(err).to.be.undefined;
        const loggedCommands = mockFactory.loggedCommands;
        expect(loggedCommands).to.deep.include({ RunnerName: 'pac', Arguments: [ 'auth', 'create', '--url', 'aUrl', '--username', 'aUserName', '--password', 'aSecret'] });
        expect(loggedCommands).to.deep.include({ RunnerName: 'pac', Arguments: [ 'admin', 'delete', '--url', 'aUrl' ] });
    });
});
