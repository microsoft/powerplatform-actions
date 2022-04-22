// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { expect } from 'chai';
import { YamlParser } from "../lib/parser/YamlParser";

describe("Yaml Parser test", () => {
    it("calls parser", async () => {
        const parser = new YamlParser();
        const actionInfo = parser.getHostParameterEntries('who-am-i');

        const expectedInfo = {name: 'environment-url', required: false, defaultValue: undefined};
        const info = actionInfo['environment-url'];
        expect(info).to.be.not.null;
        expect(info).to.be.deep.equal(expectedInfo);
    });
});
