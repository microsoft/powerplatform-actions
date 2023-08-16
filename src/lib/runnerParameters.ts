import { Logger, RunnerParameters } from "@microsoft/powerplatform-cli-wrapper";
import { cwd } from "process";
import { ActionLogger } from "./actionLogger";
import getExePath from "./getExePath";

const EnvVarPrefix = 'POWERPLATFORMTOOLS_';
const PacInstalledEnvVarName = `${EnvVarPrefix}PACINSTALLED`;

function getAutomationAgent(): string {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const jsonPackage = require("../../package.json")
    const productName = jsonPackage.name.split("/")[1];
    return productName + "/" + jsonPackage.version;
}

class ActionsRunnerParameters implements RunnerParameters {
    workingDir: string = process.env['GITHUB_WORKSPACE'] || cwd();
    logger: Logger = new ActionLogger();
    agent: string = getAutomationAgent();

    public get runnersDir(): string {
        if (process.env[PacInstalledEnvVarName] !== 'true') {
            throw new Error(`PAC is not installed. Please run the actions-install action first.`);
        }
        return getExePath();
    }

}

const runnerParameters: RunnerParameters = new ActionsRunnerParameters();

export { runnerParameters, getAutomationAgent, PacInstalledEnvVarName };
