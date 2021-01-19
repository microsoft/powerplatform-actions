// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import process = require('process');
import { DefaultRunnerFactory } from '../../lib';
import { main } from './index';

process.env['INPUT_ENVIRONMENT-URL'] = new URL(process.env['PA_BT_ORG_URL'] ?? 'https://davidjenD365-1.crm.dynamics.com').href;
process.env['INPUT_USER-NAME'] = process.env['PA_BT_ORG_USER'] ?? 'davidjen@davidjenD365.onmicrosoft.com';

const password = process.env['PA_BT_ORG_PASSWORD'] ?? '';
if (!password || password.length === 0) {
    throw new Error('Missing password! Specify one by setting env variable: PA_BT_ORG_PASSWORD');
}
process.env['INPUT_PASSWORD-SECRET'] = password;
process.env['BACKUP_LABEL'] = 'test-backup-label';

process.env['RUNNER_DEBUG'] = '1';
process.env['GITHUB_ACTIONS'] = '1';
main(DefaultRunnerFactory);
