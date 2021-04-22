import { getInput } from "@actions/core";

export default function getEnvironmentUrl() {
    return getInput("environment-url", { required: false });
}
