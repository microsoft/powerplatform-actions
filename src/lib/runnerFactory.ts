// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ActionLogger } from "./actionLogger";
import { GitRunner } from "./gitRunner";
import { Logger } from "./logger";
import { PacRunner } from "./pacRunner";
import { SopaRunner } from "./sopaRunner";

export interface Runner {
    run(args: string[]): Promise<string[]>;
    runSync(args: string[]): string[];
}

export interface RunnerFactory {
    getRunner(runnerName: string, workingDir: string): Runner;
}

class RealRunnerFactory implements RunnerFactory {
    private readonly _logger: Logger = new ActionLogger();

    getRunner(runnerName: string, workingDir: string): Runner {
        switch (runnerName) {
            case 'pac':
                return new PacRunner(workingDir, this._logger);
            case 'git':
                return new GitRunner(workingDir, this._logger);
            case 'sopa':
                return new SopaRunner(workingDir, this._logger);
            default:
                throw new Error(`Unknown runner type requested: ${runnerName}`);
        }
    }
}

export const DefaultRunnerFactory = new RealRunnerFactory();
