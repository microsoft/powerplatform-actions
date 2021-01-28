// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import path = require('path');
import { expect } from 'chai';
import { MockedRunners } from './mockedRunners';
import { ActionInputsEmulator } from './actionInputsEmulator';
import { AuthHandler, PacRunner } from '../lib';
import { AuthKind } from '../lib/authHandler';

describe('authHandler#input validations', () => {
    const workDir = path.resolve(__dirname, '..', '..', 'out', 'test');
    const mockFactory: MockedRunners = new MockedRunners(workDir);

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
            const authHandler = new AuthHandler(mockFactory);
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

    it('authHandler correctly uses SPN auth flow when appId/clientSecret are passed as input params', async() => {
        actionInputs.defineInputsExcept('user-name');
        let err;
        try {
            const authHandler = new AuthHandler(mockFactory);
            await authHandler.authenticate(AuthKind.CDS);
        }
        catch(error) {
            err = error;
        }
        expect(err).to.be.undefined;
        const loggedCommands = mockFactory.loggedCommands;
        expect(loggedCommands).to.deep.include({ RunnerName: 'pac', Arguments: [ 'auth', 'clear' ] });
        expect(loggedCommands).to.deep.include({ RunnerName: 'pac', Arguments: [ 'auth', 'create', '--url', 'aUrl', '--applicationId', 'test-app-id', '--clientSecret', 'test-secret', '--tenant', 'test-tenant-id'] });
    });

    it('authHandler throws error when both username/password and client credentials are passed', async() => {
        actionInputs.defineInputs();
        let err, res;
        try {
            const authHandler = new AuthHandler(mockFactory);
            res = await authHandler.authenticate(AuthKind.ADMIN);
        }
        catch(error) {
            err = error;
        }
        expect(res).to.be.undefined;
        expect(err.message).to.match(new RegExp(`Must pick either username/password or client credential as the authentication flow.`));
    });
});
