// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { Logger } from "../lib";
import { error, info, warn } from 'fancy-log';

export class TestLog implements Logger {
    info(...args: string[]): void {
        info(args);
    }

    warn(...args: string[]): void {
        warn(args);
    }

    error(...args: string[]): void {
        error(args);
    }
}
