// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { ExeRunner } from './exeRunner';
import { Logger } from './logger';
import os = require('os');

const platform = os.platform();
const programName = platform === "win32" ? 'pac.exe' : 'pac';
const programPath = platform === "win32" ? ['pac', 'tools'] : ['pac_linux', 'tools'];

export class PacRunner extends ExeRunner {
    
    public constructor(workingDir: string, logger: Logger) {
        super(workingDir, logger, programName, programPath);
    }
}
