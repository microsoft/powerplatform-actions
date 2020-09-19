// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { ExeRunner } from './exeRunner';
import { Logger } from './logger';


export class SopaRunner extends ExeRunner {

    public constructor(workingDir: string, logger: Logger) {
        super(workingDir, logger, 'SolutionPackager.exe', ['sopa', 'content', 'bin', 'coretools']);
    }
}
