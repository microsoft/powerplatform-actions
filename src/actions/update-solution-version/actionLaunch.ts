// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import process = require('process');
import { DefaultRunnerFactory } from '../../lib';
import { main } from './index';

process.env['INPUT_PATCH-VERSION'] = '10';
// process.env['INPUT_STRATEGY'] = 'solution';

process.env['RUNNER_DEBUG'] = '1';
process.env['GITHUB_ACTIONS'] = '1';
main(DefaultRunnerFactory);
