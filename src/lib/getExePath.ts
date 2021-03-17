import { resolve, dirname, basename } from "path";

export default function getExePath(...relativePath: string[]): string {
    // in mocha, __dirname resolves to the src folder of the .ts file,
    // but when running the .js file directly, e.g. from the /dist folder, it will be from that folder
    const currentDirectory = resolve(__dirname);
    const parentDir = dirname(currentDirectory);

    // /dist/actions/<action-name>/index.js:
    // /out/actions/<action-name>/index.js:
    let outDirRoot: string;
    switch (basename(parentDir)) {
        case "actions":
            outDirRoot = resolve(dirname(parentDir));
            break;
        case "src":
        case "out":
            outDirRoot = resolve(parentDir, "..", "out");
            break;
        default:
            throw Error(
                `ExeRunner: cannot resolve outDirRoot running from this location: ${dirname}`
            );
    }

    return resolve(outDirRoot, ...relativePath);
}
