import { HostParameterEntry, IHostAbstractions } from "@microsoft/powerplatform-cli-wrapper/dist/host/IHostAbstractions";
import * as core from '@actions/core';

export class ActionsHost implements IHostAbstractions {
  name = "GitHub-Actions";

  public getInput(entry: HostParameterEntry): string | undefined {
    const value = core.getInput(entry.name, { required: entry.required });
    // normalize value to always be undefined if the user has not declared the input value
    return (value && value.trim() !== '') ? value : undefined;
  }
}
