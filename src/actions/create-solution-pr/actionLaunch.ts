// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import cp = require('child_process');
import path = require('path');
import process = require('process');

process.env['INPUT_SOLUTION-FOLDER'] = path.resolve(__dirname, '..', '..', '..', 'src', 'test', 'data', 'emptySolution');
process.env['INPUT_SOLUTION-TARGET-FOLDER'] = path.join('solutions', 'emptySolution');
process.env['INPUT_REPO-URL'] = 'https://github.com/davidjenni/pp-actions-sample.git';
// TODO: remove token
process.env['INPUT_TOKEN'] = 'token';
process.env['INPUT_BRANCH-NAME'] = 'branch1';
process.env['INPUT_WORKING-DIRECTORY'] = path.resolve(__dirname, '..', '..', '..', 'out');

const pathToAction = path.join(__dirname, 'index.js');
process.env['RUNNER_DEBUG'] = '1';
cp.execSync(`node ${pathToAction}`, { stdio: 'inherit'});
