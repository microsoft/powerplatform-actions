// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { HostParameterEntry } from "@microsoft/powerplatform-cli-wrapper/dist/host/IHostAbstractions";
import fs = require('fs');
import yaml = require('js-yaml');
import path = require("path");

export class YamlParser {
    private readonly _actionsArchiveRoot: string;

    public constructor() {
        this._actionsArchiveRoot = this.findArchiveRoot(__dirname);
    }

    public getHostParameterEntries(actionFolder: string): Record<string, HostParameterEntry> {
        const parameterMap: Record<string, HostParameterEntry> = {};
        try {
            const file = path.resolve(this._actionsArchiveRoot, actionFolder, 'action.yml');
            console.log(`loading action yaml file: ${file}`);
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
            throw new Error(`Error parsing yaml file for ${actionFolder}: ${e}`);
        }
    }

    private findArchiveRoot(startSearchFolder: string): string {
        // determine actions archive root, relative to this source file:
        // walk up until the root action.yml is found, with pseudo/marketplace action named: 'powerplatform-actions'
        let candidateDir = startSearchFolder;
        const fsRoot = path.parse(candidateDir).root;
        do {
            const candidateActionYml = path.join(candidateDir, 'action.yml');
            if (fs.existsSync(candidateActionYml)) {
                const actionInfo = yaml.load(fs.readFileSync(candidateActionYml, 'utf-8')) as any;
                if (actionInfo.name === 'powerplatform-actions') {
                    return candidateDir;
                }
            }
            else {
                candidateDir = path.resolve(candidateDir, '..');
            }
        } while (candidateDir !== fsRoot);
        throw new Error(`Cannot find pp-actions' archive root folder. Started search at: ${startSearchFolder}`);
    }
}
