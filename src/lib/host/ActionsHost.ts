import { HostParameterEntry, IHostAbstractions } from "@microsoft/powerplatform-cli-wrapper/dist/host/IHostAbstractions";
import { getInput } from '@actions/core';

export class ActionsHost implements IHostAbstractions {
  name = "GitHub-Actions";

  public getInput(entry: HostParameterEntry): string | undefined {
    return getInput(entry.name, { required: entry.required });
  }
}
