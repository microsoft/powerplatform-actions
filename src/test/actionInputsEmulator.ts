// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export interface IActionParameter {
    Name: string;
    Value: string;
}

export class ActionInputsEmulator {
    private readonly _parameters: IActionParameter[];

    public get parameters() : IActionParameter[] {
        return this._parameters;
    }

    public constructor(parameters: IActionParameter[]) {
        this._parameters = parameters;
    }

    public defineInputs(): void {
        this.parameters.forEach(item => {
            process.env[this.getParamName(item.Name)] = item.Value;
        })
    }

    public defineInputsExcept(unknownParameter: string): void {
        if (this.parameters.filter(item => item.Name === unknownParameter).length === 0) {
            throw new Error(`input parameter ${unknownParameter} is not part of input parameters" ${this.parameters.map(item => item.Name).join(', ')}`);
        }
        this.parameters.forEach(item => {
            if (item.Name === unknownParameter) {
                delete process.env[this.getParamName(item.Name)];
            } else {
                process.env[this.getParamName(item.Name)] = item.Value;
            }
        })
    }

    private getParamName(name: string): string {
        // see also: https://github.com/actions/toolkit/blob/f1b118b2a9f2e4ab5413c9f98ff03cb77f259c2b/packages/core/src/core.ts#L84
        return `INPUT_${name.replace(/ /g, '_').toUpperCase()}`;
    }
}
