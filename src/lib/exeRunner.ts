// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { spawn, spawnSync } from "child_process";
import os = require('os');
import path = require("path");
import { Logger } from "./logger";

export class ExeRunner {
    private readonly _exePath: string;
    private _outDirRoot!: string;

    public constructor(private readonly _workingDir: string, private readonly logger: Logger, exeName: string, exeRelativePath?: string[]) {
        const platform = os.platform();
        if (platform !== 'win32') {
            throw Error(`Unsupported Action runner os: '${platform}'; for the time being, only Windows runners are supported (cross-platform support work is in progress)`);
        }
        if (exeRelativePath) {
            exeRelativePath.push(exeName);
            this._exePath = path.resolve(this.outDirRoot, ...exeRelativePath);
        } else {
            this._exePath = exeName;
        }
    }

    public get workingDir(): string {
        return this._workingDir;
    }

    private get outDirRoot(): string {
        if (!this._outDirRoot) {
            // in mocha, __dirname resolves to the src folder of the .ts file,
            // but when running the .js file directly, e.g. from the /dist folder, it will be from that folder
            const dirname = path.resolve(__dirname);
            const parentDir = path.dirname(dirname);
            // /dist/actions/<action-name>/index.js:
            // /out/actions/<action-name>/index.js:
            if (path.basename(parentDir) === 'actions') {
                this._outDirRoot = path.resolve(path.dirname(parentDir));
            } else if (path.basename(parentDir) === 'src' || path.basename(parentDir) === 'out') {
                this._outDirRoot = path.resolve(parentDir, '..', 'out');
            } else {
                throw Error(`ExeRunner: cannot resolve outDirRoot running from this location: ${dirname}`);
            }
        }
        return this._outDirRoot;
    }

    public async run(args: string[]): Promise<string[]> {
        return new Promise((resolve, reject) => {
            const stdout = new Array<string>();
            const stderr = new Array<string>();

            this.logger.info(`exe: ${this._exePath}, first arg of ${args.length}: ${args.length ? args[0]: '<none>'}`);
            const pac = spawn(this._exePath, args, { cwd: this.workingDir });

            pac.stdout.on('data', (data) => stdout.push(...data.toString().split(os.EOL)));
            pac.stderr.on('data', (data) => stderr.push(...data.toString().split(os.EOL)));

            pac.on('close', (code) => {
                if (code === 0) {
                    this.logger.info(`success: ${stdout.join(os.EOL)}`);
                    resolve(stdout);
                } else {
                    const allOutput = stderr.concat(stdout);
                    this.logger.error(`error: ${code}: ${allOutput.join(os.EOL)}`);
                    reject(new RunnerError(code, allOutput.join()));
                }
            });
        });
    }

    public runSync(args: string[]): string[] {
        this.logger.info(`exe: ${this._exePath}, first arg of ${args.length}: ${args.length ? args[0]: '<none>'}`);
        const proc = spawnSync(this._exePath, args, { cwd: this.workingDir });
        if (proc.status === 0) {
            const output = proc.output
                .filter(line => !!line)     // can have null entries
                .map(line => line.toString());
            this.logger.info(`success: ${output.join(os.EOL)}`);
            return output;
        } else {
            const allOutput = proc.stderr.toString().concat(proc.stdout.toString());
            this.logger.error(`error: ${proc.status}: ${allOutput}`);
            throw new RunnerError(proc.status ?? 99999, allOutput);
        }
    }
}

export class RunnerError extends Error {

    public constructor(public exitCode: number, message: string) {
        super(message);
    }
}
