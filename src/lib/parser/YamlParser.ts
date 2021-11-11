/* eslint-disable @typescript-eslint/no-explicit-any */
import { HostParameterEntry } from "@microsoft/powerplatform-cli-wrapper/dist/host/IHostAbstractions";
import fs = require('fs');
import yaml = require('js-yaml');
import path = require("path");

export class YamlParser {
    public getHostParameterEntries(workingDir: string, actionFolder: string): Record<string, HostParameterEntry> {
        const parameterMap: Record<string, HostParameterEntry> = {};
        try {
            const file = path.join(workingDir, actionFolder, "action.yml");
            const fileContents = fs.readFileSync(file, 'utf8');
            const data = yaml.load(fileContents) as any;
            for (const [name, inputInfo] of Object.entries(data.inputs)) {
                const typedData = {
                    name: name,
                    required: (inputInfo as any).required ?? false,
                    defaultValue: (inputInfo as any).default,
                }
                parameterMap[name] = typedData;
            }
            return parameterMap;
        } catch (e) {
            throw new Error(`Error parsing yaml file for ${actionFolder}`)
        }
    }
}
