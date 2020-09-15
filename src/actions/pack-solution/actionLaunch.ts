// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import cp = require('child_process');
import path = require('path');
import process = require('process');

process.env['INPUT_SOLUTION-FOLDER'] = path.resolve(__dirname, '..', '..', '..', 'src', 'test', 'data', 'emptySolution');
process.env['INPUT_SOLUTION-NAME'] = 'emptySolution';
process.env['INPUT_SOLUTION-FILE'] = path.resolve(__dirname, '..', '..', 'out', 'packed solution.zip');
process.env['INPUT_SOLUTION-TYPE'] = 'unmanaged';

const pathToAction = path.join(__dirname, 'index.js');
process.env['RUNNER_DEBUG'] = '1';
cp.execSync(`node ${pathToAction}`, { stdio: 'inherit'});
