// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { expect, use } from "chai";
import { main as whoAmI } from "../actions/who-am-i";
import { stubInterface } from "ts-sinon";
import { ActionInputsEmulator } from "./actionInputsEmulator";
import { PacRunner } from "@microsoft/powerplatform-cli-wrapper";
import * as sinonChai from "sinon-chai";
use(sinonChai);

describe("who-am-i#input validation", () => {
    const pac = stubInterface<PacRunner>();
    pac.whoAmI.returns(Promise.resolve([]));
    // TODO: read in params and their required state from the action.yml

    const inputParams = [
        { Name: "environment-url", Value: "aUrl" },
        { Name: "user-name", Value: "aUserName" },
        { Name: "password-secret", Value: "aSecret" },
    ];
    const actionInputs = new ActionInputsEmulator(inputParams);

    it("call action", async () => {
        actionInputs.defineInputs();
        let err;
        try {
            await whoAmI(() => pac);
        } catch (error) {
            err = error;
        }
        expect(err).to.be.undefined;
        expect(
            pac.authenticateCdsWithUsernamePassword
        ).to.have.been.calledOnceWith({
            envUrl: "aUrl",
            username: "aUserName",
            password: "aSecret",
        });
        expect(pac.whoAmI).to.have.been.calledOnce;
    });
});
