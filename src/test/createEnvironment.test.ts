// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import path = require('path');
import { forEachOf } from 'async';
import { expect } from 'chai';
import { main as createEnvironment } from '../actions/create-environment';
import { MockedRunners } from './mockedRunners';
import { ActionInputsEmulator } from './actionInputsEmulator';

describe('create-environment#input validation', () => {
    const workDir = path.resolve(__dirname, '..', '..', 'out', 'test');
    const mockFactory: MockedRunners = new MockedRunners(workDir);
    // TODO: read in params and their required state from the action.yml
    const requiredParams = [
        { Name: 'name', Value: 'newEnvironment', required: true },
        { Name: 'type', Value: 'Sandbox', required: true }
    ];

    const inputParams = [
        { Name: 'name', Value: 'newEnvironment', required: true },
        { Name: 'type', Value: 'Sandbox', required: true },
        { Name: 'user-name', Value: 'aUserName', required: false},
        { Name: 'password-secret', Value: 'aSecret', required: false},
        { Name: 'region', Value: 'unitedstates', required: false},
        { Name: 'domain', Value: 'test-rolling123', required: false}

    ];
    const actionInputs = new ActionInputsEmulator(inputParams);

    forEachOf(requiredParams, (requiredInputParam) => {
        it(`required parameter - ${requiredInputParam.Name}`, async() => {
            actionInputs.defineInputsExcept(requiredInputParam.Name);
            let res, err;
            try {
                res = await createEnvironment(mockFactory);
            }
            catch (error) {
                err = error;
            }
            expect(res).to.be.undefined;
            if(requiredInputParam.required)
                expect(err.message).to.match(new RegExp(`required and not supplied: ${requiredInputParam.Name}`));
        });
    });

    it('call action', async() => {
        actionInputs.defineInputs();
        let err;
        try {
            await createEnvironment(mockFactory);
        }
        catch (error) {
            err = error;
        }
        expect(err).to.be.undefined;
        const loggedCommands = mockFactory.loggedCommands;
        expect(loggedCommands).to.deep.include({ RunnerName: 'pac', Arguments: [ 'auth', 'create', '--kind', 'ADMIN', '--username', 'aUserName', '--password', 'aSecret'] });
        expect(loggedCommands).to.deep.include({ RunnerName: 'pac', Arguments: [ 'admin', 'create', '--name', 'newEnvironment', '--region', 'unitedstates', '--type', 'Sandbox', '--domain', 'test-rolling123'] });
    });
});
