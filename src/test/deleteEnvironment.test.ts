// // Copyright (c) Microsoft Corporation.
// // Licensed under the MIT License.
// import path = require('path');
// import { expect } from 'chai';

// import { main as deleteEnvironment } from '../actions/delete-environment';
// import { MockedRunners } from './mockedRunners';
// import { ActionInputsEmulator } from './actionInputsEmulator';

// describe('delete-environment#input validation', () => {
//     const workDir = path.resolve(__dirname, '..', '..', 'out', 'test');
//     const mockFactory: MockedRunners = new MockedRunners(workDir);

//     const inputParams = [
//         { Name: 'environment-url', Value: 'aUrl' },
//         { Name: 'environment-id', Value: 'envId' },
//         { Name: 'user-name', Value: 'aUserName' },
//         { Name: 'password-secret', Value: 'aSecret' },
//     ];
//     const actionInputs = new ActionInputsEmulator(inputParams);

//     it('call action', async() => {
//         actionInputs.defineInputs();
//         let err;
//         try {
//             await deleteEnvironment(mockFactory);
//         }
//         catch (error) {
//             err = error;
//         }
//         expect(err).to.be.undefined;
//         const loggedCommands = mockFactory.loggedCommands;
//         expect(loggedCommands).to.deep.include({ RunnerName: 'pac', Arguments: [ 'auth', 'create', '--kind', 'ADMIN', '--username', 'aUserName', '--password', 'aSecret'] });
//         expect(loggedCommands).to.deep.include({ RunnerName: 'pac', Arguments: [ 'admin', 'delete', '--url', 'aUrl' ] });
//     }).timeout(5000);
// });
