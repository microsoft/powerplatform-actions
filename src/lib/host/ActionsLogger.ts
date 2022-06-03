// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as core from "@actions/core";
import { Logger } from "@microsoft/powerplatform-cli-wrapper";

const ActionsLogger: Logger = {
  log: (...args: string[]) => console.log(args),
  warn: (...args: string[]) => core.warning(args.join()),
  error: (...args: string[]) => core.error(args.join()),
  debug: (...args: string[]) => core.debug(args.join())
};

export default ActionsLogger;
