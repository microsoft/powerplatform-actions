import {
    createPacRunner,
    PacRunner,
} from "@microsoft/powerplatform-cli-wrapper";
import { cwd } from "process";
import { ActionLogger } from "./actionLogger";
import getExePath from "./getExePath";

export default function createActionsPacRunner(): PacRunner {
    return createPacRunner(
        cwd(),
        getExePath("pac", "tools", "pac.exe"),
        new ActionLogger()
    );
}
