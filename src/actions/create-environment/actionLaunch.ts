// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import process = require('process');
import { DefaultRunnerFactory } from '../../lib';
import { main } from './index';

process.env['INPUT_USER-NAME'] = process.env['PA_BT_ORG_USER'] ?? 'davidjen@ppdevtools.onmicrosoft.com';

const password = process.env['PA_BT_ORG_PASSWORD'] ?? '';
if (!password || password.length === 0) {
    throw new Error('Missing password! Specify one by setting env variable: PA_BT_ORG_PASSWORD');
}
process.env['INPUT_PASSWORD-SECRET'] = password;
process.env['INPUT_NAME'] = 'test-pizza';
process.env['INPUT_REGION'] = 'unitedstates';
process.env['INPUT_TYPE'] = 'Sandbox';

process.env['RUNNER_DEBUG'] = '1';
process.env['GITHUB_ACTIONS'] = '1';
main(DefaultRunnerFactory);
