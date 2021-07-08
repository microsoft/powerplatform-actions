import { RunnerParameters } from "@microsoft/powerplatform-cli-wrapper";
import { cwd } from "process";
import { ActionLogger } from "./actionLogger";
import getExePath from "./getExePath";

function getAutomationAgent(): string {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const jsonPackage = require("../../package.json")
    const productName = jsonPackage.name.split("/")[1];
    return productName + "/" + jsonPackage.version;
}

const runnerParameters: RunnerParameters = {
    runnersDir: getExePath(),
    workingDir: cwd(),
    logger: new ActionLogger(),
    agent: getAutomationAgent(),
};

export { runnerParameters, getAutomationAgent };
