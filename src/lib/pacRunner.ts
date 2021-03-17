// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { ExeRunner } from "./exeRunner";
import { Logger } from "./logger";
import pacRelativePath from "./pacRelativePath";

export class PacRunner extends ExeRunner {
    public constructor(workingDir: string, logger: Logger) {
        super(workingDir, logger, pacRelativePath);
    }
}
