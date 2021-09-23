import { HostParameterEntry } from "@microsoft/powerplatform-cli-wrapper/dist/host/IHostAbstractions";
import fs = require('fs');
import yaml = require('js-yaml');
import path = require("path");

export class YamlParser {
    public getHostParamterEntries(workingDir: string, actionFolder: string): Record<string, HostParameterEntry> {
        const parameterMap: Record<string, HostParameterEntry> = {};
        try {
            const file = path.resolve(workingDir, `./${actionFolder}/action.yml`);
            const fileContents = fs.readFileSync(file, 'utf8');
            const data = yaml.load(fileContents);
            const names = JSON.parse(JSON.stringify(data)).inputs;
            for (const name of Object.keys(names)) {
                const typedData = {
                    name: name,
                    required: names[name].required ?? false,
                    defaultValue: names[name].default,
                }
                parameterMap[name] = typedData;
            }
            return parameterMap;
        } catch (e) {
            throw new Error(`Error parsing yaml file error for ${actionFolder}`)
        }
    }
}
