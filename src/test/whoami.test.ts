// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import path = require('path');
import { expect } from 'chai';

import { main as whoAmI } from '../actions/who-am-i';
import { MockedRunners } from './mockedRunners';
import { ActionInputsEmulator } from './actionInputsEmulator';

describe('who-am-i#input validation', () => {
    const workDir = path.resolve(__dirname, '..', '..', 'out', 'test');
    const mockFactory: MockedRunners = new MockedRunners(workDir);
    // TODO: read in params and their required state from the action.yml

    const inputParams = [
        { Name: 'environment-url', Value: 'aUrl' },
        { Name: 'user-name', Value: 'aUserName' },
        { Name: 'password-secret', Value: 'aSecret' },
    ];
    const actionInputs = new ActionInputsEmulator(inputParams);

    it('call action', async() => {
        actionInputs.defineInputs();
        let err;
        try {
            await whoAmI();
        }
        catch (error) {
            err = error;
        }
        expect(err).to.be.undefined;
        const loggedCommands = mockFactory.loggedCommands;
        expect(loggedCommands).to.deep.include({ RunnerName: 'pac', Arguments: [ 'auth', 'create', '--url', 'aUrl', '--username', 'aUserName', '--password', 'aSecret'] });
        expect(loggedCommands).to.deep.include({ RunnerName: 'pac', Arguments: [ 'org', 'who' ] });
    });
});
