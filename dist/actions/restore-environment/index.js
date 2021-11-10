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

/***/ 175:
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
exports.main = void 0;
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
const core = __nccwpck_require__(186);
const lib_1 = __nccwpck_require__(806);
(() => __awaiter(void 0, void 0, void 0, function* () {
    if (process.env.GITHUB_ACTIONS) {
        yield main(lib_1.DefaultRunnerFactory);
    }
}))();
function main(factory) {
    return __awaiter(this, void 0, void 0, function* () {
        let pac;
        try {
            core.startGroup('restore-environment:');
            const sourceUrl = core.getInput('source-url', { required: true });
            const targetUrl = core.getInput('target-url', { required: true });
            const selectedBackup = core.getInput('selected-backup', { required: true });
            pac = factory.getRunner('pac', process.cwd());
            yield new lib_1.AuthHandler(pac).authenticate(lib_1.AuthKind.ADMIN);
            const restoreEnvArgs = ['admin', 'restore', '--source-url', sourceUrl, '--target-url', targetUrl, '--selected-backup', selectedBackup];
            yield pac.run(restoreEnvArgs);
            core.info('environment restored');
            core.endGroup();
        }
        catch (error) {
            core.setFailed(`failed: ${error.message}`);
            throw error;
        }
        finally {
            yield (pac === null || pac === void 0 ? void 0 : pac.run(["auth", "clear"]));
        }
    });
}
exports.main = main;

//# sourceMappingURL=index.js.map


/***/ }),

/***/ 434:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getWorkingDirectory = exports.getInputAsBool = void 0;
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
const core = __nccwpck_require__(186);
function getInputAsBool(name, required, defaultValue) {
    const textValue = core.getInput(name, { required: required });
    return (!textValue) ? defaultValue : textValue.toLowerCase() === 'true';
}
exports.getInputAsBool = getInputAsBool;
function getWorkingDirectory(name, required, defaultValue) {
    const textValue = core.getInput(name, { required: required });
    return (!textValue) ? (defaultValue !== null && defaultValue !== void 0 ? defaultValue : process.cwd()) : textValue;
}
exports.getWorkingDirectory = getWorkingDirectory;

//# sourceMappingURL=actionInput.js.map


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

/***/ 677:
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
exports.AuthKind = exports.AuthHandler = void 0;
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
const core = __nccwpck_require__(186);
const createLegacyRunnerPacAuthenticator_1 = __nccwpck_require__(687);
class AuthHandler {
    constructor(pac) {
        if ("run" in pac) {
            this._pacAuthenticator = createLegacyRunnerPacAuthenticator_1.default(pac);
        }
        else {
            this._pacAuthenticator = pac;
        }
    }
    authenticate(authKind) {
        return __awaiter(this, void 0, void 0, function* () {
            core.startGroup("authentication");
            this._envUrl = core.getInput("environment-url", { required: false });
            const authType = this.determineAuthType();
            if (authType === AuthTypes.USERNAME_PASSWORD) {
                yield this.authenticateWithUsernamePassword(authKind);
            }
            else if (authType == AuthTypes.APPID_SECRET) {
                yield this.authenticateWithClientCredentials(authKind);
            }
            else {
                throw new Error("Must provide either username/password or app-id/client-secret/tenant-id for authentication!");
            }
            core.endGroup();
        });
    }
    determineAuthType() {
        const validUsernameAuth = this.isValidUsernameAuth();
        const validSPNAuth = this.isValidSPNAuth();
        try {
            if (validUsernameAuth && validSPNAuth) {
                throw new Error("Too many authentication parameters specified. Must pick either username/password or app-id/client-secret/tenant-id for the authentication flow.");
            }
            if (validUsernameAuth) {
                return AuthTypes.USERNAME_PASSWORD;
            }
            else if (validSPNAuth) {
                return AuthTypes.APPID_SECRET;
            }
        }
        catch (error) {
            core.setFailed(`failed: ${error.message}`);
            throw error;
        }
        return AuthTypes.INVALID_AUTH_TYPE;
    }
    isValidUsernameAuth() {
        this._username = core.getInput("user-name", { required: false });
        this._password = core.getInput("password-secret", { required: false });
        return !!this._username && !!this._password;
    }
    isValidSPNAuth() {
        this._appId = core.getInput("app-id", { required: false });
        this._clientSecret = core.getInput("client-secret", {
            required: false,
        });
        this._tenantId = core.getInput("tenant-id", { required: false });
        return !!this._appId && !!this._clientSecret && !!this._tenantId;
    }
    authenticateWithClientCredentials(authKind) {
        return __awaiter(this, void 0, void 0, function* () {
            core.info(`SPN Authentication : Authenticating with appId: ${this._appId}`);
            if (authKind === AuthKind.CDS) {
                yield this._pacAuthenticator.authenticateCdsWithClientCredentials({
                    tenantId: this._tenantId,
                    appId: this._appId,
                    clientSecret: this._clientSecret,
                });
            }
            else {
                yield this._pacAuthenticator.authenticateAdminWithClientCredentials({
                    tenantId: this._tenantId,
                    appId: this._appId,
                    clientSecret: this._clientSecret,
                });
            }
        });
    }
    authenticateWithUsernamePassword(authKind) {
        return __awaiter(this, void 0, void 0, function* () {
            core.info(`Username/password Authentication : Authenticating with user: ${this._username}`);
            if (authKind == AuthKind.CDS) {
                yield this._pacAuthenticator.authenticateCdsWithUsernamePassword({
                    username: this._username,
                    password: this._password,
                });
            }
            else {
                yield this._pacAuthenticator.authenticateAdminWithUsernamePassword({
                    username: this._username,
                    password: this._password,
                });
            }
        });
    }
}
exports.AuthHandler = AuthHandler;
var AuthTypes;
(function (AuthTypes) {
    AuthTypes[AuthTypes["USERNAME_PASSWORD"] = 0] = "USERNAME_PASSWORD";
    AuthTypes[AuthTypes["APPID_SECRET"] = 1] = "APPID_SECRET";
    AuthTypes[AuthTypes["INVALID_AUTH_TYPE"] = 2] = "INVALID_AUTH_TYPE";
})(AuthTypes || (AuthTypes = {}));
var AuthKind;
(function (AuthKind) {
    AuthKind[AuthKind["CDS"] = 0] = "CDS";
    AuthKind[AuthKind["ADMIN"] = 1] = "ADMIN";
})(AuthKind = exports.AuthKind || (exports.AuthKind = {}));

//# sourceMappingURL=authHandler.js.map


/***/ }),

/***/ 687:
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
const getEnvironmentUrl_1 = __nccwpck_require__(699);
function createLegacyRunnerPacAuthenticator(pac) {
    return {
        authenticateCdsWithClientCredentials: (parameters) => __awaiter(this, void 0, void 0, function* () {
            yield clearAuth();
            yield pac.run([
                "auth",
                "create",
                "--url",
                getEnvironmentUrl_1.default(),
                "--applicationId",
                parameters.appId,
                "--clientSecret",
                parameters.clientSecret,
                "--tenant",
                parameters.tenantId,
            ]);
        }),
        authenticateAdminWithClientCredentials: (parameters) => __awaiter(this, void 0, void 0, function* () {
            yield clearAuth();
            yield pac.run([
                "auth",
                "create",
                "--kind",
                "ADMIN",
                "--applicationId",
                parameters.appId,
                "--clientSecret",
                parameters.clientSecret,
                "--tenant",
                parameters.tenantId,
            ]);
        }),
        authenticateCdsWithUsernamePassword: (parameters) => __awaiter(this, void 0, void 0, function* () {
            yield clearAuth();
            yield pac.run([
                "auth",
                "create",
                "--url",
                getEnvironmentUrl_1.default(),
                "--username",
                parameters.username,
                "--password",
                parameters.password,
            ]);
        }),
        authenticateAdminWithUsernamePassword: (parameters) => __awaiter(this, void 0, void 0, function* () {
            yield clearAuth();
            yield pac.run([
                "auth",
                "create",
                "--kind",
                "ADMIN",
                "--username",
                parameters.username,
                "--password",
                parameters.password,
            ]);
        }),
    };
    function clearAuth() {
        return __awaiter(this, void 0, void 0, function* () {
            yield pac.run(["auth", "clear"]);
        });
    }
}
exports.default = createLegacyRunnerPacAuthenticator;

//# sourceMappingURL=createLegacyRunnerPacAuthenticator.js.map


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
exports.RunnerError = exports.ExeRunner = void 0;
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
const child_process_1 = __nccwpck_require__(129);
const os = __nccwpck_require__(87);
const getExePath_1 = __nccwpck_require__(309);
const runnerParameters_1 = __nccwpck_require__(727);
const process = __nccwpck_require__(765);
class ExeRunner {
    constructor(_workingDir, logger, exeName, exeRelativePath) {
        this._workingDir = _workingDir;
        this.logger = logger;
        if (exeRelativePath) {
            this._exePath = getExePath_1.default(...exeRelativePath, exeName);
        }
        else {
            this._exePath = exeName;
        }
    }
    get workingDir() {
        return this._workingDir;
    }
    run(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const stdout = new Array();
                const stderr = new Array();
                this.logger.info(`exe: ${this._exePath}, first arg of ${args.length}: ${args.length ? args[0] : '<none>'}`);
                const cp = child_process_1.spawn(this._exePath, args, {
                    cwd: this.workingDir,
                    env: Object.assign(Object.assign({}, process.env), { "PP_TOOLS_AUTOMATION_AGENT": runnerParameters_1.getAutomationAgent() })
                });
                cp.stdout.on('data', (data) => stdout.push(...data.toString().split(os.EOL)));
                cp.stderr.on('data', (data) => stderr.push(...data.toString().split(os.EOL)));
                cp.on('exit', (code) => {
                    if (code === 0) {
                        this.logger.info(`success: ${stdout.join(os.EOL)}`);
                        resolve(stdout);
                    }
                    else {
                        const allOutput = stderr.concat(stdout);
                        this.logger.error(`error: ${code}: ${allOutput.join(os.EOL)}`);
                        reject(new RunnerError(code !== null && code !== void 0 ? code : 99999, allOutput.join()));
                    }
                    // Close out handles to the output streams so that we don't wait on grandchild processes like pacTelemetryUpload
                    cp.stdout.destroy();
                    cp.stderr.destroy();
                });
            });
        });
    }
    runSync(args) {
        var _a;
        this.logger.info(`exe: ${this._exePath}, first arg of ${args.length}: ${args.length ? args[0] : '<none>'}`);
        const proc = child_process_1.spawnSync(this._exePath, args, {
            cwd: this.workingDir,
            env: Object.assign(Object.assign({}, process.env), { "PP_TOOLS_AUTOMATION_AGENT": runnerParameters_1.getAutomationAgent() })
        });
        if (proc.status === 0) {
            const output = proc.output
                .filter(line => !!line) // can have null entries
                .map(line => line.toString());
            this.logger.info(`success: ${output.join(os.EOL)}`);
            return output;
        }
        else {
            const allOutput = proc.stderr.toString().concat(proc.stdout.toString());
            this.logger.error(`error: ${proc.status}: ${allOutput}`);
            throw new RunnerError((_a = proc.status) !== null && _a !== void 0 ? _a : 99999, allOutput);
        }
    }
}
exports.ExeRunner = ExeRunner;
class RunnerError extends Error {
    constructor(exitCode, message) {
        super(message);
        this.exitCode = exitCode;
    }
}
exports.RunnerError = RunnerError;

//# sourceMappingURL=exeRunner.js.map


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

/***/ 973:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GitRunner = void 0;
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
const exeRunner_1 = __nccwpck_require__(21);
class GitRunner extends exeRunner_1.ExeRunner {
    constructor(workingDir, logger) {
        super(workingDir, logger, 'git');
    }
}
exports.GitRunner = GitRunner;

//# sourceMappingURL=gitRunner.js.map


/***/ }),

/***/ 806:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthKind = exports.AuthHandler = exports.PacRunner = exports.GitRunner = exports.ActionLogger = exports.DefaultRunnerFactory = exports.RunnerError = exports.getWorkingDirectory = exports.getInputAsBool = void 0;
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
var actionInput_1 = __nccwpck_require__(434);
Object.defineProperty(exports, "getInputAsBool", ({ enumerable: true, get: function () { return actionInput_1.getInputAsBool; } }));
Object.defineProperty(exports, "getWorkingDirectory", ({ enumerable: true, get: function () { return actionInput_1.getWorkingDirectory; } }));
var exeRunner_1 = __nccwpck_require__(21);
Object.defineProperty(exports, "RunnerError", ({ enumerable: true, get: function () { return exeRunner_1.RunnerError; } }));
var runnerFactory_1 = __nccwpck_require__(147);
Object.defineProperty(exports, "DefaultRunnerFactory", ({ enumerable: true, get: function () { return runnerFactory_1.DefaultRunnerFactory; } }));
// TODO: delete exports once all actions are converted:
var actionLogger_1 = __nccwpck_require__(970);
Object.defineProperty(exports, "ActionLogger", ({ enumerable: true, get: function () { return actionLogger_1.ActionLogger; } }));
var gitRunner_1 = __nccwpck_require__(973);
Object.defineProperty(exports, "GitRunner", ({ enumerable: true, get: function () { return gitRunner_1.GitRunner; } }));
var pacRunner_1 = __nccwpck_require__(366);
Object.defineProperty(exports, "PacRunner", ({ enumerable: true, get: function () { return pacRunner_1.PacRunner; } }));
var authHandler_1 = __nccwpck_require__(677);
Object.defineProperty(exports, "AuthHandler", ({ enumerable: true, get: function () { return authHandler_1.AuthHandler; } }));
Object.defineProperty(exports, "AuthKind", ({ enumerable: true, get: function () { return authHandler_1.AuthKind; } }));

//# sourceMappingURL=index.js.map


/***/ }),

/***/ 366:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PacRunner = void 0;
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
const exeRunner_1 = __nccwpck_require__(21);
const os = __nccwpck_require__(87);
const platform = os.platform();
const programName = platform === "win32" ? 'pac.exe' : 'pac';
const programPath = platform === "win32" ? ['pac', 'tools'] : ['pac_linux', 'tools'];
class PacRunner extends exeRunner_1.ExeRunner {
    constructor(workingDir, logger) {
        super(workingDir, logger, programName, programPath);
    }
}
exports.PacRunner = PacRunner;

//# sourceMappingURL=pacRunner.js.map


/***/ }),

/***/ 147:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DefaultRunnerFactory = void 0;
const actionLogger_1 = __nccwpck_require__(970);
const gitRunner_1 = __nccwpck_require__(973);
const pacRunner_1 = __nccwpck_require__(366);
class RealRunnerFactory {
    constructor() {
        this._logger = new actionLogger_1.ActionLogger();
    }
    getRunner(runnerName, workingDir) {
        switch (runnerName) {
            case 'pac':
                return new pacRunner_1.PacRunner(workingDir, this._logger);
            case 'git':
                return new gitRunner_1.GitRunner(workingDir, this._logger);
            default:
                throw new Error(`Unknown runner type requested: ${runnerName}`);
        }
    }
}
exports.DefaultRunnerFactory = new RealRunnerFactory();

//# sourceMappingURL=runnerFactory.js.map


/***/ }),

/***/ 727:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getAutomationAgent = exports.runnerParameters = void 0;
const process_1 = __nccwpck_require__(765);
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

module.exports = JSON.parse('{"name":"@microsoft/powerplatform-actions","version":"0.1.0","description":"Github Action for Power Platform","main":"index.js","scripts":{"clean":"scorch","build":"node node_modules/gulp/bin/gulp.js","test":"node node_modules/gulp/bin/gulp.js test","ci":"node node_modules/gulp/bin/gulp.js ci","update-dist":"node node_modules/gulp/bin/gulp.js updateDist"},"author":"PowerApps-ISV-Tools","license":"MIT","repository":{"type":"git","url":"https://github.com/microsoft/powerplatform-actions.git"},"devDependencies":{"@types/async":"^3.2.7","@types/chai":"^4.2.20","@types/fancy-log":"^1.3.1","@types/fs-extra":"^9.0.12","@types/glob":"^7.1.4","@types/js-yaml":"^4.0.3","@types/mocha":"^8.2.3","@types/node":"^14.14.35","@types/sinon":"^9.0.11","@types/sinon-chai":"^3.2.5","@types/uuid":"^8.3.0","@types/yargs":"^17.0.2","@typescript-eslint/eslint-plugin":"^4.28.2","@typescript-eslint/parser":"^4.28.2","@vercel/ncc":"^0.28.6","async":"^3.2.0","chai":"^4.3.4","dotenv":"^8.2.0","eslint":"^7.30.0","fancy-log":"^1.3.3","glob":"^7.1.7","gulp":"^4.0.2","gulp-eslint":"^6.0.0","gulp-mocha":"^8.0.0","gulp-sourcemaps":"^3.0.0","gulp-typescript":"^6.0.0-alpha.1","mocha":"^9.0.2","node-fetch":"^2.6.1","ps-list":"^7.2.0","rewiremock":"^3.14.3","sinon":"^9.2.4","sinon-chai":"^3.5.0","ts-node":"^10.0.0","ts-sinon":"^2.0.1","typescript":"^4.3.5","unzip-stream":"^0.3.0","winston":"^3.3.3","yargs":"^17.0.1"},"dependencies":{"@actions/artifact":"^0.5.2","@actions/core":"^1.4.0","@microsoft/powerplatform-cli-wrapper":"^0.1.31","date-fns":"^2.22.1","fs-extra":"^10.0.0","js-yaml":"^4.1","uuid":"^8.3.2"}}');

/***/ }),

/***/ 129:
/***/ ((module) => {

module.exports = require("child_process");;

/***/ }),

/***/ 747:
/***/ ((module) => {

module.exports = require("fs");;

/***/ }),

/***/ 87:
/***/ ((module) => {

module.exports = require("os");;

/***/ }),

/***/ 622:
/***/ ((module) => {

module.exports = require("path");;

/***/ }),

/***/ 765:
/***/ ((module) => {

module.exports = require("process");;

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
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __nccwpck_require__(175);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;