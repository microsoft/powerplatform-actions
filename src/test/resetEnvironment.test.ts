// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import path = require('path');
import { expect } from 'chai';

import { main as resetEnvironment } from '../actions/reset-environment';
import { MockedRunners } from './mockedRunners';
import { ActionInputsEmulator } from './actionInputsEmulator';

describe('reset-environment#input validation', () => {
    const workDir = path.resolve(__dirname, '..', '..', 'out', 'test');
    const mockFactory: MockedRunners = new MockedRunners(workDir)

    const inputParams = [
        { Name: 'environment-url', Value: 'aUrl', required: true},
        { Name: 'user-name', Value: 'aUserName', required: false},
        { Name: 'password-secret', Value: 'aSecret', required: false},
    ];
    const actionsInput = new ActionInputsEmulator(inputParams);

    it('call action', async() => {
        actionsInput.defineInputs();
        let err;
        try {
            await resetEnvironment(mockFactory);
        }
        catch (error) {
            err = error;
        }
        expect(err).to.be.undefined;
        const loggedCommands = mockFactory.loggedCommands;
        expect(loggedCommands).to.deep.include({ RunnerName: 'pac', Arguments: [ 'auth', 'create', '--kind', 'ADMIN', '--username', 'aUserName', '--password', 'aSecret']});
        expect(loggedCommands).to.deep.include({ RunnerName: 'pac', Arguments: ['admin', 'reset', '--url', 'aUrl' ]});
    }).timeout(5000);
});
