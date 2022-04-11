// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import process = require('process');
import { main } from './index';

process.env['INPUT_ENVIRONMENT'] = new URL(process.env['PP_A_ENV'] ?? 'https://contoso.crm.dynamics.com').href;
process.env['INPUT_OBJECT_ID'] = process.env['PP_A_OBJECT_ID'] ?? '8a7729e0-0000-0000-0000-c789d0a9720a';
process.env['INPUT_ROLE'] = process.env['PP_A_ROLE'] ?? '12345678-0000-0000-0000-c789d0a91234';

process.env['RUNNER_DEBUG'] = '1';
process.env['GITHUB_ACTIONS'] = '1';
main();
