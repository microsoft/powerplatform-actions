import { createPacRunner } from "powerplatform-cli-wrapper";

export default function createActionsPacRunner() {
    
    const pac = createPacRunner(getExePath(...pacRelativePath));
    return pac;
}
