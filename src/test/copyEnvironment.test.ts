// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import path = require('path');
import { forEachOf } from 'async';
import { expect } from 'chai';

import { main as copyEnvironment } from '../actions/copy-environment';
import { MockedRunners } from './mockedRunners';
import { ActionInputsEmulator } from './actionInputsEmulator';

describe('copy-environment#input validation', () => {
    const workDir = path.resolve(__dirname, '..', '..', 'out', 'test');
    const mockFactory: MockedRunners = new MockedRunners(workDir);
    // TODO: read in params and their required state from the action.yml
    const inputParams = [
        { Name: 'user-name', Value: 'aUserName', required: true},
        { Name: 'password-secret', Value: 'aSecret', required: true},
        { Name: 'source-url', Value: 'sourceUrl', required: true},
        { Name: 'target-url', Value: 'targetUrl', required: true},
    ];
    const actionInputs = new ActionInputsEmulator(inputParams);

    forEachOf(inputParams, (inputParam) => {
        it(`required parameter - ${inputParam.Name}`, async() => {
            actionInputs.defineInputsExcept(inputParam.Name);
            let res, err;
            try {
                res = await copyEnvironment(mockFactory);
            }
            catch (error) {
                err = error;
            }
            expect(res).to.be.undefined;
            if(inputParam.required)
                expect(err.message).to.match(new RegExp(`required and not supplied: ${inputParam.Name}`));
        });
    });

    it('call action', async() => {
        actionInputs.defineInputs();
        let err;
        try {
            await copyEnvironment(mockFactory);
        }
        catch (error) {
            err = error;
        }
        expect(err).to.be.undefined;
        const loggedCommands = mockFactory.loggedCommands;
        expect(loggedCommands).to.deep.include({ RunnerName: 'pac', Arguments: [ 'auth', 'create', '--kind', 'ADMIN', '--username', 'aUserName', '--password', 'aSecret'] });
        expect(loggedCommands).to.deep.include({ RunnerName: 'pac', Arguments: [ 'admin', 'copy', '--source-url', 'sourceUrl', '--target-url', 'targetUrl'] });
    });
});
