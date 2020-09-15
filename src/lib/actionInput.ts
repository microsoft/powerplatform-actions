// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';

export function getInputAsBool(name: string, required: boolean, defaultValue: boolean): boolean{
    const textValue = core.getInput(name, { required: required });
    return (!textValue) ? defaultValue : textValue.toLowerCase() === 'true';
}

export function getWorkingDirectory(name: string, required: boolean, defaultValue?: string): string {
    const textValue = core.getInput(name, { required: required });
    return (!textValue) ? (defaultValue ?? process.cwd()) : textValue;
}
