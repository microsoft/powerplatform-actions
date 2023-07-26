// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import process = require('process');
import { main } from './index';

process.env['INPUT_NAME'] = '1';
process.env['INPUT_VERSION'] = '1';

process.env['RUNNER_DEBUG'] = '1';
process.env['GITHUB_ACTIONS'] = '1';
main();
