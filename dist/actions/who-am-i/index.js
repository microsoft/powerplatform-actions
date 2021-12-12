/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__nccwpck_require__(87));
const utils_1 = __nccwpck_require__(278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __nccwpck_require__(351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(278);
const os = __importStar(__nccwpck_require__(87));
const path = __importStar(__nccwpck_require__(622));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    return inputs;
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */
function error(message) {
    command_1.issue('error', message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */
function warning(message) {
    command_1.issue('warning', message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issueCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(747));
const os = __importStar(__nccwpck_require__(87));
const utils_1 = __nccwpck_require__(278);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 278:
/***/ ((__unused_webpack_module, exports) => {


// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 892:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RunnerError = exports.createCommandRunner = void 0;
const child_process_1 = __nccwpck_require__(129);
const process_1 = __nccwpck_require__(316);
const os_1 = __nccwpck_require__(87);
const process = __nccwpck_require__(316);
function createCommandRunner(workingDir, commandPath, logger, options, agent) {
    return function run(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                logInitialization(...args);
                const allOutput = [];
                const cp = child_process_1.spawn(commandPath, args, Object.assign({ cwd: workingDir, env: Object.assign({ PATH: process_1.env.PATH,
                        "PP_TOOLS_AUTOMATION_AGENT": agent
                    }, process.env) }, options));
                cp.stdout.on("data", logData(logger.log));
                cp.stderr.on("data", logData(logger.error));
                function logData(logFunction) {
                    return (data) => {
                        `${data}`.split(os_1.EOL).forEach((line) => {
                            allOutput.push(line);
                            logFunction(line);
                        });
                    };
                }
                cp.on("exit", (code) => {
                    if (code === 0) {
                        resolve(allOutput);
                    }
                    else {
                        logger.error(`error: ${code}`);
                        reject(new RunnerError(code, allOutput.join(os_1.EOL)));
                    }
                    /* Close out handles to the output streams so that we don't wait on
                        grandchild processes like pacTelemetryUpload */
                    cp.stdout.destroy();
                    cp.stderr.destroy();
                });
            });
        });
    };
    function logInitialization(...args) {
        logger.debug(`command: ${commandPath}, first arg of ${args.length}: ${args.length ? args[0] : "<none>"}`);
    }
}
exports.createCommandRunner = createCommandRunner;
class RunnerError extends Error {
    constructor(exitCode, message) {
        super(message);
        this.exitCode = exitCode;
    }
}
exports.RunnerError = RunnerError;

//# sourceMappingURL=CommandRunner.js.map


/***/ }),

/***/ 920:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.backupEnvironment = void 0;
const InputValidator_1 = __nccwpck_require__(988);
const authenticate_1 = __nccwpck_require__(192);
const createPacRunner_1 = __nccwpck_require__(226);
function backupEnvironment(parameters, runnerParameters, host) {
    return __awaiter(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = createPacRunner_1.default(runnerParameters);
        try {
            const authenticateResult = yield authenticate_1.authenticateAdmin(pac, parameters.credentials);
            logger.log("The Authentication Result: " + authenticateResult);
            // Made environment url mandatory and removed environment id as there are planned changes in PAC CLI on the parameter.
            const pacArgs = ["admin", "backup"];
            const validator = new InputValidator_1.InputValidator(host);
            validator.pushInput(pacArgs, "--environment", parameters.environment);
            validator.pushInput(pacArgs, "--url", parameters.environmentUrl);
            validator.pushInput(pacArgs, "--environment-id", parameters.environmentId);
            validator.pushInput(pacArgs, "--label", parameters.backupLabel);
            validator.pushInput(pacArgs, "--notes", parameters.notes);
            logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
            const pacResult = yield pac(...pacArgs);
            logger.log("BackupEnvironment Action Result: " + pacResult);
        }
        catch (error) {
            logger.error(`failed: ${error.message}`);
            throw error;
        }
        finally {
            const clearAuthResult = yield authenticate_1.clearAuthentication(pac);
            logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
    });
}
exports.backupEnvironment = backupEnvironment;

//# sourceMappingURL=backupEnvironment.js.map


/***/ }),

/***/ 896:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkSolution = void 0;
const InputValidator_1 = __nccwpck_require__(988);
const authenticate_1 = __nccwpck_require__(192);
const createPacRunner_1 = __nccwpck_require__(226);
const path = __nccwpck_require__(622);
function checkSolution(parameters, runnerParameters, host) {
    return __awaiter(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = createPacRunner_1.default(runnerParameters);
        try {
            const authenticateResult = yield authenticate_1.authenticateEnvironment(pac, parameters.credentials, parameters.environmentUrl);
            logger.log("The Authentication Result: " + authenticateResult);
            const pacArgs = ["solution", "check"];
            const validator = new InputValidator_1.InputValidator(host);
            validator.pushInput(pacArgs, "--path", parameters.solutionPath, (value) => path.resolve(runnerParameters.workingDir, value));
            validator.pushInput(pacArgs, "--geo", parameters.geoInstance);
            validator.pushInput(pacArgs, "--ruleLevelOverride", parameters.ruleLevelOverride);
            validator.pushInput(pacArgs, "--outputDirectory", parameters.outputDirectory);
            logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
            const pacResult = yield pac(...pacArgs);
            logger.log("CheckSolution Action Result: " + pacResult);
        }
        catch (error) {
            logger.error(`failed: ${error.message}`);
            throw error;
        }
        finally {
            const clearAuthResult = yield authenticate_1.clearAuthentication(pac);
            logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
    });
}
exports.checkSolution = checkSolution;

//# sourceMappingURL=checkSolution.js.map


/***/ }),

/***/ 841:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.cloneSolution = void 0;
const InputValidator_1 = __nccwpck_require__(988);
const authenticate_1 = __nccwpck_require__(192);
const createPacRunner_1 = __nccwpck_require__(226);
function cloneSolution(parameters, runnerParameters, host) {
    return __awaiter(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = createPacRunner_1.default(runnerParameters);
        try {
            const authenticateResult = yield authenticate_1.authenticateEnvironment(pac, parameters.credentials, parameters.environmentUrl);
            logger.log("The Authentication Result: " + authenticateResult);
            const pacArgs = ["solution", "clone"];
            const validator = new InputValidator_1.InputValidator(host);
            validator.pushInput(pacArgs, "--name", parameters.name);
            validator.pushInput(pacArgs, "--targetversion", parameters.targetVersion);
            validator.pushInput(pacArgs, "--outputDirectory", parameters.outputDirectory);
            validator.pushInput(pacArgs, "--async", parameters.async);
            validator.pushInput(pacArgs, "--max-async-wait-time", parameters.maxAsyncWaitTimeInMin);
            const includeArgs = [];
            if (validator.getInput(parameters.autoNumberSettings) === 'true') {
                includeArgs.push("autonumbering");
            }
            if (validator.getInput(parameters.calenderSettings) === 'true') {
                includeArgs.push("calendar");
            }
            if (validator.getInput(parameters.customizationSettings) === 'true') {
                includeArgs.push("customization");
            }
            if (validator.getInput(parameters.emailTrackingSettings) === 'true') {
                includeArgs.push("emailtracking");
            }
            if (validator.getInput(parameters.externalApplicationSettings) === 'true') {
                includeArgs.push("externalapplications");
            }
            if (validator.getInput(parameters.generalSettings) === 'true') {
                includeArgs.push("general");
            }
            if (validator.getInput(parameters.isvConfig) === 'true') {
                includeArgs.push("isvconfig");
            }
            if (validator.getInput(parameters.marketingSettings) === 'true') {
                includeArgs.push("marketing");
            }
            if (validator.getInput(parameters.outlookSynchronizationSettings) === 'true') {
                includeArgs.push("outlooksynchronization");
            }
            if (validator.getInput(parameters.relationshipRoles) === 'true') {
                includeArgs.push("relationshiproles");
            }
            if (validator.getInput(parameters.sales) === 'true') {
                includeArgs.push("sales");
            }
            if (includeArgs.length > 0) {
                pacArgs.push("--include", includeArgs.join(','));
            }
            logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
            const pacResult = yield pac(...pacArgs);
            logger.log("CloneSolution Action Result: " + pacResult);
        }
        catch (error) {
            logger.error(`failed: ${error.message}`);
            throw error;
        }
        finally {
            const clearAuthResult = yield authenticate_1.clearAuthentication(pac);
            logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
    });
}
exports.cloneSolution = cloneSolution;

//# sourceMappingURL=cloneSolution.js.map


/***/ }),

/***/ 219:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.copyEnvironment = void 0;
const InputValidator_1 = __nccwpck_require__(988);
const authenticate_1 = __nccwpck_require__(192);
const createPacRunner_1 = __nccwpck_require__(226);
function copyEnvironment(parameters, runnerParameters, host) {
    return __awaiter(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = createPacRunner_1.default(runnerParameters);
        try {
            const authenticateResult = yield authenticate_1.authenticateAdmin(pac, parameters.credentials);
            logger.log("The Authentication Result: " + authenticateResult);
            // Made environment url mandatory and removed environment id as there are planned changes in PAC CLI on the parameter.
            const pacArgs = ["admin", "copy"];
            const validator = new InputValidator_1.InputValidator(host);
            validator.pushInput(pacArgs, "--source-env", parameters.sourceEnvironment);
            validator.pushInput(pacArgs, "--target-env", parameters.targetEnvironment);
            validator.pushInput(pacArgs, "--source-url", parameters.sourceEnvironmentUrl);
            validator.pushInput(pacArgs, "--target-url", parameters.targetEnvironmentUrl);
            validator.pushInput(pacArgs, "--source-id", parameters.sourceEnvironmentId);
            validator.pushInput(pacArgs, "--target-id", parameters.targetEnvironmentId);
            if (validator.getInput(parameters.overrideFriendlyName) === 'true') {
                validator.pushInput(pacArgs, "--name", parameters.friendlyTargetEnvironmentName);
            }
            validator.pushInput(pacArgs, "--type", parameters.copyType);
            logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
            const pacResult = yield pac(...pacArgs);
            logger.log("CopyEnvironment Action Result: " + pacResult);
        }
        catch (error) {
            logger.error(`failed: ${error.message}`);
            throw error;
        }
        finally {
            const clearAuthResult = yield authenticate_1.clearAuthentication(pac);
            logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
    });
}
exports.copyEnvironment = copyEnvironment;

//# sourceMappingURL=copyEnvironment.js.map


/***/ }),

/***/ 98:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createEnvironment = void 0;
const InputValidator_1 = __nccwpck_require__(988);
const authenticate_1 = __nccwpck_require__(192);
const createPacRunner_1 = __nccwpck_require__(226);
function createEnvironment(parameters, runnerParameters, host) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = createPacRunner_1.default(runnerParameters);
        try {
            const authenticateResult = yield authenticate_1.authenticateAdmin(pac, parameters.credentials);
            logger.log("The Authentication Result: " + authenticateResult);
            const pacArgs = ["admin", "create"];
            const validator = new InputValidator_1.InputValidator(host);
            validator.pushInput(pacArgs, "--name", parameters.environmentName);
            validator.pushInput(pacArgs, "--type", parameters.environmentType);
            validator.pushInput(pacArgs, "--templates", parameters.templates);
            validator.pushInput(pacArgs, "--region", parameters.region);
            validator.pushInput(pacArgs, "--currency", parameters.currency);
            validator.pushInput(pacArgs, "--language", parameters.language);
            validator.pushInput(pacArgs, "--domain", parameters.domainName);
            logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
            const pacResult = yield pac(...pacArgs);
            logger.log("CreateEnvironment Action Result: " + pacResult);
            // HACK TODO: Need structured output from pac CLI to make parsing out of the resulting env URL more robust
            const newEnvDetailColumns = (_a = pacResult
                .filter(l => l.length > 0)
                .pop()) === null || _a === void 0 ? void 0 : _a.trim().split(/\s+/);
            const envUrl = newEnvDetailColumns === null || newEnvDetailColumns === void 0 ? void 0 : newEnvDetailColumns.shift();
            const envId = newEnvDetailColumns === null || newEnvDetailColumns === void 0 ? void 0 : newEnvDetailColumns.shift();
            return {
                environmentId: envId,
                environmentUrl: envUrl
            };
        }
        catch (error) {
            logger.error(`failed: ${error.message}`);
            throw error;
        }
        finally {
            const clearAuthResult = yield authenticate_1.clearAuthentication(pac);
            logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
    });
}
exports.createEnvironment = createEnvironment;

//# sourceMappingURL=createEnvironment.js.map


/***/ }),

/***/ 930:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deleteEnvironment = void 0;
const InputValidator_1 = __nccwpck_require__(988);
const authenticate_1 = __nccwpck_require__(192);
const createPacRunner_1 = __nccwpck_require__(226);
function deleteEnvironment(parameters, runnerParameters, host) {
    return __awaiter(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = createPacRunner_1.default(runnerParameters);
        try {
            const authenticateResult = yield authenticate_1.authenticateAdmin(pac, parameters.credentials);
            logger.log("The Authentication Result: " + authenticateResult);
            // Made environment url mandatory and removed environment id as there are planned changes in PAC CLI on the parameter.
            const pacArgs = ["admin", "delete"];
            const validator = new InputValidator_1.InputValidator(host);
            validator.pushInput(pacArgs, "--environment", parameters.environment);
            validator.pushInput(pacArgs, "--url", parameters.environmentUrl);
            validator.pushInput(pacArgs, "--environment-id", parameters.environmentId);
            logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
            const pacResult = yield pac(...pacArgs);
            logger.log("DeleteEnvironment Action Result: " + pacResult);
        }
        catch (error) {
            logger.error(`failed: ${error.message}`);
            throw error;
        }
        finally {
            const clearAuthResult = yield authenticate_1.clearAuthentication(pac);
            logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
    });
}
exports.deleteEnvironment = deleteEnvironment;

//# sourceMappingURL=deleteEnvironment.js.map


/***/ }),

/***/ 183:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deleteSolution = void 0;
const InputValidator_1 = __nccwpck_require__(988);
const authenticate_1 = __nccwpck_require__(192);
const createPacRunner_1 = __nccwpck_require__(226);
function deleteSolution(parameters, runnerParameters, host) {
    return __awaiter(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = createPacRunner_1.default(runnerParameters);
        try {
            const authenticateResult = yield authenticate_1.authenticateEnvironment(pac, parameters.credentials, parameters.environmentUrl);
            logger.log("The Authentication Result: " + authenticateResult);
            const pacArgs = ["solution", "delete"];
            const validator = new InputValidator_1.InputValidator(host);
            validator.pushInput(pacArgs, "--solution-name", parameters.name);
            logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
            const pacResult = yield pac(...pacArgs);
            logger.log("DeleteSolution Action Result: " + pacResult);
        }
        catch (error) {
            logger.error(`failed: ${error.message}`);
            throw error;
        }
        finally {
            const clearAuthResult = yield authenticate_1.clearAuthentication(pac);
            logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
    });
}
exports.deleteSolution = deleteSolution;

//# sourceMappingURL=deleteSolution.js.map


/***/ }),

/***/ 671:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deployPackage = void 0;
const InputValidator_1 = __nccwpck_require__(988);
const authenticate_1 = __nccwpck_require__(192);
const createPacRunner_1 = __nccwpck_require__(226);
const path = __nccwpck_require__(622);
const os = __nccwpck_require__(87);
function deployPackage(parameters, runnerParameters, host) {
    return __awaiter(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = createPacRunner_1.default(runnerParameters);
        try {
            const platform = os.platform();
            if (platform !== 'win32') {
                throw new Error(`deploy package is only supported on Windows agents/runners (attempted run on ${platform})`);
            }
            const authenticateResult = yield authenticate_1.authenticateEnvironment(pac, parameters.credentials, parameters.environmentUrl);
            logger.log("The Authentication Result: " + authenticateResult);
            const pacArgs = ["package", "deploy"];
            const validator = new InputValidator_1.InputValidator(host);
            validator.pushInput(pacArgs, "--package", parameters.packagePath, (value) => path.resolve(runnerParameters.workingDir, value));
            validator.pushInput(pacArgs, "--logFile", parameters.logFile);
            validator.pushInput(pacArgs, "--logConsole", parameters.logConsole);
            logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
            const pacResult = yield pac(...pacArgs);
            logger.log("DeployPackage Action Result: " + pacResult);
        }
        catch (error) {
            logger.error(`failed: ${error.message}`);
            throw error;
        }
        finally {
            const clearAuthResult = yield authenticate_1.clearAuthentication(pac);
            logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
    });
}
exports.deployPackage = deployPackage;

//# sourceMappingURL=deployPackage.js.map


/***/ }),

/***/ 598:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.downloadPaportal = void 0;
const InputValidator_1 = __nccwpck_require__(988);
const authenticate_1 = __nccwpck_require__(192);
const createPacRunner_1 = __nccwpck_require__(226);
function downloadPaportal(parameters, runnerParameters, host) {
    return __awaiter(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = createPacRunner_1.default(runnerParameters);
        try {
            const authenticateResult = yield authenticate_1.authenticateEnvironment(pac, parameters.credentials, parameters.environmentUrl);
            logger.log("The Authentication Result: " + authenticateResult);
            const pacArgs = ["paportal", "download"];
            const validator = new InputValidator_1.InputValidator(host);
            validator.pushInput(pacArgs, "--path", parameters.path);
            validator.pushInput(pacArgs, "--websiteId", parameters.websiteId);
            logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
            const pacResult = yield pac(...pacArgs);
            logger.log("DownloadPaPortal Action Result: " + pacResult);
        }
        catch (error) {
            logger.error(`failed: ${error.message}`);
            throw error;
        }
        finally {
            const clearAuthResult = yield authenticate_1.clearAuthentication(pac);
            logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
    });
}
exports.downloadPaportal = downloadPaportal;

//# sourceMappingURL=downloadPaportal.js.map


/***/ }),

/***/ 288:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.exportSolution = void 0;
const InputValidator_1 = __nccwpck_require__(988);
const authenticate_1 = __nccwpck_require__(192);
const createPacRunner_1 = __nccwpck_require__(226);
const path = __nccwpck_require__(622);
function exportSolution(parameters, runnerParameters, host) {
    return __awaiter(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = createPacRunner_1.default(runnerParameters);
        try {
            const authenticateResult = yield authenticate_1.authenticateEnvironment(pac, parameters.credentials, parameters.environmentUrl);
            logger.log("The Authentication Result: " + authenticateResult);
            const pacArgs = ["solution", "export"];
            const validator = new InputValidator_1.InputValidator(host);
            validator.pushInput(pacArgs, "--name", parameters.name);
            validator.pushInput(pacArgs, "--path", parameters.path, (value) => path.resolve(runnerParameters.workingDir, value));
            validator.pushInput(pacArgs, "--managed", parameters.managed);
            validator.pushInput(pacArgs, "--async", parameters.async);
            validator.pushInput(pacArgs, "--max-async-wait-time", parameters.maxAsyncWaitTimeInMin);
            validator.pushInput(pacArgs, "--targetversion", parameters.targetVersion);
            const includeArgs = [];
            if (validator.getInput(parameters.autoNumberSettings) === 'true') {
                includeArgs.push("autonumbering");
            }
            if (validator.getInput(parameters.calenderSettings) === 'true') {
                includeArgs.push("calendar");
            }
            if (validator.getInput(parameters.customizationSettings) === 'true') {
                includeArgs.push("customization");
            }
            if (validator.getInput(parameters.emailTrackingSettings) === 'true') {
                includeArgs.push("emailtracking");
            }
            if (validator.getInput(parameters.externalApplicationSettings) === 'true') {
                includeArgs.push("externalapplications");
            }
            if (validator.getInput(parameters.generalSettings) === 'true') {
                includeArgs.push("general");
            }
            if (validator.getInput(parameters.isvConfig) === 'true') {
                includeArgs.push("isvconfig");
            }
            if (validator.getInput(parameters.marketingSettings) === 'true') {
                includeArgs.push("marketing");
            }
            if (validator.getInput(parameters.outlookSynchronizationSettings) === 'true') {
                includeArgs.push("outlooksynchronization");
            }
            if (validator.getInput(parameters.relationshipRoles) === 'true') {
                includeArgs.push("relationshiproles");
            }
            if (validator.getInput(parameters.sales) === 'true') {
                includeArgs.push("sales");
            }
            if (includeArgs.length > 0) {
                pacArgs.push("--include", includeArgs.join(','));
            }
            logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
            const pacResult = yield pac(...pacArgs);
            logger.log("ExportSolution Action Result: " + pacResult);
        }
        catch (error) {
            logger.error(`failed: ${error.message}`);
            throw error;
        }
        finally {
            const clearAuthResult = yield authenticate_1.clearAuthentication(pac);
            logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
    });
}
exports.exportSolution = exportSolution;

//# sourceMappingURL=exportSolution.js.map


/***/ }),

/***/ 332:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.importSolution = void 0;
const InputValidator_1 = __nccwpck_require__(988);
const authenticate_1 = __nccwpck_require__(192);
const createPacRunner_1 = __nccwpck_require__(226);
const path = __nccwpck_require__(622);
function importSolution(parameters, runnerParameters, host) {
    return __awaiter(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = createPacRunner_1.default(runnerParameters);
        try {
            const authenticateResult = yield authenticate_1.authenticateEnvironment(pac, parameters.credentials, parameters.environmentUrl);
            logger.log("The Authentication Result: " + authenticateResult);
            const pacArgs = ["solution", "import"];
            const validator = new InputValidator_1.InputValidator(host);
            validator.pushInput(pacArgs, "--path", parameters.path, (value) => path.resolve(runnerParameters.workingDir, value));
            validator.pushInput(pacArgs, "--async", parameters.async);
            validator.pushInput(pacArgs, "--import-as-holding", parameters.importAsHolding);
            validator.pushInput(pacArgs, "--force-overwrite", parameters.forceOverwrite);
            validator.pushInput(pacArgs, "--publish-changes", parameters.publishChanges);
            validator.pushInput(pacArgs, "--skip-dependency-check", parameters.skipDependencyCheck);
            validator.pushInput(pacArgs, "--convert-to-managed", parameters.convertToManaged);
            validator.pushInput(pacArgs, "--max-async-wait-time", parameters.maxAsyncWaitTimeInMin);
            validator.pushInput(pacArgs, "--activate-plugins", parameters.activatePlugins);
            if (validator.getInput(parameters.useDeploymentSettingsFile) === "true") {
                validator.pushInput(pacArgs, "--settings-file", parameters.deploymentSettingsFile);
            }
            logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
            const pacResult = yield pac(...pacArgs);
            logger.log("ImportSolution Action Result: " + pacResult);
        }
        catch (error) {
            logger.error(`failed: ${error.message}`);
            throw error;
        }
        finally {
            const clearAuthResult = yield authenticate_1.clearAuthentication(pac);
            logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
    });
}
exports.importSolution = importSolution;

//# sourceMappingURL=importSolution.js.map


/***/ }),

/***/ 765:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__nccwpck_require__(288), exports);
__exportStar(__nccwpck_require__(302), exports);
__exportStar(__nccwpck_require__(332), exports);
__exportStar(__nccwpck_require__(177), exports);
__exportStar(__nccwpck_require__(930), exports);
__exportStar(__nccwpck_require__(920), exports);
__exportStar(__nccwpck_require__(896), exports);
__exportStar(__nccwpck_require__(119), exports);
__exportStar(__nccwpck_require__(671), exports);
__exportStar(__nccwpck_require__(98), exports);
__exportStar(__nccwpck_require__(697), exports);
__exportStar(__nccwpck_require__(183), exports);
__exportStar(__nccwpck_require__(936), exports);
__exportStar(__nccwpck_require__(230), exports);
__exportStar(__nccwpck_require__(682), exports);
__exportStar(__nccwpck_require__(219), exports);
__exportStar(__nccwpck_require__(223), exports);
__exportStar(__nccwpck_require__(598), exports);
__exportStar(__nccwpck_require__(841), exports);
__exportStar(__nccwpck_require__(21), exports);

//# sourceMappingURL=index.js.map


/***/ }),

/***/ 936:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.packSolution = void 0;
const InputValidator_1 = __nccwpck_require__(988);
const createPacRunner_1 = __nccwpck_require__(226);
const path = __nccwpck_require__(622);
function packSolution(parameters, runnerParameters, host) {
    return __awaiter(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = createPacRunner_1.default(runnerParameters);
        try {
            const pacArgs = ["solution", "pack"];
            const validator = new InputValidator_1.InputValidator(host);
            validator.pushInput(pacArgs, "--zipFile", parameters.solutionZipFile, (value) => path.resolve(runnerParameters.workingDir, value));
            validator.pushInput(pacArgs, "--folder", parameters.sourceFolder, (value) => path.resolve(runnerParameters.workingDir, value));
            validator.pushInput(pacArgs, "--packageType", parameters.solutionType);
            logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
            const pacResult = yield pac(...pacArgs);
            logger.log("PackSolution Action Result: " + pacResult);
        }
        catch (error) {
            logger.error(`failed: ${error.message}`);
            throw error;
        }
    });
}
exports.packSolution = packSolution;

//# sourceMappingURL=packSolution.js.map


/***/ }),

/***/ 119:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.publishSolution = void 0;
const authenticate_1 = __nccwpck_require__(192);
const createPacRunner_1 = __nccwpck_require__(226);
function publishSolution(parameters, runnerParameters) {
    return __awaiter(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = createPacRunner_1.default(runnerParameters);
        try {
            const authenticateResult = yield authenticate_1.authenticateEnvironment(pac, parameters.credentials, parameters.environmentUrl);
            logger.log("The Authentication Result: " + authenticateResult);
            const pacResult = yield pac("solution", "publish");
            logger.log("PublishSolution Action Result: " + pacResult);
        }
        catch (error) {
            logger.error(`failed: ${error.message}`);
            throw error;
        }
        finally {
            const clearAuthResult = yield authenticate_1.clearAuthentication(pac);
            logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
    });
}
exports.publishSolution = publishSolution;

//# sourceMappingURL=publishSolution.js.map


/***/ }),

/***/ 682:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resetEnvironment = void 0;
const InputValidator_1 = __nccwpck_require__(988);
const authenticate_1 = __nccwpck_require__(192);
const createPacRunner_1 = __nccwpck_require__(226);
function resetEnvironment(parameters, runnerParameters, host) {
    return __awaiter(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = createPacRunner_1.default(runnerParameters);
        try {
            const authenticateResult = yield authenticate_1.authenticateAdmin(pac, parameters.credentials);
            logger.log("The Authentication Result: " + authenticateResult);
            // Made environment url mandatory and removed environment id as there are planned changes in PAC CLI on the parameter.
            const pacArgs = ["admin", "reset"];
            const validator = new InputValidator_1.InputValidator(host);
            validator.pushInput(pacArgs, "--environment", parameters.environment);
            validator.pushInput(pacArgs, "--url", parameters.environmentUrl);
            validator.pushInput(pacArgs, "--environment-id", parameters.environmentId);
            validator.pushInput(pacArgs, "--language", parameters.language);
            validator.pushInput(pacArgs, "--currency", parameters.currency);
            validator.pushInput(pacArgs, "--purpose", parameters.purpose);
            validator.pushInput(pacArgs, "--templates", parameters.templates);
            if (validator.getInput(parameters.overrideDomainName) === 'true') {
                validator.pushInput(pacArgs, "--domain", parameters.domainName);
            }
            if (validator.getInput(parameters.overrideFriendlyName) === 'true') {
                validator.pushInput(pacArgs, "--name", parameters.friendlyEnvironmentName);
            }
            logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
            const pacResult = yield pac(...pacArgs);
            logger.log("ResetEnvironment Action Result: " + pacResult);
        }
        catch (error) {
            logger.error(`failed: ${error.message}`);
            throw error;
        }
        finally {
            const clearAuthResult = yield authenticate_1.clearAuthentication(pac);
            logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
    });
}
exports.resetEnvironment = resetEnvironment;

//# sourceMappingURL=resetEnvironment.js.map


/***/ }),

/***/ 697:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.restoreEnvironment = void 0;
const InputValidator_1 = __nccwpck_require__(988);
const authenticate_1 = __nccwpck_require__(192);
const createPacRunner_1 = __nccwpck_require__(226);
function restoreEnvironment(parameters, runnerParameters, host) {
    return __awaiter(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = createPacRunner_1.default(runnerParameters);
        try {
            const authenticateResult = yield authenticate_1.authenticateAdmin(pac, parameters.credentials);
            logger.log("The Authentication Result: " + authenticateResult);
            const pacArgs = ["admin", "restore"];
            const validator = new InputValidator_1.InputValidator(host);
            validator.pushInput(pacArgs, "--source-env", parameters.sourceEnvironment);
            validator.pushInput(pacArgs, "--target-env", parameters.targetEnvironment);
            validator.pushInput(pacArgs, "--source-url", parameters.sourceEnvironmentUrl);
            validator.pushInput(pacArgs, "--target-url", parameters.targetEnvironmentUrl);
            validator.pushInput(pacArgs, "--source-id", parameters.sourceEnvironmentId);
            validator.pushInput(pacArgs, "--target-id", parameters.targetEnvironmentId);
            validator.pushInput(pacArgs, "--name", parameters.targetEnvironmentName);
            if (validator.getInput(parameters.restoreLatestBackup) === 'true') {
                pacArgs.push("--selected-backup", "latest");
            }
            else if (parameters.backupDateTime) {
                validator.pushInput(pacArgs, "--selected-backup", parameters.backupDateTime);
            }
            else {
                throw new Error("Either latest backup must be true or Valid date and time for backup must be provided.");
            }
            logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
            const pacResult = yield pac(...pacArgs);
            logger.log("RestoreEnvironment Action Result: " + pacResult);
        }
        catch (error) {
            logger.error(`failed: ${error.message}`);
            throw error;
        }
        finally {
            const clearAuthResult = yield authenticate_1.clearAuthentication(pac);
            logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
    });
}
exports.restoreEnvironment = restoreEnvironment;

//# sourceMappingURL=restoreEnvironment.js.map


/***/ }),

/***/ 230:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.unpackSolution = void 0;
const InputValidator_1 = __nccwpck_require__(988);
const createPacRunner_1 = __nccwpck_require__(226);
const path = __nccwpck_require__(622);
function unpackSolution(parameters, runnerParameters, host) {
    return __awaiter(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = createPacRunner_1.default(runnerParameters);
        try {
            const pacArgs = ["solution", "unpack"];
            const validator = new InputValidator_1.InputValidator(host);
            validator.pushInput(pacArgs, "--zipFile", parameters.solutionZipFile, (value) => path.resolve(runnerParameters.workingDir, value));
            validator.pushInput(pacArgs, "--folder", parameters.sourceFolder, (value) => path.resolve(runnerParameters.workingDir, value));
            validator.pushInput(pacArgs, "--packageType", parameters.solutionType);
            if (validator.getInput(parameters.overwriteFiles) === "true") {
                pacArgs.push("--allowDelete");
                pacArgs.push("true");
                pacArgs.push("--allowWrite");
                pacArgs.push("true");
                pacArgs.push("--clobber");
                pacArgs.push("true");
            }
            logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
            const pacResult = yield pac(...pacArgs);
            logger.log("UnpackSolution Action Result: " + pacResult);
        }
        catch (error) {
            logger.error(`failed: ${error.message}`);
            throw error;
        }
    });
}
exports.unpackSolution = unpackSolution;

//# sourceMappingURL=unpackSolution.js.map


/***/ }),

/***/ 21:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.updateVersionSolution = void 0;
const InputValidator_1 = __nccwpck_require__(988);
const authenticate_1 = __nccwpck_require__(192);
const createPacRunner_1 = __nccwpck_require__(226);
function updateVersionSolution(parameters, runnerParameters, host) {
    return __awaiter(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = createPacRunner_1.default(runnerParameters);
        try {
            const authenticateResult = yield authenticate_1.authenticateEnvironment(pac, parameters.credentials, parameters.environmentUrl);
            logger.log("The Authentication Result: " + authenticateResult);
            const pacArgs = ["solution", "version"];
            const validator = new InputValidator_1.InputValidator(host);
            validator.pushInput(pacArgs, "--patchversion", parameters.patchVersion);
            validator.pushInput(pacArgs, "--strategy", parameters.strategy);
            validator.pushInput(pacArgs, "--filename", parameters.fileName);
            logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
            const pacResult = yield pac(...pacArgs);
            logger.log("UpdateVersionSolution Action Result: " + pacResult);
        }
        catch (error) {
            logger.error(`failed: ${error.message}`);
            throw error;
        }
        finally {
            const clearAuthResult = yield authenticate_1.clearAuthentication(pac);
            logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
    });
}
exports.updateVersionSolution = updateVersionSolution;

//# sourceMappingURL=updateVersionSolution.js.map


/***/ }),

/***/ 177:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.upgradeSolution = void 0;
const InputValidator_1 = __nccwpck_require__(988);
const authenticate_1 = __nccwpck_require__(192);
const createPacRunner_1 = __nccwpck_require__(226);
function upgradeSolution(parameters, runnerParameters, host) {
    return __awaiter(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = createPacRunner_1.default(runnerParameters);
        try {
            const authenticateResult = yield authenticate_1.authenticateEnvironment(pac, parameters.credentials, parameters.environmentUrl);
            logger.log("The Authentication Result: " + authenticateResult);
            const pacArgs = ["solution", "upgrade"];
            const validator = new InputValidator_1.InputValidator(host);
            validator.pushInput(pacArgs, "--solution-name", parameters.name);
            validator.pushInput(pacArgs, "--async", parameters.async);
            validator.pushInput(pacArgs, "--max-async-wait-time", parameters.maxAsyncWaitTimeInMin);
            logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
            const pacResult = yield pac(...pacArgs);
            logger.log("UpgradeSolution Action Result: " + pacResult);
        }
        catch (error) {
            logger.error(`failed: ${error.message}`);
            throw error;
        }
        finally {
            const clearAuthResult = yield authenticate_1.clearAuthentication(pac);
            logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
    });
}
exports.upgradeSolution = upgradeSolution;

//# sourceMappingURL=upgradeSolution.js.map


/***/ }),

/***/ 223:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.uploadPaportal = void 0;
const InputValidator_1 = __nccwpck_require__(988);
const authenticate_1 = __nccwpck_require__(192);
const createPacRunner_1 = __nccwpck_require__(226);
function uploadPaportal(parameters, runnerParameters, host) {
    return __awaiter(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = createPacRunner_1.default(runnerParameters);
        try {
            const authenticateResult = yield authenticate_1.authenticateEnvironment(pac, parameters.credentials, parameters.environmentUrl);
            logger.log("The Authentication Result: " + authenticateResult);
            const pacArgs = ["paportal", "upload"];
            const validator = new InputValidator_1.InputValidator(host);
            validator.pushInput(pacArgs, "--path", parameters.path);
            validator.pushInput(pacArgs, "--deploymentProfile", parameters.deploymentProfile);
            logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
            const pacResult = yield pac(...pacArgs);
            logger.log("UploadPaPortal Action Result: " + pacResult);
        }
        catch (error) {
            logger.error(`failed: ${error.message}`);
            throw error;
        }
        finally {
            const clearAuthResult = yield authenticate_1.clearAuthentication(pac);
            logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
    });
}
exports.uploadPaportal = uploadPaportal;

//# sourceMappingURL=uploadPaportal.js.map


/***/ }),

/***/ 302:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.whoAmI = void 0;
const authenticate_1 = __nccwpck_require__(192);
const createPacRunner_1 = __nccwpck_require__(226);
function whoAmI(parameters, runnerParameters) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = createPacRunner_1.default(runnerParameters);
        try {
            const authenticateResult = yield authenticate_1.authenticateEnvironment(pac, parameters.credentials, parameters.environmentUrl);
            logger.log("The Authentication Result: " + authenticateResult);
            const pacResult = yield pac("org", "who");
            logger.log("WhoAmI Action Result: " + pacResult);
            const envIdLabel = "Environment ID:";
            // HACK TODO: Need structured output from pac CLI to make parsing out of the resulting env id more robust
            const envId = (_a = pacResult
                .filter(l => l.length > 0)
                .filter(l => l.includes(envIdLabel))) === null || _a === void 0 ? void 0 : _a[0].split(envIdLabel)[1].trim();
            return {
                environmentId: envId
            };
        }
        catch (error) {
            logger.error(`failed: ${error.message}`);
            throw error;
        }
        finally {
            const clearAuthResult = yield authenticate_1.clearAuthentication(pac);
            logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
    });
}
exports.whoAmI = whoAmI;

//# sourceMappingURL=whoAmI.js.map


/***/ }),

/***/ 988:
/***/ ((__unused_webpack_module, exports) => {


// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InputValidator = void 0;
class InputValidator {
    constructor(host) {
        this._host = host;
    }
    getInput(params) {
        const val = this._host.getInput(params);
        if (val === undefined && params.defaultValue !== undefined) {
            return params.defaultValue.toString();
        }
        return val;
    }
    pushInput(pacArgs, property, paramEntry, callback) {
        // TODO: change action-specific ...Parameters contracts to always require the parameter definition
        // today, we double-encode if a task/action parameter is optional in the ...Parameters interface definition, but shouldn't!
        if (!paramEntry) {
            return;
        }
        let val = this.getInput(paramEntry);
        if (!val && paramEntry.required) {
            throw new Error(`Required ${paramEntry.name} not set`);
        }
        else if (val) {
            if (callback) {
                val = callback(val);
            }
            pacArgs.push(property, val);
        }
    }
}
exports.InputValidator = InputValidator;

//# sourceMappingURL=InputValidator.js.map


/***/ }),

/***/ 192:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.clearAuthentication = exports.authenticateEnvironment = exports.authenticateAdmin = void 0;
function authenticateAdmin(pac, credentials) {
    return pac("auth", "create", "--kind", "ADMIN", ...addCredentials(credentials));
}
exports.authenticateAdmin = authenticateAdmin;
function authenticateEnvironment(pac, credentials, environmentUrl) {
    return pac("auth", "create", ...addUrl(environmentUrl), ...addCredentials(credentials));
}
exports.authenticateEnvironment = authenticateEnvironment;
function clearAuthentication(pac) {
    return pac("auth", "clear");
}
exports.clearAuthentication = clearAuthentication;
function addUrl(url) {
    return ["--url", url];
}
function addCredentials(credentials) {
    return isUsernamePassword(credentials) ? addUsernamePassword(credentials) : addClientCredentials(credentials);
}
function isUsernamePassword(credentials) {
    return "username" in credentials;
}
function addClientCredentials(parameters) {
    return ["--tenant", parameters.tenantId, "--applicationId", parameters.appId, "--clientSecret", parameters.clientSecret];
}
function addUsernamePassword(parameters) {
    return ["--username", parameters.username, "--password", parameters.password];
}

//# sourceMappingURL=authenticate.js.map


/***/ }),

/***/ 226:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const os_1 = __nccwpck_require__(87);
const path_1 = __nccwpck_require__(622);
const CommandRunner_1 = __nccwpck_require__(892);
function createPacRunner({ workingDir, runnersDir, logger, agent }) {
    return CommandRunner_1.createCommandRunner(workingDir, os_1.platform() === "win32"
        ? path_1.resolve(runnersDir, "pac", "tools", "pac.exe")
        : path_1.resolve(runnersDir, "pac_linux", "tools", "pac"), logger, undefined, agent);
}
exports.default = createPacRunner;

//# sourceMappingURL=createPacRunner.js.map


/***/ }),

/***/ 274:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
const actions_1 = __nccwpck_require__(765);
const core = __nccwpck_require__(186);
const getCredentials_1 = __nccwpck_require__(429);
const getEnvironmentUrl_1 = __nccwpck_require__(699);
const runnerParameters_1 = __nccwpck_require__(727);
(() => __awaiter(void 0, void 0, void 0, function* () {
    core.startGroup('who-am-i:');
    const result = yield actions_1.whoAmI({
        credentials: getCredentials_1.default(),
        environmentUrl: getEnvironmentUrl_1.default(),
    }, runnerParameters_1.runnerParameters);
    core.setOutput('environment-id', result.environmentId);
    core.endGroup();
}))().catch(error => {
    const logger = runnerParameters_1.runnerParameters.logger;
    logger.error(`failed: ${error}`);
    core.endGroup();
});

//# sourceMappingURL=index.js.map


/***/ }),

/***/ 970:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ActionLogger = void 0;
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
const core = __nccwpck_require__(186);
class ActionLogger {
    info(...args) {
        core.info(args.join());
    }
    warn(...args) {
        core.warning(args.join());
    }
    error(...args) {
        const errorMessage = args.join();
        core.setFailed(errorMessage);
        core.error(errorMessage);
    }
    debug(...args) {
        core.debug(args.join());
    }
    log(...args) {
        console.log(args.join());
    }
}
exports.ActionLogger = ActionLogger;

//# sourceMappingURL=actionLogger.js.map


/***/ }),

/***/ 429:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __nccwpck_require__(186);
function getCredentials() {
    const usernamePassword = {
        username: getInput("user-name"),
        password: getInput("password-secret"),
    };
    const isUpValid = isUsernamePasswordValid(usernamePassword);
    const clientCredentials = {
        appId: getInput("app-id"),
        clientSecret: getInput("client-secret"),
        tenantId: getInput("tenant-id"),
    };
    const isCcValid = isClientCredentialsValid(clientCredentials);
    if (isUpValid && isCcValid) {
        throw new Error("Too many authentication parameters specified. Must pick either username/password or app-id/client-secret/tenant-id for the authentication flow.");
    }
    if (isUpValid) {
        return usernamePassword;
    }
    if (isCcValid) {
        return clientCredentials;
    }
    throw new Error("Must provide either username/password or app-id/client-secret/tenant-id for authentication!");
}
exports.default = getCredentials;
function getInput(name) {
    return core_1.getInput(name, { required: false });
}
function isUsernamePasswordValid(usernamePassword) {
    return !!usernamePassword.username && !!usernamePassword.password;
}
function isClientCredentialsValid(clientCredentials) {
    return (!!clientCredentials.appId &&
        !!clientCredentials.clientSecret &&
        !!clientCredentials.tenantId);
}

//# sourceMappingURL=getCredentials.js.map


/***/ }),

/***/ 699:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __nccwpck_require__(186);
function getEnvironmentUrl() {
    return core_1.getInput("environment-url", { required: false });
}
exports.default = getEnvironmentUrl;

//# sourceMappingURL=getEnvironmentUrl.js.map


/***/ }),

/***/ 309:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const path_1 = __nccwpck_require__(622);
function getExePath(...relativePath) {
    // in mocha, __dirname resolves to the src folder of the .ts file,
    // but when running the .js file directly, e.g. from the /dist folder, it will be from that folder
    const currentDirectory = path_1.resolve(__dirname);
    const parentDir = path_1.dirname(currentDirectory);
    // /dist/actions/<action-name>/index.js:
    // /out/actions/<action-name>/index.js:
    let outDirRoot;
    switch (path_1.basename(parentDir)) {
        case "actions":
            outDirRoot = path_1.resolve(path_1.dirname(parentDir));
            break;
        case "src":
        case "out":
            outDirRoot = path_1.resolve(parentDir, "..", "out");
            break;
        default:
            throw Error(`ExeRunner: cannot resolve outDirRoot running from this location: ${path_1.dirname}`);
    }
    return path_1.resolve(outDirRoot, ...relativePath);
}
exports.default = getExePath;

//# sourceMappingURL=getExePath.js.map


/***/ }),

/***/ 727:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getAutomationAgent = exports.runnerParameters = void 0;
const process_1 = __nccwpck_require__(316);
const actionLogger_1 = __nccwpck_require__(970);
const getExePath_1 = __nccwpck_require__(309);
function getAutomationAgent() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const jsonPackage = __nccwpck_require__(306);
    const productName = jsonPackage.name.split("/")[1];
    return productName + "/" + jsonPackage.version;
}
exports.getAutomationAgent = getAutomationAgent;
const runnerParameters = {
    runnersDir: getExePath_1.default(),
    workingDir: process_1.cwd(),
    logger: new actionLogger_1.ActionLogger(),
    agent: getAutomationAgent(),
};
exports.runnerParameters = runnerParameters;

//# sourceMappingURL=runnerParameters.js.map


/***/ }),

/***/ 306:
/***/ ((module) => {

module.exports = JSON.parse('{"name":"@microsoft/powerplatform-actions","version":"0.1.0","description":"Github Action for Power Platform","main":"index.js","scripts":{"clean":"scorch","build":"node node_modules/gulp/bin/gulp.js","test":"node node_modules/gulp/bin/gulp.js test","ci":"node node_modules/gulp/bin/gulp.js ci","update-dist":"node node_modules/gulp/bin/gulp.js updateDist"},"author":"PowerApps-ISV-Tools","license":"MIT","repository":{"type":"git","url":"https://github.com/microsoft/powerplatform-actions.git"},"devDependencies":{"@types/async":"^3.2.7","@types/chai":"^4.2.20","@types/fancy-log":"^1.3.1","@types/fs-extra":"^9.0.12","@types/glob":"^7.1.4","@types/js-yaml":"^4.0.3","@types/mocha":"^8.2.3","@types/node":"^14.14.35","@types/sinon":"^9.0.11","@types/sinon-chai":"^3.2.5","@types/uuid":"^8.3.0","@types/yargs":"^17.0.2","@typescript-eslint/eslint-plugin":"^4.28.2","@typescript-eslint/parser":"^4.28.2","@vercel/ncc":"^0.31.1","async":"^3.2.0","chai":"^4.3.4","dotenv":"^8.2.0","eslint":"^7.30.0","fancy-log":"^1.3.3","glob":"^7.1.7","gulp":"^4.0.2","gulp-eslint":"^6.0.0","gulp-mocha":"^8.0.0","gulp-sourcemaps":"^3.0.0","gulp-typescript":"^6.0.0-alpha.1","mocha":"^9.0.2","node-fetch":"^2.6.1","ps-list":"^7.2.0","rewiremock":"^3.14.3","sinon":"^9.2.4","sinon-chai":"^3.5.0","ts-node":"^10.0.0","ts-sinon":"^2.0.1","typescript":"^4.3.5","unzip-stream":"^0.3.0","winston":"^3.3.3","yargs":"^17.0.1"},"dependencies":{"@actions/artifact":"^0.5.2","@actions/core":"^1.4.0","@microsoft/powerplatform-cli-wrapper":"^0.1.37","date-fns":"^2.22.1","fs-extra":"^10.0.0","js-yaml":"^4.1","uuid":"^8.3.2"}}');

/***/ }),

/***/ 129:
/***/ ((module) => {

module.exports = require("child_process");

/***/ }),

/***/ 747:
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ 87:
/***/ ((module) => {

module.exports = require("os");

/***/ }),

/***/ 622:
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ 316:
/***/ ((module) => {

module.exports = require("process");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/
/************************************************************************/
/******/
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __nccwpck_require__(274);
/******/ 	module.exports = __webpack_exports__;
/******/
/******/ })()
;
