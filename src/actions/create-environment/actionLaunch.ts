// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import process = require('process');
import { main } from './index';

process.env['INPUT_USER-NAME'] = process.env['PA_BT_ORG_USER'] ?? 'ppdevautomation@ppdevtools.onmicrosoft.com';
process.env['INPUT_APP-ID'] = process.env['PA_BT_ORG_SPN_ID'] ?? '8a7729e0-2b71-4919-a89a-c789d0a9720a';
process.env['INPUT_CLIENT-SECRET'] = process.env['PA_BT_ORG_SPNKEY'] ?? "expectSpnKeyFromEnvVariable";
process.env['INPUT_TENANT-ID'] = process.env['PA_BT_ORG_SPN_TENANT_ID'] ?? '3041a058-5110-495a-a575-b2a5571d9eac';

const password = process.env['PA_BT_ORG_PASSWORD'] ?? '';

process.env['INPUT_PASSWORD-SECRET'] = password;
process.env['INPUT_NAME'] = 'test-pizza';
process.env['INPUT_REGION'] = 'unitedstates';
process.env['INPUT_TYPE'] = 'Sandbox';
process.env['INPUT_TEAM-ID'] = '3041a058-0000-0000-0000-b2a5571d9eac';

process.env['RUNNER_DEBUG'] = '1';
process.env['GITHUB_ACTIONS'] = '1';
main();
