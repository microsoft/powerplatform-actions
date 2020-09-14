// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import cp = require('child_process');
import path = require('path');
import process = require('process');

process.env['INPUT_SOLUTION-FILE'] = path.resolve(__dirname, '..', '..', 'src', 'test', 'data', 'emptySolution_0_1_0_0.zip');
process.env['INPUT_SOLUTION-NAME'] = 'emptySolution';
process.env['INPUT_SOLUTION-FOLDER'] = path.resolve(__dirname, '..', '..', 'out', 'unpack solution');
process.env['INPUT_SOLUTION-TYPE'] = 'unmanaged';
// process.env['INPUT_OVERWRITE-FILES'] = 'false';

const pathToAction = path.join(__dirname, 'index.js');
process.env['RUNNER_DEBUG'] = '1';
cp.execSync(`node ${pathToAction}`, { stdio: 'inherit'});
