import { getInput } from "@actions/core";

export default function getEnvironmentUrl(): string {
    return getInput("environment-url", { required: false });
}
