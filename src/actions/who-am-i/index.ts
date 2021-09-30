// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { whoAmI } from "@microsoft/powerplatform-cli-wrapper/dist/actions";
import getCredentials from "../../lib/auth/getCredentials";
import getEnvironmentUrl from "../../lib/auth/getEnvironmentUrl";
import { runnerParameters } from "../../lib/runnerParameters";

whoAmI({
    credentials: getCredentials(),
    environmentUrl: getEnvironmentUrl(),
    }, runnerParameters
);
