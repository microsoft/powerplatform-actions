// // Copyright (c) Microsoft Corporation.
// // Licensed under the MIT License.
// import path = require('path');
// import { forEachOf } from 'async';
// import { expect } from 'chai';

// import { main as restoreEnvironment } from '../actions/restore-environment';
// import { MockedRunners } from './mockedRunners';
// import { ActionInputsEmulator } from './actionInputsEmulator';

// describe('restore-environment#input validation', () => {
//     const workDir = path.resolve(__dirname, '..', '..', 'out', 'test');
//     const mockFactory: MockedRunners = new MockedRunners(workDir);
//     // TODO: read in params and their required state from the action.yml
//     const requiredParams = [
//         { Name: 'source-url', Value: 'sourceUrl', required: true},
//         { Name: 'target-url', Value: 'targetUrl', required: true},
//         { Name: 'selected-backup', Value: 'latest', required: true},
//     ];

//     const inputParams = [
//         { Name: 'user-name', Value: 'aUserName', required: false},
//         { Name: 'password-secret', Value: 'aSecret', required: false},
//         { Name: 'source-url', Value: 'sourceUrl', required: true},
//         { Name: 'target-url', Value: 'targetUrl', required: true},
//         { Name: 'selected-backup', Value: 'latest', required: true},
//     ];
//     const actionInputs = new ActionInputsEmulator(inputParams);

//     forEachOf(requiredParams, (inputParam) => {
//         it(`required parameter - ${inputParam.Name}`, async() => {
//             actionInputs.defineInputsExcept(inputParam.Name);
//             let res, err;
//             try {
//                  res = await restoreEnvironment(mockFactory);
//             }
//             catch (error) {
//                 err = error;
//             }
//             expect(res).to.be.undefined;
//             expect(err.message).to.match(new RegExp(`required and not supplied: ${inputParam.Name}`));
//         });
//     });

//     it('call action', async() => {
//         actionInputs.defineInputs();
//         let err;
//         try {
//             await restoreEnvironment(mockFactory);
//         }
//         catch (error) {
//             err = error;
//         }
//         expect(err).to.be.undefined;
//         const loggedCommands = mockFactory.loggedCommands;
//         expect(loggedCommands).to.deep.include({ RunnerName: 'pac', Arguments: [ 'auth', 'create', '--kind', 'ADMIN', '--username', 'aUserName', '--password', 'aSecret'] });
//         expect(loggedCommands).to.deep.include({ RunnerName: 'pac', Arguments: [ 'admin', 'restore', '--source-url', 'sourceUrl', '--target-url', 'targetUrl', '--selected-backup', 'latest'] });
//     }).timeout(5000);
// });
