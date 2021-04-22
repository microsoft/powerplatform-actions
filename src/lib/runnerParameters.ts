import { RunnerParameters } from "@microsoft/powerplatform-cli-wrapper";
import { cwd } from "process";
import { ActionLogger } from "./actionLogger";
import getExePath from "./getExePath";

const runnerParameters: RunnerParameters = {
    runnersDir: getExePath(),
    workingDir: cwd(),
    logger: new ActionLogger(),
};

export default runnerParameters;
