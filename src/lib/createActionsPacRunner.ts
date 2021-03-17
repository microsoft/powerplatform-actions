import { createPacRunner, PacRunner } from "powerplatform-cli-wrapper";
import { cwd } from "process";
import { ActionLogger } from "./actionLogger";
import getExePath from "./getExePath";
import pacRelativePath from "./pacRelativePath";

export default function createActionsPacRunner(): PacRunner {
    return createPacRunner(
        cwd(),
        getExePath(...pacRelativePath),
        new ActionLogger()
    );
}
