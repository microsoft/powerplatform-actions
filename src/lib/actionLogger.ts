// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from '@actions/core';
import { Logger } from '../lib';

export class ActionLogger implements Logger {
    info(...args: string[]): void {
        core.info(args.join());
    }

    warn(...args: string[]): void {
        core.warning(args.join());
    }

    error(...args: string[]): void {
        core.error(args.join());
    }
}
