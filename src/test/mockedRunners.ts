// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Runner, RunnerFactory } from '../lib';

export interface LoggedCommands {
    RunnerName: string;
    Arguments: string[];
}

export class MockedRunners implements RunnerFactory {
    private _workingDir: string;
    private readonly _requestedRunners: SpyRunner[] = [];

    public get loggedCommands(): LoggedCommands[] {
        // flattening into single commands collection:
        return this._requestedRunners
            .map(spy => spy.loggedCommands)
            .reduce((flattened, arr) => flattened.concat(arr), [])
    }

    public get workingDir(): string {
        return this._workingDir;
    }

    public constructor(workingDir: string){
        this._workingDir = workingDir;
    }

    public getRunner(runnerName: string, workingDir: string): Runner {
        this._workingDir = workingDir;
        const runner = new SpyRunner(runnerName);
        this._requestedRunners.push(runner);
        return runner;
    }
}

class SpyRunner implements Runner {
    private readonly _runnerName: string;
    private readonly _loggedCommands: LoggedCommands[];

    public get loggedCommands(): LoggedCommands[] {
        return this._loggedCommands;
    }

    constructor(cmdName: string) {
        this._runnerName = cmdName;
        this._loggedCommands = [];
    }

    public async run(args: string[]): Promise<string[]> {
        this._loggedCommands.push({ RunnerName: this._runnerName, Arguments: args });
        return [];
    }

    public runSync(args: string[]): string[] {
        this._loggedCommands.push({ RunnerName: this._runnerName, Arguments: args });
        return [];
    }
}
