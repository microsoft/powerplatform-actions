// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import * as core from "@actions/core";
import { Logger } from "@microsoft/powerplatform-cli-wrapper";

export class ActionLogger implements Logger {
    info(...args: string[]): void {
        core.info(args.join());
    }

    warn(...args: string[]): void {
        core.warning(args.join());
    }

    error(...args: string[]): void {
        const errorMessage = args.join();
        core.setFailed(errorMessage);
        core.error(errorMessage);
    }

    debug(...args: string[]): void {
        core.debug(args.join());
    }

    log(...args: string[]): void {
        console.log(args.join());
    }
}
