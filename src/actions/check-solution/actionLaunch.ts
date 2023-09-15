// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import path = require('path');
import process = require('process');

process.env['INPUT_ENVIRONMENT-URL'] = new URL(process.env['PA_BT_ORG_URL'] ?? 'https://ppdevtools.crm.dynamics.com').href;
// process.env['INPUT_APP-ID'] = process.env['PA_BT_ORG_SPN_ID'] ?? '8e2da2df-60cc-4aef-8676-71cdb789ddf7';
// process.env['INPUT_CLIENT-SECRET'] = process.env['PA_BT_ORG_SPNKEY'] ?? "expectSpnKeyFromEnvVariable";
// process.env['INPUT_TENANT-ID'] = process.env['PA_BT_ORG_SPN_TENANT_ID'] ?? '3041a058-5110-495a-a575-b2a5571d9eac';
process.env['INPUT_USER-NAME'] = process.env['PA_BT_ORG_USER'] ?? 'ppdevautomation@ppdevtools.onmicrosoft.com';
const password = process.env['PA_BT_ORG_PASSWORD'] ?? '';
process.env['INPUT_PASSWORD-SECRET'] = password;

process.env['INPUT_PATH'] = path.resolve(__dirname, '..', '..', '..', 'src', 'test', 'data', 'e*.zip');
process.env['INPUT_GEO'] = 'unitedstates';

process.env['RUNNER_DEBUG'] = '1';
process.env['GITHUB_ACTIONS'] = '1';
process.env['GITHUB_WORKSPACE'] = path.resolve(__dirname, '..', '..', '..', 'out');

require("./index");
