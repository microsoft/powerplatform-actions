// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import path = require('path');
import { expect } from 'chai';
import { MockedRunners } from './mockedRunners';
import { ActionInputsEmulator } from './actionInputsEmulator';
import { AuthKind, AuthHandler } from '../lib';

describe('authHandler#input validations', () => {
    const workDir = path.resolve(__dirname, '..', '..', 'out', 'test');
    const mockFactory: MockedRunners = new MockedRunners(workDir);
    const pac = mockFactory.getRunner('pac', process.cwd());

    const authInputParams = [
        { Name: 'environment-url', Value: 'aUrl' },
        { Name: 'user-name', Value: 'aUserName' },
        { Name: 'password-secret', Value: 'aSecret' },
        { Name: 'app-id', Value: 'test-app-id'},
        { Name: 'client-secret', Value: 'test-secret'},
        { Name: 'tenant-id', Value: 'test-tenant-id'}
    ];

    const actionInputs = new ActionInputsEmulator(authInputParams);
    it('authHandler correctly uses username/password auth flow when username/password are passed as input params', async () => {
        actionInputs.defineInputsExcept('app-id');
        let err;
        try {
            const authHandler = new AuthHandler(pac);
            await authHandler.authenticate(AuthKind.CDS);
        }
        catch(error) {
            err = error;
        }
        expect(err).to.be.undefined;
        const loggedCommands = mockFactory.loggedCommands;
        expect(loggedCommands).to.deep.include({ RunnerName: 'pac', Arguments: [ 'auth', 'clear' ] });
        expect(loggedCommands).to.deep.include({ RunnerName: 'pac', Arguments: [ 'auth', 'create', '--url', 'aUrl', '--username', 'aUserName', '--password', 'aSecret'] });
    })
});
