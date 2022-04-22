// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import process = require('process');
import { main } from './index';

process.env['INPUT_ENVIRONMENT-URL'] = new URL(process.env['PA_BT_ORG_URL'] ?? 'https://davidjenD365-1.crm.dynamics.com').href;
process.env['INPUT_USER-NAME'] = process.env['PA_BT_ORG_USER'] ?? 'davidjen@ppdevtools.onmicrosoft.com';
process.env['INPUT_APP-ID'] = process.env['PA_BT_ORG_SPN_ID'] ?? '8a7729e0-2b71-4919-a89a-c789d0a9720a';
process.env['INPUT_CLIENT-SECRET'] = process.env['PA_BT_ORG_SPNKEY'] ?? "expectSpnKeyFromEnvVariable";
process.env['INPUT_TENANT-ID'] = process.env['PA_BT_ORG_SPN_TENANT_ID'] ?? '3041a058-5110-495a-a575-b2a5571d9eac';

const password = process.env['PA_BT_ORG_PASSWORD'] ?? '';
process.env['INPUT_PASSWORD-SECRET'] = password;

process.env['RUNNER_DEBUG'] = '1';
process.env['GITHUB_ACTIONS'] = '1';
main();
