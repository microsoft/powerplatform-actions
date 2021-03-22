// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { ExeRunner } from './exeRunner';
import { Logger } from './logger';
import os = require('os');

export class SopaRunner extends ExeRunner {

    public constructor(workingDir: string, logger: Logger) {
        super(workingDir, logger, 'SolutionPackager.exe', ['sopa', 'content', 'bin', 'coretools']);
        const platform = os.platform();
        if (platform !== 'win32') {
            throw Error(`Unsupported SoPa runner os: '${platform}'; the standalone SoPa executable is only available on Windows`);
        }
    }
}
