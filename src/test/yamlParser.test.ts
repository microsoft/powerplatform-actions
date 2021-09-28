import { assert } from "chai";
import { YamlParser } from "../lib/parser/YamlParser";

describe("Yaml Parser test", () => {
    it("calls parser", async () => {
        const actionMap = {"action-name": { name: "action-name", required: true, defaultValue: "default"}};
        const parser = new YamlParser();
        const parsedMap = parser.getHostParameterEntries(__dirname, "data");
        assert.deepEqual(parsedMap, actionMap);
    });
});
