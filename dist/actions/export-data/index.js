"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/host/InputValidator.js
var require_InputValidator = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/host/InputValidator.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.normalizeLanguage = exports2.normalizeRegion = exports2.InputValidator = void 0;
    var InputValidator = class {
      constructor(host) {
        this._host = host;
      }
      getInput(params) {
        const val = this._host.getInput(params);
        if (val === void 0 && params.defaultValue !== void 0) {
          return params.defaultValue.toString();
        }
        return val;
      }
      pushInput(pacArgs, property, paramEntry, callback) {
        if (!paramEntry) {
          return;
        }
        let val = this.getInput(paramEntry);
        if (!val && paramEntry.required) {
          throw new Error(`Required ${paramEntry.name} not set`);
        } else if (val) {
          if (callback) {
            val = callback(val || paramEntry.defaultValue);
          }
          if (val)
            pacArgs.push(property, val);
        }
      }
    };
    exports2.InputValidator = InputValidator;
    var regionMap = {
      // pac CLI accepts case-insensitive region names, only transpose different names:
      // region key entries must be lower case
      "united states": "unitedstates",
      "united kingdom": "unitedkingdom",
      "preview (united states)": "unitedstatesfirstrelease",
      "south america": "southamerica"
    };
    function normalizeRegion(taskRegionName) {
      if (!taskRegionName || typeof taskRegionName !== "string")
        return void 0;
      const cliRegionName = regionMap[taskRegionName.toLowerCase()];
      return cliRegionName || taskRegionName;
    }
    exports2.normalizeRegion = normalizeRegion;
    var languageMap = {
      // pac CLI accepts case-insensitive region names, only transpose different names:
      // pac CLI accepts languages by either the BAP names, e.g. 'English (United States)' or by langCode, here: 1033
      // language key entries must be lower case
      "english": "1033"
    };
    function normalizeLanguage(taskLanguageName) {
      if (!taskLanguageName || typeof taskLanguageName !== "string")
        return void 0;
      const cliLanguageName = languageMap[taskLanguageName.toLowerCase()];
      return cliLanguageName || taskLanguageName;
    }
    exports2.normalizeLanguage = normalizeLanguage;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/pac/auth/authenticate.js
var require_authenticate = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/pac/auth/authenticate.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.clearAuthentication = exports2.authenticateEnvironment = exports2.authenticateAdmin = void 0;
    function authenticateAdmin(pac, credentials, logger) {
      logger.log(`authN to admin API: authType=${isUsernamePassword(credentials) ? "UserPass" : "SPN"}; cloudInstance: ${credentials.cloudInstance || "<not set>"}`);
      return pac("auth", "create", "--kind", "ADMIN", ...addCredentials(credentials), ...addCloudInstance(credentials));
    }
    exports2.authenticateAdmin = authenticateAdmin;
    function authenticateEnvironment(pac, credentials, environmentUrl, logger) {
      logger.log(`authN to env. authType:${isUsernamePassword(credentials) ? "UserPass" : "SPN"} authScheme:${isUsernamePassword(credentials) ? "" : `${credentials.scheme}`}; cloudInstance: ${credentials.cloudInstance || "<not set>"}; envUrl: ${environmentUrl}`);
      return pac("auth", "create", ...addUrl(environmentUrl), ...addCredentials(credentials), ...addCloudInstance(credentials));
    }
    exports2.authenticateEnvironment = authenticateEnvironment;
    function clearAuthentication(pac) {
      delete process.env.PAC_CLI_SPN_SECRET;
      return pac("auth", "clear");
    }
    exports2.clearAuthentication = clearAuthentication;
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
      if (parameters.scheme == "ManagedServiceIdentity") {
        return ["--managedIdentity"];
      }
      process.env.PAC_CLI_SPN_SECRET = parameters.clientSecret;
      const clientSecret = parameters.encodeSecret ? `data:text/plain;base64,${Buffer.from(parameters.clientSecret, "binary").toString("base64")}` : parameters.clientSecret;
      return [
        "--tenant",
        parameters.tenantId,
        "--applicationId",
        parameters.appId,
        "--clientSecret",
        clientSecret
      ];
    }
    function addUsernamePassword(parameters) {
      const password = parameters.encodePassword ? `data:text/plain;base64,${Buffer.from(parameters.password, "binary").toString("base64")}` : parameters.password;
      return [
        "--username",
        parameters.username,
        "--password",
        password
      ];
    }
    function addCloudInstance(parameters) {
      const cloudInstance = parameters.cloudInstance || "Public";
      return ["--cloud", cloudInstance];
    }
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/CommandRunner.js
var require_CommandRunner = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/CommandRunner.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.RunnerError = exports2.createCommandRunner = void 0;
    var child_process_1 = require("child_process");
    var process_1 = require("process");
    var readline = require("readline");
    var os_1 = require("os");
    var process2 = require("process");
    function createCommandRunner(workingDir, commandPath, logger, agent, options) {
      return function run(...args) {
        return __awaiter2(this, void 0, void 0, function* () {
          return new Promise((resolve, reject) => {
            logInitialization(...args);
            const allOutput = [];
            const cp = (0, child_process_1.spawn)(commandPath, args, Object.assign({ cwd: workingDir, env: Object.assign({
              PATH: process_1.env.PATH,
              "PP_TOOLS_AUTOMATION_AGENT": agent
            }, process2.env) }, options));
            const outputLineReader = readline.createInterface({ input: cp.stdout });
            outputLineReader.on("line", logOutputFactory(logger.log));
            const errorLineReader = readline.createInterface({ input: cp.stderr });
            errorLineReader.on("line", logOutputFactory(logger.error));
            function logOutputFactory(logFunction) {
              return (line) => {
                allOutput.push(line);
                logFunction(line);
              };
            }
            cp.on("error", (error) => {
              logger.error(`error: ${error}`);
              reject(new RunnerError(1, allOutput.join(os_1.EOL)));
              closeAllReaders(outputLineReader, errorLineReader);
              destroyOutputStreams(cp);
            });
            cp.on("exit", (code) => {
              if (code === 0) {
                resolve(allOutput);
              } else {
                logger.error(`error: ${code}`);
                reject(new RunnerError(code, allOutput.join(os_1.EOL)));
              }
              closeAllReaders(outputLineReader, errorLineReader);
              destroyOutputStreams(cp);
            });
          });
        });
      };
      function closeAllReaders(outputLineReader, errorLineReader) {
        outputLineReader === null || outputLineReader === void 0 ? void 0 : outputLineReader.close();
        errorLineReader === null || errorLineReader === void 0 ? void 0 : errorLineReader.close();
      }
      function destroyOutputStreams(cp) {
        var _a, _b;
        if (!cp) {
          return;
        }
        (_a = cp.stdout) === null || _a === void 0 ? void 0 : _a.destroy();
        (_b = cp.stderr) === null || _b === void 0 ? void 0 : _b.destroy();
      }
      function logInitialization(...args) {
        logger.debug(`command: ${commandPath}, first arg of ${args.length}: ${args.length ? args[0] : "<none>"}`);
      }
    }
    exports2.createCommandRunner = createCommandRunner;
    var RunnerError = class extends Error {
      constructor(exitCode, message) {
        super(message);
        this.exitCode = exitCode;
      }
    };
    exports2.RunnerError = RunnerError;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/pac/createPacRunner.js
var require_createPacRunner = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/pac/createPacRunner.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var os_1 = require("os");
    var path_1 = require("path");
    var CommandRunner_1 = require_CommandRunner();
    function createPacRunner({ workingDir, runnersDir, logger, agent }) {
      return (0, CommandRunner_1.createCommandRunner)(workingDir, (0, os_1.platform)() === "win32" ? (0, path_1.resolve)(runnersDir, "pac", "tools", "pac.exe") : (0, path_1.resolve)(runnersDir, "pac_linux", "tools", "pac"), logger, agent, void 0);
    }
    exports2.default = createPacRunner;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/exportSolution.js
var require_exportSolution = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/exportSolution.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.exportSolution = void 0;
    var InputValidator_1 = require_InputValidator();
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    var path = require("path");
    function exportSolution(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        function resolveFolder(folder) {
          if (!folder || typeof folder !== "string")
            return void 0;
          return path.resolve(runnerParameters.workingDir, folder);
        }
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateEnvironment)(pac, parameters.credentials, parameters.environmentUrl, logger);
          logger.log("The Authentication Result: " + authenticateResult);
          const pacArgs = ["solution", "export"];
          const validator = new InputValidator_1.InputValidator(host);
          validator.pushInput(pacArgs, "--name", parameters.name);
          validator.pushInput(pacArgs, "--path", parameters.path, resolveFolder);
          validator.pushInput(pacArgs, "--overwrite", parameters.overwrite);
          validator.pushInput(pacArgs, "--managed", parameters.managed);
          validator.pushInput(pacArgs, "--async", parameters.async);
          validator.pushInput(pacArgs, "--max-async-wait-time", parameters.maxAsyncWaitTimeInMin);
          const includeArgs = [];
          if (validator.getInput(parameters.autoNumberSettings) === "true") {
            includeArgs.push("autonumbering");
          }
          if (validator.getInput(parameters.calenderSettings) === "true") {
            includeArgs.push("calendar");
          }
          if (validator.getInput(parameters.customizationSettings) === "true") {
            includeArgs.push("customization");
          }
          if (validator.getInput(parameters.emailTrackingSettings) === "true") {
            includeArgs.push("emailtracking");
          }
          if (validator.getInput(parameters.externalApplicationSettings) === "true") {
            includeArgs.push("externalapplications");
          }
          if (validator.getInput(parameters.generalSettings) === "true") {
            includeArgs.push("general");
          }
          if (validator.getInput(parameters.isvConfig) === "true") {
            includeArgs.push("isvconfig");
          }
          if (validator.getInput(parameters.marketingSettings) === "true") {
            includeArgs.push("marketing");
          }
          if (validator.getInput(parameters.outlookSynchronizationSettings) === "true") {
            includeArgs.push("outlooksynchronization");
          }
          if (validator.getInput(parameters.relationshipRoles) === "true") {
            includeArgs.push("relationshiproles");
          }
          if (validator.getInput(parameters.sales) === "true") {
            includeArgs.push("sales");
          }
          if (includeArgs.length > 0) {
            pacArgs.push("--include", includeArgs.join(","));
          }
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("ExportSolution Action Result: " + pacResult);
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.exportSolution = exportSolution;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/whoAmI.js
var require_whoAmI = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/whoAmI.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.whoAmI = void 0;
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    function whoAmI(parameters, runnerParameters) {
      var _a;
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateEnvironment)(pac, parameters.credentials, parameters.environmentUrl, logger);
          logger.log("The Authentication Result: " + authenticateResult);
          const pacResult = yield pac("org", "who");
          logger.log("WhoAmI Action Result: " + pacResult);
          const envIdLabel = "Environment ID:";
          const envId = (_a = pacResult.filter((l) => l.length > 0).filter((l) => l.includes(envIdLabel))) === null || _a === void 0 ? void 0 : _a[0].split(envIdLabel)[1].trim();
          return {
            environmentId: envId
          };
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.whoAmI = whoAmI;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/importSolution.js
var require_importSolution = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/importSolution.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.importSolution = void 0;
    var InputValidator_1 = require_InputValidator();
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    var path = require("path");
    function importSolution(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        function resolveFolder(folder) {
          if (!folder || typeof folder !== "string")
            return void 0;
          return path.resolve(runnerParameters.workingDir, folder);
        }
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateEnvironment)(pac, parameters.credentials, parameters.environmentUrl, logger);
          logger.log("The Authentication Result: " + authenticateResult);
          const pacArgs = ["solution", "import"];
          const validator = new InputValidator_1.InputValidator(host);
          validator.pushInput(pacArgs, "--path", parameters.path, resolveFolder);
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
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.importSolution = importSolution;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/upgradeSolution.js
var require_upgradeSolution = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/upgradeSolution.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.upgradeSolution = void 0;
    var InputValidator_1 = require_InputValidator();
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    function upgradeSolution(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateEnvironment)(pac, parameters.credentials, parameters.environmentUrl, logger);
          logger.log("The Authentication Result: " + authenticateResult);
          const pacArgs = ["solution", "upgrade"];
          const validator = new InputValidator_1.InputValidator(host);
          validator.pushInput(pacArgs, "--solution-name", parameters.name);
          validator.pushInput(pacArgs, "--async", parameters.async);
          validator.pushInput(pacArgs, "--max-async-wait-time", parameters.maxAsyncWaitTimeInMin);
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("UpgradeSolution Action Result: " + pacResult);
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.upgradeSolution = upgradeSolution;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/deleteEnvironment.js
var require_deleteEnvironment = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/deleteEnvironment.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.deleteEnvironment = void 0;
    var InputValidator_1 = require_InputValidator();
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    function deleteEnvironment(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateAdmin)(pac, parameters.credentials, logger);
          logger.log("The Authentication Result: " + authenticateResult);
          const pacArgs = ["admin", "delete"];
          const validator = new InputValidator_1.InputValidator(host);
          validator.pushInput(pacArgs, "--environment", parameters.environment);
          validator.pushInput(pacArgs, "--url", parameters.environmentUrl);
          validator.pushInput(pacArgs, "--environment-id", parameters.environmentId);
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("DeleteEnvironment Action Result: " + pacResult);
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.deleteEnvironment = deleteEnvironment;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/backupEnvironment.js
var require_backupEnvironment = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/backupEnvironment.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.backupEnvironment = void 0;
    var InputValidator_1 = require_InputValidator();
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    function backupEnvironment(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateAdmin)(pac, parameters.credentials, logger);
          logger.log("The Authentication Result: " + authenticateResult);
          const pacArgs = ["admin", "backup"];
          const validator = new InputValidator_1.InputValidator(host);
          validator.pushInput(pacArgs, "--environment", parameters.environment);
          validator.pushInput(pacArgs, "--url", parameters.environmentUrl);
          validator.pushInput(pacArgs, "--environment-id", parameters.environmentId);
          validator.pushInput(pacArgs, "--label", parameters.backupLabel);
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("BackupEnvironment Action Result: " + pacResult);
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.backupEnvironment = backupEnvironment;
  }
});

// node_modules/balanced-match/index.js
var require_balanced_match = __commonJS({
  "node_modules/balanced-match/index.js"(exports2, module2) {
    "use strict";
    module2.exports = balanced;
    function balanced(a, b, str) {
      if (a instanceof RegExp)
        a = maybeMatch(a, str);
      if (b instanceof RegExp)
        b = maybeMatch(b, str);
      var r = range(a, b, str);
      return r && {
        start: r[0],
        end: r[1],
        pre: str.slice(0, r[0]),
        body: str.slice(r[0] + a.length, r[1]),
        post: str.slice(r[1] + b.length)
      };
    }
    function maybeMatch(reg, str) {
      var m = str.match(reg);
      return m ? m[0] : null;
    }
    balanced.range = range;
    function range(a, b, str) {
      var begs, beg, left, right, result;
      var ai = str.indexOf(a);
      var bi = str.indexOf(b, ai + 1);
      var i = ai;
      if (ai >= 0 && bi > 0) {
        if (a === b) {
          return [ai, bi];
        }
        begs = [];
        left = str.length;
        while (i >= 0 && !result) {
          if (i == ai) {
            begs.push(i);
            ai = str.indexOf(a, i + 1);
          } else if (begs.length == 1) {
            result = [begs.pop(), bi];
          } else {
            beg = begs.pop();
            if (beg < left) {
              left = beg;
              right = bi;
            }
            bi = str.indexOf(b, i + 1);
          }
          i = ai < bi && ai >= 0 ? ai : bi;
        }
        if (begs.length) {
          result = [left, right];
        }
      }
      return result;
    }
  }
});

// node_modules/glob/node_modules/brace-expansion/index.js
var require_brace_expansion = __commonJS({
  "node_modules/glob/node_modules/brace-expansion/index.js"(exports2, module2) {
    var balanced = require_balanced_match();
    module2.exports = expandTop;
    var escSlash = "\0SLASH" + Math.random() + "\0";
    var escOpen = "\0OPEN" + Math.random() + "\0";
    var escClose = "\0CLOSE" + Math.random() + "\0";
    var escComma = "\0COMMA" + Math.random() + "\0";
    var escPeriod = "\0PERIOD" + Math.random() + "\0";
    function numeric(str) {
      return parseInt(str, 10) == str ? parseInt(str, 10) : str.charCodeAt(0);
    }
    function escapeBraces(str) {
      return str.split("\\\\").join(escSlash).split("\\{").join(escOpen).split("\\}").join(escClose).split("\\,").join(escComma).split("\\.").join(escPeriod);
    }
    function unescapeBraces(str) {
      return str.split(escSlash).join("\\").split(escOpen).join("{").split(escClose).join("}").split(escComma).join(",").split(escPeriod).join(".");
    }
    function parseCommaParts(str) {
      if (!str)
        return [""];
      var parts = [];
      var m = balanced("{", "}", str);
      if (!m)
        return str.split(",");
      var pre = m.pre;
      var body = m.body;
      var post = m.post;
      var p = pre.split(",");
      p[p.length - 1] += "{" + body + "}";
      var postParts = parseCommaParts(post);
      if (post.length) {
        p[p.length - 1] += postParts.shift();
        p.push.apply(p, postParts);
      }
      parts.push.apply(parts, p);
      return parts;
    }
    function expandTop(str) {
      if (!str)
        return [];
      if (str.substr(0, 2) === "{}") {
        str = "\\{\\}" + str.substr(2);
      }
      return expand(escapeBraces(str), true).map(unescapeBraces);
    }
    function embrace(str) {
      return "{" + str + "}";
    }
    function isPadded(el) {
      return /^-?0\d/.test(el);
    }
    function lte(i, y) {
      return i <= y;
    }
    function gte(i, y) {
      return i >= y;
    }
    function expand(str, isTop) {
      var expansions = [];
      var m = balanced("{", "}", str);
      if (!m)
        return [str];
      var pre = m.pre;
      var post = m.post.length ? expand(m.post, false) : [""];
      if (/\$$/.test(m.pre)) {
        for (var k = 0; k < post.length; k++) {
          var expansion = pre + "{" + m.body + "}" + post[k];
          expansions.push(expansion);
        }
      } else {
        var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
        var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
        var isSequence = isNumericSequence || isAlphaSequence;
        var isOptions = m.body.indexOf(",") >= 0;
        if (!isSequence && !isOptions) {
          if (m.post.match(/,.*\}/)) {
            str = m.pre + "{" + m.body + escClose + m.post;
            return expand(str);
          }
          return [str];
        }
        var n;
        if (isSequence) {
          n = m.body.split(/\.\./);
        } else {
          n = parseCommaParts(m.body);
          if (n.length === 1) {
            n = expand(n[0], false).map(embrace);
            if (n.length === 1) {
              return post.map(function(p) {
                return m.pre + n[0] + p;
              });
            }
          }
        }
        var N;
        if (isSequence) {
          var x = numeric(n[0]);
          var y = numeric(n[1]);
          var width = Math.max(n[0].length, n[1].length);
          var incr = n.length == 3 ? Math.abs(numeric(n[2])) : 1;
          var test = lte;
          var reverse = y < x;
          if (reverse) {
            incr *= -1;
            test = gte;
          }
          var pad = n.some(isPadded);
          N = [];
          for (var i = x; test(i, y); i += incr) {
            var c;
            if (isAlphaSequence) {
              c = String.fromCharCode(i);
              if (c === "\\")
                c = "";
            } else {
              c = String(i);
              if (pad) {
                var need = width - c.length;
                if (need > 0) {
                  var z = new Array(need + 1).join("0");
                  if (i < 0)
                    c = "-" + z + c.slice(1);
                  else
                    c = z + c;
                }
              }
            }
            N.push(c);
          }
        } else {
          N = [];
          for (var j = 0; j < n.length; j++) {
            N.push.apply(N, expand(n[j], false));
          }
        }
        for (var j = 0; j < N.length; j++) {
          for (var k = 0; k < post.length; k++) {
            var expansion = pre + N[j] + post[k];
            if (!isTop || isSequence || expansion)
              expansions.push(expansion);
          }
        }
      }
      return expansions;
    }
  }
});

// node_modules/glob/node_modules/minimatch/dist/cjs/assert-valid-pattern.js
var require_assert_valid_pattern = __commonJS({
  "node_modules/glob/node_modules/minimatch/dist/cjs/assert-valid-pattern.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.assertValidPattern = void 0;
    var MAX_PATTERN_LENGTH = 1024 * 64;
    var assertValidPattern = (pattern) => {
      if (typeof pattern !== "string") {
        throw new TypeError("invalid pattern");
      }
      if (pattern.length > MAX_PATTERN_LENGTH) {
        throw new TypeError("pattern is too long");
      }
    };
    exports2.assertValidPattern = assertValidPattern;
  }
});

// node_modules/glob/node_modules/minimatch/dist/cjs/brace-expressions.js
var require_brace_expressions = __commonJS({
  "node_modules/glob/node_modules/minimatch/dist/cjs/brace-expressions.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.parseClass = void 0;
    var posixClasses = {
      "[:alnum:]": ["\\p{L}\\p{Nl}\\p{Nd}", true],
      "[:alpha:]": ["\\p{L}\\p{Nl}", true],
      "[:ascii:]": ["\\x00-\\x7f", false],
      "[:blank:]": ["\\p{Zs}\\t", true],
      "[:cntrl:]": ["\\p{Cc}", true],
      "[:digit:]": ["\\p{Nd}", true],
      "[:graph:]": ["\\p{Z}\\p{C}", true, true],
      "[:lower:]": ["\\p{Ll}", true],
      "[:print:]": ["\\p{C}", true],
      "[:punct:]": ["\\p{P}", true],
      "[:space:]": ["\\p{Z}\\t\\r\\n\\v\\f", true],
      "[:upper:]": ["\\p{Lu}", true],
      "[:word:]": ["\\p{L}\\p{Nl}\\p{Nd}\\p{Pc}", true],
      "[:xdigit:]": ["A-Fa-f0-9", false]
    };
    var braceEscape = (s) => s.replace(/[[\]\\-]/g, "\\$&");
    var regexpEscape = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    var rangesToString = (ranges) => ranges.join("");
    var parseClass = (glob, position) => {
      const pos = position;
      if (glob.charAt(pos) !== "[") {
        throw new Error("not in a brace expression");
      }
      const ranges = [];
      const negs = [];
      let i = pos + 1;
      let sawStart = false;
      let uflag = false;
      let escaping = false;
      let negate = false;
      let endPos = pos;
      let rangeStart = "";
      WHILE:
        while (i < glob.length) {
          const c = glob.charAt(i);
          if ((c === "!" || c === "^") && i === pos + 1) {
            negate = true;
            i++;
            continue;
          }
          if (c === "]" && sawStart && !escaping) {
            endPos = i + 1;
            break;
          }
          sawStart = true;
          if (c === "\\") {
            if (!escaping) {
              escaping = true;
              i++;
              continue;
            }
          }
          if (c === "[" && !escaping) {
            for (const [cls, [unip, u, neg]] of Object.entries(posixClasses)) {
              if (glob.startsWith(cls, i)) {
                if (rangeStart) {
                  return ["$.", false, glob.length - pos, true];
                }
                i += cls.length;
                if (neg)
                  negs.push(unip);
                else
                  ranges.push(unip);
                uflag = uflag || u;
                continue WHILE;
              }
            }
          }
          escaping = false;
          if (rangeStart) {
            if (c > rangeStart) {
              ranges.push(braceEscape(rangeStart) + "-" + braceEscape(c));
            } else if (c === rangeStart) {
              ranges.push(braceEscape(c));
            }
            rangeStart = "";
            i++;
            continue;
          }
          if (glob.startsWith("-]", i + 1)) {
            ranges.push(braceEscape(c + "-"));
            i += 2;
            continue;
          }
          if (glob.startsWith("-", i + 1)) {
            rangeStart = c;
            i += 2;
            continue;
          }
          ranges.push(braceEscape(c));
          i++;
        }
      if (endPos < i) {
        return ["", false, 0, false];
      }
      if (!ranges.length && !negs.length) {
        return ["$.", false, glob.length - pos, true];
      }
      if (negs.length === 0 && ranges.length === 1 && /^\\?.$/.test(ranges[0]) && !negate) {
        const r = ranges[0].length === 2 ? ranges[0].slice(-1) : ranges[0];
        return [regexpEscape(r), false, endPos - pos, false];
      }
      const sranges = "[" + (negate ? "^" : "") + rangesToString(ranges) + "]";
      const snegs = "[" + (negate ? "" : "^") + rangesToString(negs) + "]";
      const comb = ranges.length && negs.length ? "(" + sranges + "|" + snegs + ")" : ranges.length ? sranges : snegs;
      return [comb, uflag, endPos - pos, true];
    };
    exports2.parseClass = parseClass;
  }
});

// node_modules/glob/node_modules/minimatch/dist/cjs/unescape.js
var require_unescape = __commonJS({
  "node_modules/glob/node_modules/minimatch/dist/cjs/unescape.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.unescape = void 0;
    var unescape2 = (s, { windowsPathsNoEscape = false } = {}) => {
      return windowsPathsNoEscape ? s.replace(/\[([^\/\\])\]/g, "$1") : s.replace(/((?!\\).|^)\[([^\/\\])\]/g, "$1$2").replace(/\\([^\/])/g, "$1");
    };
    exports2.unescape = unescape2;
  }
});

// node_modules/glob/node_modules/minimatch/dist/cjs/ast.js
var require_ast = __commonJS({
  "node_modules/glob/node_modules/minimatch/dist/cjs/ast.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.AST = void 0;
    var brace_expressions_js_1 = require_brace_expressions();
    var unescape_js_1 = require_unescape();
    var types = /* @__PURE__ */ new Set(["!", "?", "+", "*", "@"]);
    var isExtglobType = (c) => types.has(c);
    var startNoTraversal = "(?!\\.\\.?(?:$|/))";
    var startNoDot = "(?!\\.)";
    var addPatternStart = /* @__PURE__ */ new Set(["[", "."]);
    var justDots = /* @__PURE__ */ new Set(["..", "."]);
    var reSpecials = new Set("().*{}+?[]^$\\!");
    var regExpEscape = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    var qmark = "[^/]";
    var star = qmark + "*?";
    var starNoEmpty = qmark + "+?";
    var _root, _hasMagic, _uflag, _parts, _parent, _parentIndex, _negs, _filledNegs, _options, _toString, _emptyExt, _fillNegs, fillNegs_fn, _parseAST, parseAST_fn, _parseGlob, parseGlob_fn;
    var _AST = class {
      constructor(type, parent, options = {}) {
        __privateAdd(this, _fillNegs);
        __publicField(this, "type");
        __privateAdd(this, _root, void 0);
        __privateAdd(this, _hasMagic, void 0);
        __privateAdd(this, _uflag, false);
        __privateAdd(this, _parts, []);
        __privateAdd(this, _parent, void 0);
        __privateAdd(this, _parentIndex, void 0);
        __privateAdd(this, _negs, void 0);
        __privateAdd(this, _filledNegs, false);
        __privateAdd(this, _options, void 0);
        __privateAdd(this, _toString, void 0);
        // set to true if it's an extglob with no children
        // (which really means one child of '')
        __privateAdd(this, _emptyExt, false);
        this.type = type;
        if (type)
          __privateSet(this, _hasMagic, true);
        __privateSet(this, _parent, parent);
        __privateSet(this, _root, __privateGet(this, _parent) ? __privateGet(__privateGet(this, _parent), _root) : this);
        __privateSet(this, _options, __privateGet(this, _root) === this ? options : __privateGet(__privateGet(this, _root), _options));
        __privateSet(this, _negs, __privateGet(this, _root) === this ? [] : __privateGet(__privateGet(this, _root), _negs));
        if (type === "!" && !__privateGet(__privateGet(this, _root), _filledNegs))
          __privateGet(this, _negs).push(this);
        __privateSet(this, _parentIndex, __privateGet(this, _parent) ? __privateGet(__privateGet(this, _parent), _parts).length : 0);
      }
      get hasMagic() {
        if (__privateGet(this, _hasMagic) !== void 0)
          return __privateGet(this, _hasMagic);
        for (const p of __privateGet(this, _parts)) {
          if (typeof p === "string")
            continue;
          if (p.type || p.hasMagic)
            return __privateSet(this, _hasMagic, true);
        }
        return __privateGet(this, _hasMagic);
      }
      // reconstructs the pattern
      toString() {
        if (__privateGet(this, _toString) !== void 0)
          return __privateGet(this, _toString);
        if (!this.type) {
          return __privateSet(this, _toString, __privateGet(this, _parts).map((p) => String(p)).join(""));
        } else {
          return __privateSet(this, _toString, this.type + "(" + __privateGet(this, _parts).map((p) => String(p)).join("|") + ")");
        }
      }
      push(...parts) {
        for (const p of parts) {
          if (p === "")
            continue;
          if (typeof p !== "string" && !(p instanceof _AST && __privateGet(p, _parent) === this)) {
            throw new Error("invalid part: " + p);
          }
          __privateGet(this, _parts).push(p);
        }
      }
      toJSON() {
        const ret = this.type === null ? __privateGet(this, _parts).slice().map((p) => typeof p === "string" ? p : p.toJSON()) : [this.type, ...__privateGet(this, _parts).map((p) => p.toJSON())];
        if (this.isStart() && !this.type)
          ret.unshift([]);
        if (this.isEnd() && (this === __privateGet(this, _root) || __privateGet(__privateGet(this, _root), _filledNegs) && __privateGet(this, _parent)?.type === "!")) {
          ret.push({});
        }
        return ret;
      }
      isStart() {
        if (__privateGet(this, _root) === this)
          return true;
        if (!__privateGet(this, _parent)?.isStart())
          return false;
        if (__privateGet(this, _parentIndex) === 0)
          return true;
        const p = __privateGet(this, _parent);
        for (let i = 0; i < __privateGet(this, _parentIndex); i++) {
          const pp = __privateGet(p, _parts)[i];
          if (!(pp instanceof _AST && pp.type === "!")) {
            return false;
          }
        }
        return true;
      }
      isEnd() {
        if (__privateGet(this, _root) === this)
          return true;
        if (__privateGet(this, _parent)?.type === "!")
          return true;
        if (!__privateGet(this, _parent)?.isEnd())
          return false;
        if (!this.type)
          return __privateGet(this, _parent)?.isEnd();
        const pl = __privateGet(this, _parent) ? __privateGet(__privateGet(this, _parent), _parts).length : 0;
        return __privateGet(this, _parentIndex) === pl - 1;
      }
      copyIn(part) {
        if (typeof part === "string")
          this.push(part);
        else
          this.push(part.clone(this));
      }
      clone(parent) {
        const c = new _AST(this.type, parent);
        for (const p of __privateGet(this, _parts)) {
          c.copyIn(p);
        }
        return c;
      }
      static fromGlob(pattern, options = {}) {
        var _a;
        const ast = new _AST(null, void 0, options);
        __privateMethod(_a = _AST, _parseAST, parseAST_fn).call(_a, pattern, ast, 0, options);
        return ast;
      }
      // returns the regular expression if there's magic, or the unescaped
      // string if not.
      toMMPattern() {
        if (this !== __privateGet(this, _root))
          return __privateGet(this, _root).toMMPattern();
        const glob = this.toString();
        const [re, body, hasMagic, uflag] = this.toRegExpSource();
        const anyMagic = hasMagic || __privateGet(this, _hasMagic) || __privateGet(this, _options).nocase && !__privateGet(this, _options).nocaseMagicOnly && glob.toUpperCase() !== glob.toLowerCase();
        if (!anyMagic) {
          return body;
        }
        const flags = (__privateGet(this, _options).nocase ? "i" : "") + (uflag ? "u" : "");
        return Object.assign(new RegExp(`^${re}$`, flags), {
          _src: re,
          _glob: glob
        });
      }
      // returns the string match, the regexp source, whether there's magic
      // in the regexp (so a regular expression is required) and whether or
      // not the uflag is needed for the regular expression (for posix classes)
      // TODO: instead of injecting the start/end at this point, just return
      // the BODY of the regexp, along with the start/end portions suitable
      // for binding the start/end in either a joined full-path makeRe context
      // (where we bind to (^|/), or a standalone matchPart context (where
      // we bind to ^, and not /).  Otherwise slashes get duped!
      //
      // In part-matching mode, the start is:
      // - if not isStart: nothing
      // - if traversal possible, but not allowed: ^(?!\.\.?$)
      // - if dots allowed or not possible: ^
      // - if dots possible and not allowed: ^(?!\.)
      // end is:
      // - if not isEnd(): nothing
      // - else: $
      //
      // In full-path matching mode, we put the slash at the START of the
      // pattern, so start is:
      // - if first pattern: same as part-matching mode
      // - if not isStart(): nothing
      // - if traversal possible, but not allowed: /(?!\.\.?(?:$|/))
      // - if dots allowed or not possible: /
      // - if dots possible and not allowed: /(?!\.)
      // end is:
      // - if last pattern, same as part-matching mode
      // - else nothing
      //
      // Always put the (?:$|/) on negated tails, though, because that has to be
      // there to bind the end of the negated pattern portion, and it's easier to
      // just stick it in now rather than try to inject it later in the middle of
      // the pattern.
      //
      // We can just always return the same end, and leave it up to the caller
      // to know whether it's going to be used joined or in parts.
      // And, if the start is adjusted slightly, can do the same there:
      // - if not isStart: nothing
      // - if traversal possible, but not allowed: (?:/|^)(?!\.\.?$)
      // - if dots allowed or not possible: (?:/|^)
      // - if dots possible and not allowed: (?:/|^)(?!\.)
      //
      // But it's better to have a simpler binding without a conditional, for
      // performance, so probably better to return both start options.
      //
      // Then the caller just ignores the end if it's not the first pattern,
      // and the start always gets applied.
      //
      // But that's always going to be $ if it's the ending pattern, or nothing,
      // so the caller can just attach $ at the end of the pattern when building.
      //
      // So the todo is:
      // - better detect what kind of start is needed
      // - return both flavors of starting pattern
      // - attach $ at the end of the pattern when creating the actual RegExp
      //
      // Ah, but wait, no, that all only applies to the root when the first pattern
      // is not an extglob. If the first pattern IS an extglob, then we need all
      // that dot prevention biz to live in the extglob portions, because eg
      // +(*|.x*) can match .xy but not .yx.
      //
      // So, return the two flavors if it's #root and the first child is not an
      // AST, otherwise leave it to the child AST to handle it, and there,
      // use the (?:^|/) style of start binding.
      //
      // Even simplified further:
      // - Since the start for a join is eg /(?!\.) and the start for a part
      // is ^(?!\.), we can just prepend (?!\.) to the pattern (either root
      // or start or whatever) and prepend ^ or / at the Regexp construction.
      toRegExpSource() {
        if (__privateGet(this, _root) === this)
          __privateMethod(this, _fillNegs, fillNegs_fn).call(this);
        if (!this.type) {
          const noEmpty = this.isStart() && this.isEnd();
          const src = __privateGet(this, _parts).map((p) => {
            var _a;
            const [re, _, hasMagic, uflag] = typeof p === "string" ? __privateMethod(_a = _AST, _parseGlob, parseGlob_fn).call(_a, p, __privateGet(this, _hasMagic), noEmpty) : p.toRegExpSource();
            __privateSet(this, _hasMagic, __privateGet(this, _hasMagic) || hasMagic);
            __privateSet(this, _uflag, __privateGet(this, _uflag) || uflag);
            return re;
          }).join("");
          let start2 = "";
          if (this.isStart()) {
            if (typeof __privateGet(this, _parts)[0] === "string") {
              const dotTravAllowed = __privateGet(this, _parts).length === 1 && justDots.has(__privateGet(this, _parts)[0]);
              if (!dotTravAllowed) {
                const aps = addPatternStart;
                const needNoTrav = (
                  // dots are allowed, and the pattern starts with [ or .
                  __privateGet(this, _options).dot && aps.has(src.charAt(0)) || // the pattern starts with \., and then [ or .
                  src.startsWith("\\.") && aps.has(src.charAt(2)) || // the pattern starts with \.\., and then [ or .
                  src.startsWith("\\.\\.") && aps.has(src.charAt(4))
                );
                const needNoDot = !__privateGet(this, _options).dot && aps.has(src.charAt(0));
                start2 = needNoTrav ? startNoTraversal : needNoDot ? startNoDot : "";
              }
            }
          }
          let end = "";
          if (this.isEnd() && __privateGet(__privateGet(this, _root), _filledNegs) && __privateGet(this, _parent)?.type === "!") {
            end = "(?:$|\\/)";
          }
          const final2 = start2 + src + end;
          return [
            final2,
            (0, unescape_js_1.unescape)(src),
            __privateSet(this, _hasMagic, !!__privateGet(this, _hasMagic)),
            __privateGet(this, _uflag)
          ];
        }
        const start = this.type === "!" ? "(?:(?!(?:" : "(?:";
        const body = __privateGet(this, _parts).map((p) => {
          if (typeof p === "string") {
            throw new Error("string type in extglob ast??");
          }
          const [re, _, _hasMagic2, uflag] = p.toRegExpSource();
          __privateSet(this, _uflag, __privateGet(this, _uflag) || uflag);
          return re;
        }).filter((p) => !(this.isStart() && this.isEnd()) || !!p).join("|");
        if (this.isStart() && this.isEnd() && !body && this.type !== "!") {
          const s = this.toString();
          __privateSet(this, _parts, [s]);
          this.type = null;
          __privateSet(this, _hasMagic, void 0);
          return [s, (0, unescape_js_1.unescape)(this.toString()), false, false];
        }
        let final = "";
        if (this.type === "!" && __privateGet(this, _emptyExt)) {
          final = (this.isStart() && !__privateGet(this, _options).dot ? startNoDot : "") + starNoEmpty;
        } else {
          const close = this.type === "!" ? (
            // !() must match something,but !(x) can match ''
            "))" + (this.isStart() && !__privateGet(this, _options).dot ? startNoDot : "") + star + ")"
          ) : this.type === "@" ? ")" : `)${this.type}`;
          final = start + body + close;
        }
        return [
          final,
          (0, unescape_js_1.unescape)(body),
          __privateSet(this, _hasMagic, !!__privateGet(this, _hasMagic)),
          __privateGet(this, _uflag)
        ];
      }
    };
    var AST = _AST;
    _root = new WeakMap();
    _hasMagic = new WeakMap();
    _uflag = new WeakMap();
    _parts = new WeakMap();
    _parent = new WeakMap();
    _parentIndex = new WeakMap();
    _negs = new WeakMap();
    _filledNegs = new WeakMap();
    _options = new WeakMap();
    _toString = new WeakMap();
    _emptyExt = new WeakMap();
    _fillNegs = new WeakSet();
    fillNegs_fn = function() {
      if (this !== __privateGet(this, _root))
        throw new Error("should only call on root");
      if (__privateGet(this, _filledNegs))
        return this;
      this.toString();
      __privateSet(this, _filledNegs, true);
      let n;
      while (n = __privateGet(this, _negs).pop()) {
        if (n.type !== "!")
          continue;
        let p = n;
        let pp = __privateGet(p, _parent);
        while (pp) {
          for (let i = __privateGet(p, _parentIndex) + 1; !pp.type && i < __privateGet(pp, _parts).length; i++) {
            for (const part of __privateGet(n, _parts)) {
              if (typeof part === "string") {
                throw new Error("string part in extglob AST??");
              }
              part.copyIn(__privateGet(pp, _parts)[i]);
            }
          }
          p = pp;
          pp = __privateGet(p, _parent);
        }
      }
      return this;
    };
    _parseAST = new WeakSet();
    parseAST_fn = function(str, ast, pos, opt) {
      var _a, _b;
      let escaping = false;
      let inBrace = false;
      let braceStart = -1;
      let braceNeg = false;
      if (ast.type === null) {
        let i2 = pos;
        let acc2 = "";
        while (i2 < str.length) {
          const c = str.charAt(i2++);
          if (escaping || c === "\\") {
            escaping = !escaping;
            acc2 += c;
            continue;
          }
          if (inBrace) {
            if (i2 === braceStart + 1) {
              if (c === "^" || c === "!") {
                braceNeg = true;
              }
            } else if (c === "]" && !(i2 === braceStart + 2 && braceNeg)) {
              inBrace = false;
            }
            acc2 += c;
            continue;
          } else if (c === "[") {
            inBrace = true;
            braceStart = i2;
            braceNeg = false;
            acc2 += c;
            continue;
          }
          if (!opt.noext && isExtglobType(c) && str.charAt(i2) === "(") {
            ast.push(acc2);
            acc2 = "";
            const ext = new _AST(c, ast);
            i2 = __privateMethod(_a = _AST, _parseAST, parseAST_fn).call(_a, str, ext, i2, opt);
            ast.push(ext);
            continue;
          }
          acc2 += c;
        }
        ast.push(acc2);
        return i2;
      }
      let i = pos + 1;
      let part = new _AST(null, ast);
      const parts = [];
      let acc = "";
      while (i < str.length) {
        const c = str.charAt(i++);
        if (escaping || c === "\\") {
          escaping = !escaping;
          acc += c;
          continue;
        }
        if (inBrace) {
          if (i === braceStart + 1) {
            if (c === "^" || c === "!") {
              braceNeg = true;
            }
          } else if (c === "]" && !(i === braceStart + 2 && braceNeg)) {
            inBrace = false;
          }
          acc += c;
          continue;
        } else if (c === "[") {
          inBrace = true;
          braceStart = i;
          braceNeg = false;
          acc += c;
          continue;
        }
        if (isExtglobType(c) && str.charAt(i) === "(") {
          part.push(acc);
          acc = "";
          const ext = new _AST(c, part);
          part.push(ext);
          i = __privateMethod(_b = _AST, _parseAST, parseAST_fn).call(_b, str, ext, i, opt);
          continue;
        }
        if (c === "|") {
          part.push(acc);
          acc = "";
          parts.push(part);
          part = new _AST(null, ast);
          continue;
        }
        if (c === ")") {
          if (acc === "" && __privateGet(ast, _parts).length === 0) {
            __privateSet(ast, _emptyExt, true);
          }
          part.push(acc);
          acc = "";
          ast.push(...parts, part);
          return i;
        }
        acc += c;
      }
      ast.type = null;
      __privateSet(ast, _hasMagic, void 0);
      __privateSet(ast, _parts, [str.substring(pos - 1)]);
      return i;
    };
    _parseGlob = new WeakSet();
    parseGlob_fn = function(glob, hasMagic, noEmpty = false) {
      let escaping = false;
      let re = "";
      let uflag = false;
      for (let i = 0; i < glob.length; i++) {
        const c = glob.charAt(i);
        if (escaping) {
          escaping = false;
          re += (reSpecials.has(c) ? "\\" : "") + c;
          continue;
        }
        if (c === "\\") {
          if (i === glob.length - 1) {
            re += "\\\\";
          } else {
            escaping = true;
          }
          continue;
        }
        if (c === "[") {
          const [src, needUflag, consumed, magic] = (0, brace_expressions_js_1.parseClass)(glob, i);
          if (consumed) {
            re += src;
            uflag = uflag || needUflag;
            i += consumed - 1;
            hasMagic = hasMagic || magic;
            continue;
          }
        }
        if (c === "*") {
          if (noEmpty && glob === "*")
            re += starNoEmpty;
          else
            re += star;
          hasMagic = true;
          continue;
        }
        if (c === "?") {
          re += qmark;
          hasMagic = true;
          continue;
        }
        re += regExpEscape(c);
      }
      return [re, (0, unescape_js_1.unescape)(glob), !!hasMagic, uflag];
    };
    __privateAdd(AST, _parseAST);
    __privateAdd(AST, _parseGlob);
    exports2.AST = AST;
  }
});

// node_modules/glob/node_modules/minimatch/dist/cjs/escape.js
var require_escape = __commonJS({
  "node_modules/glob/node_modules/minimatch/dist/cjs/escape.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.escape = void 0;
    var escape = (s, { windowsPathsNoEscape = false } = {}) => {
      return windowsPathsNoEscape ? s.replace(/[?*()[\]]/g, "[$&]") : s.replace(/[?*()[\]\\]/g, "\\$&");
    };
    exports2.escape = escape;
  }
});

// node_modules/glob/node_modules/minimatch/dist/cjs/index.js
var require_cjs = __commonJS({
  "node_modules/glob/node_modules/minimatch/dist/cjs/index.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.unescape = exports2.escape = exports2.AST = exports2.Minimatch = exports2.match = exports2.makeRe = exports2.braceExpand = exports2.defaults = exports2.filter = exports2.GLOBSTAR = exports2.sep = exports2.minimatch = void 0;
    var brace_expansion_1 = __importDefault(require_brace_expansion());
    var assert_valid_pattern_js_1 = require_assert_valid_pattern();
    var ast_js_1 = require_ast();
    var escape_js_1 = require_escape();
    var unescape_js_1 = require_unescape();
    var minimatch = (p, pattern, options = {}) => {
      (0, assert_valid_pattern_js_1.assertValidPattern)(pattern);
      if (!options.nocomment && pattern.charAt(0) === "#") {
        return false;
      }
      return new Minimatch(pattern, options).match(p);
    };
    exports2.minimatch = minimatch;
    var starDotExtRE = /^\*+([^+@!?\*\[\(]*)$/;
    var starDotExtTest = (ext2) => (f) => !f.startsWith(".") && f.endsWith(ext2);
    var starDotExtTestDot = (ext2) => (f) => f.endsWith(ext2);
    var starDotExtTestNocase = (ext2) => {
      ext2 = ext2.toLowerCase();
      return (f) => !f.startsWith(".") && f.toLowerCase().endsWith(ext2);
    };
    var starDotExtTestNocaseDot = (ext2) => {
      ext2 = ext2.toLowerCase();
      return (f) => f.toLowerCase().endsWith(ext2);
    };
    var starDotStarRE = /^\*+\.\*+$/;
    var starDotStarTest = (f) => !f.startsWith(".") && f.includes(".");
    var starDotStarTestDot = (f) => f !== "." && f !== ".." && f.includes(".");
    var dotStarRE = /^\.\*+$/;
    var dotStarTest = (f) => f !== "." && f !== ".." && f.startsWith(".");
    var starRE = /^\*+$/;
    var starTest = (f) => f.length !== 0 && !f.startsWith(".");
    var starTestDot = (f) => f.length !== 0 && f !== "." && f !== "..";
    var qmarksRE = /^\?+([^+@!?\*\[\(]*)?$/;
    var qmarksTestNocase = ([$0, ext2 = ""]) => {
      const noext = qmarksTestNoExt([$0]);
      if (!ext2)
        return noext;
      ext2 = ext2.toLowerCase();
      return (f) => noext(f) && f.toLowerCase().endsWith(ext2);
    };
    var qmarksTestNocaseDot = ([$0, ext2 = ""]) => {
      const noext = qmarksTestNoExtDot([$0]);
      if (!ext2)
        return noext;
      ext2 = ext2.toLowerCase();
      return (f) => noext(f) && f.toLowerCase().endsWith(ext2);
    };
    var qmarksTestDot = ([$0, ext2 = ""]) => {
      const noext = qmarksTestNoExtDot([$0]);
      return !ext2 ? noext : (f) => noext(f) && f.endsWith(ext2);
    };
    var qmarksTest = ([$0, ext2 = ""]) => {
      const noext = qmarksTestNoExt([$0]);
      return !ext2 ? noext : (f) => noext(f) && f.endsWith(ext2);
    };
    var qmarksTestNoExt = ([$0]) => {
      const len = $0.length;
      return (f) => f.length === len && !f.startsWith(".");
    };
    var qmarksTestNoExtDot = ([$0]) => {
      const len = $0.length;
      return (f) => f.length === len && f !== "." && f !== "..";
    };
    var defaultPlatform = typeof process === "object" && process ? typeof process.env === "object" && process.env && process.env.__MINIMATCH_TESTING_PLATFORM__ || process.platform : "posix";
    var path = {
      win32: { sep: "\\" },
      posix: { sep: "/" }
    };
    exports2.sep = defaultPlatform === "win32" ? path.win32.sep : path.posix.sep;
    exports2.minimatch.sep = exports2.sep;
    exports2.GLOBSTAR = Symbol("globstar **");
    exports2.minimatch.GLOBSTAR = exports2.GLOBSTAR;
    var qmark = "[^/]";
    var star = qmark + "*?";
    var twoStarDot = "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?";
    var twoStarNoDot = "(?:(?!(?:\\/|^)\\.).)*?";
    var filter = (pattern, options = {}) => (p) => (0, exports2.minimatch)(p, pattern, options);
    exports2.filter = filter;
    exports2.minimatch.filter = exports2.filter;
    var ext = (a, b = {}) => Object.assign({}, a, b);
    var defaults = (def) => {
      if (!def || typeof def !== "object" || !Object.keys(def).length) {
        return exports2.minimatch;
      }
      const orig = exports2.minimatch;
      const m = (p, pattern, options = {}) => orig(p, pattern, ext(def, options));
      return Object.assign(m, {
        Minimatch: class Minimatch extends orig.Minimatch {
          constructor(pattern, options = {}) {
            super(pattern, ext(def, options));
          }
          static defaults(options) {
            return orig.defaults(ext(def, options)).Minimatch;
          }
        },
        AST: class AST extends orig.AST {
          /* c8 ignore start */
          constructor(type, parent, options = {}) {
            super(type, parent, ext(def, options));
          }
          /* c8 ignore stop */
          static fromGlob(pattern, options = {}) {
            return orig.AST.fromGlob(pattern, ext(def, options));
          }
        },
        unescape: (s, options = {}) => orig.unescape(s, ext(def, options)),
        escape: (s, options = {}) => orig.escape(s, ext(def, options)),
        filter: (pattern, options = {}) => orig.filter(pattern, ext(def, options)),
        defaults: (options) => orig.defaults(ext(def, options)),
        makeRe: (pattern, options = {}) => orig.makeRe(pattern, ext(def, options)),
        braceExpand: (pattern, options = {}) => orig.braceExpand(pattern, ext(def, options)),
        match: (list, pattern, options = {}) => orig.match(list, pattern, ext(def, options)),
        sep: orig.sep,
        GLOBSTAR: exports2.GLOBSTAR
      });
    };
    exports2.defaults = defaults;
    exports2.minimatch.defaults = exports2.defaults;
    var braceExpand = (pattern, options = {}) => {
      (0, assert_valid_pattern_js_1.assertValidPattern)(pattern);
      if (options.nobrace || !/\{(?:(?!\{).)*\}/.test(pattern)) {
        return [pattern];
      }
      return (0, brace_expansion_1.default)(pattern);
    };
    exports2.braceExpand = braceExpand;
    exports2.minimatch.braceExpand = exports2.braceExpand;
    var makeRe = (pattern, options = {}) => new Minimatch(pattern, options).makeRe();
    exports2.makeRe = makeRe;
    exports2.minimatch.makeRe = exports2.makeRe;
    var match = (list, pattern, options = {}) => {
      const mm = new Minimatch(pattern, options);
      list = list.filter((f) => mm.match(f));
      if (mm.options.nonull && !list.length) {
        list.push(pattern);
      }
      return list;
    };
    exports2.match = match;
    exports2.minimatch.match = exports2.match;
    var globMagic = /[?*]|[+@!]\(.*?\)|\[|\]/;
    var regExpEscape = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    var Minimatch = class {
      options;
      set;
      pattern;
      windowsPathsNoEscape;
      nonegate;
      negate;
      comment;
      empty;
      preserveMultipleSlashes;
      partial;
      globSet;
      globParts;
      nocase;
      isWindows;
      platform;
      windowsNoMagicRoot;
      regexp;
      constructor(pattern, options = {}) {
        (0, assert_valid_pattern_js_1.assertValidPattern)(pattern);
        options = options || {};
        this.options = options;
        this.pattern = pattern;
        this.platform = options.platform || defaultPlatform;
        this.isWindows = this.platform === "win32";
        this.windowsPathsNoEscape = !!options.windowsPathsNoEscape || options.allowWindowsEscape === false;
        if (this.windowsPathsNoEscape) {
          this.pattern = this.pattern.replace(/\\/g, "/");
        }
        this.preserveMultipleSlashes = !!options.preserveMultipleSlashes;
        this.regexp = null;
        this.negate = false;
        this.nonegate = !!options.nonegate;
        this.comment = false;
        this.empty = false;
        this.partial = !!options.partial;
        this.nocase = !!this.options.nocase;
        this.windowsNoMagicRoot = options.windowsNoMagicRoot !== void 0 ? options.windowsNoMagicRoot : !!(this.isWindows && this.nocase);
        this.globSet = [];
        this.globParts = [];
        this.set = [];
        this.make();
      }
      hasMagic() {
        if (this.options.magicalBraces && this.set.length > 1) {
          return true;
        }
        for (const pattern of this.set) {
          for (const part of pattern) {
            if (typeof part !== "string")
              return true;
          }
        }
        return false;
      }
      debug(..._) {
      }
      make() {
        const pattern = this.pattern;
        const options = this.options;
        if (!options.nocomment && pattern.charAt(0) === "#") {
          this.comment = true;
          return;
        }
        if (!pattern) {
          this.empty = true;
          return;
        }
        this.parseNegate();
        this.globSet = [...new Set(this.braceExpand())];
        if (options.debug) {
          this.debug = (...args) => console.error(...args);
        }
        this.debug(this.pattern, this.globSet);
        const rawGlobParts = this.globSet.map((s) => this.slashSplit(s));
        this.globParts = this.preprocess(rawGlobParts);
        this.debug(this.pattern, this.globParts);
        let set = this.globParts.map((s, _, __) => {
          if (this.isWindows && this.windowsNoMagicRoot) {
            const isUNC = s[0] === "" && s[1] === "" && (s[2] === "?" || !globMagic.test(s[2])) && !globMagic.test(s[3]);
            const isDrive = /^[a-z]:/i.test(s[0]);
            if (isUNC) {
              return [...s.slice(0, 4), ...s.slice(4).map((ss) => this.parse(ss))];
            } else if (isDrive) {
              return [s[0], ...s.slice(1).map((ss) => this.parse(ss))];
            }
          }
          return s.map((ss) => this.parse(ss));
        });
        this.debug(this.pattern, set);
        this.set = set.filter((s) => s.indexOf(false) === -1);
        if (this.isWindows) {
          for (let i = 0; i < this.set.length; i++) {
            const p = this.set[i];
            if (p[0] === "" && p[1] === "" && this.globParts[i][2] === "?" && typeof p[3] === "string" && /^[a-z]:$/i.test(p[3])) {
              p[2] = "?";
            }
          }
        }
        this.debug(this.pattern, this.set);
      }
      // various transforms to equivalent pattern sets that are
      // faster to process in a filesystem walk.  The goal is to
      // eliminate what we can, and push all ** patterns as far
      // to the right as possible, even if it increases the number
      // of patterns that we have to process.
      preprocess(globParts) {
        if (this.options.noglobstar) {
          for (let i = 0; i < globParts.length; i++) {
            for (let j = 0; j < globParts[i].length; j++) {
              if (globParts[i][j] === "**") {
                globParts[i][j] = "*";
              }
            }
          }
        }
        const { optimizationLevel = 1 } = this.options;
        if (optimizationLevel >= 2) {
          globParts = this.firstPhasePreProcess(globParts);
          globParts = this.secondPhasePreProcess(globParts);
        } else if (optimizationLevel >= 1) {
          globParts = this.levelOneOptimize(globParts);
        } else {
          globParts = this.adjascentGlobstarOptimize(globParts);
        }
        return globParts;
      }
      // just get rid of adjascent ** portions
      adjascentGlobstarOptimize(globParts) {
        return globParts.map((parts) => {
          let gs = -1;
          while (-1 !== (gs = parts.indexOf("**", gs + 1))) {
            let i = gs;
            while (parts[i + 1] === "**") {
              i++;
            }
            if (i !== gs) {
              parts.splice(gs, i - gs);
            }
          }
          return parts;
        });
      }
      // get rid of adjascent ** and resolve .. portions
      levelOneOptimize(globParts) {
        return globParts.map((parts) => {
          parts = parts.reduce((set, part) => {
            const prev = set[set.length - 1];
            if (part === "**" && prev === "**") {
              return set;
            }
            if (part === "..") {
              if (prev && prev !== ".." && prev !== "." && prev !== "**") {
                set.pop();
                return set;
              }
            }
            set.push(part);
            return set;
          }, []);
          return parts.length === 0 ? [""] : parts;
        });
      }
      levelTwoFileOptimize(parts) {
        if (!Array.isArray(parts)) {
          parts = this.slashSplit(parts);
        }
        let didSomething = false;
        do {
          didSomething = false;
          if (!this.preserveMultipleSlashes) {
            for (let i = 1; i < parts.length - 1; i++) {
              const p = parts[i];
              if (i === 1 && p === "" && parts[0] === "")
                continue;
              if (p === "." || p === "") {
                didSomething = true;
                parts.splice(i, 1);
                i--;
              }
            }
            if (parts[0] === "." && parts.length === 2 && (parts[1] === "." || parts[1] === "")) {
              didSomething = true;
              parts.pop();
            }
          }
          let dd = 0;
          while (-1 !== (dd = parts.indexOf("..", dd + 1))) {
            const p = parts[dd - 1];
            if (p && p !== "." && p !== ".." && p !== "**") {
              didSomething = true;
              parts.splice(dd - 1, 2);
              dd -= 2;
            }
          }
        } while (didSomething);
        return parts.length === 0 ? [""] : parts;
      }
      // First phase: single-pattern processing
      // <pre> is 1 or more portions
      // <rest> is 1 or more portions
      // <p> is any portion other than ., .., '', or **
      // <e> is . or ''
      //
      // **/.. is *brutal* for filesystem walking performance, because
      // it effectively resets the recursive walk each time it occurs,
      // and ** cannot be reduced out by a .. pattern part like a regexp
      // or most strings (other than .., ., and '') can be.
      //
      // <pre>/**/../<p>/<p>/<rest> -> {<pre>/../<p>/<p>/<rest>,<pre>/**/<p>/<p>/<rest>}
      // <pre>/<e>/<rest> -> <pre>/<rest>
      // <pre>/<p>/../<rest> -> <pre>/<rest>
      // **/**/<rest> -> **/<rest>
      //
      // **/*/<rest> -> */**/<rest> <== not valid because ** doesn't follow
      // this WOULD be allowed if ** did follow symlinks, or * didn't
      firstPhasePreProcess(globParts) {
        let didSomething = false;
        do {
          didSomething = false;
          for (let parts of globParts) {
            let gs = -1;
            while (-1 !== (gs = parts.indexOf("**", gs + 1))) {
              let gss = gs;
              while (parts[gss + 1] === "**") {
                gss++;
              }
              if (gss > gs) {
                parts.splice(gs + 1, gss - gs);
              }
              let next = parts[gs + 1];
              const p = parts[gs + 2];
              const p2 = parts[gs + 3];
              if (next !== "..")
                continue;
              if (!p || p === "." || p === ".." || !p2 || p2 === "." || p2 === "..") {
                continue;
              }
              didSomething = true;
              parts.splice(gs, 1);
              const other = parts.slice(0);
              other[gs] = "**";
              globParts.push(other);
              gs--;
            }
            if (!this.preserveMultipleSlashes) {
              for (let i = 1; i < parts.length - 1; i++) {
                const p = parts[i];
                if (i === 1 && p === "" && parts[0] === "")
                  continue;
                if (p === "." || p === "") {
                  didSomething = true;
                  parts.splice(i, 1);
                  i--;
                }
              }
              if (parts[0] === "." && parts.length === 2 && (parts[1] === "." || parts[1] === "")) {
                didSomething = true;
                parts.pop();
              }
            }
            let dd = 0;
            while (-1 !== (dd = parts.indexOf("..", dd + 1))) {
              const p = parts[dd - 1];
              if (p && p !== "." && p !== ".." && p !== "**") {
                didSomething = true;
                const needDot = dd === 1 && parts[dd + 1] === "**";
                const splin = needDot ? ["."] : [];
                parts.splice(dd - 1, 2, ...splin);
                if (parts.length === 0)
                  parts.push("");
                dd -= 2;
              }
            }
          }
        } while (didSomething);
        return globParts;
      }
      // second phase: multi-pattern dedupes
      // {<pre>/*/<rest>,<pre>/<p>/<rest>} -> <pre>/*/<rest>
      // {<pre>/<rest>,<pre>/<rest>} -> <pre>/<rest>
      // {<pre>/**/<rest>,<pre>/<rest>} -> <pre>/**/<rest>
      //
      // {<pre>/**/<rest>,<pre>/**/<p>/<rest>} -> <pre>/**/<rest>
      // ^-- not valid because ** doens't follow symlinks
      secondPhasePreProcess(globParts) {
        for (let i = 0; i < globParts.length - 1; i++) {
          for (let j = i + 1; j < globParts.length; j++) {
            const matched = this.partsMatch(globParts[i], globParts[j], !this.preserveMultipleSlashes);
            if (!matched)
              continue;
            globParts[i] = matched;
            globParts[j] = [];
          }
        }
        return globParts.filter((gs) => gs.length);
      }
      partsMatch(a, b, emptyGSMatch = false) {
        let ai = 0;
        let bi = 0;
        let result = [];
        let which = "";
        while (ai < a.length && bi < b.length) {
          if (a[ai] === b[bi]) {
            result.push(which === "b" ? b[bi] : a[ai]);
            ai++;
            bi++;
          } else if (emptyGSMatch && a[ai] === "**" && b[bi] === a[ai + 1]) {
            result.push(a[ai]);
            ai++;
          } else if (emptyGSMatch && b[bi] === "**" && a[ai] === b[bi + 1]) {
            result.push(b[bi]);
            bi++;
          } else if (a[ai] === "*" && b[bi] && (this.options.dot || !b[bi].startsWith(".")) && b[bi] !== "**") {
            if (which === "b")
              return false;
            which = "a";
            result.push(a[ai]);
            ai++;
            bi++;
          } else if (b[bi] === "*" && a[ai] && (this.options.dot || !a[ai].startsWith(".")) && a[ai] !== "**") {
            if (which === "a")
              return false;
            which = "b";
            result.push(b[bi]);
            ai++;
            bi++;
          } else {
            return false;
          }
        }
        return a.length === b.length && result;
      }
      parseNegate() {
        if (this.nonegate)
          return;
        const pattern = this.pattern;
        let negate = false;
        let negateOffset = 0;
        for (let i = 0; i < pattern.length && pattern.charAt(i) === "!"; i++) {
          negate = !negate;
          negateOffset++;
        }
        if (negateOffset)
          this.pattern = pattern.slice(negateOffset);
        this.negate = negate;
      }
      // set partial to true to test if, for example,
      // "/a/b" matches the start of "/*/b/*/d"
      // Partial means, if you run out of file before you run
      // out of pattern, then that's fine, as long as all
      // the parts match.
      matchOne(file, pattern, partial = false) {
        const options = this.options;
        if (this.isWindows) {
          const fileUNC = file[0] === "" && file[1] === "" && file[2] === "?" && typeof file[3] === "string" && /^[a-z]:$/i.test(file[3]);
          const patternUNC = pattern[0] === "" && pattern[1] === "" && pattern[2] === "?" && typeof pattern[3] === "string" && /^[a-z]:$/i.test(pattern[3]);
          if (fileUNC && patternUNC) {
            const fd = file[3];
            const pd = pattern[3];
            if (fd.toLowerCase() === pd.toLowerCase()) {
              file[3] = pd;
            }
          } else if (patternUNC && typeof file[0] === "string") {
            const pd = pattern[3];
            const fd = file[0];
            if (pd.toLowerCase() === fd.toLowerCase()) {
              pattern[3] = fd;
              pattern = pattern.slice(3);
            }
          } else if (fileUNC && typeof pattern[0] === "string") {
            const fd = file[3];
            if (fd.toLowerCase() === pattern[0].toLowerCase()) {
              pattern[0] = fd;
              file = file.slice(3);
            }
          }
        }
        const { optimizationLevel = 1 } = this.options;
        if (optimizationLevel >= 2) {
          file = this.levelTwoFileOptimize(file);
        }
        this.debug("matchOne", this, { file, pattern });
        this.debug("matchOne", file.length, pattern.length);
        for (var fi = 0, pi = 0, fl = file.length, pl = pattern.length; fi < fl && pi < pl; fi++, pi++) {
          this.debug("matchOne loop");
          var p = pattern[pi];
          var f = file[fi];
          this.debug(pattern, p, f);
          if (p === false) {
            return false;
          }
          if (p === exports2.GLOBSTAR) {
            this.debug("GLOBSTAR", [pattern, p, f]);
            var fr = fi;
            var pr = pi + 1;
            if (pr === pl) {
              this.debug("** at the end");
              for (; fi < fl; fi++) {
                if (file[fi] === "." || file[fi] === ".." || !options.dot && file[fi].charAt(0) === ".")
                  return false;
              }
              return true;
            }
            while (fr < fl) {
              var swallowee = file[fr];
              this.debug("\nglobstar while", file, fr, pattern, pr, swallowee);
              if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
                this.debug("globstar found match!", fr, fl, swallowee);
                return true;
              } else {
                if (swallowee === "." || swallowee === ".." || !options.dot && swallowee.charAt(0) === ".") {
                  this.debug("dot detected!", file, fr, pattern, pr);
                  break;
                }
                this.debug("globstar swallow a segment, and continue");
                fr++;
              }
            }
            if (partial) {
              this.debug("\n>>> no match, partial?", file, fr, pattern, pr);
              if (fr === fl) {
                return true;
              }
            }
            return false;
          }
          let hit;
          if (typeof p === "string") {
            hit = f === p;
            this.debug("string match", p, f, hit);
          } else {
            hit = p.test(f);
            this.debug("pattern match", p, f, hit);
          }
          if (!hit)
            return false;
        }
        if (fi === fl && pi === pl) {
          return true;
        } else if (fi === fl) {
          return partial;
        } else if (pi === pl) {
          return fi === fl - 1 && file[fi] === "";
        } else {
          throw new Error("wtf?");
        }
      }
      braceExpand() {
        return (0, exports2.braceExpand)(this.pattern, this.options);
      }
      parse(pattern) {
        (0, assert_valid_pattern_js_1.assertValidPattern)(pattern);
        const options = this.options;
        if (pattern === "**")
          return exports2.GLOBSTAR;
        if (pattern === "")
          return "";
        let m;
        let fastTest = null;
        if (m = pattern.match(starRE)) {
          fastTest = options.dot ? starTestDot : starTest;
        } else if (m = pattern.match(starDotExtRE)) {
          fastTest = (options.nocase ? options.dot ? starDotExtTestNocaseDot : starDotExtTestNocase : options.dot ? starDotExtTestDot : starDotExtTest)(m[1]);
        } else if (m = pattern.match(qmarksRE)) {
          fastTest = (options.nocase ? options.dot ? qmarksTestNocaseDot : qmarksTestNocase : options.dot ? qmarksTestDot : qmarksTest)(m);
        } else if (m = pattern.match(starDotStarRE)) {
          fastTest = options.dot ? starDotStarTestDot : starDotStarTest;
        } else if (m = pattern.match(dotStarRE)) {
          fastTest = dotStarTest;
        }
        const re = ast_js_1.AST.fromGlob(pattern, this.options).toMMPattern();
        return fastTest ? Object.assign(re, { test: fastTest }) : re;
      }
      makeRe() {
        if (this.regexp || this.regexp === false)
          return this.regexp;
        const set = this.set;
        if (!set.length) {
          this.regexp = false;
          return this.regexp;
        }
        const options = this.options;
        const twoStar = options.noglobstar ? star : options.dot ? twoStarDot : twoStarNoDot;
        const flags = new Set(options.nocase ? ["i"] : []);
        let re = set.map((pattern) => {
          const pp = pattern.map((p) => {
            if (p instanceof RegExp) {
              for (const f of p.flags.split(""))
                flags.add(f);
            }
            return typeof p === "string" ? regExpEscape(p) : p === exports2.GLOBSTAR ? exports2.GLOBSTAR : p._src;
          });
          pp.forEach((p, i) => {
            const next = pp[i + 1];
            const prev = pp[i - 1];
            if (p !== exports2.GLOBSTAR || prev === exports2.GLOBSTAR) {
              return;
            }
            if (prev === void 0) {
              if (next !== void 0 && next !== exports2.GLOBSTAR) {
                pp[i + 1] = "(?:\\/|" + twoStar + "\\/)?" + next;
              } else {
                pp[i] = twoStar;
              }
            } else if (next === void 0) {
              pp[i - 1] = prev + "(?:\\/|" + twoStar + ")?";
            } else if (next !== exports2.GLOBSTAR) {
              pp[i - 1] = prev + "(?:\\/|\\/" + twoStar + "\\/)" + next;
              pp[i + 1] = exports2.GLOBSTAR;
            }
          });
          return pp.filter((p) => p !== exports2.GLOBSTAR).join("/");
        }).join("|");
        const [open, close] = set.length > 1 ? ["(?:", ")"] : ["", ""];
        re = "^" + open + re + close + "$";
        if (this.negate)
          re = "^(?!" + re + ").+$";
        try {
          this.regexp = new RegExp(re, [...flags].join(""));
        } catch (ex) {
          this.regexp = false;
        }
        return this.regexp;
      }
      slashSplit(p) {
        if (this.preserveMultipleSlashes) {
          return p.split("/");
        } else if (this.isWindows && /^\/\/[^\/]+/.test(p)) {
          return ["", ...p.split(/\/+/)];
        } else {
          return p.split(/\/+/);
        }
      }
      match(f, partial = this.partial) {
        this.debug("match", f, this.pattern);
        if (this.comment) {
          return false;
        }
        if (this.empty) {
          return f === "";
        }
        if (f === "/" && partial) {
          return true;
        }
        const options = this.options;
        if (this.isWindows) {
          f = f.split("\\").join("/");
        }
        const ff = this.slashSplit(f);
        this.debug(this.pattern, "split", ff);
        const set = this.set;
        this.debug(this.pattern, "set", set);
        let filename = ff[ff.length - 1];
        if (!filename) {
          for (let i = ff.length - 2; !filename && i >= 0; i--) {
            filename = ff[i];
          }
        }
        for (let i = 0; i < set.length; i++) {
          const pattern = set[i];
          let file = ff;
          if (options.matchBase && pattern.length === 1) {
            file = [filename];
          }
          const hit = this.matchOne(file, pattern, partial);
          if (hit) {
            if (options.flipNegate) {
              return true;
            }
            return !this.negate;
          }
        }
        if (options.flipNegate) {
          return false;
        }
        return this.negate;
      }
      static defaults(def) {
        return exports2.minimatch.defaults(def).Minimatch;
      }
    };
    exports2.Minimatch = Minimatch;
    var ast_js_2 = require_ast();
    Object.defineProperty(exports2, "AST", { enumerable: true, get: function() {
      return ast_js_2.AST;
    } });
    var escape_js_2 = require_escape();
    Object.defineProperty(exports2, "escape", { enumerable: true, get: function() {
      return escape_js_2.escape;
    } });
    var unescape_js_2 = require_unescape();
    Object.defineProperty(exports2, "unescape", { enumerable: true, get: function() {
      return unescape_js_2.unescape;
    } });
    exports2.minimatch.AST = ast_js_1.AST;
    exports2.minimatch.Minimatch = Minimatch;
    exports2.minimatch.escape = escape_js_1.escape;
    exports2.minimatch.unescape = unescape_js_1.unescape;
  }
});

// node_modules/path-scurry/node_modules/lru-cache/dist/cjs/index.js
var require_cjs2 = __commonJS({
  "node_modules/path-scurry/node_modules/lru-cache/dist/cjs/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.LRUCache = void 0;
    var perf = typeof performance === "object" && performance && typeof performance.now === "function" ? performance : Date;
    var warned = /* @__PURE__ */ new Set();
    var PROCESS = typeof process === "object" && !!process ? process : {};
    var emitWarning = (msg, type, code, fn) => {
      typeof PROCESS.emitWarning === "function" ? PROCESS.emitWarning(msg, type, code, fn) : console.error(`[${code}] ${type}: ${msg}`);
    };
    var AC = globalThis.AbortController;
    var AS = globalThis.AbortSignal;
    if (typeof AC === "undefined") {
      AS = class AbortSignal {
        onabort;
        _onabort = [];
        reason;
        aborted = false;
        addEventListener(_, fn) {
          this._onabort.push(fn);
        }
      };
      AC = class AbortController {
        constructor() {
          warnACPolyfill();
        }
        signal = new AS();
        abort(reason) {
          if (this.signal.aborted)
            return;
          this.signal.reason = reason;
          this.signal.aborted = true;
          for (const fn of this.signal._onabort) {
            fn(reason);
          }
          this.signal.onabort?.(reason);
        }
      };
      let printACPolyfillWarning = PROCESS.env?.LRU_CACHE_IGNORE_AC_WARNING !== "1";
      const warnACPolyfill = () => {
        if (!printACPolyfillWarning)
          return;
        printACPolyfillWarning = false;
        emitWarning("AbortController is not defined. If using lru-cache in node 14, load an AbortController polyfill from the `node-abort-controller` package. A minimal polyfill is provided for use by LRUCache.fetch(), but it should not be relied upon in other contexts (eg, passing it to other APIs that use AbortController/AbortSignal might have undesirable effects). You may disable this with LRU_CACHE_IGNORE_AC_WARNING=1 in the env.", "NO_ABORT_CONTROLLER", "ENOTSUP", warnACPolyfill);
      };
    }
    var shouldWarn = (code) => !warned.has(code);
    var TYPE = Symbol("type");
    var isPosInt = (n) => n && n === Math.floor(n) && n > 0 && isFinite(n);
    var getUintArray = (max) => !isPosInt(max) ? null : max <= Math.pow(2, 8) ? Uint8Array : max <= Math.pow(2, 16) ? Uint16Array : max <= Math.pow(2, 32) ? Uint32Array : max <= Number.MAX_SAFE_INTEGER ? ZeroArray : null;
    var ZeroArray = class extends Array {
      constructor(size) {
        super(size);
        this.fill(0);
      }
    };
    var _constructing;
    var _Stack = class {
      heap;
      length;
      static create(max) {
        const HeapCls = getUintArray(max);
        if (!HeapCls)
          return [];
        __privateSet(_Stack, _constructing, true);
        const s = new _Stack(max, HeapCls);
        __privateSet(_Stack, _constructing, false);
        return s;
      }
      constructor(max, HeapCls) {
        if (!__privateGet(_Stack, _constructing)) {
          throw new TypeError("instantiate Stack using Stack.create(n)");
        }
        this.heap = new HeapCls(max);
        this.length = 0;
      }
      push(n) {
        this.heap[this.length++] = n;
      }
      pop() {
        return this.heap[--this.length];
      }
    };
    var Stack = _Stack;
    _constructing = new WeakMap();
    // private constructor
    __privateAdd(Stack, _constructing, false);
    var LRUCache = class {
      // properties coming in from the options of these, only max and maxSize
      // really *need* to be protected. The rest can be modified, as they just
      // set defaults for various methods.
      #max;
      #maxSize;
      #dispose;
      #disposeAfter;
      #fetchMethod;
      /**
       * {@link LRUCache.OptionsBase.ttl}
       */
      ttl;
      /**
       * {@link LRUCache.OptionsBase.ttlResolution}
       */
      ttlResolution;
      /**
       * {@link LRUCache.OptionsBase.ttlAutopurge}
       */
      ttlAutopurge;
      /**
       * {@link LRUCache.OptionsBase.updateAgeOnGet}
       */
      updateAgeOnGet;
      /**
       * {@link LRUCache.OptionsBase.updateAgeOnHas}
       */
      updateAgeOnHas;
      /**
       * {@link LRUCache.OptionsBase.allowStale}
       */
      allowStale;
      /**
       * {@link LRUCache.OptionsBase.noDisposeOnSet}
       */
      noDisposeOnSet;
      /**
       * {@link LRUCache.OptionsBase.noUpdateTTL}
       */
      noUpdateTTL;
      /**
       * {@link LRUCache.OptionsBase.maxEntrySize}
       */
      maxEntrySize;
      /**
       * {@link LRUCache.OptionsBase.sizeCalculation}
       */
      sizeCalculation;
      /**
       * {@link LRUCache.OptionsBase.noDeleteOnFetchRejection}
       */
      noDeleteOnFetchRejection;
      /**
       * {@link LRUCache.OptionsBase.noDeleteOnStaleGet}
       */
      noDeleteOnStaleGet;
      /**
       * {@link LRUCache.OptionsBase.allowStaleOnFetchAbort}
       */
      allowStaleOnFetchAbort;
      /**
       * {@link LRUCache.OptionsBase.allowStaleOnFetchRejection}
       */
      allowStaleOnFetchRejection;
      /**
       * {@link LRUCache.OptionsBase.ignoreFetchAbort}
       */
      ignoreFetchAbort;
      // computed properties
      #size;
      #calculatedSize;
      #keyMap;
      #keyList;
      #valList;
      #next;
      #prev;
      #head;
      #tail;
      #free;
      #disposed;
      #sizes;
      #starts;
      #ttls;
      #hasDispose;
      #hasFetchMethod;
      #hasDisposeAfter;
      /**
       * Do not call this method unless you need to inspect the
       * inner workings of the cache.  If anything returned by this
       * object is modified in any way, strange breakage may occur.
       *
       * These fields are private for a reason!
       *
       * @internal
       */
      static unsafeExposeInternals(c) {
        return {
          // properties
          starts: c.#starts,
          ttls: c.#ttls,
          sizes: c.#sizes,
          keyMap: c.#keyMap,
          keyList: c.#keyList,
          valList: c.#valList,
          next: c.#next,
          prev: c.#prev,
          get head() {
            return c.#head;
          },
          get tail() {
            return c.#tail;
          },
          free: c.#free,
          // methods
          isBackgroundFetch: (p) => c.#isBackgroundFetch(p),
          backgroundFetch: (k, index, options, context) => c.#backgroundFetch(k, index, options, context),
          moveToTail: (index) => c.#moveToTail(index),
          indexes: (options) => c.#indexes(options),
          rindexes: (options) => c.#rindexes(options),
          isStale: (index) => c.#isStale(index)
        };
      }
      // Protected read-only members
      /**
       * {@link LRUCache.OptionsBase.max} (read-only)
       */
      get max() {
        return this.#max;
      }
      /**
       * {@link LRUCache.OptionsBase.maxSize} (read-only)
       */
      get maxSize() {
        return this.#maxSize;
      }
      /**
       * The total computed size of items in the cache (read-only)
       */
      get calculatedSize() {
        return this.#calculatedSize;
      }
      /**
       * The number of items stored in the cache (read-only)
       */
      get size() {
        return this.#size;
      }
      /**
       * {@link LRUCache.OptionsBase.fetchMethod} (read-only)
       */
      get fetchMethod() {
        return this.#fetchMethod;
      }
      /**
       * {@link LRUCache.OptionsBase.dispose} (read-only)
       */
      get dispose() {
        return this.#dispose;
      }
      /**
       * {@link LRUCache.OptionsBase.disposeAfter} (read-only)
       */
      get disposeAfter() {
        return this.#disposeAfter;
      }
      constructor(options) {
        const { max = 0, ttl, ttlResolution = 1, ttlAutopurge, updateAgeOnGet, updateAgeOnHas, allowStale, dispose, disposeAfter, noDisposeOnSet, noUpdateTTL, maxSize = 0, maxEntrySize = 0, sizeCalculation, fetchMethod, noDeleteOnFetchRejection, noDeleteOnStaleGet, allowStaleOnFetchRejection, allowStaleOnFetchAbort, ignoreFetchAbort } = options;
        if (max !== 0 && !isPosInt(max)) {
          throw new TypeError("max option must be a nonnegative integer");
        }
        const UintArray = max ? getUintArray(max) : Array;
        if (!UintArray) {
          throw new Error("invalid max value: " + max);
        }
        this.#max = max;
        this.#maxSize = maxSize;
        this.maxEntrySize = maxEntrySize || this.#maxSize;
        this.sizeCalculation = sizeCalculation;
        if (this.sizeCalculation) {
          if (!this.#maxSize && !this.maxEntrySize) {
            throw new TypeError("cannot set sizeCalculation without setting maxSize or maxEntrySize");
          }
          if (typeof this.sizeCalculation !== "function") {
            throw new TypeError("sizeCalculation set to non-function");
          }
        }
        if (fetchMethod !== void 0 && typeof fetchMethod !== "function") {
          throw new TypeError("fetchMethod must be a function if specified");
        }
        this.#fetchMethod = fetchMethod;
        this.#hasFetchMethod = !!fetchMethod;
        this.#keyMap = /* @__PURE__ */ new Map();
        this.#keyList = new Array(max).fill(void 0);
        this.#valList = new Array(max).fill(void 0);
        this.#next = new UintArray(max);
        this.#prev = new UintArray(max);
        this.#head = 0;
        this.#tail = 0;
        this.#free = Stack.create(max);
        this.#size = 0;
        this.#calculatedSize = 0;
        if (typeof dispose === "function") {
          this.#dispose = dispose;
        }
        if (typeof disposeAfter === "function") {
          this.#disposeAfter = disposeAfter;
          this.#disposed = [];
        } else {
          this.#disposeAfter = void 0;
          this.#disposed = void 0;
        }
        this.#hasDispose = !!this.#dispose;
        this.#hasDisposeAfter = !!this.#disposeAfter;
        this.noDisposeOnSet = !!noDisposeOnSet;
        this.noUpdateTTL = !!noUpdateTTL;
        this.noDeleteOnFetchRejection = !!noDeleteOnFetchRejection;
        this.allowStaleOnFetchRejection = !!allowStaleOnFetchRejection;
        this.allowStaleOnFetchAbort = !!allowStaleOnFetchAbort;
        this.ignoreFetchAbort = !!ignoreFetchAbort;
        if (this.maxEntrySize !== 0) {
          if (this.#maxSize !== 0) {
            if (!isPosInt(this.#maxSize)) {
              throw new TypeError("maxSize must be a positive integer if specified");
            }
          }
          if (!isPosInt(this.maxEntrySize)) {
            throw new TypeError("maxEntrySize must be a positive integer if specified");
          }
          this.#initializeSizeTracking();
        }
        this.allowStale = !!allowStale;
        this.noDeleteOnStaleGet = !!noDeleteOnStaleGet;
        this.updateAgeOnGet = !!updateAgeOnGet;
        this.updateAgeOnHas = !!updateAgeOnHas;
        this.ttlResolution = isPosInt(ttlResolution) || ttlResolution === 0 ? ttlResolution : 1;
        this.ttlAutopurge = !!ttlAutopurge;
        this.ttl = ttl || 0;
        if (this.ttl) {
          if (!isPosInt(this.ttl)) {
            throw new TypeError("ttl must be a positive integer if specified");
          }
          this.#initializeTTLTracking();
        }
        if (this.#max === 0 && this.ttl === 0 && this.#maxSize === 0) {
          throw new TypeError("At least one of max, maxSize, or ttl is required");
        }
        if (!this.ttlAutopurge && !this.#max && !this.#maxSize) {
          const code = "LRU_CACHE_UNBOUNDED";
          if (shouldWarn(code)) {
            warned.add(code);
            const msg = "TTL caching without ttlAutopurge, max, or maxSize can result in unbounded memory consumption.";
            emitWarning(msg, "UnboundedCacheWarning", code, LRUCache);
          }
        }
      }
      /**
       * Return the remaining TTL time for a given entry key
       */
      getRemainingTTL(key) {
        return this.#keyMap.has(key) ? Infinity : 0;
      }
      #initializeTTLTracking() {
        const ttls = new ZeroArray(this.#max);
        const starts = new ZeroArray(this.#max);
        this.#ttls = ttls;
        this.#starts = starts;
        this.#setItemTTL = (index, ttl, start = perf.now()) => {
          starts[index] = ttl !== 0 ? start : 0;
          ttls[index] = ttl;
          if (ttl !== 0 && this.ttlAutopurge) {
            const t = setTimeout(() => {
              if (this.#isStale(index)) {
                this.delete(this.#keyList[index]);
              }
            }, ttl + 1);
            if (t.unref) {
              t.unref();
            }
          }
        };
        this.#updateItemAge = (index) => {
          starts[index] = ttls[index] !== 0 ? perf.now() : 0;
        };
        this.#statusTTL = (status, index) => {
          if (ttls[index]) {
            const ttl = ttls[index];
            const start = starts[index];
            status.ttl = ttl;
            status.start = start;
            status.now = cachedNow || getNow();
            const age = status.now - start;
            status.remainingTTL = ttl - age;
          }
        };
        let cachedNow = 0;
        const getNow = () => {
          const n = perf.now();
          if (this.ttlResolution > 0) {
            cachedNow = n;
            const t = setTimeout(() => cachedNow = 0, this.ttlResolution);
            if (t.unref) {
              t.unref();
            }
          }
          return n;
        };
        this.getRemainingTTL = (key) => {
          const index = this.#keyMap.get(key);
          if (index === void 0) {
            return 0;
          }
          const ttl = ttls[index];
          const start = starts[index];
          if (ttl === 0 || start === 0) {
            return Infinity;
          }
          const age = (cachedNow || getNow()) - start;
          return ttl - age;
        };
        this.#isStale = (index) => {
          return ttls[index] !== 0 && starts[index] !== 0 && (cachedNow || getNow()) - starts[index] > ttls[index];
        };
      }
      // conditionally set private methods related to TTL
      #updateItemAge = () => {
      };
      #statusTTL = () => {
      };
      #setItemTTL = () => {
      };
      /* c8 ignore stop */
      #isStale = () => false;
      #initializeSizeTracking() {
        const sizes = new ZeroArray(this.#max);
        this.#calculatedSize = 0;
        this.#sizes = sizes;
        this.#removeItemSize = (index) => {
          this.#calculatedSize -= sizes[index];
          sizes[index] = 0;
        };
        this.#requireSize = (k, v, size, sizeCalculation) => {
          if (this.#isBackgroundFetch(v)) {
            return 0;
          }
          if (!isPosInt(size)) {
            if (sizeCalculation) {
              if (typeof sizeCalculation !== "function") {
                throw new TypeError("sizeCalculation must be a function");
              }
              size = sizeCalculation(v, k);
              if (!isPosInt(size)) {
                throw new TypeError("sizeCalculation return invalid (expect positive integer)");
              }
            } else {
              throw new TypeError("invalid size value (must be positive integer). When maxSize or maxEntrySize is used, sizeCalculation or size must be set.");
            }
          }
          return size;
        };
        this.#addItemSize = (index, size, status) => {
          sizes[index] = size;
          if (this.#maxSize) {
            const maxSize = this.#maxSize - sizes[index];
            while (this.#calculatedSize > maxSize) {
              this.#evict(true);
            }
          }
          this.#calculatedSize += sizes[index];
          if (status) {
            status.entrySize = size;
            status.totalCalculatedSize = this.#calculatedSize;
          }
        };
      }
      #removeItemSize = (_i) => {
      };
      #addItemSize = (_i, _s, _st) => {
      };
      #requireSize = (_k, _v, size, sizeCalculation) => {
        if (size || sizeCalculation) {
          throw new TypeError("cannot set size without setting maxSize or maxEntrySize on cache");
        }
        return 0;
      };
      *#indexes({ allowStale = this.allowStale } = {}) {
        if (this.#size) {
          for (let i = this.#tail; true; ) {
            if (!this.#isValidIndex(i)) {
              break;
            }
            if (allowStale || !this.#isStale(i)) {
              yield i;
            }
            if (i === this.#head) {
              break;
            } else {
              i = this.#prev[i];
            }
          }
        }
      }
      *#rindexes({ allowStale = this.allowStale } = {}) {
        if (this.#size) {
          for (let i = this.#head; true; ) {
            if (!this.#isValidIndex(i)) {
              break;
            }
            if (allowStale || !this.#isStale(i)) {
              yield i;
            }
            if (i === this.#tail) {
              break;
            } else {
              i = this.#next[i];
            }
          }
        }
      }
      #isValidIndex(index) {
        return index !== void 0 && this.#keyMap.get(this.#keyList[index]) === index;
      }
      /**
       * Return a generator yielding `[key, value]` pairs,
       * in order from most recently used to least recently used.
       */
      *entries() {
        for (const i of this.#indexes()) {
          if (this.#valList[i] !== void 0 && this.#keyList[i] !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) {
            yield [this.#keyList[i], this.#valList[i]];
          }
        }
      }
      /**
       * Inverse order version of {@link LRUCache.entries}
       *
       * Return a generator yielding `[key, value]` pairs,
       * in order from least recently used to most recently used.
       */
      *rentries() {
        for (const i of this.#rindexes()) {
          if (this.#valList[i] !== void 0 && this.#keyList[i] !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) {
            yield [this.#keyList[i], this.#valList[i]];
          }
        }
      }
      /**
       * Return a generator yielding the keys in the cache,
       * in order from most recently used to least recently used.
       */
      *keys() {
        for (const i of this.#indexes()) {
          const k = this.#keyList[i];
          if (k !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) {
            yield k;
          }
        }
      }
      /**
       * Inverse order version of {@link LRUCache.keys}
       *
       * Return a generator yielding the keys in the cache,
       * in order from least recently used to most recently used.
       */
      *rkeys() {
        for (const i of this.#rindexes()) {
          const k = this.#keyList[i];
          if (k !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) {
            yield k;
          }
        }
      }
      /**
       * Return a generator yielding the values in the cache,
       * in order from most recently used to least recently used.
       */
      *values() {
        for (const i of this.#indexes()) {
          const v = this.#valList[i];
          if (v !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) {
            yield this.#valList[i];
          }
        }
      }
      /**
       * Inverse order version of {@link LRUCache.values}
       *
       * Return a generator yielding the values in the cache,
       * in order from least recently used to most recently used.
       */
      *rvalues() {
        for (const i of this.#rindexes()) {
          const v = this.#valList[i];
          if (v !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) {
            yield this.#valList[i];
          }
        }
      }
      /**
       * Iterating over the cache itself yields the same results as
       * {@link LRUCache.entries}
       */
      [Symbol.iterator]() {
        return this.entries();
      }
      /**
       * Find a value for which the supplied fn method returns a truthy value,
       * similar to Array.find().  fn is called as fn(value, key, cache).
       */
      find(fn, getOptions = {}) {
        for (const i of this.#indexes()) {
          const v = this.#valList[i];
          const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
          if (value === void 0)
            continue;
          if (fn(value, this.#keyList[i], this)) {
            return this.get(this.#keyList[i], getOptions);
          }
        }
      }
      /**
       * Call the supplied function on each item in the cache, in order from
       * most recently used to least recently used.  fn is called as
       * fn(value, key, cache).  Does not update age or recenty of use.
       * Does not iterate over stale values.
       */
      forEach(fn, thisp = this) {
        for (const i of this.#indexes()) {
          const v = this.#valList[i];
          const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
          if (value === void 0)
            continue;
          fn.call(thisp, value, this.#keyList[i], this);
        }
      }
      /**
       * The same as {@link LRUCache.forEach} but items are iterated over in
       * reverse order.  (ie, less recently used items are iterated over first.)
       */
      rforEach(fn, thisp = this) {
        for (const i of this.#rindexes()) {
          const v = this.#valList[i];
          const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
          if (value === void 0)
            continue;
          fn.call(thisp, value, this.#keyList[i], this);
        }
      }
      /**
       * Delete any stale entries. Returns true if anything was removed,
       * false otherwise.
       */
      purgeStale() {
        let deleted = false;
        for (const i of this.#rindexes({ allowStale: true })) {
          if (this.#isStale(i)) {
            this.delete(this.#keyList[i]);
            deleted = true;
          }
        }
        return deleted;
      }
      /**
       * Return an array of [key, {@link LRUCache.Entry}] tuples which can be
       * passed to cache.load()
       */
      dump() {
        const arr = [];
        for (const i of this.#indexes({ allowStale: true })) {
          const key = this.#keyList[i];
          const v = this.#valList[i];
          const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
          if (value === void 0 || key === void 0)
            continue;
          const entry = { value };
          if (this.#ttls && this.#starts) {
            entry.ttl = this.#ttls[i];
            const age = perf.now() - this.#starts[i];
            entry.start = Math.floor(Date.now() - age);
          }
          if (this.#sizes) {
            entry.size = this.#sizes[i];
          }
          arr.unshift([key, entry]);
        }
        return arr;
      }
      /**
       * Reset the cache and load in the items in entries in the order listed.
       * Note that the shape of the resulting cache may be different if the
       * same options are not used in both caches.
       */
      load(arr) {
        this.clear();
        for (const [key, entry] of arr) {
          if (entry.start) {
            const age = Date.now() - entry.start;
            entry.start = perf.now() - age;
          }
          this.set(key, entry.value, entry);
        }
      }
      /**
       * Add a value to the cache.
       *
       * Note: if `undefined` is specified as a value, this is an alias for
       * {@link LRUCache#delete}
       */
      set(k, v, setOptions = {}) {
        if (v === void 0) {
          this.delete(k);
          return this;
        }
        const { ttl = this.ttl, start, noDisposeOnSet = this.noDisposeOnSet, sizeCalculation = this.sizeCalculation, status } = setOptions;
        let { noUpdateTTL = this.noUpdateTTL } = setOptions;
        const size = this.#requireSize(k, v, setOptions.size || 0, sizeCalculation);
        if (this.maxEntrySize && size > this.maxEntrySize) {
          if (status) {
            status.set = "miss";
            status.maxEntrySizeExceeded = true;
          }
          this.delete(k);
          return this;
        }
        let index = this.#size === 0 ? void 0 : this.#keyMap.get(k);
        if (index === void 0) {
          index = this.#size === 0 ? this.#tail : this.#free.length !== 0 ? this.#free.pop() : this.#size === this.#max ? this.#evict(false) : this.#size;
          this.#keyList[index] = k;
          this.#valList[index] = v;
          this.#keyMap.set(k, index);
          this.#next[this.#tail] = index;
          this.#prev[index] = this.#tail;
          this.#tail = index;
          this.#size++;
          this.#addItemSize(index, size, status);
          if (status)
            status.set = "add";
          noUpdateTTL = false;
        } else {
          this.#moveToTail(index);
          const oldVal = this.#valList[index];
          if (v !== oldVal) {
            if (this.#hasFetchMethod && this.#isBackgroundFetch(oldVal)) {
              oldVal.__abortController.abort(new Error("replaced"));
            } else if (!noDisposeOnSet) {
              if (this.#hasDispose) {
                this.#dispose?.(oldVal, k, "set");
              }
              if (this.#hasDisposeAfter) {
                this.#disposed?.push([oldVal, k, "set"]);
              }
            }
            this.#removeItemSize(index);
            this.#addItemSize(index, size, status);
            this.#valList[index] = v;
            if (status) {
              status.set = "replace";
              const oldValue = oldVal && this.#isBackgroundFetch(oldVal) ? oldVal.__staleWhileFetching : oldVal;
              if (oldValue !== void 0)
                status.oldValue = oldValue;
            }
          } else if (status) {
            status.set = "update";
          }
        }
        if (ttl !== 0 && !this.#ttls) {
          this.#initializeTTLTracking();
        }
        if (this.#ttls) {
          if (!noUpdateTTL) {
            this.#setItemTTL(index, ttl, start);
          }
          if (status)
            this.#statusTTL(status, index);
        }
        if (!noDisposeOnSet && this.#hasDisposeAfter && this.#disposed) {
          const dt = this.#disposed;
          let task;
          while (task = dt?.shift()) {
            this.#disposeAfter?.(...task);
          }
        }
        return this;
      }
      /**
       * Evict the least recently used item, returning its value or
       * `undefined` if cache is empty.
       */
      pop() {
        try {
          while (this.#size) {
            const val = this.#valList[this.#head];
            this.#evict(true);
            if (this.#isBackgroundFetch(val)) {
              if (val.__staleWhileFetching) {
                return val.__staleWhileFetching;
              }
            } else if (val !== void 0) {
              return val;
            }
          }
        } finally {
          if (this.#hasDisposeAfter && this.#disposed) {
            const dt = this.#disposed;
            let task;
            while (task = dt?.shift()) {
              this.#disposeAfter?.(...task);
            }
          }
        }
      }
      #evict(free) {
        const head = this.#head;
        const k = this.#keyList[head];
        const v = this.#valList[head];
        if (this.#hasFetchMethod && this.#isBackgroundFetch(v)) {
          v.__abortController.abort(new Error("evicted"));
        } else if (this.#hasDispose || this.#hasDisposeAfter) {
          if (this.#hasDispose) {
            this.#dispose?.(v, k, "evict");
          }
          if (this.#hasDisposeAfter) {
            this.#disposed?.push([v, k, "evict"]);
          }
        }
        this.#removeItemSize(head);
        if (free) {
          this.#keyList[head] = void 0;
          this.#valList[head] = void 0;
          this.#free.push(head);
        }
        if (this.#size === 1) {
          this.#head = this.#tail = 0;
          this.#free.length = 0;
        } else {
          this.#head = this.#next[head];
        }
        this.#keyMap.delete(k);
        this.#size--;
        return head;
      }
      /**
       * Check if a key is in the cache, without updating the recency of use.
       * Will return false if the item is stale, even though it is technically
       * in the cache.
       *
       * Will not update item age unless
       * {@link LRUCache.OptionsBase.updateAgeOnHas} is set.
       */
      has(k, hasOptions = {}) {
        const { updateAgeOnHas = this.updateAgeOnHas, status } = hasOptions;
        const index = this.#keyMap.get(k);
        if (index !== void 0) {
          const v = this.#valList[index];
          if (this.#isBackgroundFetch(v) && v.__staleWhileFetching === void 0) {
            return false;
          }
          if (!this.#isStale(index)) {
            if (updateAgeOnHas) {
              this.#updateItemAge(index);
            }
            if (status) {
              status.has = "hit";
              this.#statusTTL(status, index);
            }
            return true;
          } else if (status) {
            status.has = "stale";
            this.#statusTTL(status, index);
          }
        } else if (status) {
          status.has = "miss";
        }
        return false;
      }
      /**
       * Like {@link LRUCache#get} but doesn't update recency or delete stale
       * items.
       *
       * Returns `undefined` if the item is stale, unless
       * {@link LRUCache.OptionsBase.allowStale} is set.
       */
      peek(k, peekOptions = {}) {
        const { allowStale = this.allowStale } = peekOptions;
        const index = this.#keyMap.get(k);
        if (index !== void 0 && (allowStale || !this.#isStale(index))) {
          const v = this.#valList[index];
          return this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
        }
      }
      #backgroundFetch(k, index, options, context) {
        const v = index === void 0 ? void 0 : this.#valList[index];
        if (this.#isBackgroundFetch(v)) {
          return v;
        }
        const ac = new AC();
        const { signal } = options;
        signal?.addEventListener("abort", () => ac.abort(signal.reason), {
          signal: ac.signal
        });
        const fetchOpts = {
          signal: ac.signal,
          options,
          context
        };
        const cb = (v2, updateCache = false) => {
          const { aborted } = ac.signal;
          const ignoreAbort = options.ignoreFetchAbort && v2 !== void 0;
          if (options.status) {
            if (aborted && !updateCache) {
              options.status.fetchAborted = true;
              options.status.fetchError = ac.signal.reason;
              if (ignoreAbort)
                options.status.fetchAbortIgnored = true;
            } else {
              options.status.fetchResolved = true;
            }
          }
          if (aborted && !ignoreAbort && !updateCache) {
            return fetchFail(ac.signal.reason);
          }
          const bf2 = p;
          if (this.#valList[index] === p) {
            if (v2 === void 0) {
              if (bf2.__staleWhileFetching) {
                this.#valList[index] = bf2.__staleWhileFetching;
              } else {
                this.delete(k);
              }
            } else {
              if (options.status)
                options.status.fetchUpdated = true;
              this.set(k, v2, fetchOpts.options);
            }
          }
          return v2;
        };
        const eb = (er) => {
          if (options.status) {
            options.status.fetchRejected = true;
            options.status.fetchError = er;
          }
          return fetchFail(er);
        };
        const fetchFail = (er) => {
          const { aborted } = ac.signal;
          const allowStaleAborted = aborted && options.allowStaleOnFetchAbort;
          const allowStale = allowStaleAborted || options.allowStaleOnFetchRejection;
          const noDelete = allowStale || options.noDeleteOnFetchRejection;
          const bf2 = p;
          if (this.#valList[index] === p) {
            const del = !noDelete || bf2.__staleWhileFetching === void 0;
            if (del) {
              this.delete(k);
            } else if (!allowStaleAborted) {
              this.#valList[index] = bf2.__staleWhileFetching;
            }
          }
          if (allowStale) {
            if (options.status && bf2.__staleWhileFetching !== void 0) {
              options.status.returnedStale = true;
            }
            return bf2.__staleWhileFetching;
          } else if (bf2.__returned === bf2) {
            throw er;
          }
        };
        const pcall = (res, rej) => {
          const fmp = this.#fetchMethod?.(k, v, fetchOpts);
          if (fmp && fmp instanceof Promise) {
            fmp.then((v2) => res(v2), rej);
          }
          ac.signal.addEventListener("abort", () => {
            if (!options.ignoreFetchAbort || options.allowStaleOnFetchAbort) {
              res();
              if (options.allowStaleOnFetchAbort) {
                res = (v2) => cb(v2, true);
              }
            }
          });
        };
        if (options.status)
          options.status.fetchDispatched = true;
        const p = new Promise(pcall).then(cb, eb);
        const bf = Object.assign(p, {
          __abortController: ac,
          __staleWhileFetching: v,
          __returned: void 0
        });
        if (index === void 0) {
          this.set(k, bf, { ...fetchOpts.options, status: void 0 });
          index = this.#keyMap.get(k);
        } else {
          this.#valList[index] = bf;
        }
        return bf;
      }
      #isBackgroundFetch(p) {
        if (!this.#hasFetchMethod)
          return false;
        const b = p;
        return !!b && b instanceof Promise && b.hasOwnProperty("__staleWhileFetching") && b.__abortController instanceof AC;
      }
      async fetch(k, fetchOptions = {}) {
        const {
          // get options
          allowStale = this.allowStale,
          updateAgeOnGet = this.updateAgeOnGet,
          noDeleteOnStaleGet = this.noDeleteOnStaleGet,
          // set options
          ttl = this.ttl,
          noDisposeOnSet = this.noDisposeOnSet,
          size = 0,
          sizeCalculation = this.sizeCalculation,
          noUpdateTTL = this.noUpdateTTL,
          // fetch exclusive options
          noDeleteOnFetchRejection = this.noDeleteOnFetchRejection,
          allowStaleOnFetchRejection = this.allowStaleOnFetchRejection,
          ignoreFetchAbort = this.ignoreFetchAbort,
          allowStaleOnFetchAbort = this.allowStaleOnFetchAbort,
          context,
          forceRefresh = false,
          status,
          signal
        } = fetchOptions;
        if (!this.#hasFetchMethod) {
          if (status)
            status.fetch = "get";
          return this.get(k, {
            allowStale,
            updateAgeOnGet,
            noDeleteOnStaleGet,
            status
          });
        }
        const options = {
          allowStale,
          updateAgeOnGet,
          noDeleteOnStaleGet,
          ttl,
          noDisposeOnSet,
          size,
          sizeCalculation,
          noUpdateTTL,
          noDeleteOnFetchRejection,
          allowStaleOnFetchRejection,
          allowStaleOnFetchAbort,
          ignoreFetchAbort,
          status,
          signal
        };
        let index = this.#keyMap.get(k);
        if (index === void 0) {
          if (status)
            status.fetch = "miss";
          const p = this.#backgroundFetch(k, index, options, context);
          return p.__returned = p;
        } else {
          const v = this.#valList[index];
          if (this.#isBackgroundFetch(v)) {
            const stale = allowStale && v.__staleWhileFetching !== void 0;
            if (status) {
              status.fetch = "inflight";
              if (stale)
                status.returnedStale = true;
            }
            return stale ? v.__staleWhileFetching : v.__returned = v;
          }
          const isStale = this.#isStale(index);
          if (!forceRefresh && !isStale) {
            if (status)
              status.fetch = "hit";
            this.#moveToTail(index);
            if (updateAgeOnGet) {
              this.#updateItemAge(index);
            }
            if (status)
              this.#statusTTL(status, index);
            return v;
          }
          const p = this.#backgroundFetch(k, index, options, context);
          const hasStale = p.__staleWhileFetching !== void 0;
          const staleVal = hasStale && allowStale;
          if (status) {
            status.fetch = isStale ? "stale" : "refresh";
            if (staleVal && isStale)
              status.returnedStale = true;
          }
          return staleVal ? p.__staleWhileFetching : p.__returned = p;
        }
      }
      /**
       * Return a value from the cache. Will update the recency of the cache
       * entry found.
       *
       * If the key is not found, get() will return `undefined`.
       */
      get(k, getOptions = {}) {
        const { allowStale = this.allowStale, updateAgeOnGet = this.updateAgeOnGet, noDeleteOnStaleGet = this.noDeleteOnStaleGet, status } = getOptions;
        const index = this.#keyMap.get(k);
        if (index !== void 0) {
          const value = this.#valList[index];
          const fetching = this.#isBackgroundFetch(value);
          if (status)
            this.#statusTTL(status, index);
          if (this.#isStale(index)) {
            if (status)
              status.get = "stale";
            if (!fetching) {
              if (!noDeleteOnStaleGet) {
                this.delete(k);
              }
              if (status && allowStale)
                status.returnedStale = true;
              return allowStale ? value : void 0;
            } else {
              if (status && allowStale && value.__staleWhileFetching !== void 0) {
                status.returnedStale = true;
              }
              return allowStale ? value.__staleWhileFetching : void 0;
            }
          } else {
            if (status)
              status.get = "hit";
            if (fetching) {
              return value.__staleWhileFetching;
            }
            this.#moveToTail(index);
            if (updateAgeOnGet) {
              this.#updateItemAge(index);
            }
            return value;
          }
        } else if (status) {
          status.get = "miss";
        }
      }
      #connect(p, n) {
        this.#prev[n] = p;
        this.#next[p] = n;
      }
      #moveToTail(index) {
        if (index !== this.#tail) {
          if (index === this.#head) {
            this.#head = this.#next[index];
          } else {
            this.#connect(this.#prev[index], this.#next[index]);
          }
          this.#connect(this.#tail, index);
          this.#tail = index;
        }
      }
      /**
       * Deletes a key out of the cache.
       * Returns true if the key was deleted, false otherwise.
       */
      delete(k) {
        let deleted = false;
        if (this.#size !== 0) {
          const index = this.#keyMap.get(k);
          if (index !== void 0) {
            deleted = true;
            if (this.#size === 1) {
              this.clear();
            } else {
              this.#removeItemSize(index);
              const v = this.#valList[index];
              if (this.#isBackgroundFetch(v)) {
                v.__abortController.abort(new Error("deleted"));
              } else if (this.#hasDispose || this.#hasDisposeAfter) {
                if (this.#hasDispose) {
                  this.#dispose?.(v, k, "delete");
                }
                if (this.#hasDisposeAfter) {
                  this.#disposed?.push([v, k, "delete"]);
                }
              }
              this.#keyMap.delete(k);
              this.#keyList[index] = void 0;
              this.#valList[index] = void 0;
              if (index === this.#tail) {
                this.#tail = this.#prev[index];
              } else if (index === this.#head) {
                this.#head = this.#next[index];
              } else {
                this.#next[this.#prev[index]] = this.#next[index];
                this.#prev[this.#next[index]] = this.#prev[index];
              }
              this.#size--;
              this.#free.push(index);
            }
          }
        }
        if (this.#hasDisposeAfter && this.#disposed?.length) {
          const dt = this.#disposed;
          let task;
          while (task = dt?.shift()) {
            this.#disposeAfter?.(...task);
          }
        }
        return deleted;
      }
      /**
       * Clear the cache entirely, throwing away all values.
       */
      clear() {
        for (const index of this.#rindexes({ allowStale: true })) {
          const v = this.#valList[index];
          if (this.#isBackgroundFetch(v)) {
            v.__abortController.abort(new Error("deleted"));
          } else {
            const k = this.#keyList[index];
            if (this.#hasDispose) {
              this.#dispose?.(v, k, "delete");
            }
            if (this.#hasDisposeAfter) {
              this.#disposed?.push([v, k, "delete"]);
            }
          }
        }
        this.#keyMap.clear();
        this.#valList.fill(void 0);
        this.#keyList.fill(void 0);
        if (this.#ttls && this.#starts) {
          this.#ttls.fill(0);
          this.#starts.fill(0);
        }
        if (this.#sizes) {
          this.#sizes.fill(0);
        }
        this.#head = 0;
        this.#tail = 0;
        this.#free.length = 0;
        this.#calculatedSize = 0;
        this.#size = 0;
        if (this.#hasDisposeAfter && this.#disposed) {
          const dt = this.#disposed;
          let task;
          while (task = dt?.shift()) {
            this.#disposeAfter?.(...task);
          }
        }
      }
    };
    exports2.LRUCache = LRUCache;
  }
});

// node_modules/minipass/index.js
var require_minipass = __commonJS({
  "node_modules/minipass/index.js"(exports2) {
    "use strict";
    var proc = typeof process === "object" && process ? process : {
      stdout: null,
      stderr: null
    };
    var EE = require("events");
    var Stream = require("stream");
    var stringdecoder = require("string_decoder");
    var SD = stringdecoder.StringDecoder;
    var EOF = Symbol("EOF");
    var MAYBE_EMIT_END = Symbol("maybeEmitEnd");
    var EMITTED_END = Symbol("emittedEnd");
    var EMITTING_END = Symbol("emittingEnd");
    var EMITTED_ERROR = Symbol("emittedError");
    var CLOSED = Symbol("closed");
    var READ = Symbol("read");
    var FLUSH = Symbol("flush");
    var FLUSHCHUNK = Symbol("flushChunk");
    var ENCODING = Symbol("encoding");
    var DECODER = Symbol("decoder");
    var FLOWING = Symbol("flowing");
    var PAUSED = Symbol("paused");
    var RESUME = Symbol("resume");
    var BUFFER = Symbol("buffer");
    var PIPES = Symbol("pipes");
    var BUFFERLENGTH = Symbol("bufferLength");
    var BUFFERPUSH = Symbol("bufferPush");
    var BUFFERSHIFT = Symbol("bufferShift");
    var OBJECTMODE = Symbol("objectMode");
    var DESTROYED = Symbol("destroyed");
    var ERROR = Symbol("error");
    var EMITDATA = Symbol("emitData");
    var EMITEND = Symbol("emitEnd");
    var EMITEND2 = Symbol("emitEnd2");
    var ASYNC = Symbol("async");
    var ABORT = Symbol("abort");
    var ABORTED = Symbol("aborted");
    var SIGNAL = Symbol("signal");
    var defer = (fn) => Promise.resolve().then(fn);
    var doIter = global._MP_NO_ITERATOR_SYMBOLS_ !== "1";
    var ASYNCITERATOR = doIter && Symbol.asyncIterator || Symbol("asyncIterator not implemented");
    var ITERATOR = doIter && Symbol.iterator || Symbol("iterator not implemented");
    var isEndish = (ev) => ev === "end" || ev === "finish" || ev === "prefinish";
    var isArrayBuffer = (b) => b instanceof ArrayBuffer || typeof b === "object" && b.constructor && b.constructor.name === "ArrayBuffer" && b.byteLength >= 0;
    var isArrayBufferView = (b) => !Buffer.isBuffer(b) && ArrayBuffer.isView(b);
    var Pipe = class {
      constructor(src, dest, opts) {
        this.src = src;
        this.dest = dest;
        this.opts = opts;
        this.ondrain = () => src[RESUME]();
        dest.on("drain", this.ondrain);
      }
      unpipe() {
        this.dest.removeListener("drain", this.ondrain);
      }
      // istanbul ignore next - only here for the prototype
      proxyErrors() {
      }
      end() {
        this.unpipe();
        if (this.opts.end)
          this.dest.end();
      }
    };
    var PipeProxyErrors = class extends Pipe {
      unpipe() {
        this.src.removeListener("error", this.proxyErrors);
        super.unpipe();
      }
      constructor(src, dest, opts) {
        super(src, dest, opts);
        this.proxyErrors = (er) => dest.emit("error", er);
        src.on("error", this.proxyErrors);
      }
    };
    var Minipass = class extends Stream {
      constructor(options) {
        super();
        this[FLOWING] = false;
        this[PAUSED] = false;
        this[PIPES] = [];
        this[BUFFER] = [];
        this[OBJECTMODE] = options && options.objectMode || false;
        if (this[OBJECTMODE])
          this[ENCODING] = null;
        else
          this[ENCODING] = options && options.encoding || null;
        if (this[ENCODING] === "buffer")
          this[ENCODING] = null;
        this[ASYNC] = options && !!options.async || false;
        this[DECODER] = this[ENCODING] ? new SD(this[ENCODING]) : null;
        this[EOF] = false;
        this[EMITTED_END] = false;
        this[EMITTING_END] = false;
        this[CLOSED] = false;
        this[EMITTED_ERROR] = null;
        this.writable = true;
        this.readable = true;
        this[BUFFERLENGTH] = 0;
        this[DESTROYED] = false;
        if (options && options.debugExposeBuffer === true) {
          Object.defineProperty(this, "buffer", { get: () => this[BUFFER] });
        }
        if (options && options.debugExposePipes === true) {
          Object.defineProperty(this, "pipes", { get: () => this[PIPES] });
        }
        this[SIGNAL] = options && options.signal;
        this[ABORTED] = false;
        if (this[SIGNAL]) {
          this[SIGNAL].addEventListener("abort", () => this[ABORT]());
          if (this[SIGNAL].aborted) {
            this[ABORT]();
          }
        }
      }
      get bufferLength() {
        return this[BUFFERLENGTH];
      }
      get encoding() {
        return this[ENCODING];
      }
      set encoding(enc) {
        if (this[OBJECTMODE])
          throw new Error("cannot set encoding in objectMode");
        if (this[ENCODING] && enc !== this[ENCODING] && (this[DECODER] && this[DECODER].lastNeed || this[BUFFERLENGTH]))
          throw new Error("cannot change encoding");
        if (this[ENCODING] !== enc) {
          this[DECODER] = enc ? new SD(enc) : null;
          if (this[BUFFER].length)
            this[BUFFER] = this[BUFFER].map((chunk) => this[DECODER].write(chunk));
        }
        this[ENCODING] = enc;
      }
      setEncoding(enc) {
        this.encoding = enc;
      }
      get objectMode() {
        return this[OBJECTMODE];
      }
      set objectMode(om) {
        this[OBJECTMODE] = this[OBJECTMODE] || !!om;
      }
      get ["async"]() {
        return this[ASYNC];
      }
      set ["async"](a) {
        this[ASYNC] = this[ASYNC] || !!a;
      }
      // drop everything and get out of the flow completely
      [ABORT]() {
        this[ABORTED] = true;
        this.emit("abort", this[SIGNAL].reason);
        this.destroy(this[SIGNAL].reason);
      }
      get aborted() {
        return this[ABORTED];
      }
      set aborted(_) {
      }
      write(chunk, encoding, cb) {
        if (this[ABORTED])
          return false;
        if (this[EOF])
          throw new Error("write after end");
        if (this[DESTROYED]) {
          this.emit(
            "error",
            Object.assign(
              new Error("Cannot call write after a stream was destroyed"),
              { code: "ERR_STREAM_DESTROYED" }
            )
          );
          return true;
        }
        if (typeof encoding === "function")
          cb = encoding, encoding = "utf8";
        if (!encoding)
          encoding = "utf8";
        const fn = this[ASYNC] ? defer : (f) => f();
        if (!this[OBJECTMODE] && !Buffer.isBuffer(chunk)) {
          if (isArrayBufferView(chunk))
            chunk = Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength);
          else if (isArrayBuffer(chunk))
            chunk = Buffer.from(chunk);
          else if (typeof chunk !== "string")
            this.objectMode = true;
        }
        if (this[OBJECTMODE]) {
          if (this.flowing && this[BUFFERLENGTH] !== 0)
            this[FLUSH](true);
          if (this.flowing)
            this.emit("data", chunk);
          else
            this[BUFFERPUSH](chunk);
          if (this[BUFFERLENGTH] !== 0)
            this.emit("readable");
          if (cb)
            fn(cb);
          return this.flowing;
        }
        if (!chunk.length) {
          if (this[BUFFERLENGTH] !== 0)
            this.emit("readable");
          if (cb)
            fn(cb);
          return this.flowing;
        }
        if (typeof chunk === "string" && // unless it is a string already ready for us to use
        !(encoding === this[ENCODING] && !this[DECODER].lastNeed)) {
          chunk = Buffer.from(chunk, encoding);
        }
        if (Buffer.isBuffer(chunk) && this[ENCODING])
          chunk = this[DECODER].write(chunk);
        if (this.flowing && this[BUFFERLENGTH] !== 0)
          this[FLUSH](true);
        if (this.flowing)
          this.emit("data", chunk);
        else
          this[BUFFERPUSH](chunk);
        if (this[BUFFERLENGTH] !== 0)
          this.emit("readable");
        if (cb)
          fn(cb);
        return this.flowing;
      }
      read(n) {
        if (this[DESTROYED])
          return null;
        if (this[BUFFERLENGTH] === 0 || n === 0 || n > this[BUFFERLENGTH]) {
          this[MAYBE_EMIT_END]();
          return null;
        }
        if (this[OBJECTMODE])
          n = null;
        if (this[BUFFER].length > 1 && !this[OBJECTMODE]) {
          if (this.encoding)
            this[BUFFER] = [this[BUFFER].join("")];
          else
            this[BUFFER] = [Buffer.concat(this[BUFFER], this[BUFFERLENGTH])];
        }
        const ret = this[READ](n || null, this[BUFFER][0]);
        this[MAYBE_EMIT_END]();
        return ret;
      }
      [READ](n, chunk) {
        if (n === chunk.length || n === null)
          this[BUFFERSHIFT]();
        else {
          this[BUFFER][0] = chunk.slice(n);
          chunk = chunk.slice(0, n);
          this[BUFFERLENGTH] -= n;
        }
        this.emit("data", chunk);
        if (!this[BUFFER].length && !this[EOF])
          this.emit("drain");
        return chunk;
      }
      end(chunk, encoding, cb) {
        if (typeof chunk === "function")
          cb = chunk, chunk = null;
        if (typeof encoding === "function")
          cb = encoding, encoding = "utf8";
        if (chunk)
          this.write(chunk, encoding);
        if (cb)
          this.once("end", cb);
        this[EOF] = true;
        this.writable = false;
        if (this.flowing || !this[PAUSED])
          this[MAYBE_EMIT_END]();
        return this;
      }
      // don't let the internal resume be overwritten
      [RESUME]() {
        if (this[DESTROYED])
          return;
        this[PAUSED] = false;
        this[FLOWING] = true;
        this.emit("resume");
        if (this[BUFFER].length)
          this[FLUSH]();
        else if (this[EOF])
          this[MAYBE_EMIT_END]();
        else
          this.emit("drain");
      }
      resume() {
        return this[RESUME]();
      }
      pause() {
        this[FLOWING] = false;
        this[PAUSED] = true;
      }
      get destroyed() {
        return this[DESTROYED];
      }
      get flowing() {
        return this[FLOWING];
      }
      get paused() {
        return this[PAUSED];
      }
      [BUFFERPUSH](chunk) {
        if (this[OBJECTMODE])
          this[BUFFERLENGTH] += 1;
        else
          this[BUFFERLENGTH] += chunk.length;
        this[BUFFER].push(chunk);
      }
      [BUFFERSHIFT]() {
        if (this[OBJECTMODE])
          this[BUFFERLENGTH] -= 1;
        else
          this[BUFFERLENGTH] -= this[BUFFER][0].length;
        return this[BUFFER].shift();
      }
      [FLUSH](noDrain) {
        do {
        } while (this[FLUSHCHUNK](this[BUFFERSHIFT]()) && this[BUFFER].length);
        if (!noDrain && !this[BUFFER].length && !this[EOF])
          this.emit("drain");
      }
      [FLUSHCHUNK](chunk) {
        this.emit("data", chunk);
        return this.flowing;
      }
      pipe(dest, opts) {
        if (this[DESTROYED])
          return;
        const ended = this[EMITTED_END];
        opts = opts || {};
        if (dest === proc.stdout || dest === proc.stderr)
          opts.end = false;
        else
          opts.end = opts.end !== false;
        opts.proxyErrors = !!opts.proxyErrors;
        if (ended) {
          if (opts.end)
            dest.end();
        } else {
          this[PIPES].push(
            !opts.proxyErrors ? new Pipe(this, dest, opts) : new PipeProxyErrors(this, dest, opts)
          );
          if (this[ASYNC])
            defer(() => this[RESUME]());
          else
            this[RESUME]();
        }
        return dest;
      }
      unpipe(dest) {
        const p = this[PIPES].find((p2) => p2.dest === dest);
        if (p) {
          this[PIPES].splice(this[PIPES].indexOf(p), 1);
          p.unpipe();
        }
      }
      addListener(ev, fn) {
        return this.on(ev, fn);
      }
      on(ev, fn) {
        const ret = super.on(ev, fn);
        if (ev === "data" && !this[PIPES].length && !this.flowing)
          this[RESUME]();
        else if (ev === "readable" && this[BUFFERLENGTH] !== 0)
          super.emit("readable");
        else if (isEndish(ev) && this[EMITTED_END]) {
          super.emit(ev);
          this.removeAllListeners(ev);
        } else if (ev === "error" && this[EMITTED_ERROR]) {
          if (this[ASYNC])
            defer(() => fn.call(this, this[EMITTED_ERROR]));
          else
            fn.call(this, this[EMITTED_ERROR]);
        }
        return ret;
      }
      get emittedEnd() {
        return this[EMITTED_END];
      }
      [MAYBE_EMIT_END]() {
        if (!this[EMITTING_END] && !this[EMITTED_END] && !this[DESTROYED] && this[BUFFER].length === 0 && this[EOF]) {
          this[EMITTING_END] = true;
          this.emit("end");
          this.emit("prefinish");
          this.emit("finish");
          if (this[CLOSED])
            this.emit("close");
          this[EMITTING_END] = false;
        }
      }
      emit(ev, data, ...extra) {
        if (ev !== "error" && ev !== "close" && ev !== DESTROYED && this[DESTROYED])
          return;
        else if (ev === "data") {
          return !this[OBJECTMODE] && !data ? false : this[ASYNC] ? defer(() => this[EMITDATA](data)) : this[EMITDATA](data);
        } else if (ev === "end") {
          return this[EMITEND]();
        } else if (ev === "close") {
          this[CLOSED] = true;
          if (!this[EMITTED_END] && !this[DESTROYED])
            return;
          const ret2 = super.emit("close");
          this.removeAllListeners("close");
          return ret2;
        } else if (ev === "error") {
          this[EMITTED_ERROR] = data;
          super.emit(ERROR, data);
          const ret2 = !this[SIGNAL] || this.listeners("error").length ? super.emit("error", data) : false;
          this[MAYBE_EMIT_END]();
          return ret2;
        } else if (ev === "resume") {
          const ret2 = super.emit("resume");
          this[MAYBE_EMIT_END]();
          return ret2;
        } else if (ev === "finish" || ev === "prefinish") {
          const ret2 = super.emit(ev);
          this.removeAllListeners(ev);
          return ret2;
        }
        const ret = super.emit(ev, data, ...extra);
        this[MAYBE_EMIT_END]();
        return ret;
      }
      [EMITDATA](data) {
        for (const p of this[PIPES]) {
          if (p.dest.write(data) === false)
            this.pause();
        }
        const ret = super.emit("data", data);
        this[MAYBE_EMIT_END]();
        return ret;
      }
      [EMITEND]() {
        if (this[EMITTED_END])
          return;
        this[EMITTED_END] = true;
        this.readable = false;
        if (this[ASYNC])
          defer(() => this[EMITEND2]());
        else
          this[EMITEND2]();
      }
      [EMITEND2]() {
        if (this[DECODER]) {
          const data = this[DECODER].end();
          if (data) {
            for (const p of this[PIPES]) {
              p.dest.write(data);
            }
            super.emit("data", data);
          }
        }
        for (const p of this[PIPES]) {
          p.end();
        }
        const ret = super.emit("end");
        this.removeAllListeners("end");
        return ret;
      }
      // const all = await stream.collect()
      collect() {
        const buf = [];
        if (!this[OBJECTMODE])
          buf.dataLength = 0;
        const p = this.promise();
        this.on("data", (c) => {
          buf.push(c);
          if (!this[OBJECTMODE])
            buf.dataLength += c.length;
        });
        return p.then(() => buf);
      }
      // const data = await stream.concat()
      concat() {
        return this[OBJECTMODE] ? Promise.reject(new Error("cannot concat in objectMode")) : this.collect().then(
          (buf) => this[OBJECTMODE] ? Promise.reject(new Error("cannot concat in objectMode")) : this[ENCODING] ? buf.join("") : Buffer.concat(buf, buf.dataLength)
        );
      }
      // stream.promise().then(() => done, er => emitted error)
      promise() {
        return new Promise((resolve, reject) => {
          this.on(DESTROYED, () => reject(new Error("stream destroyed")));
          this.on("error", (er) => reject(er));
          this.on("end", () => resolve());
        });
      }
      // for await (let chunk of stream)
      [ASYNCITERATOR]() {
        let stopped = false;
        const stop = () => {
          this.pause();
          stopped = true;
          return Promise.resolve({ done: true });
        };
        const next = () => {
          if (stopped)
            return stop();
          const res = this.read();
          if (res !== null)
            return Promise.resolve({ done: false, value: res });
          if (this[EOF])
            return stop();
          let resolve = null;
          let reject = null;
          const onerr = (er) => {
            this.removeListener("data", ondata);
            this.removeListener("end", onend);
            this.removeListener(DESTROYED, ondestroy);
            stop();
            reject(er);
          };
          const ondata = (value) => {
            this.removeListener("error", onerr);
            this.removeListener("end", onend);
            this.removeListener(DESTROYED, ondestroy);
            this.pause();
            resolve({ value, done: !!this[EOF] });
          };
          const onend = () => {
            this.removeListener("error", onerr);
            this.removeListener("data", ondata);
            this.removeListener(DESTROYED, ondestroy);
            stop();
            resolve({ done: true });
          };
          const ondestroy = () => onerr(new Error("stream destroyed"));
          return new Promise((res2, rej) => {
            reject = rej;
            resolve = res2;
            this.once(DESTROYED, ondestroy);
            this.once("error", onerr);
            this.once("end", onend);
            this.once("data", ondata);
          });
        };
        return {
          next,
          throw: stop,
          return: stop,
          [ASYNCITERATOR]() {
            return this;
          }
        };
      }
      // for (let chunk of stream)
      [ITERATOR]() {
        let stopped = false;
        const stop = () => {
          this.pause();
          this.removeListener(ERROR, stop);
          this.removeListener(DESTROYED, stop);
          this.removeListener("end", stop);
          stopped = true;
          return { done: true };
        };
        const next = () => {
          if (stopped)
            return stop();
          const value = this.read();
          return value === null ? stop() : { value };
        };
        this.once("end", stop);
        this.once(ERROR, stop);
        this.once(DESTROYED, stop);
        return {
          next,
          throw: stop,
          return: stop,
          [ITERATOR]() {
            return this;
          }
        };
      }
      destroy(er) {
        if (this[DESTROYED]) {
          if (er)
            this.emit("error", er);
          else
            this.emit(DESTROYED);
          return this;
        }
        this[DESTROYED] = true;
        this[BUFFER].length = 0;
        this[BUFFERLENGTH] = 0;
        if (typeof this.close === "function" && !this[CLOSED])
          this.close();
        if (er)
          this.emit("error", er);
        else
          this.emit(DESTROYED);
        return this;
      }
      static isStream(s) {
        return !!s && (s instanceof Minipass || s instanceof Stream || s instanceof EE && // readable
        (typeof s.pipe === "function" || // writable
        typeof s.write === "function" && typeof s.end === "function"));
      }
    };
    exports2.Minipass = Minipass;
  }
});

// node_modules/path-scurry/dist/cjs/index.js
var require_cjs3 = __commonJS({
  "node_modules/path-scurry/dist/cjs/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.PathScurry = exports2.Path = exports2.PathScurryDarwin = exports2.PathScurryPosix = exports2.PathScurryWin32 = exports2.PathScurryBase = exports2.PathPosix = exports2.PathWin32 = exports2.PathBase = exports2.ChildrenCache = exports2.ResolveCache = void 0;
    var lru_cache_1 = require_cjs2();
    var path_1 = require("path");
    var url_1 = require("url");
    var actualFS = __importStar(require("fs"));
    var fs_1 = require("fs");
    var realpathSync = fs_1.realpathSync.native;
    var promises_1 = require("fs/promises");
    var minipass_1 = require_minipass();
    var defaultFS = {
      lstatSync: fs_1.lstatSync,
      readdir: fs_1.readdir,
      readdirSync: fs_1.readdirSync,
      readlinkSync: fs_1.readlinkSync,
      realpathSync,
      promises: {
        lstat: promises_1.lstat,
        readdir: promises_1.readdir,
        readlink: promises_1.readlink,
        realpath: promises_1.realpath
      }
    };
    var fsFromOption = (fsOption) => !fsOption || fsOption === defaultFS || fsOption === actualFS ? defaultFS : {
      ...defaultFS,
      ...fsOption,
      promises: {
        ...defaultFS.promises,
        ...fsOption.promises || {}
      }
    };
    var uncDriveRegexp = /^\\\\\?\\([a-z]:)\\?$/i;
    var uncToDrive = (rootPath) => rootPath.replace(/\//g, "\\").replace(uncDriveRegexp, "$1\\");
    var eitherSep = /[\\\/]/;
    var UNKNOWN = 0;
    var IFIFO = 1;
    var IFCHR = 2;
    var IFDIR = 4;
    var IFBLK = 6;
    var IFREG = 8;
    var IFLNK = 10;
    var IFSOCK = 12;
    var IFMT = 15;
    var IFMT_UNKNOWN = ~IFMT;
    var READDIR_CALLED = 16;
    var LSTAT_CALLED = 32;
    var ENOTDIR = 64;
    var ENOENT = 128;
    var ENOREADLINK = 256;
    var ENOREALPATH = 512;
    var ENOCHILD = ENOTDIR | ENOENT | ENOREALPATH;
    var TYPEMASK = 1023;
    var entToType = (s) => s.isFile() ? IFREG : s.isDirectory() ? IFDIR : s.isSymbolicLink() ? IFLNK : s.isCharacterDevice() ? IFCHR : s.isBlockDevice() ? IFBLK : s.isSocket() ? IFSOCK : s.isFIFO() ? IFIFO : UNKNOWN;
    var normalizeCache = /* @__PURE__ */ new Map();
    var normalize = (s) => {
      const c = normalizeCache.get(s);
      if (c)
        return c;
      const n = s.normalize("NFKD");
      normalizeCache.set(s, n);
      return n;
    };
    var normalizeNocaseCache = /* @__PURE__ */ new Map();
    var normalizeNocase = (s) => {
      const c = normalizeNocaseCache.get(s);
      if (c)
        return c;
      const n = normalize(s.toLowerCase());
      normalizeNocaseCache.set(s, n);
      return n;
    };
    var ResolveCache = class extends lru_cache_1.LRUCache {
      constructor() {
        super({ max: 256 });
      }
    };
    exports2.ResolveCache = ResolveCache;
    var ChildrenCache = class extends lru_cache_1.LRUCache {
      constructor(maxSize = 16 * 1024) {
        super({
          maxSize,
          // parent + children
          sizeCalculation: (a) => a.length + 1
        });
      }
    };
    exports2.ChildrenCache = ChildrenCache;
    var setAsCwd = Symbol("PathScurry setAsCwd");
    var PathBase = class {
      /**
       * the basename of this path
       *
       * **Important**: *always* test the path name against any test string
       * usingthe {@link isNamed} method, and not by directly comparing this
       * string. Otherwise, unicode path strings that the system sees as identical
       * will not be properly treated as the same path, leading to incorrect
       * behavior and possible security issues.
       */
      name;
      /**
       * the Path entry corresponding to the path root.
       *
       * @internal
       */
      root;
      /**
       * All roots found within the current PathScurry family
       *
       * @internal
       */
      roots;
      /**
       * a reference to the parent path, or undefined in the case of root entries
       *
       * @internal
       */
      parent;
      /**
       * boolean indicating whether paths are compared case-insensitively
       * @internal
       */
      nocase;
      // potential default fs override
      #fs;
      // Stats fields
      #dev;
      get dev() {
        return this.#dev;
      }
      #mode;
      get mode() {
        return this.#mode;
      }
      #nlink;
      get nlink() {
        return this.#nlink;
      }
      #uid;
      get uid() {
        return this.#uid;
      }
      #gid;
      get gid() {
        return this.#gid;
      }
      #rdev;
      get rdev() {
        return this.#rdev;
      }
      #blksize;
      get blksize() {
        return this.#blksize;
      }
      #ino;
      get ino() {
        return this.#ino;
      }
      #size;
      get size() {
        return this.#size;
      }
      #blocks;
      get blocks() {
        return this.#blocks;
      }
      #atimeMs;
      get atimeMs() {
        return this.#atimeMs;
      }
      #mtimeMs;
      get mtimeMs() {
        return this.#mtimeMs;
      }
      #ctimeMs;
      get ctimeMs() {
        return this.#ctimeMs;
      }
      #birthtimeMs;
      get birthtimeMs() {
        return this.#birthtimeMs;
      }
      #atime;
      get atime() {
        return this.#atime;
      }
      #mtime;
      get mtime() {
        return this.#mtime;
      }
      #ctime;
      get ctime() {
        return this.#ctime;
      }
      #birthtime;
      get birthtime() {
        return this.#birthtime;
      }
      #matchName;
      #depth;
      #fullpath;
      #fullpathPosix;
      #relative;
      #relativePosix;
      #type;
      #children;
      #linkTarget;
      #realpath;
      /**
       * This property is for compatibility with the Dirent class as of
       * Node v20, where Dirent['path'] refers to the path of the directory
       * that was passed to readdir.  So, somewhat counterintuitively, this
       * property refers to the *parent* path, not the path object itself.
       * For root entries, it's the path to the entry itself.
       */
      get path() {
        return (this.parent || this).fullpath();
      }
      /**
       * Do not create new Path objects directly.  They should always be accessed
       * via the PathScurry class or other methods on the Path class.
       *
       * @internal
       */
      constructor(name, type = UNKNOWN, root, roots, nocase, children, opts) {
        this.name = name;
        this.#matchName = nocase ? normalizeNocase(name) : normalize(name);
        this.#type = type & TYPEMASK;
        this.nocase = nocase;
        this.roots = roots;
        this.root = root || this;
        this.#children = children;
        this.#fullpath = opts.fullpath;
        this.#relative = opts.relative;
        this.#relativePosix = opts.relativePosix;
        this.parent = opts.parent;
        if (this.parent) {
          this.#fs = this.parent.#fs;
        } else {
          this.#fs = fsFromOption(opts.fs);
        }
      }
      /**
       * Returns the depth of the Path object from its root.
       *
       * For example, a path at `/foo/bar` would have a depth of 2.
       */
      depth() {
        if (this.#depth !== void 0)
          return this.#depth;
        if (!this.parent)
          return this.#depth = 0;
        return this.#depth = this.parent.depth() + 1;
      }
      /**
       * @internal
       */
      childrenCache() {
        return this.#children;
      }
      /**
       * Get the Path object referenced by the string path, resolved from this Path
       */
      resolve(path) {
        if (!path) {
          return this;
        }
        const rootPath = this.getRootString(path);
        const dir = path.substring(rootPath.length);
        const dirParts = dir.split(this.splitSep);
        const result = rootPath ? this.getRoot(rootPath).#resolveParts(dirParts) : this.#resolveParts(dirParts);
        return result;
      }
      #resolveParts(dirParts) {
        let p = this;
        for (const part of dirParts) {
          p = p.child(part);
        }
        return p;
      }
      /**
       * Returns the cached children Path objects, if still available.  If they
       * have fallen out of the cache, then returns an empty array, and resets the
       * READDIR_CALLED bit, so that future calls to readdir() will require an fs
       * lookup.
       *
       * @internal
       */
      children() {
        const cached = this.#children.get(this);
        if (cached) {
          return cached;
        }
        const children = Object.assign([], { provisional: 0 });
        this.#children.set(this, children);
        this.#type &= ~READDIR_CALLED;
        return children;
      }
      /**
       * Resolves a path portion and returns or creates the child Path.
       *
       * Returns `this` if pathPart is `''` or `'.'`, or `parent` if pathPart is
       * `'..'`.
       *
       * This should not be called directly.  If `pathPart` contains any path
       * separators, it will lead to unsafe undefined behavior.
       *
       * Use `Path.resolve()` instead.
       *
       * @internal
       */
      child(pathPart, opts) {
        if (pathPart === "" || pathPart === ".") {
          return this;
        }
        if (pathPart === "..") {
          return this.parent || this;
        }
        const children = this.children();
        const name = this.nocase ? normalizeNocase(pathPart) : normalize(pathPart);
        for (const p of children) {
          if (p.#matchName === name) {
            return p;
          }
        }
        const s = this.parent ? this.sep : "";
        const fullpath = this.#fullpath ? this.#fullpath + s + pathPart : void 0;
        const pchild = this.newChild(pathPart, UNKNOWN, {
          ...opts,
          parent: this,
          fullpath
        });
        if (!this.canReaddir()) {
          pchild.#type |= ENOENT;
        }
        children.push(pchild);
        return pchild;
      }
      /**
       * The relative path from the cwd. If it does not share an ancestor with
       * the cwd, then this ends up being equivalent to the fullpath()
       */
      relative() {
        if (this.#relative !== void 0) {
          return this.#relative;
        }
        const name = this.name;
        const p = this.parent;
        if (!p) {
          return this.#relative = this.name;
        }
        const pv = p.relative();
        return pv + (!pv || !p.parent ? "" : this.sep) + name;
      }
      /**
       * The relative path from the cwd, using / as the path separator.
       * If it does not share an ancestor with
       * the cwd, then this ends up being equivalent to the fullpathPosix()
       * On posix systems, this is identical to relative().
       */
      relativePosix() {
        if (this.sep === "/")
          return this.relative();
        if (this.#relativePosix !== void 0)
          return this.#relativePosix;
        const name = this.name;
        const p = this.parent;
        if (!p) {
          return this.#relativePosix = this.fullpathPosix();
        }
        const pv = p.relativePosix();
        return pv + (!pv || !p.parent ? "" : "/") + name;
      }
      /**
       * The fully resolved path string for this Path entry
       */
      fullpath() {
        if (this.#fullpath !== void 0) {
          return this.#fullpath;
        }
        const name = this.name;
        const p = this.parent;
        if (!p) {
          return this.#fullpath = this.name;
        }
        const pv = p.fullpath();
        const fp = pv + (!p.parent ? "" : this.sep) + name;
        return this.#fullpath = fp;
      }
      /**
       * On platforms other than windows, this is identical to fullpath.
       *
       * On windows, this is overridden to return the forward-slash form of the
       * full UNC path.
       */
      fullpathPosix() {
        if (this.#fullpathPosix !== void 0)
          return this.#fullpathPosix;
        if (this.sep === "/")
          return this.#fullpathPosix = this.fullpath();
        if (!this.parent) {
          const p2 = this.fullpath().replace(/\\/g, "/");
          if (/^[a-z]:\//i.test(p2)) {
            return this.#fullpathPosix = `//?/${p2}`;
          } else {
            return this.#fullpathPosix = p2;
          }
        }
        const p = this.parent;
        const pfpp = p.fullpathPosix();
        const fpp = pfpp + (!pfpp || !p.parent ? "" : "/") + this.name;
        return this.#fullpathPosix = fpp;
      }
      /**
       * Is the Path of an unknown type?
       *
       * Note that we might know *something* about it if there has been a previous
       * filesystem operation, for example that it does not exist, or is not a
       * link, or whether it has child entries.
       */
      isUnknown() {
        return (this.#type & IFMT) === UNKNOWN;
      }
      /**
       * Is the Path a regular file?
       */
      isFile() {
        return (this.#type & IFMT) === IFREG;
      }
      /**
       * Is the Path a directory?
       */
      isDirectory() {
        return (this.#type & IFMT) === IFDIR;
      }
      /**
       * Is the path a character device?
       */
      isCharacterDevice() {
        return (this.#type & IFMT) === IFCHR;
      }
      /**
       * Is the path a block device?
       */
      isBlockDevice() {
        return (this.#type & IFMT) === IFBLK;
      }
      /**
       * Is the path a FIFO pipe?
       */
      isFIFO() {
        return (this.#type & IFMT) === IFIFO;
      }
      /**
       * Is the path a socket?
       */
      isSocket() {
        return (this.#type & IFMT) === IFSOCK;
      }
      /**
       * Is the path a symbolic link?
       */
      isSymbolicLink() {
        return (this.#type & IFLNK) === IFLNK;
      }
      /**
       * Return the entry if it has been subject of a successful lstat, or
       * undefined otherwise.
       *
       * Does not read the filesystem, so an undefined result *could* simply
       * mean that we haven't called lstat on it.
       */
      lstatCached() {
        return this.#type & LSTAT_CALLED ? this : void 0;
      }
      /**
       * Return the cached link target if the entry has been the subject of a
       * successful readlink, or undefined otherwise.
       *
       * Does not read the filesystem, so an undefined result *could* just mean we
       * don't have any cached data. Only use it if you are very sure that a
       * readlink() has been called at some point.
       */
      readlinkCached() {
        return this.#linkTarget;
      }
      /**
       * Returns the cached realpath target if the entry has been the subject
       * of a successful realpath, or undefined otherwise.
       *
       * Does not read the filesystem, so an undefined result *could* just mean we
       * don't have any cached data. Only use it if you are very sure that a
       * realpath() has been called at some point.
       */
      realpathCached() {
        return this.#realpath;
      }
      /**
       * Returns the cached child Path entries array if the entry has been the
       * subject of a successful readdir(), or [] otherwise.
       *
       * Does not read the filesystem, so an empty array *could* just mean we
       * don't have any cached data. Only use it if you are very sure that a
       * readdir() has been called recently enough to still be valid.
       */
      readdirCached() {
        const children = this.children();
        return children.slice(0, children.provisional);
      }
      /**
       * Return true if it's worth trying to readlink.  Ie, we don't (yet) have
       * any indication that readlink will definitely fail.
       *
       * Returns false if the path is known to not be a symlink, if a previous
       * readlink failed, or if the entry does not exist.
       */
      canReadlink() {
        if (this.#linkTarget)
          return true;
        if (!this.parent)
          return false;
        const ifmt = this.#type & IFMT;
        return !(ifmt !== UNKNOWN && ifmt !== IFLNK || this.#type & ENOREADLINK || this.#type & ENOENT);
      }
      /**
       * Return true if readdir has previously been successfully called on this
       * path, indicating that cachedReaddir() is likely valid.
       */
      calledReaddir() {
        return !!(this.#type & READDIR_CALLED);
      }
      /**
       * Returns true if the path is known to not exist. That is, a previous lstat
       * or readdir failed to verify its existence when that would have been
       * expected, or a parent entry was marked either enoent or enotdir.
       */
      isENOENT() {
        return !!(this.#type & ENOENT);
      }
      /**
       * Return true if the path is a match for the given path name.  This handles
       * case sensitivity and unicode normalization.
       *
       * Note: even on case-sensitive systems, it is **not** safe to test the
       * equality of the `.name` property to determine whether a given pathname
       * matches, due to unicode normalization mismatches.
       *
       * Always use this method instead of testing the `path.name` property
       * directly.
       */
      isNamed(n) {
        return !this.nocase ? this.#matchName === normalize(n) : this.#matchName === normalizeNocase(n);
      }
      /**
       * Return the Path object corresponding to the target of a symbolic link.
       *
       * If the Path is not a symbolic link, or if the readlink call fails for any
       * reason, `undefined` is returned.
       *
       * Result is cached, and thus may be outdated if the filesystem is mutated.
       */
      async readlink() {
        const target = this.#linkTarget;
        if (target) {
          return target;
        }
        if (!this.canReadlink()) {
          return void 0;
        }
        if (!this.parent) {
          return void 0;
        }
        try {
          const read = await this.#fs.promises.readlink(this.fullpath());
          const linkTarget = this.parent.resolve(read);
          if (linkTarget) {
            return this.#linkTarget = linkTarget;
          }
        } catch (er) {
          this.#readlinkFail(er.code);
          return void 0;
        }
      }
      /**
       * Synchronous {@link PathBase.readlink}
       */
      readlinkSync() {
        const target = this.#linkTarget;
        if (target) {
          return target;
        }
        if (!this.canReadlink()) {
          return void 0;
        }
        if (!this.parent) {
          return void 0;
        }
        try {
          const read = this.#fs.readlinkSync(this.fullpath());
          const linkTarget = this.parent.resolve(read);
          if (linkTarget) {
            return this.#linkTarget = linkTarget;
          }
        } catch (er) {
          this.#readlinkFail(er.code);
          return void 0;
        }
      }
      #readdirSuccess(children) {
        this.#type |= READDIR_CALLED;
        for (let p = children.provisional; p < children.length; p++) {
          children[p].#markENOENT();
        }
      }
      #markENOENT() {
        if (this.#type & ENOENT)
          return;
        this.#type = (this.#type | ENOENT) & IFMT_UNKNOWN;
        this.#markChildrenENOENT();
      }
      #markChildrenENOENT() {
        const children = this.children();
        children.provisional = 0;
        for (const p of children) {
          p.#markENOENT();
        }
      }
      #markENOREALPATH() {
        this.#type |= ENOREALPATH;
        this.#markENOTDIR();
      }
      // save the information when we know the entry is not a dir
      #markENOTDIR() {
        if (this.#type & ENOTDIR)
          return;
        let t = this.#type;
        if ((t & IFMT) === IFDIR)
          t &= IFMT_UNKNOWN;
        this.#type = t | ENOTDIR;
        this.#markChildrenENOENT();
      }
      #readdirFail(code = "") {
        if (code === "ENOTDIR" || code === "EPERM") {
          this.#markENOTDIR();
        } else if (code === "ENOENT") {
          this.#markENOENT();
        } else {
          this.children().provisional = 0;
        }
      }
      #lstatFail(code = "") {
        if (code === "ENOTDIR") {
          const p = this.parent;
          p.#markENOTDIR();
        } else if (code === "ENOENT") {
          this.#markENOENT();
        }
      }
      #readlinkFail(code = "") {
        let ter = this.#type;
        ter |= ENOREADLINK;
        if (code === "ENOENT")
          ter |= ENOENT;
        if (code === "EINVAL" || code === "UNKNOWN") {
          ter &= IFMT_UNKNOWN;
        }
        this.#type = ter;
        if (code === "ENOTDIR" && this.parent) {
          this.parent.#markENOTDIR();
        }
      }
      #readdirAddChild(e, c) {
        return this.#readdirMaybePromoteChild(e, c) || this.#readdirAddNewChild(e, c);
      }
      #readdirAddNewChild(e, c) {
        const type = entToType(e);
        const child = this.newChild(e.name, type, { parent: this });
        const ifmt = child.#type & IFMT;
        if (ifmt !== IFDIR && ifmt !== IFLNK && ifmt !== UNKNOWN) {
          child.#type |= ENOTDIR;
        }
        c.unshift(child);
        c.provisional++;
        return child;
      }
      #readdirMaybePromoteChild(e, c) {
        for (let p = c.provisional; p < c.length; p++) {
          const pchild = c[p];
          const name = this.nocase ? normalizeNocase(e.name) : normalize(e.name);
          if (name !== pchild.#matchName) {
            continue;
          }
          return this.#readdirPromoteChild(e, pchild, p, c);
        }
      }
      #readdirPromoteChild(e, p, index, c) {
        const v = p.name;
        p.#type = p.#type & IFMT_UNKNOWN | entToType(e);
        if (v !== e.name)
          p.name = e.name;
        if (index !== c.provisional) {
          if (index === c.length - 1)
            c.pop();
          else
            c.splice(index, 1);
          c.unshift(p);
        }
        c.provisional++;
        return p;
      }
      /**
       * Call lstat() on this Path, and update all known information that can be
       * determined.
       *
       * Note that unlike `fs.lstat()`, the returned value does not contain some
       * information, such as `mode`, `dev`, `nlink`, and `ino`.  If that
       * information is required, you will need to call `fs.lstat` yourself.
       *
       * If the Path refers to a nonexistent file, or if the lstat call fails for
       * any reason, `undefined` is returned.  Otherwise the updated Path object is
       * returned.
       *
       * Results are cached, and thus may be out of date if the filesystem is
       * mutated.
       */
      async lstat() {
        if ((this.#type & ENOENT) === 0) {
          try {
            this.#applyStat(await this.#fs.promises.lstat(this.fullpath()));
            return this;
          } catch (er) {
            this.#lstatFail(er.code);
          }
        }
      }
      /**
       * synchronous {@link PathBase.lstat}
       */
      lstatSync() {
        if ((this.#type & ENOENT) === 0) {
          try {
            this.#applyStat(this.#fs.lstatSync(this.fullpath()));
            return this;
          } catch (er) {
            this.#lstatFail(er.code);
          }
        }
      }
      #applyStat(st) {
        const { atime, atimeMs, birthtime, birthtimeMs, blksize, blocks, ctime, ctimeMs, dev, gid, ino, mode, mtime, mtimeMs, nlink, rdev, size, uid } = st;
        this.#atime = atime;
        this.#atimeMs = atimeMs;
        this.#birthtime = birthtime;
        this.#birthtimeMs = birthtimeMs;
        this.#blksize = blksize;
        this.#blocks = blocks;
        this.#ctime = ctime;
        this.#ctimeMs = ctimeMs;
        this.#dev = dev;
        this.#gid = gid;
        this.#ino = ino;
        this.#mode = mode;
        this.#mtime = mtime;
        this.#mtimeMs = mtimeMs;
        this.#nlink = nlink;
        this.#rdev = rdev;
        this.#size = size;
        this.#uid = uid;
        const ifmt = entToType(st);
        this.#type = this.#type & IFMT_UNKNOWN | ifmt | LSTAT_CALLED;
        if (ifmt !== UNKNOWN && ifmt !== IFDIR && ifmt !== IFLNK) {
          this.#type |= ENOTDIR;
        }
      }
      #onReaddirCB = [];
      #readdirCBInFlight = false;
      #callOnReaddirCB(children) {
        this.#readdirCBInFlight = false;
        const cbs = this.#onReaddirCB.slice();
        this.#onReaddirCB.length = 0;
        cbs.forEach((cb) => cb(null, children));
      }
      /**
       * Standard node-style callback interface to get list of directory entries.
       *
       * If the Path cannot or does not contain any children, then an empty array
       * is returned.
       *
       * Results are cached, and thus may be out of date if the filesystem is
       * mutated.
       *
       * @param cb The callback called with (er, entries).  Note that the `er`
       * param is somewhat extraneous, as all readdir() errors are handled and
       * simply result in an empty set of entries being returned.
       * @param allowZalgo Boolean indicating that immediately known results should
       * *not* be deferred with `queueMicrotask`. Defaults to `false`. Release
       * zalgo at your peril, the dark pony lord is devious and unforgiving.
       */
      readdirCB(cb, allowZalgo = false) {
        if (!this.canReaddir()) {
          if (allowZalgo)
            cb(null, []);
          else
            queueMicrotask(() => cb(null, []));
          return;
        }
        const children = this.children();
        if (this.calledReaddir()) {
          const c = children.slice(0, children.provisional);
          if (allowZalgo)
            cb(null, c);
          else
            queueMicrotask(() => cb(null, c));
          return;
        }
        this.#onReaddirCB.push(cb);
        if (this.#readdirCBInFlight) {
          return;
        }
        this.#readdirCBInFlight = true;
        const fullpath = this.fullpath();
        this.#fs.readdir(fullpath, { withFileTypes: true }, (er, entries) => {
          if (er) {
            this.#readdirFail(er.code);
            children.provisional = 0;
          } else {
            for (const e of entries) {
              this.#readdirAddChild(e, children);
            }
            this.#readdirSuccess(children);
          }
          this.#callOnReaddirCB(children.slice(0, children.provisional));
          return;
        });
      }
      #asyncReaddirInFlight;
      /**
       * Return an array of known child entries.
       *
       * If the Path cannot or does not contain any children, then an empty array
       * is returned.
       *
       * Results are cached, and thus may be out of date if the filesystem is
       * mutated.
       */
      async readdir() {
        if (!this.canReaddir()) {
          return [];
        }
        const children = this.children();
        if (this.calledReaddir()) {
          return children.slice(0, children.provisional);
        }
        const fullpath = this.fullpath();
        if (this.#asyncReaddirInFlight) {
          await this.#asyncReaddirInFlight;
        } else {
          let resolve = () => {
          };
          this.#asyncReaddirInFlight = new Promise((res) => resolve = res);
          try {
            for (const e of await this.#fs.promises.readdir(fullpath, {
              withFileTypes: true
            })) {
              this.#readdirAddChild(e, children);
            }
            this.#readdirSuccess(children);
          } catch (er) {
            this.#readdirFail(er.code);
            children.provisional = 0;
          }
          this.#asyncReaddirInFlight = void 0;
          resolve();
        }
        return children.slice(0, children.provisional);
      }
      /**
       * synchronous {@link PathBase.readdir}
       */
      readdirSync() {
        if (!this.canReaddir()) {
          return [];
        }
        const children = this.children();
        if (this.calledReaddir()) {
          return children.slice(0, children.provisional);
        }
        const fullpath = this.fullpath();
        try {
          for (const e of this.#fs.readdirSync(fullpath, {
            withFileTypes: true
          })) {
            this.#readdirAddChild(e, children);
          }
          this.#readdirSuccess(children);
        } catch (er) {
          this.#readdirFail(er.code);
          children.provisional = 0;
        }
        return children.slice(0, children.provisional);
      }
      canReaddir() {
        if (this.#type & ENOCHILD)
          return false;
        const ifmt = IFMT & this.#type;
        if (!(ifmt === UNKNOWN || ifmt === IFDIR || ifmt === IFLNK)) {
          return false;
        }
        return true;
      }
      shouldWalk(dirs, walkFilter) {
        return (this.#type & IFDIR) === IFDIR && !(this.#type & ENOCHILD) && !dirs.has(this) && (!walkFilter || walkFilter(this));
      }
      /**
       * Return the Path object corresponding to path as resolved
       * by realpath(3).
       *
       * If the realpath call fails for any reason, `undefined` is returned.
       *
       * Result is cached, and thus may be outdated if the filesystem is mutated.
       * On success, returns a Path object.
       */
      async realpath() {
        if (this.#realpath)
          return this.#realpath;
        if ((ENOREALPATH | ENOREADLINK | ENOENT) & this.#type)
          return void 0;
        try {
          const rp = await this.#fs.promises.realpath(this.fullpath());
          return this.#realpath = this.resolve(rp);
        } catch (_) {
          this.#markENOREALPATH();
        }
      }
      /**
       * Synchronous {@link realpath}
       */
      realpathSync() {
        if (this.#realpath)
          return this.#realpath;
        if ((ENOREALPATH | ENOREADLINK | ENOENT) & this.#type)
          return void 0;
        try {
          const rp = this.#fs.realpathSync(this.fullpath());
          return this.#realpath = this.resolve(rp);
        } catch (_) {
          this.#markENOREALPATH();
        }
      }
      /**
       * Internal method to mark this Path object as the scurry cwd,
       * called by {@link PathScurry#chdir}
       *
       * @internal
       */
      [setAsCwd](oldCwd) {
        if (oldCwd === this)
          return;
        const changed = /* @__PURE__ */ new Set([]);
        let rp = [];
        let p = this;
        while (p && p.parent) {
          changed.add(p);
          p.#relative = rp.join(this.sep);
          p.#relativePosix = rp.join("/");
          p = p.parent;
          rp.push("..");
        }
        p = oldCwd;
        while (p && p.parent && !changed.has(p)) {
          p.#relative = void 0;
          p.#relativePosix = void 0;
          p = p.parent;
        }
      }
    };
    exports2.PathBase = PathBase;
    var PathWin32 = class extends PathBase {
      /**
       * Separator for generating path strings.
       */
      sep = "\\";
      /**
       * Separator for parsing path strings.
       */
      splitSep = eitherSep;
      /**
       * Do not create new Path objects directly.  They should always be accessed
       * via the PathScurry class or other methods on the Path class.
       *
       * @internal
       */
      constructor(name, type = UNKNOWN, root, roots, nocase, children, opts) {
        super(name, type, root, roots, nocase, children, opts);
      }
      /**
       * @internal
       */
      newChild(name, type = UNKNOWN, opts = {}) {
        return new PathWin32(name, type, this.root, this.roots, this.nocase, this.childrenCache(), opts);
      }
      /**
       * @internal
       */
      getRootString(path) {
        return path_1.win32.parse(path).root;
      }
      /**
       * @internal
       */
      getRoot(rootPath) {
        rootPath = uncToDrive(rootPath.toUpperCase());
        if (rootPath === this.root.name) {
          return this.root;
        }
        for (const [compare, root] of Object.entries(this.roots)) {
          if (this.sameRoot(rootPath, compare)) {
            return this.roots[rootPath] = root;
          }
        }
        return this.roots[rootPath] = new PathScurryWin32(rootPath, this).root;
      }
      /**
       * @internal
       */
      sameRoot(rootPath, compare = this.root.name) {
        rootPath = rootPath.toUpperCase().replace(/\//g, "\\").replace(uncDriveRegexp, "$1\\");
        return rootPath === compare;
      }
    };
    exports2.PathWin32 = PathWin32;
    var PathPosix = class extends PathBase {
      /**
       * separator for parsing path strings
       */
      splitSep = "/";
      /**
       * separator for generating path strings
       */
      sep = "/";
      /**
       * Do not create new Path objects directly.  They should always be accessed
       * via the PathScurry class or other methods on the Path class.
       *
       * @internal
       */
      constructor(name, type = UNKNOWN, root, roots, nocase, children, opts) {
        super(name, type, root, roots, nocase, children, opts);
      }
      /**
       * @internal
       */
      getRootString(path) {
        return path.startsWith("/") ? "/" : "";
      }
      /**
       * @internal
       */
      getRoot(_rootPath) {
        return this.root;
      }
      /**
       * @internal
       */
      newChild(name, type = UNKNOWN, opts = {}) {
        return new PathPosix(name, type, this.root, this.roots, this.nocase, this.childrenCache(), opts);
      }
    };
    exports2.PathPosix = PathPosix;
    var PathScurryBase = class {
      /**
       * The root Path entry for the current working directory of this Scurry
       */
      root;
      /**
       * The string path for the root of this Scurry's current working directory
       */
      rootPath;
      /**
       * A collection of all roots encountered, referenced by rootPath
       */
      roots;
      /**
       * The Path entry corresponding to this PathScurry's current working directory.
       */
      cwd;
      #resolveCache;
      #resolvePosixCache;
      #children;
      /**
       * Perform path comparisons case-insensitively.
       *
       * Defaults true on Darwin and Windows systems, false elsewhere.
       */
      nocase;
      #fs;
      /**
       * This class should not be instantiated directly.
       *
       * Use PathScurryWin32, PathScurryDarwin, PathScurryPosix, or PathScurry
       *
       * @internal
       */
      constructor(cwd = process.cwd(), pathImpl, sep, { nocase, childrenCacheSize = 16 * 1024, fs = defaultFS } = {}) {
        this.#fs = fsFromOption(fs);
        if (cwd instanceof URL || cwd.startsWith("file://")) {
          cwd = (0, url_1.fileURLToPath)(cwd);
        }
        const cwdPath = pathImpl.resolve(cwd);
        this.roots = /* @__PURE__ */ Object.create(null);
        this.rootPath = this.parseRootPath(cwdPath);
        this.#resolveCache = new ResolveCache();
        this.#resolvePosixCache = new ResolveCache();
        this.#children = new ChildrenCache(childrenCacheSize);
        const split = cwdPath.substring(this.rootPath.length).split(sep);
        if (split.length === 1 && !split[0]) {
          split.pop();
        }
        if (nocase === void 0) {
          throw new TypeError("must provide nocase setting to PathScurryBase ctor");
        }
        this.nocase = nocase;
        this.root = this.newRoot(this.#fs);
        this.roots[this.rootPath] = this.root;
        let prev = this.root;
        let len = split.length - 1;
        const joinSep = pathImpl.sep;
        let abs = this.rootPath;
        let sawFirst = false;
        for (const part of split) {
          const l = len--;
          prev = prev.child(part, {
            relative: new Array(l).fill("..").join(joinSep),
            relativePosix: new Array(l).fill("..").join("/"),
            fullpath: abs += (sawFirst ? "" : joinSep) + part
          });
          sawFirst = true;
        }
        this.cwd = prev;
      }
      /**
       * Get the depth of a provided path, string, or the cwd
       */
      depth(path = this.cwd) {
        if (typeof path === "string") {
          path = this.cwd.resolve(path);
        }
        return path.depth();
      }
      /**
       * Return the cache of child entries.  Exposed so subclasses can create
       * child Path objects in a platform-specific way.
       *
       * @internal
       */
      childrenCache() {
        return this.#children;
      }
      /**
       * Resolve one or more path strings to a resolved string
       *
       * Same interface as require('path').resolve.
       *
       * Much faster than path.resolve() when called multiple times for the same
       * path, because the resolved Path objects are cached.  Much slower
       * otherwise.
       */
      resolve(...paths) {
        let r = "";
        for (let i = paths.length - 1; i >= 0; i--) {
          const p = paths[i];
          if (!p || p === ".")
            continue;
          r = r ? `${p}/${r}` : p;
          if (this.isAbsolute(p)) {
            break;
          }
        }
        const cached = this.#resolveCache.get(r);
        if (cached !== void 0) {
          return cached;
        }
        const result = this.cwd.resolve(r).fullpath();
        this.#resolveCache.set(r, result);
        return result;
      }
      /**
       * Resolve one or more path strings to a resolved string, returning
       * the posix path.  Identical to .resolve() on posix systems, but on
       * windows will return a forward-slash separated UNC path.
       *
       * Same interface as require('path').resolve.
       *
       * Much faster than path.resolve() when called multiple times for the same
       * path, because the resolved Path objects are cached.  Much slower
       * otherwise.
       */
      resolvePosix(...paths) {
        let r = "";
        for (let i = paths.length - 1; i >= 0; i--) {
          const p = paths[i];
          if (!p || p === ".")
            continue;
          r = r ? `${p}/${r}` : p;
          if (this.isAbsolute(p)) {
            break;
          }
        }
        const cached = this.#resolvePosixCache.get(r);
        if (cached !== void 0) {
          return cached;
        }
        const result = this.cwd.resolve(r).fullpathPosix();
        this.#resolvePosixCache.set(r, result);
        return result;
      }
      /**
       * find the relative path from the cwd to the supplied path string or entry
       */
      relative(entry = this.cwd) {
        if (typeof entry === "string") {
          entry = this.cwd.resolve(entry);
        }
        return entry.relative();
      }
      /**
       * find the relative path from the cwd to the supplied path string or
       * entry, using / as the path delimiter, even on Windows.
       */
      relativePosix(entry = this.cwd) {
        if (typeof entry === "string") {
          entry = this.cwd.resolve(entry);
        }
        return entry.relativePosix();
      }
      /**
       * Return the basename for the provided string or Path object
       */
      basename(entry = this.cwd) {
        if (typeof entry === "string") {
          entry = this.cwd.resolve(entry);
        }
        return entry.name;
      }
      /**
       * Return the dirname for the provided string or Path object
       */
      dirname(entry = this.cwd) {
        if (typeof entry === "string") {
          entry = this.cwd.resolve(entry);
        }
        return (entry.parent || entry).fullpath();
      }
      async readdir(entry = this.cwd, opts = {
        withFileTypes: true
      }) {
        if (typeof entry === "string") {
          entry = this.cwd.resolve(entry);
        } else if (!(entry instanceof PathBase)) {
          opts = entry;
          entry = this.cwd;
        }
        const { withFileTypes } = opts;
        if (!entry.canReaddir()) {
          return [];
        } else {
          const p = await entry.readdir();
          return withFileTypes ? p : p.map((e) => e.name);
        }
      }
      readdirSync(entry = this.cwd, opts = {
        withFileTypes: true
      }) {
        if (typeof entry === "string") {
          entry = this.cwd.resolve(entry);
        } else if (!(entry instanceof PathBase)) {
          opts = entry;
          entry = this.cwd;
        }
        const { withFileTypes = true } = opts;
        if (!entry.canReaddir()) {
          return [];
        } else if (withFileTypes) {
          return entry.readdirSync();
        } else {
          return entry.readdirSync().map((e) => e.name);
        }
      }
      /**
       * Call lstat() on the string or Path object, and update all known
       * information that can be determined.
       *
       * Note that unlike `fs.lstat()`, the returned value does not contain some
       * information, such as `mode`, `dev`, `nlink`, and `ino`.  If that
       * information is required, you will need to call `fs.lstat` yourself.
       *
       * If the Path refers to a nonexistent file, or if the lstat call fails for
       * any reason, `undefined` is returned.  Otherwise the updated Path object is
       * returned.
       *
       * Results are cached, and thus may be out of date if the filesystem is
       * mutated.
       */
      async lstat(entry = this.cwd) {
        if (typeof entry === "string") {
          entry = this.cwd.resolve(entry);
        }
        return entry.lstat();
      }
      /**
       * synchronous {@link PathScurryBase.lstat}
       */
      lstatSync(entry = this.cwd) {
        if (typeof entry === "string") {
          entry = this.cwd.resolve(entry);
        }
        return entry.lstatSync();
      }
      async readlink(entry = this.cwd, { withFileTypes } = {
        withFileTypes: false
      }) {
        if (typeof entry === "string") {
          entry = this.cwd.resolve(entry);
        } else if (!(entry instanceof PathBase)) {
          withFileTypes = entry.withFileTypes;
          entry = this.cwd;
        }
        const e = await entry.readlink();
        return withFileTypes ? e : e?.fullpath();
      }
      readlinkSync(entry = this.cwd, { withFileTypes } = {
        withFileTypes: false
      }) {
        if (typeof entry === "string") {
          entry = this.cwd.resolve(entry);
        } else if (!(entry instanceof PathBase)) {
          withFileTypes = entry.withFileTypes;
          entry = this.cwd;
        }
        const e = entry.readlinkSync();
        return withFileTypes ? e : e?.fullpath();
      }
      async realpath(entry = this.cwd, { withFileTypes } = {
        withFileTypes: false
      }) {
        if (typeof entry === "string") {
          entry = this.cwd.resolve(entry);
        } else if (!(entry instanceof PathBase)) {
          withFileTypes = entry.withFileTypes;
          entry = this.cwd;
        }
        const e = await entry.realpath();
        return withFileTypes ? e : e?.fullpath();
      }
      realpathSync(entry = this.cwd, { withFileTypes } = {
        withFileTypes: false
      }) {
        if (typeof entry === "string") {
          entry = this.cwd.resolve(entry);
        } else if (!(entry instanceof PathBase)) {
          withFileTypes = entry.withFileTypes;
          entry = this.cwd;
        }
        const e = entry.realpathSync();
        return withFileTypes ? e : e?.fullpath();
      }
      async walk(entry = this.cwd, opts = {}) {
        if (typeof entry === "string") {
          entry = this.cwd.resolve(entry);
        } else if (!(entry instanceof PathBase)) {
          opts = entry;
          entry = this.cwd;
        }
        const { withFileTypes = true, follow = false, filter, walkFilter } = opts;
        const results = [];
        if (!filter || filter(entry)) {
          results.push(withFileTypes ? entry : entry.fullpath());
        }
        const dirs = /* @__PURE__ */ new Set();
        const walk = (dir, cb) => {
          dirs.add(dir);
          dir.readdirCB((er, entries) => {
            if (er) {
              return cb(er);
            }
            let len = entries.length;
            if (!len)
              return cb();
            const next = () => {
              if (--len === 0) {
                cb();
              }
            };
            for (const e of entries) {
              if (!filter || filter(e)) {
                results.push(withFileTypes ? e : e.fullpath());
              }
              if (follow && e.isSymbolicLink()) {
                e.realpath().then((r) => r?.isUnknown() ? r.lstat() : r).then((r) => r?.shouldWalk(dirs, walkFilter) ? walk(r, next) : next());
              } else {
                if (e.shouldWalk(dirs, walkFilter)) {
                  walk(e, next);
                } else {
                  next();
                }
              }
            }
          }, true);
        };
        const start = entry;
        return new Promise((res, rej) => {
          walk(start, (er) => {
            if (er)
              return rej(er);
            res(results);
          });
        });
      }
      walkSync(entry = this.cwd, opts = {}) {
        if (typeof entry === "string") {
          entry = this.cwd.resolve(entry);
        } else if (!(entry instanceof PathBase)) {
          opts = entry;
          entry = this.cwd;
        }
        const { withFileTypes = true, follow = false, filter, walkFilter } = opts;
        const results = [];
        if (!filter || filter(entry)) {
          results.push(withFileTypes ? entry : entry.fullpath());
        }
        const dirs = /* @__PURE__ */ new Set([entry]);
        for (const dir of dirs) {
          const entries = dir.readdirSync();
          for (const e of entries) {
            if (!filter || filter(e)) {
              results.push(withFileTypes ? e : e.fullpath());
            }
            let r = e;
            if (e.isSymbolicLink()) {
              if (!(follow && (r = e.realpathSync())))
                continue;
              if (r.isUnknown())
                r.lstatSync();
            }
            if (r.shouldWalk(dirs, walkFilter)) {
              dirs.add(r);
            }
          }
        }
        return results;
      }
      /**
       * Support for `for await`
       *
       * Alias for {@link PathScurryBase.iterate}
       *
       * Note: As of Node 19, this is very slow, compared to other methods of
       * walking.  Consider using {@link PathScurryBase.stream} if memory overhead
       * and backpressure are concerns, or {@link PathScurryBase.walk} if not.
       */
      [Symbol.asyncIterator]() {
        return this.iterate();
      }
      iterate(entry = this.cwd, options = {}) {
        if (typeof entry === "string") {
          entry = this.cwd.resolve(entry);
        } else if (!(entry instanceof PathBase)) {
          options = entry;
          entry = this.cwd;
        }
        return this.stream(entry, options)[Symbol.asyncIterator]();
      }
      /**
       * Iterating over a PathScurry performs a synchronous walk.
       *
       * Alias for {@link PathScurryBase.iterateSync}
       */
      [Symbol.iterator]() {
        return this.iterateSync();
      }
      *iterateSync(entry = this.cwd, opts = {}) {
        if (typeof entry === "string") {
          entry = this.cwd.resolve(entry);
        } else if (!(entry instanceof PathBase)) {
          opts = entry;
          entry = this.cwd;
        }
        const { withFileTypes = true, follow = false, filter, walkFilter } = opts;
        if (!filter || filter(entry)) {
          yield withFileTypes ? entry : entry.fullpath();
        }
        const dirs = /* @__PURE__ */ new Set([entry]);
        for (const dir of dirs) {
          const entries = dir.readdirSync();
          for (const e of entries) {
            if (!filter || filter(e)) {
              yield withFileTypes ? e : e.fullpath();
            }
            let r = e;
            if (e.isSymbolicLink()) {
              if (!(follow && (r = e.realpathSync())))
                continue;
              if (r.isUnknown())
                r.lstatSync();
            }
            if (r.shouldWalk(dirs, walkFilter)) {
              dirs.add(r);
            }
          }
        }
      }
      stream(entry = this.cwd, opts = {}) {
        if (typeof entry === "string") {
          entry = this.cwd.resolve(entry);
        } else if (!(entry instanceof PathBase)) {
          opts = entry;
          entry = this.cwd;
        }
        const { withFileTypes = true, follow = false, filter, walkFilter } = opts;
        const results = new minipass_1.Minipass({ objectMode: true });
        if (!filter || filter(entry)) {
          results.write(withFileTypes ? entry : entry.fullpath());
        }
        const dirs = /* @__PURE__ */ new Set();
        const queue = [entry];
        let processing = 0;
        const process2 = () => {
          let paused = false;
          while (!paused) {
            const dir = queue.shift();
            if (!dir) {
              if (processing === 0)
                results.end();
              return;
            }
            processing++;
            dirs.add(dir);
            const onReaddir = (er, entries, didRealpaths = false) => {
              if (er)
                return results.emit("error", er);
              if (follow && !didRealpaths) {
                const promises = [];
                for (const e of entries) {
                  if (e.isSymbolicLink()) {
                    promises.push(e.realpath().then((r) => r?.isUnknown() ? r.lstat() : r));
                  }
                }
                if (promises.length) {
                  Promise.all(promises).then(() => onReaddir(null, entries, true));
                  return;
                }
              }
              for (const e of entries) {
                if (e && (!filter || filter(e))) {
                  if (!results.write(withFileTypes ? e : e.fullpath())) {
                    paused = true;
                  }
                }
              }
              processing--;
              for (const e of entries) {
                const r = e.realpathCached() || e;
                if (r.shouldWalk(dirs, walkFilter)) {
                  queue.push(r);
                }
              }
              if (paused && !results.flowing) {
                results.once("drain", process2);
              } else if (!sync) {
                process2();
              }
            };
            let sync = true;
            dir.readdirCB(onReaddir, true);
            sync = false;
          }
        };
        process2();
        return results;
      }
      streamSync(entry = this.cwd, opts = {}) {
        if (typeof entry === "string") {
          entry = this.cwd.resolve(entry);
        } else if (!(entry instanceof PathBase)) {
          opts = entry;
          entry = this.cwd;
        }
        const { withFileTypes = true, follow = false, filter, walkFilter } = opts;
        const results = new minipass_1.Minipass({ objectMode: true });
        const dirs = /* @__PURE__ */ new Set();
        if (!filter || filter(entry)) {
          results.write(withFileTypes ? entry : entry.fullpath());
        }
        const queue = [entry];
        let processing = 0;
        const process2 = () => {
          let paused = false;
          while (!paused) {
            const dir = queue.shift();
            if (!dir) {
              if (processing === 0)
                results.end();
              return;
            }
            processing++;
            dirs.add(dir);
            const entries = dir.readdirSync();
            for (const e of entries) {
              if (!filter || filter(e)) {
                if (!results.write(withFileTypes ? e : e.fullpath())) {
                  paused = true;
                }
              }
            }
            processing--;
            for (const e of entries) {
              let r = e;
              if (e.isSymbolicLink()) {
                if (!(follow && (r = e.realpathSync())))
                  continue;
                if (r.isUnknown())
                  r.lstatSync();
              }
              if (r.shouldWalk(dirs, walkFilter)) {
                queue.push(r);
              }
            }
          }
          if (paused && !results.flowing)
            results.once("drain", process2);
        };
        process2();
        return results;
      }
      chdir(path = this.cwd) {
        const oldCwd = this.cwd;
        this.cwd = typeof path === "string" ? this.cwd.resolve(path) : path;
        this.cwd[setAsCwd](oldCwd);
      }
    };
    exports2.PathScurryBase = PathScurryBase;
    var PathScurryWin32 = class extends PathScurryBase {
      /**
       * separator for generating path strings
       */
      sep = "\\";
      constructor(cwd = process.cwd(), opts = {}) {
        const { nocase = true } = opts;
        super(cwd, path_1.win32, "\\", { ...opts, nocase });
        this.nocase = nocase;
        for (let p = this.cwd; p; p = p.parent) {
          p.nocase = this.nocase;
        }
      }
      /**
       * @internal
       */
      parseRootPath(dir) {
        return path_1.win32.parse(dir).root.toUpperCase();
      }
      /**
       * @internal
       */
      newRoot(fs) {
        return new PathWin32(this.rootPath, IFDIR, void 0, this.roots, this.nocase, this.childrenCache(), { fs });
      }
      /**
       * Return true if the provided path string is an absolute path
       */
      isAbsolute(p) {
        return p.startsWith("/") || p.startsWith("\\") || /^[a-z]:(\/|\\)/i.test(p);
      }
    };
    exports2.PathScurryWin32 = PathScurryWin32;
    var PathScurryPosix = class extends PathScurryBase {
      /**
       * separator for generating path strings
       */
      sep = "/";
      constructor(cwd = process.cwd(), opts = {}) {
        const { nocase = false } = opts;
        super(cwd, path_1.posix, "/", { ...opts, nocase });
        this.nocase = nocase;
      }
      /**
       * @internal
       */
      parseRootPath(_dir) {
        return "/";
      }
      /**
       * @internal
       */
      newRoot(fs) {
        return new PathPosix(this.rootPath, IFDIR, void 0, this.roots, this.nocase, this.childrenCache(), { fs });
      }
      /**
       * Return true if the provided path string is an absolute path
       */
      isAbsolute(p) {
        return p.startsWith("/");
      }
    };
    exports2.PathScurryPosix = PathScurryPosix;
    var PathScurryDarwin = class extends PathScurryPosix {
      constructor(cwd = process.cwd(), opts = {}) {
        const { nocase = true } = opts;
        super(cwd, { ...opts, nocase });
      }
    };
    exports2.PathScurryDarwin = PathScurryDarwin;
    exports2.Path = process.platform === "win32" ? PathWin32 : PathPosix;
    exports2.PathScurry = process.platform === "win32" ? PathScurryWin32 : process.platform === "darwin" ? PathScurryDarwin : PathScurryPosix;
  }
});

// node_modules/glob/dist/cjs/src/pattern.js
var require_pattern = __commonJS({
  "node_modules/glob/dist/cjs/src/pattern.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Pattern = void 0;
    var minimatch_1 = require_cjs();
    var isPatternList = (pl) => pl.length >= 1;
    var isGlobList = (gl) => gl.length >= 1;
    var Pattern = class {
      #patternList;
      #globList;
      #index;
      length;
      #platform;
      #rest;
      #globString;
      #isDrive;
      #isUNC;
      #isAbsolute;
      #followGlobstar = true;
      constructor(patternList, globList, index, platform) {
        if (!isPatternList(patternList)) {
          throw new TypeError("empty pattern list");
        }
        if (!isGlobList(globList)) {
          throw new TypeError("empty glob list");
        }
        if (globList.length !== patternList.length) {
          throw new TypeError("mismatched pattern list and glob list lengths");
        }
        this.length = patternList.length;
        if (index < 0 || index >= this.length) {
          throw new TypeError("index out of range");
        }
        this.#patternList = patternList;
        this.#globList = globList;
        this.#index = index;
        this.#platform = platform;
        if (this.#index === 0) {
          if (this.isUNC()) {
            const [p0, p1, p2, p3, ...prest] = this.#patternList;
            const [g0, g1, g2, g3, ...grest] = this.#globList;
            if (prest[0] === "") {
              prest.shift();
              grest.shift();
            }
            const p = [p0, p1, p2, p3, ""].join("/");
            const g = [g0, g1, g2, g3, ""].join("/");
            this.#patternList = [p, ...prest];
            this.#globList = [g, ...grest];
            this.length = this.#patternList.length;
          } else if (this.isDrive() || this.isAbsolute()) {
            const [p1, ...prest] = this.#patternList;
            const [g1, ...grest] = this.#globList;
            if (prest[0] === "") {
              prest.shift();
              grest.shift();
            }
            const p = p1 + "/";
            const g = g1 + "/";
            this.#patternList = [p, ...prest];
            this.#globList = [g, ...grest];
            this.length = this.#patternList.length;
          }
        }
      }
      /**
       * The first entry in the parsed list of patterns
       */
      pattern() {
        return this.#patternList[this.#index];
      }
      /**
       * true of if pattern() returns a string
       */
      isString() {
        return typeof this.#patternList[this.#index] === "string";
      }
      /**
       * true of if pattern() returns GLOBSTAR
       */
      isGlobstar() {
        return this.#patternList[this.#index] === minimatch_1.GLOBSTAR;
      }
      /**
       * true if pattern() returns a regexp
       */
      isRegExp() {
        return this.#patternList[this.#index] instanceof RegExp;
      }
      /**
       * The /-joined set of glob parts that make up this pattern
       */
      globString() {
        return this.#globString = this.#globString || (this.#index === 0 ? this.isAbsolute() ? this.#globList[0] + this.#globList.slice(1).join("/") : this.#globList.join("/") : this.#globList.slice(this.#index).join("/"));
      }
      /**
       * true if there are more pattern parts after this one
       */
      hasMore() {
        return this.length > this.#index + 1;
      }
      /**
       * The rest of the pattern after this part, or null if this is the end
       */
      rest() {
        if (this.#rest !== void 0)
          return this.#rest;
        if (!this.hasMore())
          return this.#rest = null;
        this.#rest = new Pattern(this.#patternList, this.#globList, this.#index + 1, this.#platform);
        this.#rest.#isAbsolute = this.#isAbsolute;
        this.#rest.#isUNC = this.#isUNC;
        this.#rest.#isDrive = this.#isDrive;
        return this.#rest;
      }
      /**
       * true if the pattern represents a //unc/path/ on windows
       */
      isUNC() {
        const pl = this.#patternList;
        return this.#isUNC !== void 0 ? this.#isUNC : this.#isUNC = this.#platform === "win32" && this.#index === 0 && pl[0] === "" && pl[1] === "" && typeof pl[2] === "string" && !!pl[2] && typeof pl[3] === "string" && !!pl[3];
      }
      // pattern like C:/...
      // split = ['C:', ...]
      // XXX: would be nice to handle patterns like `c:*` to test the cwd
      // in c: for *, but I don't know of a way to even figure out what that
      // cwd is without actually chdir'ing into it?
      /**
       * True if the pattern starts with a drive letter on Windows
       */
      isDrive() {
        const pl = this.#patternList;
        return this.#isDrive !== void 0 ? this.#isDrive : this.#isDrive = this.#platform === "win32" && this.#index === 0 && this.length > 1 && typeof pl[0] === "string" && /^[a-z]:$/i.test(pl[0]);
      }
      // pattern = '/' or '/...' or '/x/...'
      // split = ['', ''] or ['', ...] or ['', 'x', ...]
      // Drive and UNC both considered absolute on windows
      /**
       * True if the pattern is rooted on an absolute path
       */
      isAbsolute() {
        const pl = this.#patternList;
        return this.#isAbsolute !== void 0 ? this.#isAbsolute : this.#isAbsolute = pl[0] === "" && pl.length > 1 || this.isDrive() || this.isUNC();
      }
      /**
       * consume the root of the pattern, and return it
       */
      root() {
        const p = this.#patternList[0];
        return typeof p === "string" && this.isAbsolute() && this.#index === 0 ? p : "";
      }
      /**
       * Check to see if the current globstar pattern is allowed to follow
       * a symbolic link.
       */
      checkFollowGlobstar() {
        return !(this.#index === 0 || !this.isGlobstar() || !this.#followGlobstar);
      }
      /**
       * Mark that the current globstar pattern is following a symbolic link
       */
      markFollowGlobstar() {
        if (this.#index === 0 || !this.isGlobstar() || !this.#followGlobstar)
          return false;
        this.#followGlobstar = false;
        return true;
      }
    };
    exports2.Pattern = Pattern;
  }
});

// node_modules/glob/dist/cjs/src/ignore.js
var require_ignore = __commonJS({
  "node_modules/glob/dist/cjs/src/ignore.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Ignore = void 0;
    var minimatch_1 = require_cjs();
    var pattern_js_1 = require_pattern();
    var defaultPlatform = typeof process === "object" && process && typeof process.platform === "string" ? process.platform : "linux";
    var Ignore = class {
      relative;
      relativeChildren;
      absolute;
      absoluteChildren;
      constructor(ignored, { nobrace, nocase, noext, noglobstar, platform = defaultPlatform }) {
        this.relative = [];
        this.absolute = [];
        this.relativeChildren = [];
        this.absoluteChildren = [];
        const mmopts = {
          dot: true,
          nobrace,
          nocase,
          noext,
          noglobstar,
          optimizationLevel: 2,
          platform,
          nocomment: true,
          nonegate: true
        };
        for (const ign of ignored) {
          const mm = new minimatch_1.Minimatch(ign, mmopts);
          for (let i = 0; i < mm.set.length; i++) {
            const parsed = mm.set[i];
            const globParts = mm.globParts[i];
            const p = new pattern_js_1.Pattern(parsed, globParts, 0, platform);
            const m = new minimatch_1.Minimatch(p.globString(), mmopts);
            const children = globParts[globParts.length - 1] === "**";
            const absolute = p.isAbsolute();
            if (absolute)
              this.absolute.push(m);
            else
              this.relative.push(m);
            if (children) {
              if (absolute)
                this.absoluteChildren.push(m);
              else
                this.relativeChildren.push(m);
            }
          }
        }
      }
      ignored(p) {
        const fullpath = p.fullpath();
        const fullpaths = `${fullpath}/`;
        const relative = p.relative() || ".";
        const relatives = `${relative}/`;
        for (const m of this.relative) {
          if (m.match(relative) || m.match(relatives))
            return true;
        }
        for (const m of this.absolute) {
          if (m.match(fullpath) || m.match(fullpaths))
            return true;
        }
        return false;
      }
      childrenIgnored(p) {
        const fullpath = p.fullpath() + "/";
        const relative = (p.relative() || ".") + "/";
        for (const m of this.relativeChildren) {
          if (m.match(relative))
            return true;
        }
        for (const m of this.absoluteChildren) {
          if (m.match(fullpath))
            true;
        }
        return false;
      }
    };
    exports2.Ignore = Ignore;
  }
});

// node_modules/glob/dist/cjs/src/processor.js
var require_processor = __commonJS({
  "node_modules/glob/dist/cjs/src/processor.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Processor = exports2.SubWalks = exports2.MatchRecord = exports2.HasWalkedCache = void 0;
    var minimatch_1 = require_cjs();
    var HasWalkedCache = class {
      store;
      constructor(store = /* @__PURE__ */ new Map()) {
        this.store = store;
      }
      copy() {
        return new HasWalkedCache(new Map(this.store));
      }
      hasWalked(target, pattern) {
        return this.store.get(target.fullpath())?.has(pattern.globString());
      }
      storeWalked(target, pattern) {
        const fullpath = target.fullpath();
        const cached = this.store.get(fullpath);
        if (cached)
          cached.add(pattern.globString());
        else
          this.store.set(fullpath, /* @__PURE__ */ new Set([pattern.globString()]));
      }
    };
    exports2.HasWalkedCache = HasWalkedCache;
    var MatchRecord = class {
      store = /* @__PURE__ */ new Map();
      add(target, absolute, ifDir) {
        const n = (absolute ? 2 : 0) | (ifDir ? 1 : 0);
        const current = this.store.get(target);
        this.store.set(target, current === void 0 ? n : n & current);
      }
      // match, absolute, ifdir
      entries() {
        return [...this.store.entries()].map(([path, n]) => [
          path,
          !!(n & 2),
          !!(n & 1)
        ]);
      }
    };
    exports2.MatchRecord = MatchRecord;
    var SubWalks = class {
      store = /* @__PURE__ */ new Map();
      add(target, pattern) {
        if (!target.canReaddir()) {
          return;
        }
        const subs = this.store.get(target);
        if (subs) {
          if (!subs.find((p) => p.globString() === pattern.globString())) {
            subs.push(pattern);
          }
        } else
          this.store.set(target, [pattern]);
      }
      get(target) {
        const subs = this.store.get(target);
        if (!subs) {
          throw new Error("attempting to walk unknown path");
        }
        return subs;
      }
      entries() {
        return this.keys().map((k) => [k, this.store.get(k)]);
      }
      keys() {
        return [...this.store.keys()].filter((t) => t.canReaddir());
      }
    };
    exports2.SubWalks = SubWalks;
    var Processor = class {
      hasWalkedCache;
      matches = new MatchRecord();
      subwalks = new SubWalks();
      patterns;
      follow;
      dot;
      opts;
      constructor(opts, hasWalkedCache) {
        this.opts = opts;
        this.follow = !!opts.follow;
        this.dot = !!opts.dot;
        this.hasWalkedCache = hasWalkedCache ? hasWalkedCache.copy() : new HasWalkedCache();
      }
      processPatterns(target, patterns) {
        this.patterns = patterns;
        const processingSet = patterns.map((p) => [target, p]);
        for (let [t, pattern] of processingSet) {
          this.hasWalkedCache.storeWalked(t, pattern);
          const root = pattern.root();
          const absolute = pattern.isAbsolute() && this.opts.absolute !== false;
          if (root) {
            t = t.resolve(root === "/" && this.opts.root !== void 0 ? this.opts.root : root);
            const rest2 = pattern.rest();
            if (!rest2) {
              this.matches.add(t, true, false);
              continue;
            } else {
              pattern = rest2;
            }
          }
          if (t.isENOENT())
            continue;
          let p;
          let rest;
          let changed = false;
          while (typeof (p = pattern.pattern()) === "string" && (rest = pattern.rest())) {
            const c = t.resolve(p);
            if (c.isUnknown() && p !== "..")
              break;
            t = c;
            pattern = rest;
            changed = true;
          }
          p = pattern.pattern();
          rest = pattern.rest();
          if (changed) {
            if (this.hasWalkedCache.hasWalked(t, pattern))
              continue;
            this.hasWalkedCache.storeWalked(t, pattern);
          }
          if (typeof p === "string") {
            if (!rest) {
              const ifDir = p === ".." || p === "" || p === ".";
              this.matches.add(t.resolve(p), absolute, ifDir);
            } else {
              this.subwalks.add(t, pattern);
            }
            continue;
          } else if (p === minimatch_1.GLOBSTAR) {
            if (!t.isSymbolicLink() || this.follow || pattern.checkFollowGlobstar()) {
              this.subwalks.add(t, pattern);
            }
            const rp = rest?.pattern();
            const rrest = rest?.rest();
            if (!rest || (rp === "" || rp === ".") && !rrest) {
              this.matches.add(t, absolute, rp === "" || rp === ".");
            } else {
              if (rp === "..") {
                const tp = t.parent || t;
                if (!rrest)
                  this.matches.add(tp, absolute, true);
                else if (!this.hasWalkedCache.hasWalked(tp, rrest)) {
                  this.subwalks.add(tp, rrest);
                }
              }
            }
          } else if (p instanceof RegExp) {
            this.subwalks.add(t, pattern);
          }
        }
        return this;
      }
      subwalkTargets() {
        return this.subwalks.keys();
      }
      child() {
        return new Processor(this.opts, this.hasWalkedCache);
      }
      // return a new Processor containing the subwalks for each
      // child entry, and a set of matches, and
      // a hasWalkedCache that's a copy of this one
      // then we're going to call
      filterEntries(parent, entries) {
        const patterns = this.subwalks.get(parent);
        const results = this.child();
        for (const e of entries) {
          for (const pattern of patterns) {
            const absolute = pattern.isAbsolute();
            const p = pattern.pattern();
            const rest = pattern.rest();
            if (p === minimatch_1.GLOBSTAR) {
              results.testGlobstar(e, pattern, rest, absolute);
            } else if (p instanceof RegExp) {
              results.testRegExp(e, p, rest, absolute);
            } else {
              results.testString(e, p, rest, absolute);
            }
          }
        }
        return results;
      }
      testGlobstar(e, pattern, rest, absolute) {
        if (this.dot || !e.name.startsWith(".")) {
          if (!pattern.hasMore()) {
            this.matches.add(e, absolute, false);
          }
          if (e.canReaddir()) {
            if (this.follow || !e.isSymbolicLink()) {
              this.subwalks.add(e, pattern);
            } else if (e.isSymbolicLink()) {
              if (rest && pattern.checkFollowGlobstar()) {
                this.subwalks.add(e, rest);
              } else if (pattern.markFollowGlobstar()) {
                this.subwalks.add(e, pattern);
              }
            }
          }
        }
        if (rest) {
          const rp = rest.pattern();
          if (typeof rp === "string" && // dots and empty were handled already
          rp !== ".." && rp !== "" && rp !== ".") {
            this.testString(e, rp, rest.rest(), absolute);
          } else if (rp === "..") {
            const ep = e.parent || e;
            this.subwalks.add(ep, rest);
          } else if (rp instanceof RegExp) {
            this.testRegExp(e, rp, rest.rest(), absolute);
          }
        }
      }
      testRegExp(e, p, rest, absolute) {
        if (!p.test(e.name))
          return;
        if (!rest) {
          this.matches.add(e, absolute, false);
        } else {
          this.subwalks.add(e, rest);
        }
      }
      testString(e, p, rest, absolute) {
        if (!e.isNamed(p))
          return;
        if (!rest) {
          this.matches.add(e, absolute, false);
        } else {
          this.subwalks.add(e, rest);
        }
      }
    };
    exports2.Processor = Processor;
  }
});

// node_modules/glob/dist/cjs/src/walker.js
var require_walker = __commonJS({
  "node_modules/glob/dist/cjs/src/walker.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.GlobStream = exports2.GlobWalker = exports2.GlobUtil = void 0;
    var minipass_1 = require_minipass();
    var ignore_js_1 = require_ignore();
    var processor_js_1 = require_processor();
    var makeIgnore = (ignore, opts) => typeof ignore === "string" ? new ignore_js_1.Ignore([ignore], opts) : Array.isArray(ignore) ? new ignore_js_1.Ignore(ignore, opts) : ignore;
    var GlobUtil = class {
      path;
      patterns;
      opts;
      seen = /* @__PURE__ */ new Set();
      paused = false;
      aborted = false;
      #onResume = [];
      #ignore;
      #sep;
      signal;
      maxDepth;
      constructor(patterns, path, opts) {
        this.patterns = patterns;
        this.path = path;
        this.opts = opts;
        this.#sep = !opts.posix && opts.platform === "win32" ? "\\" : "/";
        if (opts.ignore) {
          this.#ignore = makeIgnore(opts.ignore, opts);
        }
        this.maxDepth = opts.maxDepth || Infinity;
        if (opts.signal) {
          this.signal = opts.signal;
          this.signal.addEventListener("abort", () => {
            this.#onResume.length = 0;
          });
        }
      }
      #ignored(path) {
        return this.seen.has(path) || !!this.#ignore?.ignored?.(path);
      }
      #childrenIgnored(path) {
        return !!this.#ignore?.childrenIgnored?.(path);
      }
      // backpressure mechanism
      pause() {
        this.paused = true;
      }
      resume() {
        if (this.signal?.aborted)
          return;
        this.paused = false;
        let fn = void 0;
        while (!this.paused && (fn = this.#onResume.shift())) {
          fn();
        }
      }
      onResume(fn) {
        if (this.signal?.aborted)
          return;
        if (!this.paused) {
          fn();
        } else {
          this.#onResume.push(fn);
        }
      }
      // do the requisite realpath/stat checking, and return the path
      // to add or undefined to filter it out.
      async matchCheck(e, ifDir) {
        if (ifDir && this.opts.nodir)
          return void 0;
        let rpc;
        if (this.opts.realpath) {
          rpc = e.realpathCached() || await e.realpath();
          if (!rpc)
            return void 0;
          e = rpc;
        }
        const needStat = e.isUnknown() || this.opts.stat;
        return this.matchCheckTest(needStat ? await e.lstat() : e, ifDir);
      }
      matchCheckTest(e, ifDir) {
        return e && (this.maxDepth === Infinity || e.depth() <= this.maxDepth) && (!ifDir || e.canReaddir()) && (!this.opts.nodir || !e.isDirectory()) && !this.#ignored(e) ? e : void 0;
      }
      matchCheckSync(e, ifDir) {
        if (ifDir && this.opts.nodir)
          return void 0;
        let rpc;
        if (this.opts.realpath) {
          rpc = e.realpathCached() || e.realpathSync();
          if (!rpc)
            return void 0;
          e = rpc;
        }
        const needStat = e.isUnknown() || this.opts.stat;
        return this.matchCheckTest(needStat ? e.lstatSync() : e, ifDir);
      }
      matchFinish(e, absolute) {
        if (this.#ignored(e))
          return;
        const abs = this.opts.absolute === void 0 ? absolute : this.opts.absolute;
        this.seen.add(e);
        const mark = this.opts.mark && e.isDirectory() ? this.#sep : "";
        if (this.opts.withFileTypes) {
          this.matchEmit(e);
        } else if (abs) {
          const abs2 = this.opts.posix ? e.fullpathPosix() : e.fullpath();
          this.matchEmit(abs2 + mark);
        } else {
          const rel = this.opts.posix ? e.relativePosix() : e.relative();
          const pre = this.opts.dotRelative && !rel.startsWith(".." + this.#sep) ? "." + this.#sep : "";
          this.matchEmit(!rel ? "." + mark : pre + rel + mark);
        }
      }
      async match(e, absolute, ifDir) {
        const p = await this.matchCheck(e, ifDir);
        if (p)
          this.matchFinish(p, absolute);
      }
      matchSync(e, absolute, ifDir) {
        const p = this.matchCheckSync(e, ifDir);
        if (p)
          this.matchFinish(p, absolute);
      }
      walkCB(target, patterns, cb) {
        if (this.signal?.aborted)
          cb();
        this.walkCB2(target, patterns, new processor_js_1.Processor(this.opts), cb);
      }
      walkCB2(target, patterns, processor, cb) {
        if (this.#childrenIgnored(target))
          return cb();
        if (this.signal?.aborted)
          cb();
        if (this.paused) {
          this.onResume(() => this.walkCB2(target, patterns, processor, cb));
          return;
        }
        processor.processPatterns(target, patterns);
        let tasks = 1;
        const next = () => {
          if (--tasks === 0)
            cb();
        };
        for (const [m, absolute, ifDir] of processor.matches.entries()) {
          if (this.#ignored(m))
            continue;
          tasks++;
          this.match(m, absolute, ifDir).then(() => next());
        }
        for (const t of processor.subwalkTargets()) {
          if (this.maxDepth !== Infinity && t.depth() >= this.maxDepth) {
            continue;
          }
          tasks++;
          const childrenCached = t.readdirCached();
          if (t.calledReaddir())
            this.walkCB3(t, childrenCached, processor, next);
          else {
            t.readdirCB((_, entries) => this.walkCB3(t, entries, processor, next), true);
          }
        }
        next();
      }
      walkCB3(target, entries, processor, cb) {
        processor = processor.filterEntries(target, entries);
        let tasks = 1;
        const next = () => {
          if (--tasks === 0)
            cb();
        };
        for (const [m, absolute, ifDir] of processor.matches.entries()) {
          if (this.#ignored(m))
            continue;
          tasks++;
          this.match(m, absolute, ifDir).then(() => next());
        }
        for (const [target2, patterns] of processor.subwalks.entries()) {
          tasks++;
          this.walkCB2(target2, patterns, processor.child(), next);
        }
        next();
      }
      walkCBSync(target, patterns, cb) {
        if (this.signal?.aborted)
          cb();
        this.walkCB2Sync(target, patterns, new processor_js_1.Processor(this.opts), cb);
      }
      walkCB2Sync(target, patterns, processor, cb) {
        if (this.#childrenIgnored(target))
          return cb();
        if (this.signal?.aborted)
          cb();
        if (this.paused) {
          this.onResume(() => this.walkCB2Sync(target, patterns, processor, cb));
          return;
        }
        processor.processPatterns(target, patterns);
        let tasks = 1;
        const next = () => {
          if (--tasks === 0)
            cb();
        };
        for (const [m, absolute, ifDir] of processor.matches.entries()) {
          if (this.#ignored(m))
            continue;
          this.matchSync(m, absolute, ifDir);
        }
        for (const t of processor.subwalkTargets()) {
          if (this.maxDepth !== Infinity && t.depth() >= this.maxDepth) {
            continue;
          }
          tasks++;
          const children = t.readdirSync();
          this.walkCB3Sync(t, children, processor, next);
        }
        next();
      }
      walkCB3Sync(target, entries, processor, cb) {
        processor = processor.filterEntries(target, entries);
        let tasks = 1;
        const next = () => {
          if (--tasks === 0)
            cb();
        };
        for (const [m, absolute, ifDir] of processor.matches.entries()) {
          if (this.#ignored(m))
            continue;
          this.matchSync(m, absolute, ifDir);
        }
        for (const [target2, patterns] of processor.subwalks.entries()) {
          tasks++;
          this.walkCB2Sync(target2, patterns, processor.child(), next);
        }
        next();
      }
    };
    exports2.GlobUtil = GlobUtil;
    var GlobWalker = class extends GlobUtil {
      matches;
      constructor(patterns, path, opts) {
        super(patterns, path, opts);
        this.matches = /* @__PURE__ */ new Set();
      }
      matchEmit(e) {
        this.matches.add(e);
      }
      async walk() {
        if (this.signal?.aborted)
          throw this.signal.reason;
        if (this.path.isUnknown()) {
          await this.path.lstat();
        }
        await new Promise((res, rej) => {
          this.walkCB(this.path, this.patterns, () => {
            if (this.signal?.aborted) {
              rej(this.signal.reason);
            } else {
              res(this.matches);
            }
          });
        });
        return this.matches;
      }
      walkSync() {
        if (this.signal?.aborted)
          throw this.signal.reason;
        if (this.path.isUnknown()) {
          this.path.lstatSync();
        }
        this.walkCBSync(this.path, this.patterns, () => {
          if (this.signal?.aborted)
            throw this.signal.reason;
        });
        return this.matches;
      }
    };
    exports2.GlobWalker = GlobWalker;
    var GlobStream = class extends GlobUtil {
      results;
      constructor(patterns, path, opts) {
        super(patterns, path, opts);
        this.results = new minipass_1.Minipass({
          signal: this.signal,
          objectMode: true
        });
        this.results.on("drain", () => this.resume());
        this.results.on("resume", () => this.resume());
      }
      matchEmit(e) {
        this.results.write(e);
        if (!this.results.flowing)
          this.pause();
      }
      stream() {
        const target = this.path;
        if (target.isUnknown()) {
          target.lstat().then(() => {
            this.walkCB(target, this.patterns, () => this.results.end());
          });
        } else {
          this.walkCB(target, this.patterns, () => this.results.end());
        }
        return this.results;
      }
      streamSync() {
        if (this.path.isUnknown()) {
          this.path.lstatSync();
        }
        this.walkCBSync(this.path, this.patterns, () => this.results.end());
        return this.results;
      }
    };
    exports2.GlobStream = GlobStream;
  }
});

// node_modules/glob/dist/cjs/src/glob.js
var require_glob = __commonJS({
  "node_modules/glob/dist/cjs/src/glob.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Glob = void 0;
    var minimatch_1 = require_cjs();
    var path_scurry_1 = require_cjs3();
    var url_1 = require("url");
    var pattern_js_1 = require_pattern();
    var walker_js_1 = require_walker();
    var defaultPlatform = typeof process === "object" && process && typeof process.platform === "string" ? process.platform : "linux";
    var Glob = class {
      absolute;
      cwd;
      root;
      dot;
      dotRelative;
      follow;
      ignore;
      magicalBraces;
      mark;
      matchBase;
      maxDepth;
      nobrace;
      nocase;
      nodir;
      noext;
      noglobstar;
      pattern;
      platform;
      realpath;
      scurry;
      stat;
      signal;
      windowsPathsNoEscape;
      withFileTypes;
      /**
       * The options provided to the constructor.
       */
      opts;
      /**
       * An array of parsed immutable {@link Pattern} objects.
       */
      patterns;
      /**
       * All options are stored as properties on the `Glob` object.
       *
       * See {@link GlobOptions} for full options descriptions.
       *
       * Note that a previous `Glob` object can be passed as the
       * `GlobOptions` to another `Glob` instantiation to re-use settings
       * and caches with a new pattern.
       *
       * Traversal functions can be called multiple times to run the walk
       * again.
       */
      constructor(pattern, opts) {
        this.withFileTypes = !!opts.withFileTypes;
        this.signal = opts.signal;
        this.follow = !!opts.follow;
        this.dot = !!opts.dot;
        this.dotRelative = !!opts.dotRelative;
        this.nodir = !!opts.nodir;
        this.mark = !!opts.mark;
        if (!opts.cwd) {
          this.cwd = "";
        } else if (opts.cwd instanceof URL || opts.cwd.startsWith("file://")) {
          opts.cwd = (0, url_1.fileURLToPath)(opts.cwd);
        }
        this.cwd = opts.cwd || "";
        this.root = opts.root;
        this.magicalBraces = !!opts.magicalBraces;
        this.nobrace = !!opts.nobrace;
        this.noext = !!opts.noext;
        this.realpath = !!opts.realpath;
        this.absolute = opts.absolute;
        this.noglobstar = !!opts.noglobstar;
        this.matchBase = !!opts.matchBase;
        this.maxDepth = typeof opts.maxDepth === "number" ? opts.maxDepth : Infinity;
        this.stat = !!opts.stat;
        this.ignore = opts.ignore;
        if (this.withFileTypes && this.absolute !== void 0) {
          throw new Error("cannot set absolute and withFileTypes:true");
        }
        if (typeof pattern === "string") {
          pattern = [pattern];
        }
        this.windowsPathsNoEscape = !!opts.windowsPathsNoEscape || opts.allowWindowsEscape === false;
        if (this.windowsPathsNoEscape) {
          pattern = pattern.map((p) => p.replace(/\\/g, "/"));
        }
        if (this.matchBase) {
          if (opts.noglobstar) {
            throw new TypeError("base matching requires globstar");
          }
          pattern = pattern.map((p) => p.includes("/") ? p : `./**/${p}`);
        }
        this.pattern = pattern;
        this.platform = opts.platform || defaultPlatform;
        this.opts = { ...opts, platform: this.platform };
        if (opts.scurry) {
          this.scurry = opts.scurry;
          if (opts.nocase !== void 0 && opts.nocase !== opts.scurry.nocase) {
            throw new Error("nocase option contradicts provided scurry option");
          }
        } else {
          const Scurry = opts.platform === "win32" ? path_scurry_1.PathScurryWin32 : opts.platform === "darwin" ? path_scurry_1.PathScurryDarwin : opts.platform ? path_scurry_1.PathScurryPosix : path_scurry_1.PathScurry;
          this.scurry = new Scurry(this.cwd, {
            nocase: opts.nocase,
            fs: opts.fs
          });
        }
        this.nocase = this.scurry.nocase;
        const nocaseMagicOnly = this.platform === "darwin" || this.platform === "win32";
        const mmo = {
          // default nocase based on platform
          ...opts,
          dot: this.dot,
          matchBase: this.matchBase,
          nobrace: this.nobrace,
          nocase: this.nocase,
          nocaseMagicOnly,
          nocomment: true,
          noext: this.noext,
          nonegate: true,
          optimizationLevel: 2,
          platform: this.platform,
          windowsPathsNoEscape: this.windowsPathsNoEscape,
          debug: !!this.opts.debug
        };
        const mms = this.pattern.map((p) => new minimatch_1.Minimatch(p, mmo));
        const [matchSet, globParts] = mms.reduce((set, m) => {
          set[0].push(...m.set);
          set[1].push(...m.globParts);
          return set;
        }, [[], []]);
        this.patterns = matchSet.map((set, i) => {
          return new pattern_js_1.Pattern(set, globParts[i], 0, this.platform);
        });
      }
      async walk() {
        return [
          ...await new walker_js_1.GlobWalker(this.patterns, this.scurry.cwd, {
            ...this.opts,
            maxDepth: this.maxDepth !== Infinity ? this.maxDepth + this.scurry.cwd.depth() : Infinity,
            platform: this.platform,
            nocase: this.nocase
          }).walk()
        ];
      }
      walkSync() {
        return [
          ...new walker_js_1.GlobWalker(this.patterns, this.scurry.cwd, {
            ...this.opts,
            maxDepth: this.maxDepth !== Infinity ? this.maxDepth + this.scurry.cwd.depth() : Infinity,
            platform: this.platform,
            nocase: this.nocase
          }).walkSync()
        ];
      }
      stream() {
        return new walker_js_1.GlobStream(this.patterns, this.scurry.cwd, {
          ...this.opts,
          maxDepth: this.maxDepth !== Infinity ? this.maxDepth + this.scurry.cwd.depth() : Infinity,
          platform: this.platform,
          nocase: this.nocase
        }).stream();
      }
      streamSync() {
        return new walker_js_1.GlobStream(this.patterns, this.scurry.cwd, {
          ...this.opts,
          maxDepth: this.maxDepth !== Infinity ? this.maxDepth + this.scurry.cwd.depth() : Infinity,
          platform: this.platform,
          nocase: this.nocase
        }).streamSync();
      }
      /**
       * Default sync iteration function. Returns a Generator that
       * iterates over the results.
       */
      iterateSync() {
        return this.streamSync()[Symbol.iterator]();
      }
      [Symbol.iterator]() {
        return this.iterateSync();
      }
      /**
       * Default async iteration function. Returns an AsyncGenerator that
       * iterates over the results.
       */
      iterate() {
        return this.stream()[Symbol.asyncIterator]();
      }
      [Symbol.asyncIterator]() {
        return this.iterate();
      }
    };
    exports2.Glob = Glob;
  }
});

// node_modules/glob/dist/cjs/src/has-magic.js
var require_has_magic = __commonJS({
  "node_modules/glob/dist/cjs/src/has-magic.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.hasMagic = void 0;
    var minimatch_1 = require_cjs();
    var hasMagic = (pattern, options = {}) => {
      if (!Array.isArray(pattern)) {
        pattern = [pattern];
      }
      for (const p of pattern) {
        if (new minimatch_1.Minimatch(p, options).hasMagic())
          return true;
      }
      return false;
    };
    exports2.hasMagic = hasMagic;
  }
});

// node_modules/glob/dist/cjs/src/index.js
var require_src = __commonJS({
  "node_modules/glob/dist/cjs/src/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.glob = exports2.hasMagic = exports2.Glob = exports2.unescape = exports2.escape = exports2.sync = exports2.iterate = exports2.iterateSync = exports2.stream = exports2.streamSync = exports2.globIterate = exports2.globIterateSync = exports2.globSync = exports2.globStream = exports2.globStreamSync = void 0;
    var minimatch_1 = require_cjs();
    var glob_js_1 = require_glob();
    var has_magic_js_1 = require_has_magic();
    function globStreamSync(pattern, options = {}) {
      return new glob_js_1.Glob(pattern, options).streamSync();
    }
    exports2.globStreamSync = globStreamSync;
    function globStream(pattern, options = {}) {
      return new glob_js_1.Glob(pattern, options).stream();
    }
    exports2.globStream = globStream;
    function globSync(pattern, options = {}) {
      return new glob_js_1.Glob(pattern, options).walkSync();
    }
    exports2.globSync = globSync;
    async function glob_(pattern, options = {}) {
      return new glob_js_1.Glob(pattern, options).walk();
    }
    function globIterateSync(pattern, options = {}) {
      return new glob_js_1.Glob(pattern, options).iterateSync();
    }
    exports2.globIterateSync = globIterateSync;
    function globIterate(pattern, options = {}) {
      return new glob_js_1.Glob(pattern, options).iterate();
    }
    exports2.globIterate = globIterate;
    exports2.streamSync = globStreamSync;
    exports2.stream = Object.assign(globStream, { sync: globStreamSync });
    exports2.iterateSync = globIterateSync;
    exports2.iterate = Object.assign(globIterate, {
      sync: globIterateSync
    });
    exports2.sync = Object.assign(globSync, {
      stream: globStreamSync,
      iterate: globIterateSync
    });
    var minimatch_2 = require_cjs();
    Object.defineProperty(exports2, "escape", { enumerable: true, get: function() {
      return minimatch_2.escape;
    } });
    Object.defineProperty(exports2, "unescape", { enumerable: true, get: function() {
      return minimatch_2.unescape;
    } });
    var glob_js_2 = require_glob();
    Object.defineProperty(exports2, "Glob", { enumerable: true, get: function() {
      return glob_js_2.Glob;
    } });
    var has_magic_js_2 = require_has_magic();
    Object.defineProperty(exports2, "hasMagic", { enumerable: true, get: function() {
      return has_magic_js_2.hasMagic;
    } });
    exports2.glob = Object.assign(glob_, {
      glob: glob_,
      globSync,
      sync: exports2.sync,
      globStream,
      stream: exports2.stream,
      globStreamSync,
      streamSync: exports2.streamSync,
      globIterate,
      iterate: exports2.iterate,
      globIterateSync,
      iterateSync: exports2.iterateSync,
      Glob: glob_js_1.Glob,
      hasMagic: has_magic_js_1.hasMagic,
      escape: minimatch_1.escape,
      unescape: minimatch_1.unescape
    });
    exports2.glob.glob = exports2.glob;
  }
});

// node_modules/universalify/index.js
var require_universalify = __commonJS({
  "node_modules/universalify/index.js"(exports2) {
    "use strict";
    exports2.fromCallback = function(fn) {
      return Object.defineProperty(function(...args) {
        if (typeof args[args.length - 1] === "function")
          fn.apply(this, args);
        else {
          return new Promise((resolve, reject) => {
            fn.call(
              this,
              ...args,
              (err, res) => err != null ? reject(err) : resolve(res)
            );
          });
        }
      }, "name", { value: fn.name });
    };
    exports2.fromPromise = function(fn) {
      return Object.defineProperty(function(...args) {
        const cb = args[args.length - 1];
        if (typeof cb !== "function")
          return fn.apply(this, args);
        else
          fn.apply(this, args.slice(0, -1)).then((r) => cb(null, r), cb);
      }, "name", { value: fn.name });
    };
  }
});

// node_modules/graceful-fs/polyfills.js
var require_polyfills = __commonJS({
  "node_modules/graceful-fs/polyfills.js"(exports2, module2) {
    var constants = require("constants");
    var origCwd = process.cwd;
    var cwd = null;
    var platform = process.env.GRACEFUL_FS_PLATFORM || process.platform;
    process.cwd = function() {
      if (!cwd)
        cwd = origCwd.call(process);
      return cwd;
    };
    try {
      process.cwd();
    } catch (er) {
    }
    if (typeof process.chdir === "function") {
      chdir = process.chdir;
      process.chdir = function(d) {
        cwd = null;
        chdir.call(process, d);
      };
      if (Object.setPrototypeOf)
        Object.setPrototypeOf(process.chdir, chdir);
    }
    var chdir;
    module2.exports = patch;
    function patch(fs) {
      if (constants.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
        patchLchmod(fs);
      }
      if (!fs.lutimes) {
        patchLutimes(fs);
      }
      fs.chown = chownFix(fs.chown);
      fs.fchown = chownFix(fs.fchown);
      fs.lchown = chownFix(fs.lchown);
      fs.chmod = chmodFix(fs.chmod);
      fs.fchmod = chmodFix(fs.fchmod);
      fs.lchmod = chmodFix(fs.lchmod);
      fs.chownSync = chownFixSync(fs.chownSync);
      fs.fchownSync = chownFixSync(fs.fchownSync);
      fs.lchownSync = chownFixSync(fs.lchownSync);
      fs.chmodSync = chmodFixSync(fs.chmodSync);
      fs.fchmodSync = chmodFixSync(fs.fchmodSync);
      fs.lchmodSync = chmodFixSync(fs.lchmodSync);
      fs.stat = statFix(fs.stat);
      fs.fstat = statFix(fs.fstat);
      fs.lstat = statFix(fs.lstat);
      fs.statSync = statFixSync(fs.statSync);
      fs.fstatSync = statFixSync(fs.fstatSync);
      fs.lstatSync = statFixSync(fs.lstatSync);
      if (fs.chmod && !fs.lchmod) {
        fs.lchmod = function(path, mode, cb) {
          if (cb)
            process.nextTick(cb);
        };
        fs.lchmodSync = function() {
        };
      }
      if (fs.chown && !fs.lchown) {
        fs.lchown = function(path, uid, gid, cb) {
          if (cb)
            process.nextTick(cb);
        };
        fs.lchownSync = function() {
        };
      }
      if (platform === "win32") {
        fs.rename = typeof fs.rename !== "function" ? fs.rename : function(fs$rename) {
          function rename(from, to, cb) {
            var start = Date.now();
            var backoff = 0;
            fs$rename(from, to, function CB(er) {
              if (er && (er.code === "EACCES" || er.code === "EPERM") && Date.now() - start < 6e4) {
                setTimeout(function() {
                  fs.stat(to, function(stater, st) {
                    if (stater && stater.code === "ENOENT")
                      fs$rename(from, to, CB);
                    else
                      cb(er);
                  });
                }, backoff);
                if (backoff < 100)
                  backoff += 10;
                return;
              }
              if (cb)
                cb(er);
            });
          }
          if (Object.setPrototypeOf)
            Object.setPrototypeOf(rename, fs$rename);
          return rename;
        }(fs.rename);
      }
      fs.read = typeof fs.read !== "function" ? fs.read : function(fs$read) {
        function read(fd, buffer, offset, length, position, callback_) {
          var callback;
          if (callback_ && typeof callback_ === "function") {
            var eagCounter = 0;
            callback = function(er, _, __) {
              if (er && er.code === "EAGAIN" && eagCounter < 10) {
                eagCounter++;
                return fs$read.call(fs, fd, buffer, offset, length, position, callback);
              }
              callback_.apply(this, arguments);
            };
          }
          return fs$read.call(fs, fd, buffer, offset, length, position, callback);
        }
        if (Object.setPrototypeOf)
          Object.setPrototypeOf(read, fs$read);
        return read;
      }(fs.read);
      fs.readSync = typeof fs.readSync !== "function" ? fs.readSync : function(fs$readSync) {
        return function(fd, buffer, offset, length, position) {
          var eagCounter = 0;
          while (true) {
            try {
              return fs$readSync.call(fs, fd, buffer, offset, length, position);
            } catch (er) {
              if (er.code === "EAGAIN" && eagCounter < 10) {
                eagCounter++;
                continue;
              }
              throw er;
            }
          }
        };
      }(fs.readSync);
      function patchLchmod(fs2) {
        fs2.lchmod = function(path, mode, callback) {
          fs2.open(
            path,
            constants.O_WRONLY | constants.O_SYMLINK,
            mode,
            function(err, fd) {
              if (err) {
                if (callback)
                  callback(err);
                return;
              }
              fs2.fchmod(fd, mode, function(err2) {
                fs2.close(fd, function(err22) {
                  if (callback)
                    callback(err2 || err22);
                });
              });
            }
          );
        };
        fs2.lchmodSync = function(path, mode) {
          var fd = fs2.openSync(path, constants.O_WRONLY | constants.O_SYMLINK, mode);
          var threw = true;
          var ret;
          try {
            ret = fs2.fchmodSync(fd, mode);
            threw = false;
          } finally {
            if (threw) {
              try {
                fs2.closeSync(fd);
              } catch (er) {
              }
            } else {
              fs2.closeSync(fd);
            }
          }
          return ret;
        };
      }
      function patchLutimes(fs2) {
        if (constants.hasOwnProperty("O_SYMLINK") && fs2.futimes) {
          fs2.lutimes = function(path, at, mt, cb) {
            fs2.open(path, constants.O_SYMLINK, function(er, fd) {
              if (er) {
                if (cb)
                  cb(er);
                return;
              }
              fs2.futimes(fd, at, mt, function(er2) {
                fs2.close(fd, function(er22) {
                  if (cb)
                    cb(er2 || er22);
                });
              });
            });
          };
          fs2.lutimesSync = function(path, at, mt) {
            var fd = fs2.openSync(path, constants.O_SYMLINK);
            var ret;
            var threw = true;
            try {
              ret = fs2.futimesSync(fd, at, mt);
              threw = false;
            } finally {
              if (threw) {
                try {
                  fs2.closeSync(fd);
                } catch (er) {
                }
              } else {
                fs2.closeSync(fd);
              }
            }
            return ret;
          };
        } else if (fs2.futimes) {
          fs2.lutimes = function(_a, _b, _c, cb) {
            if (cb)
              process.nextTick(cb);
          };
          fs2.lutimesSync = function() {
          };
        }
      }
      function chmodFix(orig) {
        if (!orig)
          return orig;
        return function(target, mode, cb) {
          return orig.call(fs, target, mode, function(er) {
            if (chownErOk(er))
              er = null;
            if (cb)
              cb.apply(this, arguments);
          });
        };
      }
      function chmodFixSync(orig) {
        if (!orig)
          return orig;
        return function(target, mode) {
          try {
            return orig.call(fs, target, mode);
          } catch (er) {
            if (!chownErOk(er))
              throw er;
          }
        };
      }
      function chownFix(orig) {
        if (!orig)
          return orig;
        return function(target, uid, gid, cb) {
          return orig.call(fs, target, uid, gid, function(er) {
            if (chownErOk(er))
              er = null;
            if (cb)
              cb.apply(this, arguments);
          });
        };
      }
      function chownFixSync(orig) {
        if (!orig)
          return orig;
        return function(target, uid, gid) {
          try {
            return orig.call(fs, target, uid, gid);
          } catch (er) {
            if (!chownErOk(er))
              throw er;
          }
        };
      }
      function statFix(orig) {
        if (!orig)
          return orig;
        return function(target, options, cb) {
          if (typeof options === "function") {
            cb = options;
            options = null;
          }
          function callback(er, stats) {
            if (stats) {
              if (stats.uid < 0)
                stats.uid += 4294967296;
              if (stats.gid < 0)
                stats.gid += 4294967296;
            }
            if (cb)
              cb.apply(this, arguments);
          }
          return options ? orig.call(fs, target, options, callback) : orig.call(fs, target, callback);
        };
      }
      function statFixSync(orig) {
        if (!orig)
          return orig;
        return function(target, options) {
          var stats = options ? orig.call(fs, target, options) : orig.call(fs, target);
          if (stats) {
            if (stats.uid < 0)
              stats.uid += 4294967296;
            if (stats.gid < 0)
              stats.gid += 4294967296;
          }
          return stats;
        };
      }
      function chownErOk(er) {
        if (!er)
          return true;
        if (er.code === "ENOSYS")
          return true;
        var nonroot = !process.getuid || process.getuid() !== 0;
        if (nonroot) {
          if (er.code === "EINVAL" || er.code === "EPERM")
            return true;
        }
        return false;
      }
    }
  }
});

// node_modules/graceful-fs/legacy-streams.js
var require_legacy_streams = __commonJS({
  "node_modules/graceful-fs/legacy-streams.js"(exports2, module2) {
    var Stream = require("stream").Stream;
    module2.exports = legacy;
    function legacy(fs) {
      return {
        ReadStream,
        WriteStream
      };
      function ReadStream(path, options) {
        if (!(this instanceof ReadStream))
          return new ReadStream(path, options);
        Stream.call(this);
        var self = this;
        this.path = path;
        this.fd = null;
        this.readable = true;
        this.paused = false;
        this.flags = "r";
        this.mode = 438;
        this.bufferSize = 64 * 1024;
        options = options || {};
        var keys = Object.keys(options);
        for (var index = 0, length = keys.length; index < length; index++) {
          var key = keys[index];
          this[key] = options[key];
        }
        if (this.encoding)
          this.setEncoding(this.encoding);
        if (this.start !== void 0) {
          if ("number" !== typeof this.start) {
            throw TypeError("start must be a Number");
          }
          if (this.end === void 0) {
            this.end = Infinity;
          } else if ("number" !== typeof this.end) {
            throw TypeError("end must be a Number");
          }
          if (this.start > this.end) {
            throw new Error("start must be <= end");
          }
          this.pos = this.start;
        }
        if (this.fd !== null) {
          process.nextTick(function() {
            self._read();
          });
          return;
        }
        fs.open(this.path, this.flags, this.mode, function(err, fd) {
          if (err) {
            self.emit("error", err);
            self.readable = false;
            return;
          }
          self.fd = fd;
          self.emit("open", fd);
          self._read();
        });
      }
      function WriteStream(path, options) {
        if (!(this instanceof WriteStream))
          return new WriteStream(path, options);
        Stream.call(this);
        this.path = path;
        this.fd = null;
        this.writable = true;
        this.flags = "w";
        this.encoding = "binary";
        this.mode = 438;
        this.bytesWritten = 0;
        options = options || {};
        var keys = Object.keys(options);
        for (var index = 0, length = keys.length; index < length; index++) {
          var key = keys[index];
          this[key] = options[key];
        }
        if (this.start !== void 0) {
          if ("number" !== typeof this.start) {
            throw TypeError("start must be a Number");
          }
          if (this.start < 0) {
            throw new Error("start must be >= zero");
          }
          this.pos = this.start;
        }
        this.busy = false;
        this._queue = [];
        if (this.fd === null) {
          this._open = fs.open;
          this._queue.push([this._open, this.path, this.flags, this.mode, void 0]);
          this.flush();
        }
      }
    }
  }
});

// node_modules/graceful-fs/clone.js
var require_clone = __commonJS({
  "node_modules/graceful-fs/clone.js"(exports2, module2) {
    "use strict";
    module2.exports = clone;
    var getPrototypeOf = Object.getPrototypeOf || function(obj) {
      return obj.__proto__;
    };
    function clone(obj) {
      if (obj === null || typeof obj !== "object")
        return obj;
      if (obj instanceof Object)
        var copy = { __proto__: getPrototypeOf(obj) };
      else
        var copy = /* @__PURE__ */ Object.create(null);
      Object.getOwnPropertyNames(obj).forEach(function(key) {
        Object.defineProperty(copy, key, Object.getOwnPropertyDescriptor(obj, key));
      });
      return copy;
    }
  }
});

// node_modules/graceful-fs/graceful-fs.js
var require_graceful_fs = __commonJS({
  "node_modules/graceful-fs/graceful-fs.js"(exports2, module2) {
    var fs = require("fs");
    var polyfills = require_polyfills();
    var legacy = require_legacy_streams();
    var clone = require_clone();
    var util = require("util");
    var gracefulQueue;
    var previousSymbol;
    if (typeof Symbol === "function" && typeof Symbol.for === "function") {
      gracefulQueue = Symbol.for("graceful-fs.queue");
      previousSymbol = Symbol.for("graceful-fs.previous");
    } else {
      gracefulQueue = "___graceful-fs.queue";
      previousSymbol = "___graceful-fs.previous";
    }
    function noop() {
    }
    function publishQueue(context, queue2) {
      Object.defineProperty(context, gracefulQueue, {
        get: function() {
          return queue2;
        }
      });
    }
    var debug = noop;
    if (util.debuglog)
      debug = util.debuglog("gfs4");
    else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || ""))
      debug = function() {
        var m = util.format.apply(util, arguments);
        m = "GFS4: " + m.split(/\n/).join("\nGFS4: ");
        console.error(m);
      };
    if (!fs[gracefulQueue]) {
      queue = global[gracefulQueue] || [];
      publishQueue(fs, queue);
      fs.close = function(fs$close) {
        function close(fd, cb) {
          return fs$close.call(fs, fd, function(err) {
            if (!err) {
              resetQueue();
            }
            if (typeof cb === "function")
              cb.apply(this, arguments);
          });
        }
        Object.defineProperty(close, previousSymbol, {
          value: fs$close
        });
        return close;
      }(fs.close);
      fs.closeSync = function(fs$closeSync) {
        function closeSync(fd) {
          fs$closeSync.apply(fs, arguments);
          resetQueue();
        }
        Object.defineProperty(closeSync, previousSymbol, {
          value: fs$closeSync
        });
        return closeSync;
      }(fs.closeSync);
      if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || "")) {
        process.on("exit", function() {
          debug(fs[gracefulQueue]);
          require("assert").equal(fs[gracefulQueue].length, 0);
        });
      }
    }
    var queue;
    if (!global[gracefulQueue]) {
      publishQueue(global, fs[gracefulQueue]);
    }
    module2.exports = patch(clone(fs));
    if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !fs.__patched) {
      module2.exports = patch(fs);
      fs.__patched = true;
    }
    function patch(fs2) {
      polyfills(fs2);
      fs2.gracefulify = patch;
      fs2.createReadStream = createReadStream;
      fs2.createWriteStream = createWriteStream;
      var fs$readFile = fs2.readFile;
      fs2.readFile = readFile;
      function readFile(path, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        return go$readFile(path, options, cb);
        function go$readFile(path2, options2, cb2, startTime) {
          return fs$readFile(path2, options2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$readFile, [path2, options2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$writeFile = fs2.writeFile;
      fs2.writeFile = writeFile;
      function writeFile(path, data, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        return go$writeFile(path, data, options, cb);
        function go$writeFile(path2, data2, options2, cb2, startTime) {
          return fs$writeFile(path2, data2, options2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$writeFile, [path2, data2, options2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$appendFile = fs2.appendFile;
      if (fs$appendFile)
        fs2.appendFile = appendFile;
      function appendFile(path, data, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        return go$appendFile(path, data, options, cb);
        function go$appendFile(path2, data2, options2, cb2, startTime) {
          return fs$appendFile(path2, data2, options2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$appendFile, [path2, data2, options2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$copyFile = fs2.copyFile;
      if (fs$copyFile)
        fs2.copyFile = copyFile;
      function copyFile(src, dest, flags, cb) {
        if (typeof flags === "function") {
          cb = flags;
          flags = 0;
        }
        return go$copyFile(src, dest, flags, cb);
        function go$copyFile(src2, dest2, flags2, cb2, startTime) {
          return fs$copyFile(src2, dest2, flags2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$copyFile, [src2, dest2, flags2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$readdir = fs2.readdir;
      fs2.readdir = readdir;
      var noReaddirOptionVersions = /^v[0-5]\./;
      function readdir(path, options, cb) {
        if (typeof options === "function")
          cb = options, options = null;
        var go$readdir = noReaddirOptionVersions.test(process.version) ? function go$readdir2(path2, options2, cb2, startTime) {
          return fs$readdir(path2, fs$readdirCallback(
            path2,
            options2,
            cb2,
            startTime
          ));
        } : function go$readdir2(path2, options2, cb2, startTime) {
          return fs$readdir(path2, options2, fs$readdirCallback(
            path2,
            options2,
            cb2,
            startTime
          ));
        };
        return go$readdir(path, options, cb);
        function fs$readdirCallback(path2, options2, cb2, startTime) {
          return function(err, files) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([
                go$readdir,
                [path2, options2, cb2],
                err,
                startTime || Date.now(),
                Date.now()
              ]);
            else {
              if (files && files.sort)
                files.sort();
              if (typeof cb2 === "function")
                cb2.call(this, err, files);
            }
          };
        }
      }
      if (process.version.substr(0, 4) === "v0.8") {
        var legStreams = legacy(fs2);
        ReadStream = legStreams.ReadStream;
        WriteStream = legStreams.WriteStream;
      }
      var fs$ReadStream = fs2.ReadStream;
      if (fs$ReadStream) {
        ReadStream.prototype = Object.create(fs$ReadStream.prototype);
        ReadStream.prototype.open = ReadStream$open;
      }
      var fs$WriteStream = fs2.WriteStream;
      if (fs$WriteStream) {
        WriteStream.prototype = Object.create(fs$WriteStream.prototype);
        WriteStream.prototype.open = WriteStream$open;
      }
      Object.defineProperty(fs2, "ReadStream", {
        get: function() {
          return ReadStream;
        },
        set: function(val) {
          ReadStream = val;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(fs2, "WriteStream", {
        get: function() {
          return WriteStream;
        },
        set: function(val) {
          WriteStream = val;
        },
        enumerable: true,
        configurable: true
      });
      var FileReadStream = ReadStream;
      Object.defineProperty(fs2, "FileReadStream", {
        get: function() {
          return FileReadStream;
        },
        set: function(val) {
          FileReadStream = val;
        },
        enumerable: true,
        configurable: true
      });
      var FileWriteStream = WriteStream;
      Object.defineProperty(fs2, "FileWriteStream", {
        get: function() {
          return FileWriteStream;
        },
        set: function(val) {
          FileWriteStream = val;
        },
        enumerable: true,
        configurable: true
      });
      function ReadStream(path, options) {
        if (this instanceof ReadStream)
          return fs$ReadStream.apply(this, arguments), this;
        else
          return ReadStream.apply(Object.create(ReadStream.prototype), arguments);
      }
      function ReadStream$open() {
        var that = this;
        open(that.path, that.flags, that.mode, function(err, fd) {
          if (err) {
            if (that.autoClose)
              that.destroy();
            that.emit("error", err);
          } else {
            that.fd = fd;
            that.emit("open", fd);
            that.read();
          }
        });
      }
      function WriteStream(path, options) {
        if (this instanceof WriteStream)
          return fs$WriteStream.apply(this, arguments), this;
        else
          return WriteStream.apply(Object.create(WriteStream.prototype), arguments);
      }
      function WriteStream$open() {
        var that = this;
        open(that.path, that.flags, that.mode, function(err, fd) {
          if (err) {
            that.destroy();
            that.emit("error", err);
          } else {
            that.fd = fd;
            that.emit("open", fd);
          }
        });
      }
      function createReadStream(path, options) {
        return new fs2.ReadStream(path, options);
      }
      function createWriteStream(path, options) {
        return new fs2.WriteStream(path, options);
      }
      var fs$open = fs2.open;
      fs2.open = open;
      function open(path, flags, mode, cb) {
        if (typeof mode === "function")
          cb = mode, mode = null;
        return go$open(path, flags, mode, cb);
        function go$open(path2, flags2, mode2, cb2, startTime) {
          return fs$open(path2, flags2, mode2, function(err, fd) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$open, [path2, flags2, mode2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      return fs2;
    }
    function enqueue(elem) {
      debug("ENQUEUE", elem[0].name, elem[1]);
      fs[gracefulQueue].push(elem);
      retry();
    }
    var retryTimer;
    function resetQueue() {
      var now = Date.now();
      for (var i = 0; i < fs[gracefulQueue].length; ++i) {
        if (fs[gracefulQueue][i].length > 2) {
          fs[gracefulQueue][i][3] = now;
          fs[gracefulQueue][i][4] = now;
        }
      }
      retry();
    }
    function retry() {
      clearTimeout(retryTimer);
      retryTimer = void 0;
      if (fs[gracefulQueue].length === 0)
        return;
      var elem = fs[gracefulQueue].shift();
      var fn = elem[0];
      var args = elem[1];
      var err = elem[2];
      var startTime = elem[3];
      var lastTime = elem[4];
      if (startTime === void 0) {
        debug("RETRY", fn.name, args);
        fn.apply(null, args);
      } else if (Date.now() - startTime >= 6e4) {
        debug("TIMEOUT", fn.name, args);
        var cb = args.pop();
        if (typeof cb === "function")
          cb.call(null, err);
      } else {
        var sinceAttempt = Date.now() - lastTime;
        var sinceStart = Math.max(lastTime - startTime, 1);
        var desiredDelay = Math.min(sinceStart * 1.2, 100);
        if (sinceAttempt >= desiredDelay) {
          debug("RETRY", fn.name, args);
          fn.apply(null, args.concat([startTime]));
        } else {
          fs[gracefulQueue].push(elem);
        }
      }
      if (retryTimer === void 0) {
        retryTimer = setTimeout(retry, 0);
      }
    }
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/fs/index.js
var require_fs = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/fs/index.js"(exports2) {
    "use strict";
    var u = require_universalify().fromCallback;
    var fs = require_graceful_fs();
    var api = [
      "access",
      "appendFile",
      "chmod",
      "chown",
      "close",
      "copyFile",
      "fchmod",
      "fchown",
      "fdatasync",
      "fstat",
      "fsync",
      "ftruncate",
      "futimes",
      "lchmod",
      "lchown",
      "link",
      "lstat",
      "mkdir",
      "mkdtemp",
      "open",
      "opendir",
      "readdir",
      "readFile",
      "readlink",
      "realpath",
      "rename",
      "rm",
      "rmdir",
      "stat",
      "symlink",
      "truncate",
      "unlink",
      "utimes",
      "writeFile"
    ].filter((key) => {
      return typeof fs[key] === "function";
    });
    Object.assign(exports2, fs);
    api.forEach((method) => {
      exports2[method] = u(fs[method]);
    });
    exports2.exists = function(filename, callback) {
      if (typeof callback === "function") {
        return fs.exists(filename, callback);
      }
      return new Promise((resolve) => {
        return fs.exists(filename, resolve);
      });
    };
    exports2.read = function(fd, buffer, offset, length, position, callback) {
      if (typeof callback === "function") {
        return fs.read(fd, buffer, offset, length, position, callback);
      }
      return new Promise((resolve, reject) => {
        fs.read(fd, buffer, offset, length, position, (err, bytesRead, buffer2) => {
          if (err)
            return reject(err);
          resolve({ bytesRead, buffer: buffer2 });
        });
      });
    };
    exports2.write = function(fd, buffer, ...args) {
      if (typeof args[args.length - 1] === "function") {
        return fs.write(fd, buffer, ...args);
      }
      return new Promise((resolve, reject) => {
        fs.write(fd, buffer, ...args, (err, bytesWritten, buffer2) => {
          if (err)
            return reject(err);
          resolve({ bytesWritten, buffer: buffer2 });
        });
      });
    };
    exports2.readv = function(fd, buffers, ...args) {
      if (typeof args[args.length - 1] === "function") {
        return fs.readv(fd, buffers, ...args);
      }
      return new Promise((resolve, reject) => {
        fs.readv(fd, buffers, ...args, (err, bytesRead, buffers2) => {
          if (err)
            return reject(err);
          resolve({ bytesRead, buffers: buffers2 });
        });
      });
    };
    exports2.writev = function(fd, buffers, ...args) {
      if (typeof args[args.length - 1] === "function") {
        return fs.writev(fd, buffers, ...args);
      }
      return new Promise((resolve, reject) => {
        fs.writev(fd, buffers, ...args, (err, bytesWritten, buffers2) => {
          if (err)
            return reject(err);
          resolve({ bytesWritten, buffers: buffers2 });
        });
      });
    };
    if (typeof fs.realpath.native === "function") {
      exports2.realpath.native = u(fs.realpath.native);
    } else {
      process.emitWarning(
        "fs.realpath.native is not a function. Is fs being monkey-patched?",
        "Warning",
        "fs-extra-WARN0003"
      );
    }
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/mkdirs/utils.js
var require_utils = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/mkdirs/utils.js"(exports2, module2) {
    "use strict";
    var path = require("path");
    module2.exports.checkPath = function checkPath(pth) {
      if (process.platform === "win32") {
        const pathHasInvalidWinCharacters = /[<>:"|?*]/.test(pth.replace(path.parse(pth).root, ""));
        if (pathHasInvalidWinCharacters) {
          const error = new Error(`Path contains invalid characters: ${pth}`);
          error.code = "EINVAL";
          throw error;
        }
      }
    };
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/mkdirs/make-dir.js
var require_make_dir = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/mkdirs/make-dir.js"(exports2, module2) {
    "use strict";
    var fs = require_fs();
    var { checkPath } = require_utils();
    var getMode = (options) => {
      const defaults = { mode: 511 };
      if (typeof options === "number")
        return options;
      return { ...defaults, ...options }.mode;
    };
    module2.exports.makeDir = async (dir, options) => {
      checkPath(dir);
      return fs.mkdir(dir, {
        mode: getMode(options),
        recursive: true
      });
    };
    module2.exports.makeDirSync = (dir, options) => {
      checkPath(dir);
      return fs.mkdirSync(dir, {
        mode: getMode(options),
        recursive: true
      });
    };
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/mkdirs/index.js
var require_mkdirs = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/mkdirs/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    var { makeDir: _makeDir, makeDirSync } = require_make_dir();
    var makeDir = u(_makeDir);
    module2.exports = {
      mkdirs: makeDir,
      mkdirsSync: makeDirSync,
      // alias
      mkdirp: makeDir,
      mkdirpSync: makeDirSync,
      ensureDir: makeDir,
      ensureDirSync: makeDirSync
    };
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/path-exists/index.js
var require_path_exists = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/path-exists/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    var fs = require_fs();
    function pathExists(path) {
      return fs.access(path).then(() => true).catch(() => false);
    }
    module2.exports = {
      pathExists: u(pathExists),
      pathExistsSync: fs.existsSync
    };
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/util/utimes.js
var require_utimes = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/util/utimes.js"(exports2, module2) {
    "use strict";
    var fs = require_graceful_fs();
    function utimesMillis(path, atime, mtime, callback) {
      fs.open(path, "r+", (err, fd) => {
        if (err)
          return callback(err);
        fs.futimes(fd, atime, mtime, (futimesErr) => {
          fs.close(fd, (closeErr) => {
            if (callback)
              callback(futimesErr || closeErr);
          });
        });
      });
    }
    function utimesMillisSync(path, atime, mtime) {
      const fd = fs.openSync(path, "r+");
      fs.futimesSync(fd, atime, mtime);
      return fs.closeSync(fd);
    }
    module2.exports = {
      utimesMillis,
      utimesMillisSync
    };
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/util/stat.js
var require_stat = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/util/stat.js"(exports2, module2) {
    "use strict";
    var fs = require_fs();
    var path = require("path");
    var util = require("util");
    function getStats(src, dest, opts) {
      const statFunc = opts.dereference ? (file) => fs.stat(file, { bigint: true }) : (file) => fs.lstat(file, { bigint: true });
      return Promise.all([
        statFunc(src),
        statFunc(dest).catch((err) => {
          if (err.code === "ENOENT")
            return null;
          throw err;
        })
      ]).then(([srcStat, destStat]) => ({ srcStat, destStat }));
    }
    function getStatsSync(src, dest, opts) {
      let destStat;
      const statFunc = opts.dereference ? (file) => fs.statSync(file, { bigint: true }) : (file) => fs.lstatSync(file, { bigint: true });
      const srcStat = statFunc(src);
      try {
        destStat = statFunc(dest);
      } catch (err) {
        if (err.code === "ENOENT")
          return { srcStat, destStat: null };
        throw err;
      }
      return { srcStat, destStat };
    }
    function checkPaths(src, dest, funcName, opts, cb) {
      util.callbackify(getStats)(src, dest, opts, (err, stats) => {
        if (err)
          return cb(err);
        const { srcStat, destStat } = stats;
        if (destStat) {
          if (areIdentical(srcStat, destStat)) {
            const srcBaseName = path.basename(src);
            const destBaseName = path.basename(dest);
            if (funcName === "move" && srcBaseName !== destBaseName && srcBaseName.toLowerCase() === destBaseName.toLowerCase()) {
              return cb(null, { srcStat, destStat, isChangingCase: true });
            }
            return cb(new Error("Source and destination must not be the same."));
          }
          if (srcStat.isDirectory() && !destStat.isDirectory()) {
            return cb(new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`));
          }
          if (!srcStat.isDirectory() && destStat.isDirectory()) {
            return cb(new Error(`Cannot overwrite directory '${dest}' with non-directory '${src}'.`));
          }
        }
        if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
          return cb(new Error(errMsg(src, dest, funcName)));
        }
        return cb(null, { srcStat, destStat });
      });
    }
    function checkPathsSync(src, dest, funcName, opts) {
      const { srcStat, destStat } = getStatsSync(src, dest, opts);
      if (destStat) {
        if (areIdentical(srcStat, destStat)) {
          const srcBaseName = path.basename(src);
          const destBaseName = path.basename(dest);
          if (funcName === "move" && srcBaseName !== destBaseName && srcBaseName.toLowerCase() === destBaseName.toLowerCase()) {
            return { srcStat, destStat, isChangingCase: true };
          }
          throw new Error("Source and destination must not be the same.");
        }
        if (srcStat.isDirectory() && !destStat.isDirectory()) {
          throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`);
        }
        if (!srcStat.isDirectory() && destStat.isDirectory()) {
          throw new Error(`Cannot overwrite directory '${dest}' with non-directory '${src}'.`);
        }
      }
      if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
        throw new Error(errMsg(src, dest, funcName));
      }
      return { srcStat, destStat };
    }
    function checkParentPaths(src, srcStat, dest, funcName, cb) {
      const srcParent = path.resolve(path.dirname(src));
      const destParent = path.resolve(path.dirname(dest));
      if (destParent === srcParent || destParent === path.parse(destParent).root)
        return cb();
      fs.stat(destParent, { bigint: true }, (err, destStat) => {
        if (err) {
          if (err.code === "ENOENT")
            return cb();
          return cb(err);
        }
        if (areIdentical(srcStat, destStat)) {
          return cb(new Error(errMsg(src, dest, funcName)));
        }
        return checkParentPaths(src, srcStat, destParent, funcName, cb);
      });
    }
    function checkParentPathsSync(src, srcStat, dest, funcName) {
      const srcParent = path.resolve(path.dirname(src));
      const destParent = path.resolve(path.dirname(dest));
      if (destParent === srcParent || destParent === path.parse(destParent).root)
        return;
      let destStat;
      try {
        destStat = fs.statSync(destParent, { bigint: true });
      } catch (err) {
        if (err.code === "ENOENT")
          return;
        throw err;
      }
      if (areIdentical(srcStat, destStat)) {
        throw new Error(errMsg(src, dest, funcName));
      }
      return checkParentPathsSync(src, srcStat, destParent, funcName);
    }
    function areIdentical(srcStat, destStat) {
      return destStat.ino && destStat.dev && destStat.ino === srcStat.ino && destStat.dev === srcStat.dev;
    }
    function isSrcSubdir(src, dest) {
      const srcArr = path.resolve(src).split(path.sep).filter((i) => i);
      const destArr = path.resolve(dest).split(path.sep).filter((i) => i);
      return srcArr.reduce((acc, cur, i) => acc && destArr[i] === cur, true);
    }
    function errMsg(src, dest, funcName) {
      return `Cannot ${funcName} '${src}' to a subdirectory of itself, '${dest}'.`;
    }
    module2.exports = {
      checkPaths,
      checkPathsSync,
      checkParentPaths,
      checkParentPathsSync,
      isSrcSubdir,
      areIdentical
    };
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/copy/copy.js
var require_copy = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/copy/copy.js"(exports2, module2) {
    "use strict";
    var fs = require_graceful_fs();
    var path = require("path");
    var mkdirs = require_mkdirs().mkdirs;
    var pathExists = require_path_exists().pathExists;
    var utimesMillis = require_utimes().utimesMillis;
    var stat = require_stat();
    function copy(src, dest, opts, cb) {
      if (typeof opts === "function" && !cb) {
        cb = opts;
        opts = {};
      } else if (typeof opts === "function") {
        opts = { filter: opts };
      }
      cb = cb || function() {
      };
      opts = opts || {};
      opts.clobber = "clobber" in opts ? !!opts.clobber : true;
      opts.overwrite = "overwrite" in opts ? !!opts.overwrite : opts.clobber;
      if (opts.preserveTimestamps && process.arch === "ia32") {
        process.emitWarning(
          "Using the preserveTimestamps option in 32-bit node is not recommended;\n\n	see https://github.com/jprichardson/node-fs-extra/issues/269",
          "Warning",
          "fs-extra-WARN0001"
        );
      }
      stat.checkPaths(src, dest, "copy", opts, (err, stats) => {
        if (err)
          return cb(err);
        const { srcStat, destStat } = stats;
        stat.checkParentPaths(src, srcStat, dest, "copy", (err2) => {
          if (err2)
            return cb(err2);
          runFilter(src, dest, opts, (err3, include) => {
            if (err3)
              return cb(err3);
            if (!include)
              return cb();
            checkParentDir(destStat, src, dest, opts, cb);
          });
        });
      });
    }
    function checkParentDir(destStat, src, dest, opts, cb) {
      const destParent = path.dirname(dest);
      pathExists(destParent, (err, dirExists) => {
        if (err)
          return cb(err);
        if (dirExists)
          return getStats(destStat, src, dest, opts, cb);
        mkdirs(destParent, (err2) => {
          if (err2)
            return cb(err2);
          return getStats(destStat, src, dest, opts, cb);
        });
      });
    }
    function runFilter(src, dest, opts, cb) {
      if (!opts.filter)
        return cb(null, true);
      Promise.resolve(opts.filter(src, dest)).then((include) => cb(null, include), (error) => cb(error));
    }
    function getStats(destStat, src, dest, opts, cb) {
      const stat2 = opts.dereference ? fs.stat : fs.lstat;
      stat2(src, (err, srcStat) => {
        if (err)
          return cb(err);
        if (srcStat.isDirectory())
          return onDir(srcStat, destStat, src, dest, opts, cb);
        else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice())
          return onFile(srcStat, destStat, src, dest, opts, cb);
        else if (srcStat.isSymbolicLink())
          return onLink(destStat, src, dest, opts, cb);
        else if (srcStat.isSocket())
          return cb(new Error(`Cannot copy a socket file: ${src}`));
        else if (srcStat.isFIFO())
          return cb(new Error(`Cannot copy a FIFO pipe: ${src}`));
        return cb(new Error(`Unknown file: ${src}`));
      });
    }
    function onFile(srcStat, destStat, src, dest, opts, cb) {
      if (!destStat)
        return copyFile(srcStat, src, dest, opts, cb);
      return mayCopyFile(srcStat, src, dest, opts, cb);
    }
    function mayCopyFile(srcStat, src, dest, opts, cb) {
      if (opts.overwrite) {
        fs.unlink(dest, (err) => {
          if (err)
            return cb(err);
          return copyFile(srcStat, src, dest, opts, cb);
        });
      } else if (opts.errorOnExist) {
        return cb(new Error(`'${dest}' already exists`));
      } else
        return cb();
    }
    function copyFile(srcStat, src, dest, opts, cb) {
      fs.copyFile(src, dest, (err) => {
        if (err)
          return cb(err);
        if (opts.preserveTimestamps)
          return handleTimestampsAndMode(srcStat.mode, src, dest, cb);
        return setDestMode(dest, srcStat.mode, cb);
      });
    }
    function handleTimestampsAndMode(srcMode, src, dest, cb) {
      if (fileIsNotWritable(srcMode)) {
        return makeFileWritable(dest, srcMode, (err) => {
          if (err)
            return cb(err);
          return setDestTimestampsAndMode(srcMode, src, dest, cb);
        });
      }
      return setDestTimestampsAndMode(srcMode, src, dest, cb);
    }
    function fileIsNotWritable(srcMode) {
      return (srcMode & 128) === 0;
    }
    function makeFileWritable(dest, srcMode, cb) {
      return setDestMode(dest, srcMode | 128, cb);
    }
    function setDestTimestampsAndMode(srcMode, src, dest, cb) {
      setDestTimestamps(src, dest, (err) => {
        if (err)
          return cb(err);
        return setDestMode(dest, srcMode, cb);
      });
    }
    function setDestMode(dest, srcMode, cb) {
      return fs.chmod(dest, srcMode, cb);
    }
    function setDestTimestamps(src, dest, cb) {
      fs.stat(src, (err, updatedSrcStat) => {
        if (err)
          return cb(err);
        return utimesMillis(dest, updatedSrcStat.atime, updatedSrcStat.mtime, cb);
      });
    }
    function onDir(srcStat, destStat, src, dest, opts, cb) {
      if (!destStat)
        return mkDirAndCopy(srcStat.mode, src, dest, opts, cb);
      return copyDir(src, dest, opts, cb);
    }
    function mkDirAndCopy(srcMode, src, dest, opts, cb) {
      fs.mkdir(dest, (err) => {
        if (err)
          return cb(err);
        copyDir(src, dest, opts, (err2) => {
          if (err2)
            return cb(err2);
          return setDestMode(dest, srcMode, cb);
        });
      });
    }
    function copyDir(src, dest, opts, cb) {
      fs.readdir(src, (err, items) => {
        if (err)
          return cb(err);
        return copyDirItems(items, src, dest, opts, cb);
      });
    }
    function copyDirItems(items, src, dest, opts, cb) {
      const item = items.pop();
      if (!item)
        return cb();
      return copyDirItem(items, item, src, dest, opts, cb);
    }
    function copyDirItem(items, item, src, dest, opts, cb) {
      const srcItem = path.join(src, item);
      const destItem = path.join(dest, item);
      runFilter(srcItem, destItem, opts, (err, include) => {
        if (err)
          return cb(err);
        if (!include)
          return copyDirItems(items, src, dest, opts, cb);
        stat.checkPaths(srcItem, destItem, "copy", opts, (err2, stats) => {
          if (err2)
            return cb(err2);
          const { destStat } = stats;
          getStats(destStat, srcItem, destItem, opts, (err3) => {
            if (err3)
              return cb(err3);
            return copyDirItems(items, src, dest, opts, cb);
          });
        });
      });
    }
    function onLink(destStat, src, dest, opts, cb) {
      fs.readlink(src, (err, resolvedSrc) => {
        if (err)
          return cb(err);
        if (opts.dereference) {
          resolvedSrc = path.resolve(process.cwd(), resolvedSrc);
        }
        if (!destStat) {
          return fs.symlink(resolvedSrc, dest, cb);
        } else {
          fs.readlink(dest, (err2, resolvedDest) => {
            if (err2) {
              if (err2.code === "EINVAL" || err2.code === "UNKNOWN")
                return fs.symlink(resolvedSrc, dest, cb);
              return cb(err2);
            }
            if (opts.dereference) {
              resolvedDest = path.resolve(process.cwd(), resolvedDest);
            }
            if (stat.isSrcSubdir(resolvedSrc, resolvedDest)) {
              return cb(new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`));
            }
            if (stat.isSrcSubdir(resolvedDest, resolvedSrc)) {
              return cb(new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`));
            }
            return copyLink(resolvedSrc, dest, cb);
          });
        }
      });
    }
    function copyLink(resolvedSrc, dest, cb) {
      fs.unlink(dest, (err) => {
        if (err)
          return cb(err);
        return fs.symlink(resolvedSrc, dest, cb);
      });
    }
    module2.exports = copy;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/copy/copy-sync.js
var require_copy_sync = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/copy/copy-sync.js"(exports2, module2) {
    "use strict";
    var fs = require_graceful_fs();
    var path = require("path");
    var mkdirsSync = require_mkdirs().mkdirsSync;
    var utimesMillisSync = require_utimes().utimesMillisSync;
    var stat = require_stat();
    function copySync(src, dest, opts) {
      if (typeof opts === "function") {
        opts = { filter: opts };
      }
      opts = opts || {};
      opts.clobber = "clobber" in opts ? !!opts.clobber : true;
      opts.overwrite = "overwrite" in opts ? !!opts.overwrite : opts.clobber;
      if (opts.preserveTimestamps && process.arch === "ia32") {
        process.emitWarning(
          "Using the preserveTimestamps option in 32-bit node is not recommended;\n\n	see https://github.com/jprichardson/node-fs-extra/issues/269",
          "Warning",
          "fs-extra-WARN0002"
        );
      }
      const { srcStat, destStat } = stat.checkPathsSync(src, dest, "copy", opts);
      stat.checkParentPathsSync(src, srcStat, dest, "copy");
      if (opts.filter && !opts.filter(src, dest))
        return;
      const destParent = path.dirname(dest);
      if (!fs.existsSync(destParent))
        mkdirsSync(destParent);
      return getStats(destStat, src, dest, opts);
    }
    function getStats(destStat, src, dest, opts) {
      const statSync = opts.dereference ? fs.statSync : fs.lstatSync;
      const srcStat = statSync(src);
      if (srcStat.isDirectory())
        return onDir(srcStat, destStat, src, dest, opts);
      else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice())
        return onFile(srcStat, destStat, src, dest, opts);
      else if (srcStat.isSymbolicLink())
        return onLink(destStat, src, dest, opts);
      else if (srcStat.isSocket())
        throw new Error(`Cannot copy a socket file: ${src}`);
      else if (srcStat.isFIFO())
        throw new Error(`Cannot copy a FIFO pipe: ${src}`);
      throw new Error(`Unknown file: ${src}`);
    }
    function onFile(srcStat, destStat, src, dest, opts) {
      if (!destStat)
        return copyFile(srcStat, src, dest, opts);
      return mayCopyFile(srcStat, src, dest, opts);
    }
    function mayCopyFile(srcStat, src, dest, opts) {
      if (opts.overwrite) {
        fs.unlinkSync(dest);
        return copyFile(srcStat, src, dest, opts);
      } else if (opts.errorOnExist) {
        throw new Error(`'${dest}' already exists`);
      }
    }
    function copyFile(srcStat, src, dest, opts) {
      fs.copyFileSync(src, dest);
      if (opts.preserveTimestamps)
        handleTimestamps(srcStat.mode, src, dest);
      return setDestMode(dest, srcStat.mode);
    }
    function handleTimestamps(srcMode, src, dest) {
      if (fileIsNotWritable(srcMode))
        makeFileWritable(dest, srcMode);
      return setDestTimestamps(src, dest);
    }
    function fileIsNotWritable(srcMode) {
      return (srcMode & 128) === 0;
    }
    function makeFileWritable(dest, srcMode) {
      return setDestMode(dest, srcMode | 128);
    }
    function setDestMode(dest, srcMode) {
      return fs.chmodSync(dest, srcMode);
    }
    function setDestTimestamps(src, dest) {
      const updatedSrcStat = fs.statSync(src);
      return utimesMillisSync(dest, updatedSrcStat.atime, updatedSrcStat.mtime);
    }
    function onDir(srcStat, destStat, src, dest, opts) {
      if (!destStat)
        return mkDirAndCopy(srcStat.mode, src, dest, opts);
      return copyDir(src, dest, opts);
    }
    function mkDirAndCopy(srcMode, src, dest, opts) {
      fs.mkdirSync(dest);
      copyDir(src, dest, opts);
      return setDestMode(dest, srcMode);
    }
    function copyDir(src, dest, opts) {
      fs.readdirSync(src).forEach((item) => copyDirItem(item, src, dest, opts));
    }
    function copyDirItem(item, src, dest, opts) {
      const srcItem = path.join(src, item);
      const destItem = path.join(dest, item);
      if (opts.filter && !opts.filter(srcItem, destItem))
        return;
      const { destStat } = stat.checkPathsSync(srcItem, destItem, "copy", opts);
      return getStats(destStat, srcItem, destItem, opts);
    }
    function onLink(destStat, src, dest, opts) {
      let resolvedSrc = fs.readlinkSync(src);
      if (opts.dereference) {
        resolvedSrc = path.resolve(process.cwd(), resolvedSrc);
      }
      if (!destStat) {
        return fs.symlinkSync(resolvedSrc, dest);
      } else {
        let resolvedDest;
        try {
          resolvedDest = fs.readlinkSync(dest);
        } catch (err) {
          if (err.code === "EINVAL" || err.code === "UNKNOWN")
            return fs.symlinkSync(resolvedSrc, dest);
          throw err;
        }
        if (opts.dereference) {
          resolvedDest = path.resolve(process.cwd(), resolvedDest);
        }
        if (stat.isSrcSubdir(resolvedSrc, resolvedDest)) {
          throw new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`);
        }
        if (stat.isSrcSubdir(resolvedDest, resolvedSrc)) {
          throw new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`);
        }
        return copyLink(resolvedSrc, dest);
      }
    }
    function copyLink(resolvedSrc, dest) {
      fs.unlinkSync(dest);
      return fs.symlinkSync(resolvedSrc, dest);
    }
    module2.exports = copySync;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/copy/index.js
var require_copy2 = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/copy/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    module2.exports = {
      copy: u(require_copy()),
      copySync: require_copy_sync()
    };
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/remove/index.js
var require_remove = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/remove/index.js"(exports2, module2) {
    "use strict";
    var fs = require_graceful_fs();
    var u = require_universalify().fromCallback;
    function remove(path, callback) {
      fs.rm(path, { recursive: true, force: true }, callback);
    }
    function removeSync(path) {
      fs.rmSync(path, { recursive: true, force: true });
    }
    module2.exports = {
      remove: u(remove),
      removeSync
    };
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/empty/index.js
var require_empty = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/empty/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    var fs = require_fs();
    var path = require("path");
    var mkdir = require_mkdirs();
    var remove = require_remove();
    var emptyDir = u(async function emptyDir2(dir) {
      let items;
      try {
        items = await fs.readdir(dir);
      } catch {
        return mkdir.mkdirs(dir);
      }
      return Promise.all(items.map((item) => remove.remove(path.join(dir, item))));
    });
    function emptyDirSync(dir) {
      let items;
      try {
        items = fs.readdirSync(dir);
      } catch {
        return mkdir.mkdirsSync(dir);
      }
      items.forEach((item) => {
        item = path.join(dir, item);
        remove.removeSync(item);
      });
    }
    module2.exports = {
      emptyDirSync,
      emptydirSync: emptyDirSync,
      emptyDir,
      emptydir: emptyDir
    };
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/ensure/file.js
var require_file = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/ensure/file.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    var path = require("path");
    var fs = require_graceful_fs();
    var mkdir = require_mkdirs();
    function createFile(file, callback) {
      function makeFile() {
        fs.writeFile(file, "", (err) => {
          if (err)
            return callback(err);
          callback();
        });
      }
      fs.stat(file, (err, stats) => {
        if (!err && stats.isFile())
          return callback();
        const dir = path.dirname(file);
        fs.stat(dir, (err2, stats2) => {
          if (err2) {
            if (err2.code === "ENOENT") {
              return mkdir.mkdirs(dir, (err3) => {
                if (err3)
                  return callback(err3);
                makeFile();
              });
            }
            return callback(err2);
          }
          if (stats2.isDirectory())
            makeFile();
          else {
            fs.readdir(dir, (err3) => {
              if (err3)
                return callback(err3);
            });
          }
        });
      });
    }
    function createFileSync(file) {
      let stats;
      try {
        stats = fs.statSync(file);
      } catch {
      }
      if (stats && stats.isFile())
        return;
      const dir = path.dirname(file);
      try {
        if (!fs.statSync(dir).isDirectory()) {
          fs.readdirSync(dir);
        }
      } catch (err) {
        if (err && err.code === "ENOENT")
          mkdir.mkdirsSync(dir);
        else
          throw err;
      }
      fs.writeFileSync(file, "");
    }
    module2.exports = {
      createFile: u(createFile),
      createFileSync
    };
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/ensure/link.js
var require_link = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/ensure/link.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    var path = require("path");
    var fs = require_graceful_fs();
    var mkdir = require_mkdirs();
    var pathExists = require_path_exists().pathExists;
    var { areIdentical } = require_stat();
    function createLink(srcpath, dstpath, callback) {
      function makeLink(srcpath2, dstpath2) {
        fs.link(srcpath2, dstpath2, (err) => {
          if (err)
            return callback(err);
          callback(null);
        });
      }
      fs.lstat(dstpath, (_, dstStat) => {
        fs.lstat(srcpath, (err, srcStat) => {
          if (err) {
            err.message = err.message.replace("lstat", "ensureLink");
            return callback(err);
          }
          if (dstStat && areIdentical(srcStat, dstStat))
            return callback(null);
          const dir = path.dirname(dstpath);
          pathExists(dir, (err2, dirExists) => {
            if (err2)
              return callback(err2);
            if (dirExists)
              return makeLink(srcpath, dstpath);
            mkdir.mkdirs(dir, (err3) => {
              if (err3)
                return callback(err3);
              makeLink(srcpath, dstpath);
            });
          });
        });
      });
    }
    function createLinkSync(srcpath, dstpath) {
      let dstStat;
      try {
        dstStat = fs.lstatSync(dstpath);
      } catch {
      }
      try {
        const srcStat = fs.lstatSync(srcpath);
        if (dstStat && areIdentical(srcStat, dstStat))
          return;
      } catch (err) {
        err.message = err.message.replace("lstat", "ensureLink");
        throw err;
      }
      const dir = path.dirname(dstpath);
      const dirExists = fs.existsSync(dir);
      if (dirExists)
        return fs.linkSync(srcpath, dstpath);
      mkdir.mkdirsSync(dir);
      return fs.linkSync(srcpath, dstpath);
    }
    module2.exports = {
      createLink: u(createLink),
      createLinkSync
    };
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/ensure/symlink-paths.js
var require_symlink_paths = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/ensure/symlink-paths.js"(exports2, module2) {
    "use strict";
    var path = require("path");
    var fs = require_graceful_fs();
    var pathExists = require_path_exists().pathExists;
    function symlinkPaths(srcpath, dstpath, callback) {
      if (path.isAbsolute(srcpath)) {
        return fs.lstat(srcpath, (err) => {
          if (err) {
            err.message = err.message.replace("lstat", "ensureSymlink");
            return callback(err);
          }
          return callback(null, {
            toCwd: srcpath,
            toDst: srcpath
          });
        });
      } else {
        const dstdir = path.dirname(dstpath);
        const relativeToDst = path.join(dstdir, srcpath);
        return pathExists(relativeToDst, (err, exists) => {
          if (err)
            return callback(err);
          if (exists) {
            return callback(null, {
              toCwd: relativeToDst,
              toDst: srcpath
            });
          } else {
            return fs.lstat(srcpath, (err2) => {
              if (err2) {
                err2.message = err2.message.replace("lstat", "ensureSymlink");
                return callback(err2);
              }
              return callback(null, {
                toCwd: srcpath,
                toDst: path.relative(dstdir, srcpath)
              });
            });
          }
        });
      }
    }
    function symlinkPathsSync(srcpath, dstpath) {
      let exists;
      if (path.isAbsolute(srcpath)) {
        exists = fs.existsSync(srcpath);
        if (!exists)
          throw new Error("absolute srcpath does not exist");
        return {
          toCwd: srcpath,
          toDst: srcpath
        };
      } else {
        const dstdir = path.dirname(dstpath);
        const relativeToDst = path.join(dstdir, srcpath);
        exists = fs.existsSync(relativeToDst);
        if (exists) {
          return {
            toCwd: relativeToDst,
            toDst: srcpath
          };
        } else {
          exists = fs.existsSync(srcpath);
          if (!exists)
            throw new Error("relative srcpath does not exist");
          return {
            toCwd: srcpath,
            toDst: path.relative(dstdir, srcpath)
          };
        }
      }
    }
    module2.exports = {
      symlinkPaths,
      symlinkPathsSync
    };
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/ensure/symlink-type.js
var require_symlink_type = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/ensure/symlink-type.js"(exports2, module2) {
    "use strict";
    var fs = require_graceful_fs();
    function symlinkType(srcpath, type, callback) {
      callback = typeof type === "function" ? type : callback;
      type = typeof type === "function" ? false : type;
      if (type)
        return callback(null, type);
      fs.lstat(srcpath, (err, stats) => {
        if (err)
          return callback(null, "file");
        type = stats && stats.isDirectory() ? "dir" : "file";
        callback(null, type);
      });
    }
    function symlinkTypeSync(srcpath, type) {
      let stats;
      if (type)
        return type;
      try {
        stats = fs.lstatSync(srcpath);
      } catch {
        return "file";
      }
      return stats && stats.isDirectory() ? "dir" : "file";
    }
    module2.exports = {
      symlinkType,
      symlinkTypeSync
    };
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/ensure/symlink.js
var require_symlink = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/ensure/symlink.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    var path = require("path");
    var fs = require_fs();
    var _mkdirs = require_mkdirs();
    var mkdirs = _mkdirs.mkdirs;
    var mkdirsSync = _mkdirs.mkdirsSync;
    var _symlinkPaths = require_symlink_paths();
    var symlinkPaths = _symlinkPaths.symlinkPaths;
    var symlinkPathsSync = _symlinkPaths.symlinkPathsSync;
    var _symlinkType = require_symlink_type();
    var symlinkType = _symlinkType.symlinkType;
    var symlinkTypeSync = _symlinkType.symlinkTypeSync;
    var pathExists = require_path_exists().pathExists;
    var { areIdentical } = require_stat();
    function createSymlink(srcpath, dstpath, type, callback) {
      callback = typeof type === "function" ? type : callback;
      type = typeof type === "function" ? false : type;
      fs.lstat(dstpath, (err, stats) => {
        if (!err && stats.isSymbolicLink()) {
          Promise.all([
            fs.stat(srcpath),
            fs.stat(dstpath)
          ]).then(([srcStat, dstStat]) => {
            if (areIdentical(srcStat, dstStat))
              return callback(null);
            _createSymlink(srcpath, dstpath, type, callback);
          });
        } else
          _createSymlink(srcpath, dstpath, type, callback);
      });
    }
    function _createSymlink(srcpath, dstpath, type, callback) {
      symlinkPaths(srcpath, dstpath, (err, relative) => {
        if (err)
          return callback(err);
        srcpath = relative.toDst;
        symlinkType(relative.toCwd, type, (err2, type2) => {
          if (err2)
            return callback(err2);
          const dir = path.dirname(dstpath);
          pathExists(dir, (err3, dirExists) => {
            if (err3)
              return callback(err3);
            if (dirExists)
              return fs.symlink(srcpath, dstpath, type2, callback);
            mkdirs(dir, (err4) => {
              if (err4)
                return callback(err4);
              fs.symlink(srcpath, dstpath, type2, callback);
            });
          });
        });
      });
    }
    function createSymlinkSync(srcpath, dstpath, type) {
      let stats;
      try {
        stats = fs.lstatSync(dstpath);
      } catch {
      }
      if (stats && stats.isSymbolicLink()) {
        const srcStat = fs.statSync(srcpath);
        const dstStat = fs.statSync(dstpath);
        if (areIdentical(srcStat, dstStat))
          return;
      }
      const relative = symlinkPathsSync(srcpath, dstpath);
      srcpath = relative.toDst;
      type = symlinkTypeSync(relative.toCwd, type);
      const dir = path.dirname(dstpath);
      const exists = fs.existsSync(dir);
      if (exists)
        return fs.symlinkSync(srcpath, dstpath, type);
      mkdirsSync(dir);
      return fs.symlinkSync(srcpath, dstpath, type);
    }
    module2.exports = {
      createSymlink: u(createSymlink),
      createSymlinkSync
    };
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/ensure/index.js
var require_ensure = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/ensure/index.js"(exports2, module2) {
    "use strict";
    var { createFile, createFileSync } = require_file();
    var { createLink, createLinkSync } = require_link();
    var { createSymlink, createSymlinkSync } = require_symlink();
    module2.exports = {
      // file
      createFile,
      createFileSync,
      ensureFile: createFile,
      ensureFileSync: createFileSync,
      // link
      createLink,
      createLinkSync,
      ensureLink: createLink,
      ensureLinkSync: createLinkSync,
      // symlink
      createSymlink,
      createSymlinkSync,
      ensureSymlink: createSymlink,
      ensureSymlinkSync: createSymlinkSync
    };
  }
});

// node_modules/jsonfile/utils.js
var require_utils2 = __commonJS({
  "node_modules/jsonfile/utils.js"(exports2, module2) {
    function stringify2(obj, { EOL = "\n", finalEOL = true, replacer = null, spaces } = {}) {
      const EOF = finalEOL ? EOL : "";
      const str = JSON.stringify(obj, replacer, spaces);
      return str.replace(/\n/g, EOL) + EOF;
    }
    function stripBom(content) {
      if (Buffer.isBuffer(content))
        content = content.toString("utf8");
      return content.replace(/^\uFEFF/, "");
    }
    module2.exports = { stringify: stringify2, stripBom };
  }
});

// node_modules/jsonfile/index.js
var require_jsonfile = __commonJS({
  "node_modules/jsonfile/index.js"(exports2, module2) {
    var _fs;
    try {
      _fs = require_graceful_fs();
    } catch (_) {
      _fs = require("fs");
    }
    var universalify = require_universalify();
    var { stringify: stringify2, stripBom } = require_utils2();
    async function _readFile(file, options = {}) {
      if (typeof options === "string") {
        options = { encoding: options };
      }
      const fs = options.fs || _fs;
      const shouldThrow = "throws" in options ? options.throws : true;
      let data = await universalify.fromCallback(fs.readFile)(file, options);
      data = stripBom(data);
      let obj;
      try {
        obj = JSON.parse(data, options ? options.reviver : null);
      } catch (err) {
        if (shouldThrow) {
          err.message = `${file}: ${err.message}`;
          throw err;
        } else {
          return null;
        }
      }
      return obj;
    }
    var readFile = universalify.fromPromise(_readFile);
    function readFileSync(file, options = {}) {
      if (typeof options === "string") {
        options = { encoding: options };
      }
      const fs = options.fs || _fs;
      const shouldThrow = "throws" in options ? options.throws : true;
      try {
        let content = fs.readFileSync(file, options);
        content = stripBom(content);
        return JSON.parse(content, options.reviver);
      } catch (err) {
        if (shouldThrow) {
          err.message = `${file}: ${err.message}`;
          throw err;
        } else {
          return null;
        }
      }
    }
    async function _writeFile(file, obj, options = {}) {
      const fs = options.fs || _fs;
      const str = stringify2(obj, options);
      await universalify.fromCallback(fs.writeFile)(file, str, options);
    }
    var writeFile = universalify.fromPromise(_writeFile);
    function writeFileSync(file, obj, options = {}) {
      const fs = options.fs || _fs;
      const str = stringify2(obj, options);
      return fs.writeFileSync(file, str, options);
    }
    var jsonfile = {
      readFile,
      readFileSync,
      writeFile,
      writeFileSync
    };
    module2.exports = jsonfile;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/json/jsonfile.js
var require_jsonfile2 = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/json/jsonfile.js"(exports2, module2) {
    "use strict";
    var jsonFile = require_jsonfile();
    module2.exports = {
      // jsonfile exports
      readJson: jsonFile.readFile,
      readJsonSync: jsonFile.readFileSync,
      writeJson: jsonFile.writeFile,
      writeJsonSync: jsonFile.writeFileSync
    };
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/output-file/index.js
var require_output_file = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/output-file/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    var fs = require_graceful_fs();
    var path = require("path");
    var mkdir = require_mkdirs();
    var pathExists = require_path_exists().pathExists;
    function outputFile(file, data, encoding, callback) {
      if (typeof encoding === "function") {
        callback = encoding;
        encoding = "utf8";
      }
      const dir = path.dirname(file);
      pathExists(dir, (err, itDoes) => {
        if (err)
          return callback(err);
        if (itDoes)
          return fs.writeFile(file, data, encoding, callback);
        mkdir.mkdirs(dir, (err2) => {
          if (err2)
            return callback(err2);
          fs.writeFile(file, data, encoding, callback);
        });
      });
    }
    function outputFileSync(file, ...args) {
      const dir = path.dirname(file);
      if (fs.existsSync(dir)) {
        return fs.writeFileSync(file, ...args);
      }
      mkdir.mkdirsSync(dir);
      fs.writeFileSync(file, ...args);
    }
    module2.exports = {
      outputFile: u(outputFile),
      outputFileSync
    };
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/json/output-json.js
var require_output_json = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/json/output-json.js"(exports2, module2) {
    "use strict";
    var { stringify: stringify2 } = require_utils2();
    var { outputFile } = require_output_file();
    async function outputJson(file, data, options = {}) {
      const str = stringify2(data, options);
      await outputFile(file, str, options);
    }
    module2.exports = outputJson;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/json/output-json-sync.js
var require_output_json_sync = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/json/output-json-sync.js"(exports2, module2) {
    "use strict";
    var { stringify: stringify2 } = require_utils2();
    var { outputFileSync } = require_output_file();
    function outputJsonSync(file, data, options) {
      const str = stringify2(data, options);
      outputFileSync(file, str, options);
    }
    module2.exports = outputJsonSync;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/json/index.js
var require_json = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/json/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    var jsonFile = require_jsonfile2();
    jsonFile.outputJson = u(require_output_json());
    jsonFile.outputJsonSync = require_output_json_sync();
    jsonFile.outputJSON = jsonFile.outputJson;
    jsonFile.outputJSONSync = jsonFile.outputJsonSync;
    jsonFile.writeJSON = jsonFile.writeJson;
    jsonFile.writeJSONSync = jsonFile.writeJsonSync;
    jsonFile.readJSON = jsonFile.readJson;
    jsonFile.readJSONSync = jsonFile.readJsonSync;
    module2.exports = jsonFile;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/move/move.js
var require_move = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/move/move.js"(exports2, module2) {
    "use strict";
    var fs = require_graceful_fs();
    var path = require("path");
    var copy = require_copy2().copy;
    var remove = require_remove().remove;
    var mkdirp = require_mkdirs().mkdirp;
    var pathExists = require_path_exists().pathExists;
    var stat = require_stat();
    function move(src, dest, opts, cb) {
      if (typeof opts === "function") {
        cb = opts;
        opts = {};
      }
      opts = opts || {};
      const overwrite = opts.overwrite || opts.clobber || false;
      stat.checkPaths(src, dest, "move", opts, (err, stats) => {
        if (err)
          return cb(err);
        const { srcStat, isChangingCase = false } = stats;
        stat.checkParentPaths(src, srcStat, dest, "move", (err2) => {
          if (err2)
            return cb(err2);
          if (isParentRoot(dest))
            return doRename(src, dest, overwrite, isChangingCase, cb);
          mkdirp(path.dirname(dest), (err3) => {
            if (err3)
              return cb(err3);
            return doRename(src, dest, overwrite, isChangingCase, cb);
          });
        });
      });
    }
    function isParentRoot(dest) {
      const parent = path.dirname(dest);
      const parsedPath = path.parse(parent);
      return parsedPath.root === parent;
    }
    function doRename(src, dest, overwrite, isChangingCase, cb) {
      if (isChangingCase)
        return rename(src, dest, overwrite, cb);
      if (overwrite) {
        return remove(dest, (err) => {
          if (err)
            return cb(err);
          return rename(src, dest, overwrite, cb);
        });
      }
      pathExists(dest, (err, destExists) => {
        if (err)
          return cb(err);
        if (destExists)
          return cb(new Error("dest already exists."));
        return rename(src, dest, overwrite, cb);
      });
    }
    function rename(src, dest, overwrite, cb) {
      fs.rename(src, dest, (err) => {
        if (!err)
          return cb();
        if (err.code !== "EXDEV")
          return cb(err);
        return moveAcrossDevice(src, dest, overwrite, cb);
      });
    }
    function moveAcrossDevice(src, dest, overwrite, cb) {
      const opts = {
        overwrite,
        errorOnExist: true,
        preserveTimestamps: true
      };
      copy(src, dest, opts, (err) => {
        if (err)
          return cb(err);
        return remove(src, cb);
      });
    }
    module2.exports = move;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/move/move-sync.js
var require_move_sync = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/move/move-sync.js"(exports2, module2) {
    "use strict";
    var fs = require_graceful_fs();
    var path = require("path");
    var copySync = require_copy2().copySync;
    var removeSync = require_remove().removeSync;
    var mkdirpSync = require_mkdirs().mkdirpSync;
    var stat = require_stat();
    function moveSync(src, dest, opts) {
      opts = opts || {};
      const overwrite = opts.overwrite || opts.clobber || false;
      const { srcStat, isChangingCase = false } = stat.checkPathsSync(src, dest, "move", opts);
      stat.checkParentPathsSync(src, srcStat, dest, "move");
      if (!isParentRoot(dest))
        mkdirpSync(path.dirname(dest));
      return doRename(src, dest, overwrite, isChangingCase);
    }
    function isParentRoot(dest) {
      const parent = path.dirname(dest);
      const parsedPath = path.parse(parent);
      return parsedPath.root === parent;
    }
    function doRename(src, dest, overwrite, isChangingCase) {
      if (isChangingCase)
        return rename(src, dest, overwrite);
      if (overwrite) {
        removeSync(dest);
        return rename(src, dest, overwrite);
      }
      if (fs.existsSync(dest))
        throw new Error("dest already exists.");
      return rename(src, dest, overwrite);
    }
    function rename(src, dest, overwrite) {
      try {
        fs.renameSync(src, dest);
      } catch (err) {
        if (err.code !== "EXDEV")
          throw err;
        return moveAcrossDevice(src, dest, overwrite);
      }
    }
    function moveAcrossDevice(src, dest, overwrite) {
      const opts = {
        overwrite,
        errorOnExist: true,
        preserveTimestamps: true
      };
      copySync(src, dest, opts);
      return removeSync(src);
    }
    module2.exports = moveSync;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/move/index.js
var require_move2 = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/move/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    module2.exports = {
      move: u(require_move()),
      moveSync: require_move_sync()
    };
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/index.js
var require_lib = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/node_modules/fs-extra/lib/index.js"(exports2, module2) {
    "use strict";
    module2.exports = {
      // Export promiseified graceful-fs:
      ...require_fs(),
      // Export extra methods:
      ...require_copy2(),
      ...require_empty(),
      ...require_ensure(),
      ...require_json(),
      ...require_mkdirs(),
      ...require_move2(),
      ...require_output_file(),
      ...require_path_exists(),
      ...require_remove()
    };
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/checkSolution.js
var require_checkSolution = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/checkSolution.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.checkSolution = void 0;
    var glob = require_src();
    var os = require("os");
    var path = require("path");
    var InputValidator_1 = require_InputValidator();
    var createPacRunner_1 = require_createPacRunner();
    var authenticate_1 = require_authenticate();
    var fs_extra_1 = require_lib();
    function checkSolution(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        const validator = new InputValidator_1.InputValidator(host);
        const artifactStore = host.getArtifactStore();
        function resolveFolder(folder) {
          if (!folder || typeof folder !== "string")
            return void 0;
          return path.resolve(runnerParameters.workingDir, folder);
        }
        let level;
        let threshold;
        if (parameters.errorThreshold != void 0) {
          level = validator.getInput(parameters.errorLevel);
          threshold = validator.getInput(parameters.errorThreshold);
        }
        const failOnAnalysisError = validator.getInput(parameters.failOnAnalysisError) === "true";
        let ruleLevelOverrideFile;
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateAdmin)(pac, parameters.credentials, logger);
          logger.log("The Authentication Result: " + authenticateResult);
          const pacArgs = ["solution", "check"];
          if (validator.getInput(parameters.fileLocation) === "sasUriFile") {
            validator.pushInput(pacArgs, "--solutionUrl", parameters.solutionUrl);
          } else {
            validator.pushInput(pacArgs, "--path", parameters.solutionPath, resolveFolder);
          }
          validator.pushInput(pacArgs, "--ruleSet", parameters.ruleSet, defaultRulesMapper);
          ruleLevelOverrideFile = yield createRuleOverrideFile(validator.getInput(parameters.ruleLevelOverride));
          if (ruleLevelOverrideFile) {
            pacArgs.push("--ruleLevelOverride", ruleLevelOverrideFile);
          }
          validator.pushInput(pacArgs, "--excludedFiles", parameters.filesExcluded);
          if (validator.getInput(parameters.useDefaultPAEndpoint) !== "true") {
            const customEndpoint = validator.getInput(parameters.customPAEndpoint);
            if (!customEndpoint) {
              throw new Error(`Required ${parameters.customPAEndpoint.name} not set`);
            }
            pacArgs.push("--customEndpoint", customEndpoint);
          } else {
            const geo = validator.getInput(parameters.geoInstance);
            if (geo) {
              pacArgs.push("--geo", geo);
            } else {
              pacArgs.push("--customEndpoint", parameters.environmentUrl);
            }
          }
          const outputDirectory = path.join(artifactStore.getTempFolder(), "checker-output");
          logger.debug(`checker-output folder: ${outputDirectory}`);
          pacArgs.push("--outputDirectory", outputDirectory);
          validator.pushInput(pacArgs, "--saveResults", parameters.saveResults);
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("CheckSolution Action Result: " + pacResult);
          const files = glob.sync("**/*", { cwd: outputDirectory, absolute: true });
          const artifactStoreName = validator.getInput(parameters.artifactStoreName) || "CheckSolutionLogs";
          yield artifactStore.upload(artifactStoreName, files);
          const status = isolateStatus(pacResult);
          if (status === "Failed" || status === "FinishedWithErrors") {
            const msg = "PowerApps Checker analysis results indicate a failure or error during the analysis process.";
            if (failOnAnalysisError) {
              throw new Error(msg);
            } else {
              logger.warn(msg);
            }
          }
          if (level != void 0 && threshold != void 0) {
            errorCheck(pacResult, level, parseInt(threshold));
          }
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          if (ruleLevelOverrideFile) {
            try {
              (0, fs_extra_1.rmSync)(ruleLevelOverrideFile);
              (0, fs_extra_1.rmdirSync)(path.dirname(ruleLevelOverrideFile));
            } catch (_a) {
            }
          }
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.checkSolution = checkSolution;
    function isolateStatus(pacResults) {
      for (let i = pacResults.length - 1; i >= 0; i--) {
        const hit = pacResults[i].match(/^\s*Status\s*:\s*(\S+)/i);
        if (hit && hit.length == 2) {
          return hit[1];
        }
      }
    }
    function errorCheck(pacResults, errorLevel, errorThreshold) {
      let issuesLine = -1;
      for (let i = pacResults.length - 1; i >= 0; i--) {
        if (pacResults[i].match(/^\s*Critical\s+High/)) {
          issuesLine = i;
          break;
        }
      }
      if (issuesLine < 0) {
        throw Error("Cannot find issues summary line in results!");
      }
      const errors = {};
      const PAErrorLevels = pacResults[issuesLine].trim().split(/\s+/);
      const PAErrorValues = pacResults[issuesLine + 2].trim().split(/\s+/);
      for (let i = 0; i < PAErrorLevels.length && i < PAErrorValues.length; i++) {
        errors[PAErrorLevels[i]] = parseInt(PAErrorValues[i]);
      }
      const issueCount = {
        "CriticalIssueCount": "Critical",
        "HighIssueCount": "High",
        "MediumIssueCount": "Medium",
        "LowIssueCount": "Low",
        "InformationalIssueCount": "Informational"
      };
      if (errors[issueCount[errorLevel]] > errorThreshold) {
        throw new Error("Analysis results do not pass with selected error level and threshold choices.  Please review detailed results in SARIF file for more information.");
      }
    }
    function createRuleOverrideFile(ruleOverrideJson) {
      return __awaiter2(this, void 0, void 0, function* () {
        if (ruleOverrideJson) {
          const overrideFile = path.join(yield fs_extra_1.promises.mkdtemp(path.join(os.tmpdir(), "checker-")), "overrideRule.json");
          yield (0, fs_extra_1.writeFile)(overrideFile, ruleOverrideJson);
          return overrideFile;
        }
        return void 0;
      });
    }
    function defaultRulesMapper(rule) {
      if (!rule || typeof rule !== "string")
        return void 0;
      switch (rule.toLowerCase()) {
        case "appsource certification":
          return "083a2ef5-7e0e-4754-9d88-9455142dc08b";
        case "solution checker":
          return "0ad12346-e108-40b8-a956-9a8f95ea18c9";
        default:
          return rule;
      }
    }
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/publishSolution.js
var require_publishSolution = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/publishSolution.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.publishSolution = void 0;
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    var InputValidator_1 = require_InputValidator();
    function publishSolution(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateEnvironment)(pac, parameters.credentials, parameters.environmentUrl, logger);
          logger.log("The Authentication Result: " + authenticateResult);
          const pacArgs = ["solution", "publish"];
          const validator = new InputValidator_1.InputValidator(host);
          validator.pushInput(pacArgs, "--async", parameters.async);
          validator.pushInput(pacArgs, "--max-async-wait-time", parameters.maxAsyncWaitTimeInMin);
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("PublishSolution Action Result: " + pacResult);
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.publishSolution = publishSolution;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/deployPackage.js
var require_deployPackage = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/deployPackage.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.deployPackage = void 0;
    var path = require("path");
    var os = require("os");
    var fs = require_lib();
    var InputValidator_1 = require_InputValidator();
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    function deployPackage(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const artifactStore = host.getArtifactStore();
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        let logFile = "";
        try {
          const platform = os.platform();
          if (platform !== "win32") {
            throw new Error(`deploy package is only supported on Windows agents/runners (attempted run on ${platform})`);
          }
          const authenticateResult = yield (0, authenticate_1.authenticateEnvironment)(pac, parameters.credentials, parameters.environmentUrl, logger);
          logger.log("The Authentication Result: " + authenticateResult);
          const pacArgs = ["package", "deploy"];
          const validator = new InputValidator_1.InputValidator(host);
          const packagePathIn = validator.getInput(parameters.packagePath);
          if (!packagePathIn) {
            throw new Error("Missing value for required param: packagePath");
          }
          const outputDirectory = path.join(artifactStore.getTempFolder(), "deploy-package");
          const packagePath = path.isAbsolute(packagePathIn) ? packagePathIn : path.resolve(runnerParameters.workingDir, packagePathIn);
          logger.log(`Deploying package: ${packagePath}`);
          pacArgs.push("--package", packagePath);
          logFile = path.resolve(outputDirectory, `${path.basename(packagePath, ".dll")}-${(/* @__PURE__ */ new Date()).toISOString().replace(/:/g, "-")}.log`);
          fs.ensureDir(path.dirname(logFile));
          pacArgs.push("--logFile", logFile);
          validator.pushInput(pacArgs, "--logConsole", parameters.logConsole);
          validator.pushInput(pacArgs, "--settings", parameters.settings);
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("DeployPackage Action Result: " + pacResult);
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          if (fs.pathExistsSync(logFile)) {
            artifactStore.upload("DeployPackageLogs", [logFile]);
          }
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.deployPackage = deployPackage;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/createEnvironment.js
var require_createEnvironment = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/createEnvironment.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getEnvironmentDetails = exports2.createEnvironment = void 0;
    var InputValidator_1 = require_InputValidator();
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    function createEnvironment(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateAdmin)(pac, parameters.credentials, logger);
          logger.log("The Authentication Result: " + authenticateResult);
          const pacArgs = ["admin", "create"];
          const validator = new InputValidator_1.InputValidator(host);
          validator.pushInput(pacArgs, "--name", parameters.environmentName);
          validator.pushInput(pacArgs, "--type", parameters.environmentType);
          validator.pushInput(pacArgs, "--templates", parameters.templates);
          validator.pushInput(pacArgs, "--region", parameters.region, InputValidator_1.normalizeRegion);
          validator.pushInput(pacArgs, "--currency", parameters.currency);
          validator.pushInput(pacArgs, "--language", parameters.language, InputValidator_1.normalizeLanguage);
          validator.pushInput(pacArgs, "--domain", parameters.domainName);
          validator.pushInput(pacArgs, "--team-id", parameters.teamId);
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("CreateEnvironment Action Result: " + pacResult);
          const envResult = getEnvironmentDetails(pacResult);
          return envResult;
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.createEnvironment = createEnvironment;
    function getEnvironmentDetails(pacResult) {
      var _a;
      const newEnvDetailColumns = (_a = pacResult.filter((l) => l.length > 0).pop()) === null || _a === void 0 ? void 0 : _a.trim().split(/\s+/);
      const envUrl = newEnvDetailColumns === null || newEnvDetailColumns === void 0 ? void 0 : newEnvDetailColumns.shift();
      const envId = newEnvDetailColumns === null || newEnvDetailColumns === void 0 ? void 0 : newEnvDetailColumns.shift();
      return {
        environmentId: envId,
        environmentUrl: envUrl
      };
    }
    exports2.getEnvironmentDetails = getEnvironmentDetails;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/restoreEnvironment.js
var require_restoreEnvironment = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/restoreEnvironment.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.restoreEnvironment = void 0;
    var InputValidator_1 = require_InputValidator();
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    var createEnvironment_1 = require_createEnvironment();
    function restoreEnvironment(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateAdmin)(pac, parameters.credentials, logger);
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
          if (validator.getInput(parameters.restoreLatestBackup) === "true") {
            pacArgs.push("--selected-backup", "latest");
          } else if (parameters.backupDateTime) {
            validator.pushInput(pacArgs, "--selected-backup", parameters.backupDateTime);
          } else {
            throw new Error("Either latest backup must be true or Valid date and time for backup must be provided.");
          }
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("RestoreEnvironment Action Result: " + pacResult);
          const envResult = (0, createEnvironment_1.getEnvironmentDetails)(pacResult);
          return envResult;
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.restoreEnvironment = restoreEnvironment;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/deleteSolution.js
var require_deleteSolution = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/deleteSolution.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.deleteSolution = void 0;
    var InputValidator_1 = require_InputValidator();
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    function deleteSolution(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateEnvironment)(pac, parameters.credentials, parameters.environmentUrl, logger);
          logger.log("The Authentication Result: " + authenticateResult);
          const pacArgs = ["solution", "delete"];
          const validator = new InputValidator_1.InputValidator(host);
          validator.pushInput(pacArgs, "--solution-name", parameters.name);
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("DeleteSolution Action Result: " + pacResult);
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.deleteSolution = deleteSolution;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/solutionPackagingBase.js
var require_solutionPackagingBase = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/solutionPackagingBase.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.setSolutionPackagingCommonArgs = void 0;
    var path = require("path");
    function setSolutionPackagingCommonArgs(parameters, runnerParameters, validator, pacArgs) {
      function resolveFolder(folder) {
        if (!folder || typeof folder !== "string")
          return void 0;
        return path.resolve(runnerParameters.workingDir, folder);
      }
      validator.pushInput(pacArgs, "--zipFile", parameters.solutionZipFile, resolveFolder);
      validator.pushInput(pacArgs, "--folder", parameters.sourceFolder, resolveFolder);
      validator.pushInput(pacArgs, "--packageType", parameters.solutionType);
      validator.pushInput(pacArgs, "--localize", parameters.localize);
      validator.pushInput(pacArgs, "--log", parameters.logFile);
      validator.pushInput(pacArgs, "--errorlevel", parameters.errorLevel);
      validator.pushInput(pacArgs, "--singleComponent", parameters.singleComponent);
      validator.pushInput(pacArgs, "--map", parameters.mapFile);
      validator.pushInput(pacArgs, "--sourceLoc", parameters.localeTemplate);
      validator.pushInput(pacArgs, "--useLcid", parameters.useLcid);
      validator.pushInput(pacArgs, "--useUnmanagedFileForMissingManaged", parameters.useUnmanagedFileForManaged);
      validator.pushInput(pacArgs, "--disablePluginRemap", parameters.disablePluginRemap);
      validator.pushInput(pacArgs, "--processCanvasApps", parameters.processCanvasApps);
    }
    exports2.setSolutionPackagingCommonArgs = setSolutionPackagingCommonArgs;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/packSolution.js
var require_packSolution = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/packSolution.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.packSolution = void 0;
    var InputValidator_1 = require_InputValidator();
    var createPacRunner_1 = require_createPacRunner();
    var solutionPackagingBase_1 = require_solutionPackagingBase();
    function packSolution(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        try {
          const pacArgs = ["solution", "pack"];
          const validator = new InputValidator_1.InputValidator(host);
          (0, solutionPackagingBase_1.setSolutionPackagingCommonArgs)(parameters, runnerParameters, validator, pacArgs);
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("PackSolution Action Result: " + pacResult);
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        }
      });
    }
    exports2.packSolution = packSolution;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/unpackSolution.js
var require_unpackSolution = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/unpackSolution.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.unpackSolution = void 0;
    var InputValidator_1 = require_InputValidator();
    var createPacRunner_1 = require_createPacRunner();
    var solutionPackagingBase_1 = require_solutionPackagingBase();
    function unpackSolution(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        try {
          const pacArgs = ["solution", "unpack"];
          const validator = new InputValidator_1.InputValidator(host);
          (0, solutionPackagingBase_1.setSolutionPackagingCommonArgs)(parameters, runnerParameters, validator, pacArgs);
          if (parameters.overwriteFiles && validator.getInput(parameters.overwriteFiles) === "true") {
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
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        }
      });
    }
    exports2.unpackSolution = unpackSolution;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/resetEnvironment.js
var require_resetEnvironment = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/resetEnvironment.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.resetEnvironment = void 0;
    var InputValidator_1 = require_InputValidator();
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    var createEnvironment_1 = require_createEnvironment();
    function resetEnvironment(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateAdmin)(pac, parameters.credentials, logger);
          logger.log("The Authentication Result: " + authenticateResult);
          const pacArgs = ["admin", "reset"];
          const validator = new InputValidator_1.InputValidator(host);
          validator.pushInput(pacArgs, "--environment", parameters.environment);
          validator.pushInput(pacArgs, "--url", parameters.environmentUrl);
          validator.pushInput(pacArgs, "--environment-id", parameters.environmentId);
          validator.pushInput(pacArgs, "--language", parameters.language, InputValidator_1.normalizeLanguage);
          validator.pushInput(pacArgs, "--currency", parameters.currency);
          validator.pushInput(pacArgs, "--purpose", parameters.purpose);
          validator.pushInput(pacArgs, "--templates", parameters.templates);
          if (validator.getInput(parameters.overrideDomainName) === "true") {
            validator.pushInput(pacArgs, "--domain", parameters.domainName);
          }
          if (validator.getInput(parameters.overrideFriendlyName) === "true") {
            validator.pushInput(pacArgs, "--name", parameters.friendlyEnvironmentName);
          }
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("ResetEnvironment Action Result: " + pacResult);
          const envResult = (0, createEnvironment_1.getEnvironmentDetails)(pacResult);
          return envResult;
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.resetEnvironment = resetEnvironment;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/copyEnvironment.js
var require_copyEnvironment = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/copyEnvironment.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.copyEnvironment = void 0;
    var InputValidator_1 = require_InputValidator();
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    var createEnvironment_1 = require_createEnvironment();
    function copyEnvironment(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateAdmin)(pac, parameters.credentials, logger);
          logger.log("The Authentication Result: " + authenticateResult);
          const pacArgs = ["admin", "copy"];
          const validator = new InputValidator_1.InputValidator(host);
          validator.pushInput(pacArgs, "--source-env", parameters.sourceEnvironment);
          validator.pushInput(pacArgs, "--target-env", parameters.targetEnvironment);
          validator.pushInput(pacArgs, "--source-url", parameters.sourceEnvironmentUrl);
          validator.pushInput(pacArgs, "--target-url", parameters.targetEnvironmentUrl);
          validator.pushInput(pacArgs, "--source-id", parameters.sourceEnvironmentId);
          validator.pushInput(pacArgs, "--target-id", parameters.targetEnvironmentId);
          if (validator.getInput(parameters.overrideFriendlyName) === "true") {
            validator.pushInput(pacArgs, "--name", parameters.friendlyTargetEnvironmentName);
          }
          validator.pushInput(pacArgs, "--type", parameters.copyType);
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("CopyEnvironment Action Result: " + pacResult);
          const envResult = (0, createEnvironment_1.getEnvironmentDetails)(pacResult);
          return envResult;
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.copyEnvironment = copyEnvironment;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/uploadPaportal.js
var require_uploadPaportal = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/uploadPaportal.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.uploadPaportal = void 0;
    var InputValidator_1 = require_InputValidator();
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    function uploadPaportal(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateEnvironment)(pac, parameters.credentials, parameters.environmentUrl, logger);
          logger.log("The Authentication Result: " + authenticateResult);
          const pacArgs = ["paportal", "upload"];
          const validator = new InputValidator_1.InputValidator(host);
          validator.pushInput(pacArgs, "--path", parameters.path);
          validator.pushInput(pacArgs, "--deploymentProfile", parameters.deploymentProfile);
          validator.pushInput(pacArgs, "--modelVersion", parameters.modelVersion);
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("UploadPaPortal Action Result: " + pacResult);
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.uploadPaportal = uploadPaportal;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/downloadPaportal.js
var require_downloadPaportal = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/downloadPaportal.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.downloadPaportal = void 0;
    var InputValidator_1 = require_InputValidator();
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    function downloadPaportal(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateEnvironment)(pac, parameters.credentials, parameters.environmentUrl, logger);
          logger.log("The Authentication Result: " + authenticateResult);
          const pacArgs = ["paportal", "download"];
          const validator = new InputValidator_1.InputValidator(host);
          validator.pushInput(pacArgs, "--path", parameters.path);
          validator.pushInput(pacArgs, "--websiteId", parameters.websiteId);
          validator.pushInput(pacArgs, "--overwrite", parameters.overwrite);
          validator.pushInput(pacArgs, "--excludeEntities", parameters.excludeEntities);
          validator.pushInput(pacArgs, "--modelVersion", parameters.modelVersion);
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("DownloadPaPortal Action Result: " + pacResult);
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.downloadPaportal = downloadPaportal;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/cloneSolution.js
var require_cloneSolution = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/cloneSolution.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.cloneSolution = void 0;
    var InputValidator_1 = require_InputValidator();
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    function cloneSolution(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateEnvironment)(pac, parameters.credentials, parameters.environmentUrl, logger);
          logger.log("The Authentication Result: " + authenticateResult);
          const pacArgs = ["solution", "clone"];
          const validator = new InputValidator_1.InputValidator(host);
          validator.pushInput(pacArgs, "--name", parameters.name);
          validator.pushInput(pacArgs, "--outputDirectory", parameters.outputDirectory);
          validator.pushInput(pacArgs, "--async", parameters.async);
          validator.pushInput(pacArgs, "--max-async-wait-time", parameters.maxAsyncWaitTimeInMin);
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("CloneSolution Action Result: " + pacResult);
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.cloneSolution = cloneSolution;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/updateVersionSolution.js
var require_updateVersionSolution = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/updateVersionSolution.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.updateVersionSolution = void 0;
    var InputValidator_1 = require_InputValidator();
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    function updateVersionSolution(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateEnvironment)(pac, parameters.credentials, parameters.environmentUrl, logger);
          logger.log("The Authentication Result: " + authenticateResult);
          const pacArgs = ["solution", "version"];
          const validator = new InputValidator_1.InputValidator(host);
          validator.pushInput(pacArgs, "--buildversion", parameters.buildVersion);
          validator.pushInput(pacArgs, "--revisionversion", parameters.revisionVersion);
          validator.pushInput(pacArgs, "--patchversion", parameters.patchVersion);
          validator.pushInput(pacArgs, "--strategy", parameters.strategy);
          validator.pushInput(pacArgs, "--filename", parameters.fileName);
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("UpdateVersionSolution Action Result: " + pacResult);
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.updateVersionSolution = updateVersionSolution;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/onlineVersionSolution.js
var require_onlineVersionSolution = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/onlineVersionSolution.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.onlineVersionSolution = void 0;
    var InputValidator_1 = require_InputValidator();
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    function onlineVersionSolution(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateEnvironment)(pac, parameters.credentials, parameters.environmentUrl, logger);
          logger.log("The Authentication Result: " + authenticateResult);
          const pacArgs = ["solution", "online-version"];
          const validator = new InputValidator_1.InputValidator(host);
          validator.pushInput(pacArgs, "--solution-name", parameters.name);
          validator.pushInput(pacArgs, "--solution-version", parameters.version);
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("OnlineVersionSolution Action Result: " + pacResult);
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.onlineVersionSolution = onlineVersionSolution;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/installApplication.js
var require_installApplication = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/installApplication.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.installApplication = void 0;
    var InputValidator_1 = require_InputValidator();
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    var path = require("path");
    function installApplication(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        function resolveFolder(folder) {
          if (!folder || typeof folder !== "string")
            return void 0;
          return path.resolve(runnerParameters.workingDir, folder);
        }
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateAdmin)(pac, parameters.credentials, logger);
          logger.log("The Authentication Result: " + authenticateResult);
          const pacArgs = ["application", "install"];
          const validator = new InputValidator_1.InputValidator(host);
          validator.pushInput(pacArgs, "--environment", parameters.environment);
          validator.pushInput(pacArgs, "--application-list", parameters.applicationListFile, resolveFolder);
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("Application Install Action Result: " + pacResult);
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.installApplication = installApplication;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/assignUser.js
var require_assignUser = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/assignUser.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.assignUser = void 0;
    var InputValidator_1 = require_InputValidator();
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    function assignUser(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        const pacArgs = ["admin", "assign-user"];
        const validator = new InputValidator_1.InputValidator(host);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateAdmin)(pac, parameters.credentials, logger);
          logger.log("The Authentication Result: " + authenticateResult);
          validator.pushInput(pacArgs, "--environment", parameters.environment);
          validator.pushInput(pacArgs, "--user", parameters.user);
          validator.pushInput(pacArgs, "--role", parameters.role);
          validator.pushInput(pacArgs, "--application-user", parameters.applicationUser);
          validator.pushInput(pacArgs, "--business-unit", parameters.businessUnit);
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("AssignUser Action Result: " + pacResult);
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.assignUser = assignUser;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/addSolutionComponent.js
var require_addSolutionComponent = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/addSolutionComponent.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.addSolutionComponent = void 0;
    var InputValidator_1 = require_InputValidator();
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    function addSolutionComponent(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        const pacArgs = ["solution", "add-solution-component"];
        const inputValidator = new InputValidator_1.InputValidator(host);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateEnvironment)(pac, parameters.credentials, parameters.environmentUrl, logger);
          logger.log("The Authentication Result: " + authenticateResult);
          inputValidator.pushInput(pacArgs, "--solutionUniqueName", parameters.solutionName);
          inputValidator.pushInput(pacArgs, "--component", parameters.component);
          inputValidator.pushInput(pacArgs, "--componentType", parameters.componentType);
          if (parameters.addRequiredComponents && inputValidator.getInput(parameters.addRequiredComponents) === "true") {
            inputValidator.pushInput(pacArgs, "--AddRequiredComponents", parameters.addRequiredComponents);
          }
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log(`AddSolutionComponent Action Result: ${pacResult}`);
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log(`The Clear Authentication Result: ${clearAuthResult}`);
        }
      });
    }
    exports2.addSolutionComponent = addSolutionComponent;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/dataExport.js
var require_dataExport = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/dataExport.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.dataExport = void 0;
    var os = require("os");
    var InputValidator_1 = require_InputValidator();
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    function dataExport(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const platform = os.platform();
        if (platform !== "win32") {
          throw new Error(`'data export' is only supported on Windows agents/runners (attempted run on ${platform})`);
        }
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        const pacArgs = ["data", "export"];
        const validator = new InputValidator_1.InputValidator(host);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateEnvironment)(pac, parameters.credentials, parameters.environmentUrl, logger);
          logger.log("The Authentication Result: " + authenticateResult);
          validator.pushInput(pacArgs, "--schemaFile", parameters.schemaFile);
          validator.pushInput(pacArgs, "--dataFile", parameters.dataFile);
          validator.pushInput(pacArgs, "--overwrite", parameters.overwrite);
          validator.pushInput(pacArgs, "--verbose", parameters.verbose);
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("Action Result: " + pacResult);
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.dataExport = dataExport;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/dataImport.js
var require_dataImport = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/dataImport.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.dataImport = void 0;
    var os = require("os");
    var InputValidator_1 = require_InputValidator();
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    function dataImport(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const platform = os.platform();
        if (platform !== "win32") {
          throw new Error(`'data export' is only supported on Windows agents/runners (attempted run on ${platform})`);
        }
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        const pacArgs = ["data", "import"];
        const validator = new InputValidator_1.InputValidator(host);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateEnvironment)(pac, parameters.credentials, parameters.environmentUrl, logger);
          logger.log("The Authentication Result: " + authenticateResult);
          validator.pushInput(pacArgs, "--data", parameters.dataFile);
          validator.pushInput(pacArgs, "--verbose", parameters.verbose);
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("Action Result: " + pacResult);
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.dataImport = dataImport;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/assignGroup.js
var require_assignGroup = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/assignGroup.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.assignGroup = void 0;
    var InputValidator_1 = require_InputValidator();
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    function assignGroup(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        const pacArgs = ["admin", "assign-group"];
        const validator = new InputValidator_1.InputValidator(host);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateAdmin)(pac, parameters.credentials, logger);
          logger.log("The Authentication Result: " + authenticateResult);
          validator.pushInput(pacArgs, "--environment", parameters.environment);
          validator.pushInput(pacArgs, "--group", parameters.azureAadGroup);
          validator.pushInput(pacArgs, "--group-name", parameters.groupName);
          validator.pushInput(pacArgs, "--role", parameters.role);
          validator.pushInput(pacArgs, "--team-type", parameters.teamType);
          validator.pushInput(pacArgs, "--membership-type", parameters.membershipType);
          validator.pushInput(pacArgs, "--business-unit", parameters.businessUnit);
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("AssignGroup Action Result: " + pacResult);
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.assignGroup = assignGroup;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/virtualAgentsStatus.js
var require_virtualAgentsStatus = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/virtualAgentsStatus.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.virtualAgentsStatus = void 0;
    var InputValidator_1 = require_InputValidator();
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    function virtualAgentsStatus(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        const pacArgs = ["virtual-agent", "status"];
        const inputValidator = new InputValidator_1.InputValidator(host);
        inputValidator.pushInput(pacArgs, "--bot-id", parameters.botId);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateEnvironment)(pac, parameters.credentials, parameters.environmentUrl, logger);
          logger.log("The Authentication Result: " + authenticateResult);
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("VirtualAgentsStatus Action Result: " + pacResult);
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.virtualAgentsStatus = virtualAgentsStatus;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/installCatalog.js
var require_installCatalog = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/installCatalog.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.installCatalog = void 0;
    var InputValidator_1 = require_InputValidator();
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    function installCatalog(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateEnvironment)(pac, parameters.credentials, parameters.environmentUrl, logger);
          logger.log("The Authentication Result: " + authenticateResult);
          const pacArgs = ["catalog", "install"];
          const validator = new InputValidator_1.InputValidator(host);
          validator.pushInput(pacArgs, "--catalog-item-id", parameters.catalogItemId);
          validator.pushInput(pacArgs, "--target-url", parameters.targetEnvironmentUrl);
          validator.pushInput(pacArgs, "--settings", parameters.settings);
          validator.pushInput(pacArgs, "--target-version", parameters.targetVersion);
          validator.pushInput(pacArgs, "--poll-status", parameters.pollStatus);
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("InstallCatalog Action Result: " + pacResult);
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.installCatalog = installCatalog;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/catalogStatus.js
var require_catalogStatus = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/catalogStatus.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.catalogStatus = void 0;
    var InputValidator_1 = require_InputValidator();
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    function catalogStatus(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateEnvironment)(pac, parameters.credentials, parameters.environmentUrl, logger);
          logger.log("The Authentication Result: " + authenticateResult);
          const pacArgs = ["catalog", "status"];
          const validator = new InputValidator_1.InputValidator(host);
          validator.pushInput(pacArgs, "--tracking-id", parameters.trackingId);
          validator.pushInput(pacArgs, "--type", parameters.requestType);
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("CatalogStatus Action Result: " + pacResult);
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.catalogStatus = catalogStatus;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/submitCatalog.js
var require_submitCatalog = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/submitCatalog.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.submitCatalog = void 0;
    var InputValidator_1 = require_InputValidator();
    var authenticate_1 = require_authenticate();
    var createPacRunner_1 = require_createPacRunner();
    function submitCatalog(parameters, runnerParameters, host) {
      return __awaiter2(this, void 0, void 0, function* () {
        const logger = runnerParameters.logger;
        const pac = (0, createPacRunner_1.default)(runnerParameters);
        try {
          const authenticateResult = yield (0, authenticate_1.authenticateEnvironment)(pac, parameters.credentials, parameters.environmentUrl, logger);
          logger.log("The Authentication Result: " + authenticateResult);
          const pacArgs = ["catalog", "submit"];
          const validator = new InputValidator_1.InputValidator(host);
          validator.pushInput(pacArgs, "--path", parameters.path);
          validator.pushInput(pacArgs, "--poll-status", parameters.pollStatus);
          if (validator.getInput(parameters.packageSolutionZipFile) === "SolutionZipFile") {
            validator.pushInput(pacArgs, "--solution-zip", parameters.solutionZip);
          }
          if (validator.getInput(parameters.packageSolutionZipFile) === "PackageZipFile") {
            validator.pushInput(pacArgs, "--package-zip", parameters.packageZip);
          }
          logger.log("Calling pac cli inputs: " + pacArgs.join(" "));
          const pacResult = yield pac(...pacArgs);
          logger.log("SubmitCatalog Action Result: " + pacResult);
        } catch (error) {
          logger.error(`failed: ${error instanceof Error ? error.message : error}`);
          throw error;
        } finally {
          const clearAuthResult = yield (0, authenticate_1.clearAuthentication)(pac);
          logger.log("The Clear Authentication Result: " + clearAuthResult);
        }
      });
    }
    exports2.submitCatalog = submitCatalog;
  }
});

// node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/index.js
var require_actions = __commonJS({
  "node_modules/@microsoft/powerplatform-cli-wrapper/dist/actions/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p))
          __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    __exportStar(require_exportSolution(), exports2);
    __exportStar(require_whoAmI(), exports2);
    __exportStar(require_importSolution(), exports2);
    __exportStar(require_upgradeSolution(), exports2);
    __exportStar(require_deleteEnvironment(), exports2);
    __exportStar(require_backupEnvironment(), exports2);
    __exportStar(require_checkSolution(), exports2);
    __exportStar(require_publishSolution(), exports2);
    __exportStar(require_deployPackage(), exports2);
    __exportStar(require_createEnvironment(), exports2);
    __exportStar(require_restoreEnvironment(), exports2);
    __exportStar(require_deleteSolution(), exports2);
    __exportStar(require_packSolution(), exports2);
    __exportStar(require_unpackSolution(), exports2);
    __exportStar(require_resetEnvironment(), exports2);
    __exportStar(require_copyEnvironment(), exports2);
    __exportStar(require_uploadPaportal(), exports2);
    __exportStar(require_downloadPaportal(), exports2);
    __exportStar(require_cloneSolution(), exports2);
    __exportStar(require_updateVersionSolution(), exports2);
    __exportStar(require_onlineVersionSolution(), exports2);
    __exportStar(require_installApplication(), exports2);
    __exportStar(require_assignUser(), exports2);
    __exportStar(require_addSolutionComponent(), exports2);
    __exportStar(require_dataExport(), exports2);
    __exportStar(require_dataImport(), exports2);
    __exportStar(require_assignGroup(), exports2);
    __exportStar(require_virtualAgentsStatus(), exports2);
    __exportStar(require_installCatalog(), exports2);
    __exportStar(require_catalogStatus(), exports2);
    __exportStar(require_submitCatalog(), exports2);
  }
});

// node_modules/@actions/core/lib/utils.js
var require_utils3 = __commonJS({
  "node_modules/@actions/core/lib/utils.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.toCommandProperties = exports2.toCommandValue = void 0;
    function toCommandValue(input) {
      if (input === null || input === void 0) {
        return "";
      } else if (typeof input === "string" || input instanceof String) {
        return input;
      }
      return JSON.stringify(input);
    }
    exports2.toCommandValue = toCommandValue;
    function toCommandProperties(annotationProperties) {
      if (!Object.keys(annotationProperties).length) {
        return {};
      }
      return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
      };
    }
    exports2.toCommandProperties = toCommandProperties;
  }
});

// node_modules/@actions/core/lib/command.js
var require_command = __commonJS({
  "node_modules/@actions/core/lib/command.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.issue = exports2.issueCommand = void 0;
    var os = __importStar(require("os"));
    var utils_1 = require_utils3();
    function issueCommand(command, properties, message) {
      const cmd = new Command(command, properties, message);
      process.stdout.write(cmd.toString() + os.EOL);
    }
    exports2.issueCommand = issueCommand;
    function issue(name, message = "") {
      issueCommand(name, {}, message);
    }
    exports2.issue = issue;
    var CMD_STRING = "::";
    var Command = class {
      constructor(command, properties, message) {
        if (!command) {
          command = "missing.command";
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
      }
      toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
          cmdStr += " ";
          let first = true;
          for (const key in this.properties) {
            if (this.properties.hasOwnProperty(key)) {
              const val = this.properties[key];
              if (val) {
                if (first) {
                  first = false;
                } else {
                  cmdStr += ",";
                }
                cmdStr += `${key}=${escapeProperty(val)}`;
              }
            }
          }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
      }
    };
    function escapeData(s) {
      return utils_1.toCommandValue(s).replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
    }
    function escapeProperty(s) {
      return utils_1.toCommandValue(s).replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A").replace(/:/g, "%3A").replace(/,/g, "%2C");
    }
  }
});

// node_modules/@actions/core/node_modules/uuid/dist/esm-node/rng.js
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    import_crypto.default.randomFillSync(rnds8Pool);
    poolPtr = 0;
  }
  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}
var import_crypto, rnds8Pool, poolPtr;
var init_rng = __esm({
  "node_modules/@actions/core/node_modules/uuid/dist/esm-node/rng.js"() {
    import_crypto = __toESM(require("crypto"));
    rnds8Pool = new Uint8Array(256);
    poolPtr = rnds8Pool.length;
  }
});

// node_modules/@actions/core/node_modules/uuid/dist/esm-node/regex.js
var regex_default;
var init_regex = __esm({
  "node_modules/@actions/core/node_modules/uuid/dist/esm-node/regex.js"() {
    regex_default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
  }
});

// node_modules/@actions/core/node_modules/uuid/dist/esm-node/validate.js
function validate(uuid) {
  return typeof uuid === "string" && regex_default.test(uuid);
}
var validate_default;
var init_validate = __esm({
  "node_modules/@actions/core/node_modules/uuid/dist/esm-node/validate.js"() {
    init_regex();
    validate_default = validate;
  }
});

// node_modules/@actions/core/node_modules/uuid/dist/esm-node/stringify.js
function stringify(arr, offset = 0) {
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
  if (!validate_default(uuid)) {
    throw TypeError("Stringified UUID is invalid");
  }
  return uuid;
}
var byteToHex, stringify_default;
var init_stringify = __esm({
  "node_modules/@actions/core/node_modules/uuid/dist/esm-node/stringify.js"() {
    init_validate();
    byteToHex = [];
    for (let i = 0; i < 256; ++i) {
      byteToHex.push((i + 256).toString(16).substr(1));
    }
    stringify_default = stringify;
  }
});

// node_modules/@actions/core/node_modules/uuid/dist/esm-node/v1.js
function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== void 0 ? options.clockseq : _clockseq;
  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || rng)();
    if (node == null) {
      node = _nodeId = [seedBytes[0] | 1, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }
    if (clockseq == null) {
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 16383;
    }
  }
  let msecs = options.msecs !== void 0 ? options.msecs : Date.now();
  let nsecs = options.nsecs !== void 0 ? options.nsecs : _lastNSecs + 1;
  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 1e4;
  if (dt < 0 && options.clockseq === void 0) {
    clockseq = clockseq + 1 & 16383;
  }
  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === void 0) {
    nsecs = 0;
  }
  if (nsecs >= 1e4) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }
  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;
  msecs += 122192928e5;
  const tl = ((msecs & 268435455) * 1e4 + nsecs) % 4294967296;
  b[i++] = tl >>> 24 & 255;
  b[i++] = tl >>> 16 & 255;
  b[i++] = tl >>> 8 & 255;
  b[i++] = tl & 255;
  const tmh = msecs / 4294967296 * 1e4 & 268435455;
  b[i++] = tmh >>> 8 & 255;
  b[i++] = tmh & 255;
  b[i++] = tmh >>> 24 & 15 | 16;
  b[i++] = tmh >>> 16 & 255;
  b[i++] = clockseq >>> 8 | 128;
  b[i++] = clockseq & 255;
  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }
  return buf || stringify_default(b);
}
var _nodeId, _clockseq, _lastMSecs, _lastNSecs, v1_default;
var init_v1 = __esm({
  "node_modules/@actions/core/node_modules/uuid/dist/esm-node/v1.js"() {
    init_rng();
    init_stringify();
    _lastMSecs = 0;
    _lastNSecs = 0;
    v1_default = v1;
  }
});

// node_modules/@actions/core/node_modules/uuid/dist/esm-node/parse.js
function parse(uuid) {
  if (!validate_default(uuid)) {
    throw TypeError("Invalid UUID");
  }
  let v;
  const arr = new Uint8Array(16);
  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 255;
  arr[2] = v >>> 8 & 255;
  arr[3] = v & 255;
  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 255;
  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 255;
  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 255;
  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 1099511627776 & 255;
  arr[11] = v / 4294967296 & 255;
  arr[12] = v >>> 24 & 255;
  arr[13] = v >>> 16 & 255;
  arr[14] = v >>> 8 & 255;
  arr[15] = v & 255;
  return arr;
}
var parse_default;
var init_parse = __esm({
  "node_modules/@actions/core/node_modules/uuid/dist/esm-node/parse.js"() {
    init_validate();
    parse_default = parse;
  }
});

// node_modules/@actions/core/node_modules/uuid/dist/esm-node/v35.js
function stringToBytes(str) {
  str = unescape(encodeURIComponent(str));
  const bytes = [];
  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }
  return bytes;
}
function v35_default(name, version2, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === "string") {
      value = stringToBytes(value);
    }
    if (typeof namespace === "string") {
      namespace = parse_default(namespace);
    }
    if (namespace.length !== 16) {
      throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
    }
    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 15 | version2;
    bytes[8] = bytes[8] & 63 | 128;
    if (buf) {
      offset = offset || 0;
      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }
      return buf;
    }
    return stringify_default(bytes);
  }
  try {
    generateUUID.name = name;
  } catch (err) {
  }
  generateUUID.DNS = DNS;
  generateUUID.URL = URL2;
  return generateUUID;
}
var DNS, URL2;
var init_v35 = __esm({
  "node_modules/@actions/core/node_modules/uuid/dist/esm-node/v35.js"() {
    init_stringify();
    init_parse();
    DNS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
    URL2 = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
  }
});

// node_modules/@actions/core/node_modules/uuid/dist/esm-node/md5.js
function md5(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === "string") {
    bytes = Buffer.from(bytes, "utf8");
  }
  return import_crypto2.default.createHash("md5").update(bytes).digest();
}
var import_crypto2, md5_default;
var init_md5 = __esm({
  "node_modules/@actions/core/node_modules/uuid/dist/esm-node/md5.js"() {
    import_crypto2 = __toESM(require("crypto"));
    md5_default = md5;
  }
});

// node_modules/@actions/core/node_modules/uuid/dist/esm-node/v3.js
var v3, v3_default;
var init_v3 = __esm({
  "node_modules/@actions/core/node_modules/uuid/dist/esm-node/v3.js"() {
    init_v35();
    init_md5();
    v3 = v35_default("v3", 48, md5_default);
    v3_default = v3;
  }
});

// node_modules/@actions/core/node_modules/uuid/dist/esm-node/v4.js
function v4(options, buf, offset) {
  options = options || {};
  const rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return stringify_default(rnds);
}
var v4_default;
var init_v4 = __esm({
  "node_modules/@actions/core/node_modules/uuid/dist/esm-node/v4.js"() {
    init_rng();
    init_stringify();
    v4_default = v4;
  }
});

// node_modules/@actions/core/node_modules/uuid/dist/esm-node/sha1.js
function sha1(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === "string") {
    bytes = Buffer.from(bytes, "utf8");
  }
  return import_crypto3.default.createHash("sha1").update(bytes).digest();
}
var import_crypto3, sha1_default;
var init_sha1 = __esm({
  "node_modules/@actions/core/node_modules/uuid/dist/esm-node/sha1.js"() {
    import_crypto3 = __toESM(require("crypto"));
    sha1_default = sha1;
  }
});

// node_modules/@actions/core/node_modules/uuid/dist/esm-node/v5.js
var v5, v5_default;
var init_v5 = __esm({
  "node_modules/@actions/core/node_modules/uuid/dist/esm-node/v5.js"() {
    init_v35();
    init_sha1();
    v5 = v35_default("v5", 80, sha1_default);
    v5_default = v5;
  }
});

// node_modules/@actions/core/node_modules/uuid/dist/esm-node/nil.js
var nil_default;
var init_nil = __esm({
  "node_modules/@actions/core/node_modules/uuid/dist/esm-node/nil.js"() {
    nil_default = "00000000-0000-0000-0000-000000000000";
  }
});

// node_modules/@actions/core/node_modules/uuid/dist/esm-node/version.js
function version(uuid) {
  if (!validate_default(uuid)) {
    throw TypeError("Invalid UUID");
  }
  return parseInt(uuid.substr(14, 1), 16);
}
var version_default;
var init_version = __esm({
  "node_modules/@actions/core/node_modules/uuid/dist/esm-node/version.js"() {
    init_validate();
    version_default = version;
  }
});

// node_modules/@actions/core/node_modules/uuid/dist/esm-node/index.js
var esm_node_exports = {};
__export(esm_node_exports, {
  NIL: () => nil_default,
  parse: () => parse_default,
  stringify: () => stringify_default,
  v1: () => v1_default,
  v3: () => v3_default,
  v4: () => v4_default,
  v5: () => v5_default,
  validate: () => validate_default,
  version: () => version_default
});
var init_esm_node = __esm({
  "node_modules/@actions/core/node_modules/uuid/dist/esm-node/index.js"() {
    init_v1();
    init_v3();
    init_v4();
    init_v5();
    init_nil();
    init_version();
    init_validate();
    init_stringify();
    init_parse();
  }
});

// node_modules/@actions/core/lib/file-command.js
var require_file_command = __commonJS({
  "node_modules/@actions/core/lib/file-command.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.prepareKeyValueMessage = exports2.issueFileCommand = void 0;
    var fs = __importStar(require("fs"));
    var os = __importStar(require("os"));
    var uuid_1 = (init_esm_node(), __toCommonJS(esm_node_exports));
    var utils_1 = require_utils3();
    function issueFileCommand(command, message) {
      const filePath = process.env[`GITHUB_${command}`];
      if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
      }
      if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
      }
      fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: "utf8"
      });
    }
    exports2.issueFileCommand = issueFileCommand;
    function prepareKeyValueMessage(key, value) {
      const delimiter = `ghadelimiter_${uuid_1.v4()}`;
      const convertedValue = utils_1.toCommandValue(value);
      if (key.includes(delimiter)) {
        throw new Error(`Unexpected input: name should not contain the delimiter "${delimiter}"`);
      }
      if (convertedValue.includes(delimiter)) {
        throw new Error(`Unexpected input: value should not contain the delimiter "${delimiter}"`);
      }
      return `${key}<<${delimiter}${os.EOL}${convertedValue}${os.EOL}${delimiter}`;
    }
    exports2.prepareKeyValueMessage = prepareKeyValueMessage;
  }
});

// node_modules/@actions/http-client/lib/proxy.js
var require_proxy = __commonJS({
  "node_modules/@actions/http-client/lib/proxy.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.checkBypass = exports2.getProxyUrl = void 0;
    function getProxyUrl(reqUrl) {
      const usingSsl = reqUrl.protocol === "https:";
      if (checkBypass(reqUrl)) {
        return void 0;
      }
      const proxyVar = (() => {
        if (usingSsl) {
          return process.env["https_proxy"] || process.env["HTTPS_PROXY"];
        } else {
          return process.env["http_proxy"] || process.env["HTTP_PROXY"];
        }
      })();
      if (proxyVar) {
        return new URL(proxyVar);
      } else {
        return void 0;
      }
    }
    exports2.getProxyUrl = getProxyUrl;
    function checkBypass(reqUrl) {
      if (!reqUrl.hostname) {
        return false;
      }
      const noProxy = process.env["no_proxy"] || process.env["NO_PROXY"] || "";
      if (!noProxy) {
        return false;
      }
      let reqPort;
      if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
      } else if (reqUrl.protocol === "http:") {
        reqPort = 80;
      } else if (reqUrl.protocol === "https:") {
        reqPort = 443;
      }
      const upperReqHosts = [reqUrl.hostname.toUpperCase()];
      if (typeof reqPort === "number") {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
      }
      for (const upperNoProxyItem of noProxy.split(",").map((x) => x.trim().toUpperCase()).filter((x) => x)) {
        if (upperReqHosts.some((x) => x === upperNoProxyItem)) {
          return true;
        }
      }
      return false;
    }
    exports2.checkBypass = checkBypass;
  }
});

// node_modules/tunnel/lib/tunnel.js
var require_tunnel = __commonJS({
  "node_modules/tunnel/lib/tunnel.js"(exports2) {
    "use strict";
    var net = require("net");
    var tls = require("tls");
    var http = require("http");
    var https = require("https");
    var events = require("events");
    var assert = require("assert");
    var util = require("util");
    exports2.httpOverHttp = httpOverHttp;
    exports2.httpsOverHttp = httpsOverHttp;
    exports2.httpOverHttps = httpOverHttps;
    exports2.httpsOverHttps = httpsOverHttps;
    function httpOverHttp(options) {
      var agent = new TunnelingAgent(options);
      agent.request = http.request;
      return agent;
    }
    function httpsOverHttp(options) {
      var agent = new TunnelingAgent(options);
      agent.request = http.request;
      agent.createSocket = createSecureSocket;
      agent.defaultPort = 443;
      return agent;
    }
    function httpOverHttps(options) {
      var agent = new TunnelingAgent(options);
      agent.request = https.request;
      return agent;
    }
    function httpsOverHttps(options) {
      var agent = new TunnelingAgent(options);
      agent.request = https.request;
      agent.createSocket = createSecureSocket;
      agent.defaultPort = 443;
      return agent;
    }
    function TunnelingAgent(options) {
      var self = this;
      self.options = options || {};
      self.proxyOptions = self.options.proxy || {};
      self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
      self.requests = [];
      self.sockets = [];
      self.on("free", function onFree(socket, host, port, localAddress) {
        var options2 = toOptions(host, port, localAddress);
        for (var i = 0, len = self.requests.length; i < len; ++i) {
          var pending = self.requests[i];
          if (pending.host === options2.host && pending.port === options2.port) {
            self.requests.splice(i, 1);
            pending.request.onSocket(socket);
            return;
          }
        }
        socket.destroy();
        self.removeSocket(socket);
      });
    }
    util.inherits(TunnelingAgent, events.EventEmitter);
    TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
      var self = this;
      var options = mergeOptions({ request: req }, self.options, toOptions(host, port, localAddress));
      if (self.sockets.length >= this.maxSockets) {
        self.requests.push(options);
        return;
      }
      self.createSocket(options, function(socket) {
        socket.on("free", onFree);
        socket.on("close", onCloseOrRemove);
        socket.on("agentRemove", onCloseOrRemove);
        req.onSocket(socket);
        function onFree() {
          self.emit("free", socket, options);
        }
        function onCloseOrRemove(err) {
          self.removeSocket(socket);
          socket.removeListener("free", onFree);
          socket.removeListener("close", onCloseOrRemove);
          socket.removeListener("agentRemove", onCloseOrRemove);
        }
      });
    };
    TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
      var self = this;
      var placeholder = {};
      self.sockets.push(placeholder);
      var connectOptions = mergeOptions({}, self.proxyOptions, {
        method: "CONNECT",
        path: options.host + ":" + options.port,
        agent: false,
        headers: {
          host: options.host + ":" + options.port
        }
      });
      if (options.localAddress) {
        connectOptions.localAddress = options.localAddress;
      }
      if (connectOptions.proxyAuth) {
        connectOptions.headers = connectOptions.headers || {};
        connectOptions.headers["Proxy-Authorization"] = "Basic " + new Buffer(connectOptions.proxyAuth).toString("base64");
      }
      debug("making CONNECT request");
      var connectReq = self.request(connectOptions);
      connectReq.useChunkedEncodingByDefault = false;
      connectReq.once("response", onResponse);
      connectReq.once("upgrade", onUpgrade);
      connectReq.once("connect", onConnect);
      connectReq.once("error", onError);
      connectReq.end();
      function onResponse(res) {
        res.upgrade = true;
      }
      function onUpgrade(res, socket, head) {
        process.nextTick(function() {
          onConnect(res, socket, head);
        });
      }
      function onConnect(res, socket, head) {
        connectReq.removeAllListeners();
        socket.removeAllListeners();
        if (res.statusCode !== 200) {
          debug(
            "tunneling socket could not be established, statusCode=%d",
            res.statusCode
          );
          socket.destroy();
          var error = new Error("tunneling socket could not be established, statusCode=" + res.statusCode);
          error.code = "ECONNRESET";
          options.request.emit("error", error);
          self.removeSocket(placeholder);
          return;
        }
        if (head.length > 0) {
          debug("got illegal response body from proxy");
          socket.destroy();
          var error = new Error("got illegal response body from proxy");
          error.code = "ECONNRESET";
          options.request.emit("error", error);
          self.removeSocket(placeholder);
          return;
        }
        debug("tunneling connection has established");
        self.sockets[self.sockets.indexOf(placeholder)] = socket;
        return cb(socket);
      }
      function onError(cause) {
        connectReq.removeAllListeners();
        debug(
          "tunneling socket could not be established, cause=%s\n",
          cause.message,
          cause.stack
        );
        var error = new Error("tunneling socket could not be established, cause=" + cause.message);
        error.code = "ECONNRESET";
        options.request.emit("error", error);
        self.removeSocket(placeholder);
      }
    };
    TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
      var pos = this.sockets.indexOf(socket);
      if (pos === -1) {
        return;
      }
      this.sockets.splice(pos, 1);
      var pending = this.requests.shift();
      if (pending) {
        this.createSocket(pending, function(socket2) {
          pending.request.onSocket(socket2);
        });
      }
    };
    function createSecureSocket(options, cb) {
      var self = this;
      TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
        var hostHeader = options.request.getHeader("host");
        var tlsOptions = mergeOptions({}, self.options, {
          socket,
          servername: hostHeader ? hostHeader.replace(/:.*$/, "") : options.host
        });
        var secureSocket = tls.connect(0, tlsOptions);
        self.sockets[self.sockets.indexOf(socket)] = secureSocket;
        cb(secureSocket);
      });
    }
    function toOptions(host, port, localAddress) {
      if (typeof host === "string") {
        return {
          host,
          port,
          localAddress
        };
      }
      return host;
    }
    function mergeOptions(target) {
      for (var i = 1, len = arguments.length; i < len; ++i) {
        var overrides = arguments[i];
        if (typeof overrides === "object") {
          var keys = Object.keys(overrides);
          for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
            var k = keys[j];
            if (overrides[k] !== void 0) {
              target[k] = overrides[k];
            }
          }
        }
      }
      return target;
    }
    var debug;
    if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
      debug = function() {
        var args = Array.prototype.slice.call(arguments);
        if (typeof args[0] === "string") {
          args[0] = "TUNNEL: " + args[0];
        } else {
          args.unshift("TUNNEL:");
        }
        console.error.apply(console, args);
      };
    } else {
      debug = function() {
      };
    }
    exports2.debug = debug;
  }
});

// node_modules/tunnel/index.js
var require_tunnel2 = __commonJS({
  "node_modules/tunnel/index.js"(exports2, module2) {
    module2.exports = require_tunnel();
  }
});

// node_modules/@actions/http-client/lib/index.js
var require_lib2 = __commonJS({
  "node_modules/@actions/http-client/lib/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.HttpClient = exports2.isHttps = exports2.HttpClientResponse = exports2.HttpClientError = exports2.getProxyUrl = exports2.MediaTypes = exports2.Headers = exports2.HttpCodes = void 0;
    var http = __importStar(require("http"));
    var https = __importStar(require("https"));
    var pm = __importStar(require_proxy());
    var tunnel = __importStar(require_tunnel2());
    var HttpCodes;
    (function(HttpCodes2) {
      HttpCodes2[HttpCodes2["OK"] = 200] = "OK";
      HttpCodes2[HttpCodes2["MultipleChoices"] = 300] = "MultipleChoices";
      HttpCodes2[HttpCodes2["MovedPermanently"] = 301] = "MovedPermanently";
      HttpCodes2[HttpCodes2["ResourceMoved"] = 302] = "ResourceMoved";
      HttpCodes2[HttpCodes2["SeeOther"] = 303] = "SeeOther";
      HttpCodes2[HttpCodes2["NotModified"] = 304] = "NotModified";
      HttpCodes2[HttpCodes2["UseProxy"] = 305] = "UseProxy";
      HttpCodes2[HttpCodes2["SwitchProxy"] = 306] = "SwitchProxy";
      HttpCodes2[HttpCodes2["TemporaryRedirect"] = 307] = "TemporaryRedirect";
      HttpCodes2[HttpCodes2["PermanentRedirect"] = 308] = "PermanentRedirect";
      HttpCodes2[HttpCodes2["BadRequest"] = 400] = "BadRequest";
      HttpCodes2[HttpCodes2["Unauthorized"] = 401] = "Unauthorized";
      HttpCodes2[HttpCodes2["PaymentRequired"] = 402] = "PaymentRequired";
      HttpCodes2[HttpCodes2["Forbidden"] = 403] = "Forbidden";
      HttpCodes2[HttpCodes2["NotFound"] = 404] = "NotFound";
      HttpCodes2[HttpCodes2["MethodNotAllowed"] = 405] = "MethodNotAllowed";
      HttpCodes2[HttpCodes2["NotAcceptable"] = 406] = "NotAcceptable";
      HttpCodes2[HttpCodes2["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
      HttpCodes2[HttpCodes2["RequestTimeout"] = 408] = "RequestTimeout";
      HttpCodes2[HttpCodes2["Conflict"] = 409] = "Conflict";
      HttpCodes2[HttpCodes2["Gone"] = 410] = "Gone";
      HttpCodes2[HttpCodes2["TooManyRequests"] = 429] = "TooManyRequests";
      HttpCodes2[HttpCodes2["InternalServerError"] = 500] = "InternalServerError";
      HttpCodes2[HttpCodes2["NotImplemented"] = 501] = "NotImplemented";
      HttpCodes2[HttpCodes2["BadGateway"] = 502] = "BadGateway";
      HttpCodes2[HttpCodes2["ServiceUnavailable"] = 503] = "ServiceUnavailable";
      HttpCodes2[HttpCodes2["GatewayTimeout"] = 504] = "GatewayTimeout";
    })(HttpCodes = exports2.HttpCodes || (exports2.HttpCodes = {}));
    var Headers;
    (function(Headers2) {
      Headers2["Accept"] = "accept";
      Headers2["ContentType"] = "content-type";
    })(Headers = exports2.Headers || (exports2.Headers = {}));
    var MediaTypes;
    (function(MediaTypes2) {
      MediaTypes2["ApplicationJson"] = "application/json";
    })(MediaTypes = exports2.MediaTypes || (exports2.MediaTypes = {}));
    function getProxyUrl(serverUrl) {
      const proxyUrl = pm.getProxyUrl(new URL(serverUrl));
      return proxyUrl ? proxyUrl.href : "";
    }
    exports2.getProxyUrl = getProxyUrl;
    var HttpRedirectCodes = [
      HttpCodes.MovedPermanently,
      HttpCodes.ResourceMoved,
      HttpCodes.SeeOther,
      HttpCodes.TemporaryRedirect,
      HttpCodes.PermanentRedirect
    ];
    var HttpResponseRetryCodes = [
      HttpCodes.BadGateway,
      HttpCodes.ServiceUnavailable,
      HttpCodes.GatewayTimeout
    ];
    var RetryableHttpVerbs = ["OPTIONS", "GET", "DELETE", "HEAD"];
    var ExponentialBackoffCeiling = 10;
    var ExponentialBackoffTimeSlice = 5;
    var HttpClientError = class extends Error {
      constructor(message, statusCode) {
        super(message);
        this.name = "HttpClientError";
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
      }
    };
    exports2.HttpClientError = HttpClientError;
    var HttpClientResponse = class {
      constructor(message) {
        this.message = message;
      }
      readBody() {
        return __awaiter2(this, void 0, void 0, function* () {
          return new Promise((resolve) => __awaiter2(this, void 0, void 0, function* () {
            let output = Buffer.alloc(0);
            this.message.on("data", (chunk) => {
              output = Buffer.concat([output, chunk]);
            });
            this.message.on("end", () => {
              resolve(output.toString());
            });
          }));
        });
      }
    };
    exports2.HttpClientResponse = HttpClientResponse;
    function isHttps(requestUrl) {
      const parsedUrl = new URL(requestUrl);
      return parsedUrl.protocol === "https:";
    }
    exports2.isHttps = isHttps;
    var HttpClient = class {
      constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
          if (requestOptions.ignoreSslError != null) {
            this._ignoreSslError = requestOptions.ignoreSslError;
          }
          this._socketTimeout = requestOptions.socketTimeout;
          if (requestOptions.allowRedirects != null) {
            this._allowRedirects = requestOptions.allowRedirects;
          }
          if (requestOptions.allowRedirectDowngrade != null) {
            this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
          }
          if (requestOptions.maxRedirects != null) {
            this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
          }
          if (requestOptions.keepAlive != null) {
            this._keepAlive = requestOptions.keepAlive;
          }
          if (requestOptions.allowRetries != null) {
            this._allowRetries = requestOptions.allowRetries;
          }
          if (requestOptions.maxRetries != null) {
            this._maxRetries = requestOptions.maxRetries;
          }
        }
      }
      options(requestUrl, additionalHeaders) {
        return __awaiter2(this, void 0, void 0, function* () {
          return this.request("OPTIONS", requestUrl, null, additionalHeaders || {});
        });
      }
      get(requestUrl, additionalHeaders) {
        return __awaiter2(this, void 0, void 0, function* () {
          return this.request("GET", requestUrl, null, additionalHeaders || {});
        });
      }
      del(requestUrl, additionalHeaders) {
        return __awaiter2(this, void 0, void 0, function* () {
          return this.request("DELETE", requestUrl, null, additionalHeaders || {});
        });
      }
      post(requestUrl, data, additionalHeaders) {
        return __awaiter2(this, void 0, void 0, function* () {
          return this.request("POST", requestUrl, data, additionalHeaders || {});
        });
      }
      patch(requestUrl, data, additionalHeaders) {
        return __awaiter2(this, void 0, void 0, function* () {
          return this.request("PATCH", requestUrl, data, additionalHeaders || {});
        });
      }
      put(requestUrl, data, additionalHeaders) {
        return __awaiter2(this, void 0, void 0, function* () {
          return this.request("PUT", requestUrl, data, additionalHeaders || {});
        });
      }
      head(requestUrl, additionalHeaders) {
        return __awaiter2(this, void 0, void 0, function* () {
          return this.request("HEAD", requestUrl, null, additionalHeaders || {});
        });
      }
      sendStream(verb, requestUrl, stream, additionalHeaders) {
        return __awaiter2(this, void 0, void 0, function* () {
          return this.request(verb, requestUrl, stream, additionalHeaders);
        });
      }
      /**
       * Gets a typed object from an endpoint
       * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
       */
      getJson(requestUrl, additionalHeaders = {}) {
        return __awaiter2(this, void 0, void 0, function* () {
          additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
          const res = yield this.get(requestUrl, additionalHeaders);
          return this._processResponse(res, this.requestOptions);
        });
      }
      postJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter2(this, void 0, void 0, function* () {
          const data = JSON.stringify(obj, null, 2);
          additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
          additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
          const res = yield this.post(requestUrl, data, additionalHeaders);
          return this._processResponse(res, this.requestOptions);
        });
      }
      putJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter2(this, void 0, void 0, function* () {
          const data = JSON.stringify(obj, null, 2);
          additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
          additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
          const res = yield this.put(requestUrl, data, additionalHeaders);
          return this._processResponse(res, this.requestOptions);
        });
      }
      patchJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter2(this, void 0, void 0, function* () {
          const data = JSON.stringify(obj, null, 2);
          additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
          additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
          const res = yield this.patch(requestUrl, data, additionalHeaders);
          return this._processResponse(res, this.requestOptions);
        });
      }
      /**
       * Makes a raw http request.
       * All other methods such as get, post, patch, and request ultimately call this.
       * Prefer get, del, post and patch
       */
      request(verb, requestUrl, data, headers) {
        return __awaiter2(this, void 0, void 0, function* () {
          if (this._disposed) {
            throw new Error("Client has already been disposed.");
          }
          const parsedUrl = new URL(requestUrl);
          let info = this._prepareRequest(verb, parsedUrl, headers);
          const maxTries = this._allowRetries && RetryableHttpVerbs.includes(verb) ? this._maxRetries + 1 : 1;
          let numTries = 0;
          let response;
          do {
            response = yield this.requestRaw(info, data);
            if (response && response.message && response.message.statusCode === HttpCodes.Unauthorized) {
              let authenticationHandler;
              for (const handler of this.handlers) {
                if (handler.canHandleAuthentication(response)) {
                  authenticationHandler = handler;
                  break;
                }
              }
              if (authenticationHandler) {
                return authenticationHandler.handleAuthentication(this, info, data);
              } else {
                return response;
              }
            }
            let redirectsRemaining = this._maxRedirects;
            while (response.message.statusCode && HttpRedirectCodes.includes(response.message.statusCode) && this._allowRedirects && redirectsRemaining > 0) {
              const redirectUrl = response.message.headers["location"];
              if (!redirectUrl) {
                break;
              }
              const parsedRedirectUrl = new URL(redirectUrl);
              if (parsedUrl.protocol === "https:" && parsedUrl.protocol !== parsedRedirectUrl.protocol && !this._allowRedirectDowngrade) {
                throw new Error("Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.");
              }
              yield response.readBody();
              if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                for (const header in headers) {
                  if (header.toLowerCase() === "authorization") {
                    delete headers[header];
                  }
                }
              }
              info = this._prepareRequest(verb, parsedRedirectUrl, headers);
              response = yield this.requestRaw(info, data);
              redirectsRemaining--;
            }
            if (!response.message.statusCode || !HttpResponseRetryCodes.includes(response.message.statusCode)) {
              return response;
            }
            numTries += 1;
            if (numTries < maxTries) {
              yield response.readBody();
              yield this._performExponentialBackoff(numTries);
            }
          } while (numTries < maxTries);
          return response;
        });
      }
      /**
       * Needs to be called if keepAlive is set to true in request options.
       */
      dispose() {
        if (this._agent) {
          this._agent.destroy();
        }
        this._disposed = true;
      }
      /**
       * Raw request.
       * @param info
       * @param data
       */
      requestRaw(info, data) {
        return __awaiter2(this, void 0, void 0, function* () {
          return new Promise((resolve, reject) => {
            function callbackForResult(err, res) {
              if (err) {
                reject(err);
              } else if (!res) {
                reject(new Error("Unknown error"));
              } else {
                resolve(res);
              }
            }
            this.requestRawWithCallback(info, data, callbackForResult);
          });
        });
      }
      /**
       * Raw request with callback.
       * @param info
       * @param data
       * @param onResult
       */
      requestRawWithCallback(info, data, onResult) {
        if (typeof data === "string") {
          if (!info.options.headers) {
            info.options.headers = {};
          }
          info.options.headers["Content-Length"] = Buffer.byteLength(data, "utf8");
        }
        let callbackCalled = false;
        function handleResult(err, res) {
          if (!callbackCalled) {
            callbackCalled = true;
            onResult(err, res);
          }
        }
        const req = info.httpModule.request(info.options, (msg) => {
          const res = new HttpClientResponse(msg);
          handleResult(void 0, res);
        });
        let socket;
        req.on("socket", (sock) => {
          socket = sock;
        });
        req.setTimeout(this._socketTimeout || 3 * 6e4, () => {
          if (socket) {
            socket.end();
          }
          handleResult(new Error(`Request timeout: ${info.options.path}`));
        });
        req.on("error", function(err) {
          handleResult(err);
        });
        if (data && typeof data === "string") {
          req.write(data, "utf8");
        }
        if (data && typeof data !== "string") {
          data.on("close", function() {
            req.end();
          });
          data.pipe(req);
        } else {
          req.end();
        }
      }
      /**
       * Gets an http agent. This function is useful when you need an http agent that handles
       * routing through a proxy server - depending upon the url and proxy environment variables.
       * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
       */
      getAgent(serverUrl) {
        const parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
      }
      _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === "https:";
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port ? parseInt(info.parsedUrl.port) : defaultPort;
        info.options.path = (info.parsedUrl.pathname || "") + (info.parsedUrl.search || "");
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
          info.options.headers["user-agent"] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        if (this.handlers) {
          for (const handler of this.handlers) {
            handler.prepareRequest(info.options);
          }
        }
        return info;
      }
      _mergeHeaders(headers) {
        if (this.requestOptions && this.requestOptions.headers) {
          return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers || {}));
        }
        return lowercaseKeys(headers || {});
      }
      _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
          clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
      }
      _getAgent(parsedUrl) {
        let agent;
        const proxyUrl = pm.getProxyUrl(parsedUrl);
        const useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
          agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
          agent = this._agent;
        }
        if (agent) {
          return agent;
        }
        const usingSsl = parsedUrl.protocol === "https:";
        let maxSockets = 100;
        if (this.requestOptions) {
          maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        if (proxyUrl && proxyUrl.hostname) {
          const agentOptions = {
            maxSockets,
            keepAlive: this._keepAlive,
            proxy: Object.assign(Object.assign({}, (proxyUrl.username || proxyUrl.password) && {
              proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
            }), { host: proxyUrl.hostname, port: proxyUrl.port })
          };
          let tunnelAgent;
          const overHttps = proxyUrl.protocol === "https:";
          if (usingSsl) {
            tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
          } else {
            tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
          }
          agent = tunnelAgent(agentOptions);
          this._proxyAgent = agent;
        }
        if (this._keepAlive && !agent) {
          const options = { keepAlive: this._keepAlive, maxSockets };
          agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
          this._agent = agent;
        }
        if (!agent) {
          agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
          agent.options = Object.assign(agent.options || {}, {
            rejectUnauthorized: false
          });
        }
        return agent;
      }
      _performExponentialBackoff(retryNumber) {
        return __awaiter2(this, void 0, void 0, function* () {
          retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
          const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
          return new Promise((resolve) => setTimeout(() => resolve(), ms));
        });
      }
      _processResponse(res, options) {
        return __awaiter2(this, void 0, void 0, function* () {
          return new Promise((resolve, reject) => __awaiter2(this, void 0, void 0, function* () {
            const statusCode = res.message.statusCode || 0;
            const response = {
              statusCode,
              result: null,
              headers: {}
            };
            if (statusCode === HttpCodes.NotFound) {
              resolve(response);
            }
            function dateTimeDeserializer(key, value) {
              if (typeof value === "string") {
                const a = new Date(value);
                if (!isNaN(a.valueOf())) {
                  return a;
                }
              }
              return value;
            }
            let obj;
            let contents;
            try {
              contents = yield res.readBody();
              if (contents && contents.length > 0) {
                if (options && options.deserializeDates) {
                  obj = JSON.parse(contents, dateTimeDeserializer);
                } else {
                  obj = JSON.parse(contents);
                }
                response.result = obj;
              }
              response.headers = res.message.headers;
            } catch (err) {
            }
            if (statusCode > 299) {
              let msg;
              if (obj && obj.message) {
                msg = obj.message;
              } else if (contents && contents.length > 0) {
                msg = contents;
              } else {
                msg = `Failed request: (${statusCode})`;
              }
              const err = new HttpClientError(msg, statusCode);
              err.result = response.result;
              reject(err);
            } else {
              resolve(response);
            }
          }));
        });
      }
    };
    exports2.HttpClient = HttpClient;
    var lowercaseKeys = (obj) => Object.keys(obj).reduce((c, k) => (c[k.toLowerCase()] = obj[k], c), {});
  }
});

// node_modules/@actions/http-client/lib/auth.js
var require_auth = __commonJS({
  "node_modules/@actions/http-client/lib/auth.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.PersonalAccessTokenCredentialHandler = exports2.BearerCredentialHandler = exports2.BasicCredentialHandler = void 0;
    var BasicCredentialHandler = class {
      constructor(username, password) {
        this.username = username;
        this.password = password;
      }
      prepareRequest(options) {
        if (!options.headers) {
          throw Error("The request has no headers");
        }
        options.headers["Authorization"] = `Basic ${Buffer.from(`${this.username}:${this.password}`).toString("base64")}`;
      }
      // This handler cannot handle 401
      canHandleAuthentication() {
        return false;
      }
      handleAuthentication() {
        return __awaiter2(this, void 0, void 0, function* () {
          throw new Error("not implemented");
        });
      }
    };
    exports2.BasicCredentialHandler = BasicCredentialHandler;
    var BearerCredentialHandler = class {
      constructor(token) {
        this.token = token;
      }
      // currently implements pre-authorization
      // TODO: support preAuth = false where it hooks on 401
      prepareRequest(options) {
        if (!options.headers) {
          throw Error("The request has no headers");
        }
        options.headers["Authorization"] = `Bearer ${this.token}`;
      }
      // This handler cannot handle 401
      canHandleAuthentication() {
        return false;
      }
      handleAuthentication() {
        return __awaiter2(this, void 0, void 0, function* () {
          throw new Error("not implemented");
        });
      }
    };
    exports2.BearerCredentialHandler = BearerCredentialHandler;
    var PersonalAccessTokenCredentialHandler = class {
      constructor(token) {
        this.token = token;
      }
      // currently implements pre-authorization
      // TODO: support preAuth = false where it hooks on 401
      prepareRequest(options) {
        if (!options.headers) {
          throw Error("The request has no headers");
        }
        options.headers["Authorization"] = `Basic ${Buffer.from(`PAT:${this.token}`).toString("base64")}`;
      }
      // This handler cannot handle 401
      canHandleAuthentication() {
        return false;
      }
      handleAuthentication() {
        return __awaiter2(this, void 0, void 0, function* () {
          throw new Error("not implemented");
        });
      }
    };
    exports2.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;
  }
});

// node_modules/@actions/core/lib/oidc-utils.js
var require_oidc_utils = __commonJS({
  "node_modules/@actions/core/lib/oidc-utils.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.OidcClient = void 0;
    var http_client_1 = require_lib2();
    var auth_1 = require_auth();
    var core_1 = require_core();
    var OidcClient = class {
      static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
          allowRetries: allowRetry,
          maxRetries: maxRetry
        };
        return new http_client_1.HttpClient("actions/oidc-client", [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
      }
      static getRequestToken() {
        const token = process.env["ACTIONS_ID_TOKEN_REQUEST_TOKEN"];
        if (!token) {
          throw new Error("Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable");
        }
        return token;
      }
      static getIDTokenUrl() {
        const runtimeUrl = process.env["ACTIONS_ID_TOKEN_REQUEST_URL"];
        if (!runtimeUrl) {
          throw new Error("Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable");
        }
        return runtimeUrl;
      }
      static getCall(id_token_url) {
        var _a;
        return __awaiter2(this, void 0, void 0, function* () {
          const httpclient = OidcClient.createHttpClient();
          const res = yield httpclient.getJson(id_token_url).catch((error) => {
            throw new Error(`Failed to get ID Token. 
 
        Error Code : ${error.statusCode}
 
        Error Message: ${error.result.message}`);
          });
          const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
          if (!id_token) {
            throw new Error("Response json body do not have ID Token field");
          }
          return id_token;
        });
      }
      static getIDToken(audience) {
        return __awaiter2(this, void 0, void 0, function* () {
          try {
            let id_token_url = OidcClient.getIDTokenUrl();
            if (audience) {
              const encodedAudience = encodeURIComponent(audience);
              id_token_url = `${id_token_url}&audience=${encodedAudience}`;
            }
            core_1.debug(`ID token url is ${id_token_url}`);
            const id_token = yield OidcClient.getCall(id_token_url);
            core_1.setSecret(id_token);
            return id_token;
          } catch (error) {
            throw new Error(`Error message: ${error.message}`);
          }
        });
      }
    };
    exports2.OidcClient = OidcClient;
  }
});

// node_modules/@actions/core/lib/summary.js
var require_summary = __commonJS({
  "node_modules/@actions/core/lib/summary.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.summary = exports2.markdownSummary = exports2.SUMMARY_DOCS_URL = exports2.SUMMARY_ENV_VAR = void 0;
    var os_1 = require("os");
    var fs_1 = require("fs");
    var { access, appendFile, writeFile } = fs_1.promises;
    exports2.SUMMARY_ENV_VAR = "GITHUB_STEP_SUMMARY";
    exports2.SUMMARY_DOCS_URL = "https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions#adding-a-job-summary";
    var Summary = class {
      constructor() {
        this._buffer = "";
      }
      /**
       * Finds the summary file path from the environment, rejects if env var is not found or file does not exist
       * Also checks r/w permissions.
       *
       * @returns step summary file path
       */
      filePath() {
        return __awaiter2(this, void 0, void 0, function* () {
          if (this._filePath) {
            return this._filePath;
          }
          const pathFromEnv = process.env[exports2.SUMMARY_ENV_VAR];
          if (!pathFromEnv) {
            throw new Error(`Unable to find environment variable for $${exports2.SUMMARY_ENV_VAR}. Check if your runtime environment supports job summaries.`);
          }
          try {
            yield access(pathFromEnv, fs_1.constants.R_OK | fs_1.constants.W_OK);
          } catch (_a) {
            throw new Error(`Unable to access summary file: '${pathFromEnv}'. Check if the file has correct read/write permissions.`);
          }
          this._filePath = pathFromEnv;
          return this._filePath;
        });
      }
      /**
       * Wraps content in an HTML tag, adding any HTML attributes
       *
       * @param {string} tag HTML tag to wrap
       * @param {string | null} content content within the tag
       * @param {[attribute: string]: string} attrs key-value list of HTML attributes to add
       *
       * @returns {string} content wrapped in HTML element
       */
      wrap(tag, content, attrs = {}) {
        const htmlAttrs = Object.entries(attrs).map(([key, value]) => ` ${key}="${value}"`).join("");
        if (!content) {
          return `<${tag}${htmlAttrs}>`;
        }
        return `<${tag}${htmlAttrs}>${content}</${tag}>`;
      }
      /**
       * Writes text in the buffer to the summary buffer file and empties buffer. Will append by default.
       *
       * @param {SummaryWriteOptions} [options] (optional) options for write operation
       *
       * @returns {Promise<Summary>} summary instance
       */
      write(options) {
        return __awaiter2(this, void 0, void 0, function* () {
          const overwrite = !!(options === null || options === void 0 ? void 0 : options.overwrite);
          const filePath = yield this.filePath();
          const writeFunc = overwrite ? writeFile : appendFile;
          yield writeFunc(filePath, this._buffer, { encoding: "utf8" });
          return this.emptyBuffer();
        });
      }
      /**
       * Clears the summary buffer and wipes the summary file
       *
       * @returns {Summary} summary instance
       */
      clear() {
        return __awaiter2(this, void 0, void 0, function* () {
          return this.emptyBuffer().write({ overwrite: true });
        });
      }
      /**
       * Returns the current summary buffer as a string
       *
       * @returns {string} string of summary buffer
       */
      stringify() {
        return this._buffer;
      }
      /**
       * If the summary buffer is empty
       *
       * @returns {boolen} true if the buffer is empty
       */
      isEmptyBuffer() {
        return this._buffer.length === 0;
      }
      /**
       * Resets the summary buffer without writing to summary file
       *
       * @returns {Summary} summary instance
       */
      emptyBuffer() {
        this._buffer = "";
        return this;
      }
      /**
       * Adds raw text to the summary buffer
       *
       * @param {string} text content to add
       * @param {boolean} [addEOL=false] (optional) append an EOL to the raw text (default: false)
       *
       * @returns {Summary} summary instance
       */
      addRaw(text, addEOL = false) {
        this._buffer += text;
        return addEOL ? this.addEOL() : this;
      }
      /**
       * Adds the operating system-specific end-of-line marker to the buffer
       *
       * @returns {Summary} summary instance
       */
      addEOL() {
        return this.addRaw(os_1.EOL);
      }
      /**
       * Adds an HTML codeblock to the summary buffer
       *
       * @param {string} code content to render within fenced code block
       * @param {string} lang (optional) language to syntax highlight code
       *
       * @returns {Summary} summary instance
       */
      addCodeBlock(code, lang) {
        const attrs = Object.assign({}, lang && { lang });
        const element = this.wrap("pre", this.wrap("code", code), attrs);
        return this.addRaw(element).addEOL();
      }
      /**
       * Adds an HTML list to the summary buffer
       *
       * @param {string[]} items list of items to render
       * @param {boolean} [ordered=false] (optional) if the rendered list should be ordered or not (default: false)
       *
       * @returns {Summary} summary instance
       */
      addList(items, ordered = false) {
        const tag = ordered ? "ol" : "ul";
        const listItems = items.map((item) => this.wrap("li", item)).join("");
        const element = this.wrap(tag, listItems);
        return this.addRaw(element).addEOL();
      }
      /**
       * Adds an HTML table to the summary buffer
       *
       * @param {SummaryTableCell[]} rows table rows
       *
       * @returns {Summary} summary instance
       */
      addTable(rows) {
        const tableBody = rows.map((row) => {
          const cells = row.map((cell) => {
            if (typeof cell === "string") {
              return this.wrap("td", cell);
            }
            const { header, data, colspan, rowspan } = cell;
            const tag = header ? "th" : "td";
            const attrs = Object.assign(Object.assign({}, colspan && { colspan }), rowspan && { rowspan });
            return this.wrap(tag, data, attrs);
          }).join("");
          return this.wrap("tr", cells);
        }).join("");
        const element = this.wrap("table", tableBody);
        return this.addRaw(element).addEOL();
      }
      /**
       * Adds a collapsable HTML details element to the summary buffer
       *
       * @param {string} label text for the closed state
       * @param {string} content collapsable content
       *
       * @returns {Summary} summary instance
       */
      addDetails(label, content) {
        const element = this.wrap("details", this.wrap("summary", label) + content);
        return this.addRaw(element).addEOL();
      }
      /**
       * Adds an HTML image tag to the summary buffer
       *
       * @param {string} src path to the image you to embed
       * @param {string} alt text description of the image
       * @param {SummaryImageOptions} options (optional) addition image attributes
       *
       * @returns {Summary} summary instance
       */
      addImage(src, alt, options) {
        const { width, height } = options || {};
        const attrs = Object.assign(Object.assign({}, width && { width }), height && { height });
        const element = this.wrap("img", null, Object.assign({ src, alt }, attrs));
        return this.addRaw(element).addEOL();
      }
      /**
       * Adds an HTML section heading element
       *
       * @param {string} text heading text
       * @param {number | string} [level=1] (optional) the heading level, default: 1
       *
       * @returns {Summary} summary instance
       */
      addHeading(text, level) {
        const tag = `h${level}`;
        const allowedTag = ["h1", "h2", "h3", "h4", "h5", "h6"].includes(tag) ? tag : "h1";
        const element = this.wrap(allowedTag, text);
        return this.addRaw(element).addEOL();
      }
      /**
       * Adds an HTML thematic break (<hr>) to the summary buffer
       *
       * @returns {Summary} summary instance
       */
      addSeparator() {
        const element = this.wrap("hr", null);
        return this.addRaw(element).addEOL();
      }
      /**
       * Adds an HTML line break (<br>) to the summary buffer
       *
       * @returns {Summary} summary instance
       */
      addBreak() {
        const element = this.wrap("br", null);
        return this.addRaw(element).addEOL();
      }
      /**
       * Adds an HTML blockquote to the summary buffer
       *
       * @param {string} text quote text
       * @param {string} cite (optional) citation url
       *
       * @returns {Summary} summary instance
       */
      addQuote(text, cite) {
        const attrs = Object.assign({}, cite && { cite });
        const element = this.wrap("blockquote", text, attrs);
        return this.addRaw(element).addEOL();
      }
      /**
       * Adds an HTML anchor tag to the summary buffer
       *
       * @param {string} text link text/content
       * @param {string} href hyperlink
       *
       * @returns {Summary} summary instance
       */
      addLink(text, href) {
        const element = this.wrap("a", text, { href });
        return this.addRaw(element).addEOL();
      }
    };
    var _summary = new Summary();
    exports2.markdownSummary = _summary;
    exports2.summary = _summary;
  }
});

// node_modules/@actions/core/lib/path-utils.js
var require_path_utils = __commonJS({
  "node_modules/@actions/core/lib/path-utils.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.toPlatformPath = exports2.toWin32Path = exports2.toPosixPath = void 0;
    var path = __importStar(require("path"));
    function toPosixPath(pth) {
      return pth.replace(/[\\]/g, "/");
    }
    exports2.toPosixPath = toPosixPath;
    function toWin32Path(pth) {
      return pth.replace(/[/]/g, "\\");
    }
    exports2.toWin32Path = toWin32Path;
    function toPlatformPath(pth) {
      return pth.replace(/[/\\]/g, path.sep);
    }
    exports2.toPlatformPath = toPlatformPath;
  }
});

// node_modules/@actions/core/lib/core.js
var require_core = __commonJS({
  "node_modules/@actions/core/lib/core.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getIDToken = exports2.getState = exports2.saveState = exports2.group = exports2.endGroup = exports2.startGroup = exports2.info = exports2.notice = exports2.warning = exports2.error = exports2.debug = exports2.isDebug = exports2.setFailed = exports2.setCommandEcho = exports2.setOutput = exports2.getBooleanInput = exports2.getMultilineInput = exports2.getInput = exports2.addPath = exports2.setSecret = exports2.exportVariable = exports2.ExitCode = void 0;
    var command_1 = require_command();
    var file_command_1 = require_file_command();
    var utils_1 = require_utils3();
    var os = __importStar(require("os"));
    var path = __importStar(require("path"));
    var oidc_utils_1 = require_oidc_utils();
    var ExitCode;
    (function(ExitCode2) {
      ExitCode2[ExitCode2["Success"] = 0] = "Success";
      ExitCode2[ExitCode2["Failure"] = 1] = "Failure";
    })(ExitCode = exports2.ExitCode || (exports2.ExitCode = {}));
    function exportVariable(name, val) {
      const convertedVal = utils_1.toCommandValue(val);
      process.env[name] = convertedVal;
      const filePath = process.env["GITHUB_ENV"] || "";
      if (filePath) {
        return file_command_1.issueFileCommand("ENV", file_command_1.prepareKeyValueMessage(name, val));
      }
      command_1.issueCommand("set-env", { name }, convertedVal);
    }
    exports2.exportVariable = exportVariable;
    function setSecret(secret) {
      command_1.issueCommand("add-mask", {}, secret);
    }
    exports2.setSecret = setSecret;
    function addPath(inputPath) {
      const filePath = process.env["GITHUB_PATH"] || "";
      if (filePath) {
        file_command_1.issueFileCommand("PATH", inputPath);
      } else {
        command_1.issueCommand("add-path", {}, inputPath);
      }
      process.env["PATH"] = `${inputPath}${path.delimiter}${process.env["PATH"]}`;
    }
    exports2.addPath = addPath;
    function getInput(name, options) {
      const val = process.env[`INPUT_${name.replace(/ /g, "_").toUpperCase()}`] || "";
      if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
      }
      if (options && options.trimWhitespace === false) {
        return val;
      }
      return val.trim();
    }
    exports2.getInput = getInput;
    function getMultilineInput(name, options) {
      const inputs = getInput(name, options).split("\n").filter((x) => x !== "");
      if (options && options.trimWhitespace === false) {
        return inputs;
      }
      return inputs.map((input) => input.trim());
    }
    exports2.getMultilineInput = getMultilineInput;
    function getBooleanInput(name, options) {
      const trueValue = ["true", "True", "TRUE"];
      const falseValue = ["false", "False", "FALSE"];
      const val = getInput(name, options);
      if (trueValue.includes(val))
        return true;
      if (falseValue.includes(val))
        return false;
      throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}
Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
    }
    exports2.getBooleanInput = getBooleanInput;
    function setOutput(name, value) {
      const filePath = process.env["GITHUB_OUTPUT"] || "";
      if (filePath) {
        return file_command_1.issueFileCommand("OUTPUT", file_command_1.prepareKeyValueMessage(name, value));
      }
      process.stdout.write(os.EOL);
      command_1.issueCommand("set-output", { name }, utils_1.toCommandValue(value));
    }
    exports2.setOutput = setOutput;
    function setCommandEcho(enabled) {
      command_1.issue("echo", enabled ? "on" : "off");
    }
    exports2.setCommandEcho = setCommandEcho;
    function setFailed(message) {
      process.exitCode = ExitCode.Failure;
      error(message);
    }
    exports2.setFailed = setFailed;
    function isDebug() {
      return process.env["RUNNER_DEBUG"] === "1";
    }
    exports2.isDebug = isDebug;
    function debug(message) {
      command_1.issueCommand("debug", {}, message);
    }
    exports2.debug = debug;
    function error(message, properties = {}) {
      command_1.issueCommand("error", utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
    }
    exports2.error = error;
    function warning(message, properties = {}) {
      command_1.issueCommand("warning", utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
    }
    exports2.warning = warning;
    function notice(message, properties = {}) {
      command_1.issueCommand("notice", utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
    }
    exports2.notice = notice;
    function info(message) {
      process.stdout.write(message + os.EOL);
    }
    exports2.info = info;
    function startGroup(name) {
      command_1.issue("group", name);
    }
    exports2.startGroup = startGroup;
    function endGroup() {
      command_1.issue("endgroup");
    }
    exports2.endGroup = endGroup;
    function group(name, fn) {
      return __awaiter2(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
          result = yield fn();
        } finally {
          endGroup();
        }
        return result;
      });
    }
    exports2.group = group;
    function saveState(name, value) {
      const filePath = process.env["GITHUB_STATE"] || "";
      if (filePath) {
        return file_command_1.issueFileCommand("STATE", file_command_1.prepareKeyValueMessage(name, value));
      }
      command_1.issueCommand("save-state", { name }, utils_1.toCommandValue(value));
    }
    exports2.saveState = saveState;
    function getState(name) {
      return process.env[`STATE_${name}`] || "";
    }
    exports2.getState = getState;
    function getIDToken(aud) {
      return __awaiter2(this, void 0, void 0, function* () {
        return yield oidc_utils_1.OidcClient.getIDToken(aud);
      });
    }
    exports2.getIDToken = getIDToken;
    var summary_1 = require_summary();
    Object.defineProperty(exports2, "summary", { enumerable: true, get: function() {
      return summary_1.summary;
    } });
    var summary_2 = require_summary();
    Object.defineProperty(exports2, "markdownSummary", { enumerable: true, get: function() {
      return summary_2.markdownSummary;
    } });
    var path_utils_1 = require_path_utils();
    Object.defineProperty(exports2, "toPosixPath", { enumerable: true, get: function() {
      return path_utils_1.toPosixPath;
    } });
    Object.defineProperty(exports2, "toWin32Path", { enumerable: true, get: function() {
      return path_utils_1.toWin32Path;
    } });
    Object.defineProperty(exports2, "toPlatformPath", { enumerable: true, get: function() {
      return path_utils_1.toPlatformPath;
    } });
  }
});

// node_modules/js-yaml/lib/common.js
var require_common = __commonJS({
  "node_modules/js-yaml/lib/common.js"(exports2, module2) {
    "use strict";
    function isNothing(subject) {
      return typeof subject === "undefined" || subject === null;
    }
    function isObject(subject) {
      return typeof subject === "object" && subject !== null;
    }
    function toArray(sequence) {
      if (Array.isArray(sequence))
        return sequence;
      else if (isNothing(sequence))
        return [];
      return [sequence];
    }
    function extend(target, source) {
      var index, length, key, sourceKeys;
      if (source) {
        sourceKeys = Object.keys(source);
        for (index = 0, length = sourceKeys.length; index < length; index += 1) {
          key = sourceKeys[index];
          target[key] = source[key];
        }
      }
      return target;
    }
    function repeat(string, count) {
      var result = "", cycle;
      for (cycle = 0; cycle < count; cycle += 1) {
        result += string;
      }
      return result;
    }
    function isNegativeZero(number) {
      return number === 0 && Number.NEGATIVE_INFINITY === 1 / number;
    }
    module2.exports.isNothing = isNothing;
    module2.exports.isObject = isObject;
    module2.exports.toArray = toArray;
    module2.exports.repeat = repeat;
    module2.exports.isNegativeZero = isNegativeZero;
    module2.exports.extend = extend;
  }
});

// node_modules/js-yaml/lib/exception.js
var require_exception = __commonJS({
  "node_modules/js-yaml/lib/exception.js"(exports2, module2) {
    "use strict";
    function formatError(exception, compact) {
      var where = "", message = exception.reason || "(unknown reason)";
      if (!exception.mark)
        return message;
      if (exception.mark.name) {
        where += 'in "' + exception.mark.name + '" ';
      }
      where += "(" + (exception.mark.line + 1) + ":" + (exception.mark.column + 1) + ")";
      if (!compact && exception.mark.snippet) {
        where += "\n\n" + exception.mark.snippet;
      }
      return message + " " + where;
    }
    function YAMLException(reason, mark) {
      Error.call(this);
      this.name = "YAMLException";
      this.reason = reason;
      this.mark = mark;
      this.message = formatError(this, false);
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      } else {
        this.stack = new Error().stack || "";
      }
    }
    YAMLException.prototype = Object.create(Error.prototype);
    YAMLException.prototype.constructor = YAMLException;
    YAMLException.prototype.toString = function toString(compact) {
      return this.name + ": " + formatError(this, compact);
    };
    module2.exports = YAMLException;
  }
});

// node_modules/js-yaml/lib/snippet.js
var require_snippet = __commonJS({
  "node_modules/js-yaml/lib/snippet.js"(exports2, module2) {
    "use strict";
    var common = require_common();
    function getLine(buffer, lineStart, lineEnd, position, maxLineLength) {
      var head = "";
      var tail = "";
      var maxHalfLength = Math.floor(maxLineLength / 2) - 1;
      if (position - lineStart > maxHalfLength) {
        head = " ... ";
        lineStart = position - maxHalfLength + head.length;
      }
      if (lineEnd - position > maxHalfLength) {
        tail = " ...";
        lineEnd = position + maxHalfLength - tail.length;
      }
      return {
        str: head + buffer.slice(lineStart, lineEnd).replace(/\t/g, "\u2192") + tail,
        pos: position - lineStart + head.length
        // relative position
      };
    }
    function padStart(string, max) {
      return common.repeat(" ", max - string.length) + string;
    }
    function makeSnippet(mark, options) {
      options = Object.create(options || null);
      if (!mark.buffer)
        return null;
      if (!options.maxLength)
        options.maxLength = 79;
      if (typeof options.indent !== "number")
        options.indent = 1;
      if (typeof options.linesBefore !== "number")
        options.linesBefore = 3;
      if (typeof options.linesAfter !== "number")
        options.linesAfter = 2;
      var re = /\r?\n|\r|\0/g;
      var lineStarts = [0];
      var lineEnds = [];
      var match;
      var foundLineNo = -1;
      while (match = re.exec(mark.buffer)) {
        lineEnds.push(match.index);
        lineStarts.push(match.index + match[0].length);
        if (mark.position <= match.index && foundLineNo < 0) {
          foundLineNo = lineStarts.length - 2;
        }
      }
      if (foundLineNo < 0)
        foundLineNo = lineStarts.length - 1;
      var result = "", i, line;
      var lineNoLength = Math.min(mark.line + options.linesAfter, lineEnds.length).toString().length;
      var maxLineLength = options.maxLength - (options.indent + lineNoLength + 3);
      for (i = 1; i <= options.linesBefore; i++) {
        if (foundLineNo - i < 0)
          break;
        line = getLine(
          mark.buffer,
          lineStarts[foundLineNo - i],
          lineEnds[foundLineNo - i],
          mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo - i]),
          maxLineLength
        );
        result = common.repeat(" ", options.indent) + padStart((mark.line - i + 1).toString(), lineNoLength) + " | " + line.str + "\n" + result;
      }
      line = getLine(mark.buffer, lineStarts[foundLineNo], lineEnds[foundLineNo], mark.position, maxLineLength);
      result += common.repeat(" ", options.indent) + padStart((mark.line + 1).toString(), lineNoLength) + " | " + line.str + "\n";
      result += common.repeat("-", options.indent + lineNoLength + 3 + line.pos) + "^\n";
      for (i = 1; i <= options.linesAfter; i++) {
        if (foundLineNo + i >= lineEnds.length)
          break;
        line = getLine(
          mark.buffer,
          lineStarts[foundLineNo + i],
          lineEnds[foundLineNo + i],
          mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo + i]),
          maxLineLength
        );
        result += common.repeat(" ", options.indent) + padStart((mark.line + i + 1).toString(), lineNoLength) + " | " + line.str + "\n";
      }
      return result.replace(/\n$/, "");
    }
    module2.exports = makeSnippet;
  }
});

// node_modules/js-yaml/lib/type.js
var require_type = __commonJS({
  "node_modules/js-yaml/lib/type.js"(exports2, module2) {
    "use strict";
    var YAMLException = require_exception();
    var TYPE_CONSTRUCTOR_OPTIONS = [
      "kind",
      "multi",
      "resolve",
      "construct",
      "instanceOf",
      "predicate",
      "represent",
      "representName",
      "defaultStyle",
      "styleAliases"
    ];
    var YAML_NODE_KINDS = [
      "scalar",
      "sequence",
      "mapping"
    ];
    function compileStyleAliases(map) {
      var result = {};
      if (map !== null) {
        Object.keys(map).forEach(function(style) {
          map[style].forEach(function(alias) {
            result[String(alias)] = style;
          });
        });
      }
      return result;
    }
    function Type(tag, options) {
      options = options || {};
      Object.keys(options).forEach(function(name) {
        if (TYPE_CONSTRUCTOR_OPTIONS.indexOf(name) === -1) {
          throw new YAMLException('Unknown option "' + name + '" is met in definition of "' + tag + '" YAML type.');
        }
      });
      this.options = options;
      this.tag = tag;
      this.kind = options["kind"] || null;
      this.resolve = options["resolve"] || function() {
        return true;
      };
      this.construct = options["construct"] || function(data) {
        return data;
      };
      this.instanceOf = options["instanceOf"] || null;
      this.predicate = options["predicate"] || null;
      this.represent = options["represent"] || null;
      this.representName = options["representName"] || null;
      this.defaultStyle = options["defaultStyle"] || null;
      this.multi = options["multi"] || false;
      this.styleAliases = compileStyleAliases(options["styleAliases"] || null);
      if (YAML_NODE_KINDS.indexOf(this.kind) === -1) {
        throw new YAMLException('Unknown kind "' + this.kind + '" is specified for "' + tag + '" YAML type.');
      }
    }
    module2.exports = Type;
  }
});

// node_modules/js-yaml/lib/schema.js
var require_schema = __commonJS({
  "node_modules/js-yaml/lib/schema.js"(exports2, module2) {
    "use strict";
    var YAMLException = require_exception();
    var Type = require_type();
    function compileList(schema, name) {
      var result = [];
      schema[name].forEach(function(currentType) {
        var newIndex = result.length;
        result.forEach(function(previousType, previousIndex) {
          if (previousType.tag === currentType.tag && previousType.kind === currentType.kind && previousType.multi === currentType.multi) {
            newIndex = previousIndex;
          }
        });
        result[newIndex] = currentType;
      });
      return result;
    }
    function compileMap() {
      var result = {
        scalar: {},
        sequence: {},
        mapping: {},
        fallback: {},
        multi: {
          scalar: [],
          sequence: [],
          mapping: [],
          fallback: []
        }
      }, index, length;
      function collectType(type) {
        if (type.multi) {
          result.multi[type.kind].push(type);
          result.multi["fallback"].push(type);
        } else {
          result[type.kind][type.tag] = result["fallback"][type.tag] = type;
        }
      }
      for (index = 0, length = arguments.length; index < length; index += 1) {
        arguments[index].forEach(collectType);
      }
      return result;
    }
    function Schema(definition) {
      return this.extend(definition);
    }
    Schema.prototype.extend = function extend(definition) {
      var implicit = [];
      var explicit = [];
      if (definition instanceof Type) {
        explicit.push(definition);
      } else if (Array.isArray(definition)) {
        explicit = explicit.concat(definition);
      } else if (definition && (Array.isArray(definition.implicit) || Array.isArray(definition.explicit))) {
        if (definition.implicit)
          implicit = implicit.concat(definition.implicit);
        if (definition.explicit)
          explicit = explicit.concat(definition.explicit);
      } else {
        throw new YAMLException("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
      }
      implicit.forEach(function(type) {
        if (!(type instanceof Type)) {
          throw new YAMLException("Specified list of YAML types (or a single Type object) contains a non-Type object.");
        }
        if (type.loadKind && type.loadKind !== "scalar") {
          throw new YAMLException("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
        }
        if (type.multi) {
          throw new YAMLException("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
        }
      });
      explicit.forEach(function(type) {
        if (!(type instanceof Type)) {
          throw new YAMLException("Specified list of YAML types (or a single Type object) contains a non-Type object.");
        }
      });
      var result = Object.create(Schema.prototype);
      result.implicit = (this.implicit || []).concat(implicit);
      result.explicit = (this.explicit || []).concat(explicit);
      result.compiledImplicit = compileList(result, "implicit");
      result.compiledExplicit = compileList(result, "explicit");
      result.compiledTypeMap = compileMap(result.compiledImplicit, result.compiledExplicit);
      return result;
    };
    module2.exports = Schema;
  }
});

// node_modules/js-yaml/lib/type/str.js
var require_str = __commonJS({
  "node_modules/js-yaml/lib/type/str.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    module2.exports = new Type("tag:yaml.org,2002:str", {
      kind: "scalar",
      construct: function(data) {
        return data !== null ? data : "";
      }
    });
  }
});

// node_modules/js-yaml/lib/type/seq.js
var require_seq = __commonJS({
  "node_modules/js-yaml/lib/type/seq.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    module2.exports = new Type("tag:yaml.org,2002:seq", {
      kind: "sequence",
      construct: function(data) {
        return data !== null ? data : [];
      }
    });
  }
});

// node_modules/js-yaml/lib/type/map.js
var require_map = __commonJS({
  "node_modules/js-yaml/lib/type/map.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    module2.exports = new Type("tag:yaml.org,2002:map", {
      kind: "mapping",
      construct: function(data) {
        return data !== null ? data : {};
      }
    });
  }
});

// node_modules/js-yaml/lib/schema/failsafe.js
var require_failsafe = __commonJS({
  "node_modules/js-yaml/lib/schema/failsafe.js"(exports2, module2) {
    "use strict";
    var Schema = require_schema();
    module2.exports = new Schema({
      explicit: [
        require_str(),
        require_seq(),
        require_map()
      ]
    });
  }
});

// node_modules/js-yaml/lib/type/null.js
var require_null = __commonJS({
  "node_modules/js-yaml/lib/type/null.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    function resolveYamlNull(data) {
      if (data === null)
        return true;
      var max = data.length;
      return max === 1 && data === "~" || max === 4 && (data === "null" || data === "Null" || data === "NULL");
    }
    function constructYamlNull() {
      return null;
    }
    function isNull(object) {
      return object === null;
    }
    module2.exports = new Type("tag:yaml.org,2002:null", {
      kind: "scalar",
      resolve: resolveYamlNull,
      construct: constructYamlNull,
      predicate: isNull,
      represent: {
        canonical: function() {
          return "~";
        },
        lowercase: function() {
          return "null";
        },
        uppercase: function() {
          return "NULL";
        },
        camelcase: function() {
          return "Null";
        },
        empty: function() {
          return "";
        }
      },
      defaultStyle: "lowercase"
    });
  }
});

// node_modules/js-yaml/lib/type/bool.js
var require_bool = __commonJS({
  "node_modules/js-yaml/lib/type/bool.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    function resolveYamlBoolean(data) {
      if (data === null)
        return false;
      var max = data.length;
      return max === 4 && (data === "true" || data === "True" || data === "TRUE") || max === 5 && (data === "false" || data === "False" || data === "FALSE");
    }
    function constructYamlBoolean(data) {
      return data === "true" || data === "True" || data === "TRUE";
    }
    function isBoolean(object) {
      return Object.prototype.toString.call(object) === "[object Boolean]";
    }
    module2.exports = new Type("tag:yaml.org,2002:bool", {
      kind: "scalar",
      resolve: resolveYamlBoolean,
      construct: constructYamlBoolean,
      predicate: isBoolean,
      represent: {
        lowercase: function(object) {
          return object ? "true" : "false";
        },
        uppercase: function(object) {
          return object ? "TRUE" : "FALSE";
        },
        camelcase: function(object) {
          return object ? "True" : "False";
        }
      },
      defaultStyle: "lowercase"
    });
  }
});

// node_modules/js-yaml/lib/type/int.js
var require_int = __commonJS({
  "node_modules/js-yaml/lib/type/int.js"(exports2, module2) {
    "use strict";
    var common = require_common();
    var Type = require_type();
    function isHexCode(c) {
      return 48 <= c && c <= 57 || 65 <= c && c <= 70 || 97 <= c && c <= 102;
    }
    function isOctCode(c) {
      return 48 <= c && c <= 55;
    }
    function isDecCode(c) {
      return 48 <= c && c <= 57;
    }
    function resolveYamlInteger(data) {
      if (data === null)
        return false;
      var max = data.length, index = 0, hasDigits = false, ch;
      if (!max)
        return false;
      ch = data[index];
      if (ch === "-" || ch === "+") {
        ch = data[++index];
      }
      if (ch === "0") {
        if (index + 1 === max)
          return true;
        ch = data[++index];
        if (ch === "b") {
          index++;
          for (; index < max; index++) {
            ch = data[index];
            if (ch === "_")
              continue;
            if (ch !== "0" && ch !== "1")
              return false;
            hasDigits = true;
          }
          return hasDigits && ch !== "_";
        }
        if (ch === "x") {
          index++;
          for (; index < max; index++) {
            ch = data[index];
            if (ch === "_")
              continue;
            if (!isHexCode(data.charCodeAt(index)))
              return false;
            hasDigits = true;
          }
          return hasDigits && ch !== "_";
        }
        if (ch === "o") {
          index++;
          for (; index < max; index++) {
            ch = data[index];
            if (ch === "_")
              continue;
            if (!isOctCode(data.charCodeAt(index)))
              return false;
            hasDigits = true;
          }
          return hasDigits && ch !== "_";
        }
      }
      if (ch === "_")
        return false;
      for (; index < max; index++) {
        ch = data[index];
        if (ch === "_")
          continue;
        if (!isDecCode(data.charCodeAt(index))) {
          return false;
        }
        hasDigits = true;
      }
      if (!hasDigits || ch === "_")
        return false;
      return true;
    }
    function constructYamlInteger(data) {
      var value = data, sign = 1, ch;
      if (value.indexOf("_") !== -1) {
        value = value.replace(/_/g, "");
      }
      ch = value[0];
      if (ch === "-" || ch === "+") {
        if (ch === "-")
          sign = -1;
        value = value.slice(1);
        ch = value[0];
      }
      if (value === "0")
        return 0;
      if (ch === "0") {
        if (value[1] === "b")
          return sign * parseInt(value.slice(2), 2);
        if (value[1] === "x")
          return sign * parseInt(value.slice(2), 16);
        if (value[1] === "o")
          return sign * parseInt(value.slice(2), 8);
      }
      return sign * parseInt(value, 10);
    }
    function isInteger(object) {
      return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 === 0 && !common.isNegativeZero(object));
    }
    module2.exports = new Type("tag:yaml.org,2002:int", {
      kind: "scalar",
      resolve: resolveYamlInteger,
      construct: constructYamlInteger,
      predicate: isInteger,
      represent: {
        binary: function(obj) {
          return obj >= 0 ? "0b" + obj.toString(2) : "-0b" + obj.toString(2).slice(1);
        },
        octal: function(obj) {
          return obj >= 0 ? "0o" + obj.toString(8) : "-0o" + obj.toString(8).slice(1);
        },
        decimal: function(obj) {
          return obj.toString(10);
        },
        /* eslint-disable max-len */
        hexadecimal: function(obj) {
          return obj >= 0 ? "0x" + obj.toString(16).toUpperCase() : "-0x" + obj.toString(16).toUpperCase().slice(1);
        }
      },
      defaultStyle: "decimal",
      styleAliases: {
        binary: [2, "bin"],
        octal: [8, "oct"],
        decimal: [10, "dec"],
        hexadecimal: [16, "hex"]
      }
    });
  }
});

// node_modules/js-yaml/lib/type/float.js
var require_float = __commonJS({
  "node_modules/js-yaml/lib/type/float.js"(exports2, module2) {
    "use strict";
    var common = require_common();
    var Type = require_type();
    var YAML_FLOAT_PATTERN = new RegExp(
      // 2.5e4, 2.5 and integers
      "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
    );
    function resolveYamlFloat(data) {
      if (data === null)
        return false;
      if (!YAML_FLOAT_PATTERN.test(data) || // Quick hack to not allow integers end with `_`
      // Probably should update regexp & check speed
      data[data.length - 1] === "_") {
        return false;
      }
      return true;
    }
    function constructYamlFloat(data) {
      var value, sign;
      value = data.replace(/_/g, "").toLowerCase();
      sign = value[0] === "-" ? -1 : 1;
      if ("+-".indexOf(value[0]) >= 0) {
        value = value.slice(1);
      }
      if (value === ".inf") {
        return sign === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
      } else if (value === ".nan") {
        return NaN;
      }
      return sign * parseFloat(value, 10);
    }
    var SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;
    function representYamlFloat(object, style) {
      var res;
      if (isNaN(object)) {
        switch (style) {
          case "lowercase":
            return ".nan";
          case "uppercase":
            return ".NAN";
          case "camelcase":
            return ".NaN";
        }
      } else if (Number.POSITIVE_INFINITY === object) {
        switch (style) {
          case "lowercase":
            return ".inf";
          case "uppercase":
            return ".INF";
          case "camelcase":
            return ".Inf";
        }
      } else if (Number.NEGATIVE_INFINITY === object) {
        switch (style) {
          case "lowercase":
            return "-.inf";
          case "uppercase":
            return "-.INF";
          case "camelcase":
            return "-.Inf";
        }
      } else if (common.isNegativeZero(object)) {
        return "-0.0";
      }
      res = object.toString(10);
      return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace("e", ".e") : res;
    }
    function isFloat(object) {
      return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 !== 0 || common.isNegativeZero(object));
    }
    module2.exports = new Type("tag:yaml.org,2002:float", {
      kind: "scalar",
      resolve: resolveYamlFloat,
      construct: constructYamlFloat,
      predicate: isFloat,
      represent: representYamlFloat,
      defaultStyle: "lowercase"
    });
  }
});

// node_modules/js-yaml/lib/schema/json.js
var require_json2 = __commonJS({
  "node_modules/js-yaml/lib/schema/json.js"(exports2, module2) {
    "use strict";
    module2.exports = require_failsafe().extend({
      implicit: [
        require_null(),
        require_bool(),
        require_int(),
        require_float()
      ]
    });
  }
});

// node_modules/js-yaml/lib/schema/core.js
var require_core2 = __commonJS({
  "node_modules/js-yaml/lib/schema/core.js"(exports2, module2) {
    "use strict";
    module2.exports = require_json2();
  }
});

// node_modules/js-yaml/lib/type/timestamp.js
var require_timestamp = __commonJS({
  "node_modules/js-yaml/lib/type/timestamp.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    var YAML_DATE_REGEXP = new RegExp(
      "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
    );
    var YAML_TIMESTAMP_REGEXP = new RegExp(
      "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
    );
    function resolveYamlTimestamp(data) {
      if (data === null)
        return false;
      if (YAML_DATE_REGEXP.exec(data) !== null)
        return true;
      if (YAML_TIMESTAMP_REGEXP.exec(data) !== null)
        return true;
      return false;
    }
    function constructYamlTimestamp(data) {
      var match, year, month, day, hour, minute, second, fraction = 0, delta = null, tz_hour, tz_minute, date;
      match = YAML_DATE_REGEXP.exec(data);
      if (match === null)
        match = YAML_TIMESTAMP_REGEXP.exec(data);
      if (match === null)
        throw new Error("Date resolve error");
      year = +match[1];
      month = +match[2] - 1;
      day = +match[3];
      if (!match[4]) {
        return new Date(Date.UTC(year, month, day));
      }
      hour = +match[4];
      minute = +match[5];
      second = +match[6];
      if (match[7]) {
        fraction = match[7].slice(0, 3);
        while (fraction.length < 3) {
          fraction += "0";
        }
        fraction = +fraction;
      }
      if (match[9]) {
        tz_hour = +match[10];
        tz_minute = +(match[11] || 0);
        delta = (tz_hour * 60 + tz_minute) * 6e4;
        if (match[9] === "-")
          delta = -delta;
      }
      date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));
      if (delta)
        date.setTime(date.getTime() - delta);
      return date;
    }
    function representYamlTimestamp(object) {
      return object.toISOString();
    }
    module2.exports = new Type("tag:yaml.org,2002:timestamp", {
      kind: "scalar",
      resolve: resolveYamlTimestamp,
      construct: constructYamlTimestamp,
      instanceOf: Date,
      represent: representYamlTimestamp
    });
  }
});

// node_modules/js-yaml/lib/type/merge.js
var require_merge = __commonJS({
  "node_modules/js-yaml/lib/type/merge.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    function resolveYamlMerge(data) {
      return data === "<<" || data === null;
    }
    module2.exports = new Type("tag:yaml.org,2002:merge", {
      kind: "scalar",
      resolve: resolveYamlMerge
    });
  }
});

// node_modules/js-yaml/lib/type/binary.js
var require_binary = __commonJS({
  "node_modules/js-yaml/lib/type/binary.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    var BASE64_MAP = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";
    function resolveYamlBinary(data) {
      if (data === null)
        return false;
      var code, idx, bitlen = 0, max = data.length, map = BASE64_MAP;
      for (idx = 0; idx < max; idx++) {
        code = map.indexOf(data.charAt(idx));
        if (code > 64)
          continue;
        if (code < 0)
          return false;
        bitlen += 6;
      }
      return bitlen % 8 === 0;
    }
    function constructYamlBinary(data) {
      var idx, tailbits, input = data.replace(/[\r\n=]/g, ""), max = input.length, map = BASE64_MAP, bits = 0, result = [];
      for (idx = 0; idx < max; idx++) {
        if (idx % 4 === 0 && idx) {
          result.push(bits >> 16 & 255);
          result.push(bits >> 8 & 255);
          result.push(bits & 255);
        }
        bits = bits << 6 | map.indexOf(input.charAt(idx));
      }
      tailbits = max % 4 * 6;
      if (tailbits === 0) {
        result.push(bits >> 16 & 255);
        result.push(bits >> 8 & 255);
        result.push(bits & 255);
      } else if (tailbits === 18) {
        result.push(bits >> 10 & 255);
        result.push(bits >> 2 & 255);
      } else if (tailbits === 12) {
        result.push(bits >> 4 & 255);
      }
      return new Uint8Array(result);
    }
    function representYamlBinary(object) {
      var result = "", bits = 0, idx, tail, max = object.length, map = BASE64_MAP;
      for (idx = 0; idx < max; idx++) {
        if (idx % 3 === 0 && idx) {
          result += map[bits >> 18 & 63];
          result += map[bits >> 12 & 63];
          result += map[bits >> 6 & 63];
          result += map[bits & 63];
        }
        bits = (bits << 8) + object[idx];
      }
      tail = max % 3;
      if (tail === 0) {
        result += map[bits >> 18 & 63];
        result += map[bits >> 12 & 63];
        result += map[bits >> 6 & 63];
        result += map[bits & 63];
      } else if (tail === 2) {
        result += map[bits >> 10 & 63];
        result += map[bits >> 4 & 63];
        result += map[bits << 2 & 63];
        result += map[64];
      } else if (tail === 1) {
        result += map[bits >> 2 & 63];
        result += map[bits << 4 & 63];
        result += map[64];
        result += map[64];
      }
      return result;
    }
    function isBinary(obj) {
      return Object.prototype.toString.call(obj) === "[object Uint8Array]";
    }
    module2.exports = new Type("tag:yaml.org,2002:binary", {
      kind: "scalar",
      resolve: resolveYamlBinary,
      construct: constructYamlBinary,
      predicate: isBinary,
      represent: representYamlBinary
    });
  }
});

// node_modules/js-yaml/lib/type/omap.js
var require_omap = __commonJS({
  "node_modules/js-yaml/lib/type/omap.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    var _hasOwnProperty = Object.prototype.hasOwnProperty;
    var _toString = Object.prototype.toString;
    function resolveYamlOmap(data) {
      if (data === null)
        return true;
      var objectKeys = [], index, length, pair, pairKey, pairHasKey, object = data;
      for (index = 0, length = object.length; index < length; index += 1) {
        pair = object[index];
        pairHasKey = false;
        if (_toString.call(pair) !== "[object Object]")
          return false;
        for (pairKey in pair) {
          if (_hasOwnProperty.call(pair, pairKey)) {
            if (!pairHasKey)
              pairHasKey = true;
            else
              return false;
          }
        }
        if (!pairHasKey)
          return false;
        if (objectKeys.indexOf(pairKey) === -1)
          objectKeys.push(pairKey);
        else
          return false;
      }
      return true;
    }
    function constructYamlOmap(data) {
      return data !== null ? data : [];
    }
    module2.exports = new Type("tag:yaml.org,2002:omap", {
      kind: "sequence",
      resolve: resolveYamlOmap,
      construct: constructYamlOmap
    });
  }
});

// node_modules/js-yaml/lib/type/pairs.js
var require_pairs = __commonJS({
  "node_modules/js-yaml/lib/type/pairs.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    var _toString = Object.prototype.toString;
    function resolveYamlPairs(data) {
      if (data === null)
        return true;
      var index, length, pair, keys, result, object = data;
      result = new Array(object.length);
      for (index = 0, length = object.length; index < length; index += 1) {
        pair = object[index];
        if (_toString.call(pair) !== "[object Object]")
          return false;
        keys = Object.keys(pair);
        if (keys.length !== 1)
          return false;
        result[index] = [keys[0], pair[keys[0]]];
      }
      return true;
    }
    function constructYamlPairs(data) {
      if (data === null)
        return [];
      var index, length, pair, keys, result, object = data;
      result = new Array(object.length);
      for (index = 0, length = object.length; index < length; index += 1) {
        pair = object[index];
        keys = Object.keys(pair);
        result[index] = [keys[0], pair[keys[0]]];
      }
      return result;
    }
    module2.exports = new Type("tag:yaml.org,2002:pairs", {
      kind: "sequence",
      resolve: resolveYamlPairs,
      construct: constructYamlPairs
    });
  }
});

// node_modules/js-yaml/lib/type/set.js
var require_set = __commonJS({
  "node_modules/js-yaml/lib/type/set.js"(exports2, module2) {
    "use strict";
    var Type = require_type();
    var _hasOwnProperty = Object.prototype.hasOwnProperty;
    function resolveYamlSet(data) {
      if (data === null)
        return true;
      var key, object = data;
      for (key in object) {
        if (_hasOwnProperty.call(object, key)) {
          if (object[key] !== null)
            return false;
        }
      }
      return true;
    }
    function constructYamlSet(data) {
      return data !== null ? data : {};
    }
    module2.exports = new Type("tag:yaml.org,2002:set", {
      kind: "mapping",
      resolve: resolveYamlSet,
      construct: constructYamlSet
    });
  }
});

// node_modules/js-yaml/lib/schema/default.js
var require_default = __commonJS({
  "node_modules/js-yaml/lib/schema/default.js"(exports2, module2) {
    "use strict";
    module2.exports = require_core2().extend({
      implicit: [
        require_timestamp(),
        require_merge()
      ],
      explicit: [
        require_binary(),
        require_omap(),
        require_pairs(),
        require_set()
      ]
    });
  }
});

// node_modules/js-yaml/lib/loader.js
var require_loader = __commonJS({
  "node_modules/js-yaml/lib/loader.js"(exports2, module2) {
    "use strict";
    var common = require_common();
    var YAMLException = require_exception();
    var makeSnippet = require_snippet();
    var DEFAULT_SCHEMA = require_default();
    var _hasOwnProperty = Object.prototype.hasOwnProperty;
    var CONTEXT_FLOW_IN = 1;
    var CONTEXT_FLOW_OUT = 2;
    var CONTEXT_BLOCK_IN = 3;
    var CONTEXT_BLOCK_OUT = 4;
    var CHOMPING_CLIP = 1;
    var CHOMPING_STRIP = 2;
    var CHOMPING_KEEP = 3;
    var PATTERN_NON_PRINTABLE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
    var PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
    var PATTERN_FLOW_INDICATORS = /[,\[\]\{\}]/;
    var PATTERN_TAG_HANDLE = /^(?:!|!!|![a-z\-]+!)$/i;
    var PATTERN_TAG_URI = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
    function _class(obj) {
      return Object.prototype.toString.call(obj);
    }
    function is_EOL(c) {
      return c === 10 || c === 13;
    }
    function is_WHITE_SPACE(c) {
      return c === 9 || c === 32;
    }
    function is_WS_OR_EOL(c) {
      return c === 9 || c === 32 || c === 10 || c === 13;
    }
    function is_FLOW_INDICATOR(c) {
      return c === 44 || c === 91 || c === 93 || c === 123 || c === 125;
    }
    function fromHexCode(c) {
      var lc;
      if (48 <= c && c <= 57) {
        return c - 48;
      }
      lc = c | 32;
      if (97 <= lc && lc <= 102) {
        return lc - 97 + 10;
      }
      return -1;
    }
    function escapedHexLen(c) {
      if (c === 120) {
        return 2;
      }
      if (c === 117) {
        return 4;
      }
      if (c === 85) {
        return 8;
      }
      return 0;
    }
    function fromDecimalCode(c) {
      if (48 <= c && c <= 57) {
        return c - 48;
      }
      return -1;
    }
    function simpleEscapeSequence(c) {
      return c === 48 ? "\0" : c === 97 ? "\x07" : c === 98 ? "\b" : c === 116 ? "	" : c === 9 ? "	" : c === 110 ? "\n" : c === 118 ? "\v" : c === 102 ? "\f" : c === 114 ? "\r" : c === 101 ? "\x1B" : c === 32 ? " " : c === 34 ? '"' : c === 47 ? "/" : c === 92 ? "\\" : c === 78 ? "\x85" : c === 95 ? "\xA0" : c === 76 ? "\u2028" : c === 80 ? "\u2029" : "";
    }
    function charFromCodepoint(c) {
      if (c <= 65535) {
        return String.fromCharCode(c);
      }
      return String.fromCharCode(
        (c - 65536 >> 10) + 55296,
        (c - 65536 & 1023) + 56320
      );
    }
    var simpleEscapeCheck = new Array(256);
    var simpleEscapeMap = new Array(256);
    for (i = 0; i < 256; i++) {
      simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
      simpleEscapeMap[i] = simpleEscapeSequence(i);
    }
    var i;
    function State(input, options) {
      this.input = input;
      this.filename = options["filename"] || null;
      this.schema = options["schema"] || DEFAULT_SCHEMA;
      this.onWarning = options["onWarning"] || null;
      this.legacy = options["legacy"] || false;
      this.json = options["json"] || false;
      this.listener = options["listener"] || null;
      this.implicitTypes = this.schema.compiledImplicit;
      this.typeMap = this.schema.compiledTypeMap;
      this.length = input.length;
      this.position = 0;
      this.line = 0;
      this.lineStart = 0;
      this.lineIndent = 0;
      this.firstTabInLine = -1;
      this.documents = [];
    }
    function generateError(state, message) {
      var mark = {
        name: state.filename,
        buffer: state.input.slice(0, -1),
        // omit trailing \0
        position: state.position,
        line: state.line,
        column: state.position - state.lineStart
      };
      mark.snippet = makeSnippet(mark);
      return new YAMLException(message, mark);
    }
    function throwError(state, message) {
      throw generateError(state, message);
    }
    function throwWarning(state, message) {
      if (state.onWarning) {
        state.onWarning.call(null, generateError(state, message));
      }
    }
    var directiveHandlers = {
      YAML: function handleYamlDirective(state, name, args) {
        var match, major, minor;
        if (state.version !== null) {
          throwError(state, "duplication of %YAML directive");
        }
        if (args.length !== 1) {
          throwError(state, "YAML directive accepts exactly one argument");
        }
        match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);
        if (match === null) {
          throwError(state, "ill-formed argument of the YAML directive");
        }
        major = parseInt(match[1], 10);
        minor = parseInt(match[2], 10);
        if (major !== 1) {
          throwError(state, "unacceptable YAML version of the document");
        }
        state.version = args[0];
        state.checkLineBreaks = minor < 2;
        if (minor !== 1 && minor !== 2) {
          throwWarning(state, "unsupported YAML version of the document");
        }
      },
      TAG: function handleTagDirective(state, name, args) {
        var handle, prefix;
        if (args.length !== 2) {
          throwError(state, "TAG directive accepts exactly two arguments");
        }
        handle = args[0];
        prefix = args[1];
        if (!PATTERN_TAG_HANDLE.test(handle)) {
          throwError(state, "ill-formed tag handle (first argument) of the TAG directive");
        }
        if (_hasOwnProperty.call(state.tagMap, handle)) {
          throwError(state, 'there is a previously declared suffix for "' + handle + '" tag handle');
        }
        if (!PATTERN_TAG_URI.test(prefix)) {
          throwError(state, "ill-formed tag prefix (second argument) of the TAG directive");
        }
        try {
          prefix = decodeURIComponent(prefix);
        } catch (err) {
          throwError(state, "tag prefix is malformed: " + prefix);
        }
        state.tagMap[handle] = prefix;
      }
    };
    function captureSegment(state, start, end, checkJson) {
      var _position, _length, _character, _result;
      if (start < end) {
        _result = state.input.slice(start, end);
        if (checkJson) {
          for (_position = 0, _length = _result.length; _position < _length; _position += 1) {
            _character = _result.charCodeAt(_position);
            if (!(_character === 9 || 32 <= _character && _character <= 1114111)) {
              throwError(state, "expected valid JSON character");
            }
          }
        } else if (PATTERN_NON_PRINTABLE.test(_result)) {
          throwError(state, "the stream contains non-printable characters");
        }
        state.result += _result;
      }
    }
    function mergeMappings(state, destination, source, overridableKeys) {
      var sourceKeys, key, index, quantity;
      if (!common.isObject(source)) {
        throwError(state, "cannot merge mappings; the provided source object is unacceptable");
      }
      sourceKeys = Object.keys(source);
      for (index = 0, quantity = sourceKeys.length; index < quantity; index += 1) {
        key = sourceKeys[index];
        if (!_hasOwnProperty.call(destination, key)) {
          destination[key] = source[key];
          overridableKeys[key] = true;
        }
      }
    }
    function storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, startLine, startLineStart, startPos) {
      var index, quantity;
      if (Array.isArray(keyNode)) {
        keyNode = Array.prototype.slice.call(keyNode);
        for (index = 0, quantity = keyNode.length; index < quantity; index += 1) {
          if (Array.isArray(keyNode[index])) {
            throwError(state, "nested arrays are not supported inside keys");
          }
          if (typeof keyNode === "object" && _class(keyNode[index]) === "[object Object]") {
            keyNode[index] = "[object Object]";
          }
        }
      }
      if (typeof keyNode === "object" && _class(keyNode) === "[object Object]") {
        keyNode = "[object Object]";
      }
      keyNode = String(keyNode);
      if (_result === null) {
        _result = {};
      }
      if (keyTag === "tag:yaml.org,2002:merge") {
        if (Array.isArray(valueNode)) {
          for (index = 0, quantity = valueNode.length; index < quantity; index += 1) {
            mergeMappings(state, _result, valueNode[index], overridableKeys);
          }
        } else {
          mergeMappings(state, _result, valueNode, overridableKeys);
        }
      } else {
        if (!state.json && !_hasOwnProperty.call(overridableKeys, keyNode) && _hasOwnProperty.call(_result, keyNode)) {
          state.line = startLine || state.line;
          state.lineStart = startLineStart || state.lineStart;
          state.position = startPos || state.position;
          throwError(state, "duplicated mapping key");
        }
        if (keyNode === "__proto__") {
          Object.defineProperty(_result, keyNode, {
            configurable: true,
            enumerable: true,
            writable: true,
            value: valueNode
          });
        } else {
          _result[keyNode] = valueNode;
        }
        delete overridableKeys[keyNode];
      }
      return _result;
    }
    function readLineBreak(state) {
      var ch;
      ch = state.input.charCodeAt(state.position);
      if (ch === 10) {
        state.position++;
      } else if (ch === 13) {
        state.position++;
        if (state.input.charCodeAt(state.position) === 10) {
          state.position++;
        }
      } else {
        throwError(state, "a line break is expected");
      }
      state.line += 1;
      state.lineStart = state.position;
      state.firstTabInLine = -1;
    }
    function skipSeparationSpace(state, allowComments, checkIndent) {
      var lineBreaks = 0, ch = state.input.charCodeAt(state.position);
      while (ch !== 0) {
        while (is_WHITE_SPACE(ch)) {
          if (ch === 9 && state.firstTabInLine === -1) {
            state.firstTabInLine = state.position;
          }
          ch = state.input.charCodeAt(++state.position);
        }
        if (allowComments && ch === 35) {
          do {
            ch = state.input.charCodeAt(++state.position);
          } while (ch !== 10 && ch !== 13 && ch !== 0);
        }
        if (is_EOL(ch)) {
          readLineBreak(state);
          ch = state.input.charCodeAt(state.position);
          lineBreaks++;
          state.lineIndent = 0;
          while (ch === 32) {
            state.lineIndent++;
            ch = state.input.charCodeAt(++state.position);
          }
        } else {
          break;
        }
      }
      if (checkIndent !== -1 && lineBreaks !== 0 && state.lineIndent < checkIndent) {
        throwWarning(state, "deficient indentation");
      }
      return lineBreaks;
    }
    function testDocumentSeparator(state) {
      var _position = state.position, ch;
      ch = state.input.charCodeAt(_position);
      if ((ch === 45 || ch === 46) && ch === state.input.charCodeAt(_position + 1) && ch === state.input.charCodeAt(_position + 2)) {
        _position += 3;
        ch = state.input.charCodeAt(_position);
        if (ch === 0 || is_WS_OR_EOL(ch)) {
          return true;
        }
      }
      return false;
    }
    function writeFoldedLines(state, count) {
      if (count === 1) {
        state.result += " ";
      } else if (count > 1) {
        state.result += common.repeat("\n", count - 1);
      }
    }
    function readPlainScalar(state, nodeIndent, withinFlowCollection) {
      var preceding, following, captureStart, captureEnd, hasPendingContent, _line, _lineStart, _lineIndent, _kind = state.kind, _result = state.result, ch;
      ch = state.input.charCodeAt(state.position);
      if (is_WS_OR_EOL(ch) || is_FLOW_INDICATOR(ch) || ch === 35 || ch === 38 || ch === 42 || ch === 33 || ch === 124 || ch === 62 || ch === 39 || ch === 34 || ch === 37 || ch === 64 || ch === 96) {
        return false;
      }
      if (ch === 63 || ch === 45) {
        following = state.input.charCodeAt(state.position + 1);
        if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
          return false;
        }
      }
      state.kind = "scalar";
      state.result = "";
      captureStart = captureEnd = state.position;
      hasPendingContent = false;
      while (ch !== 0) {
        if (ch === 58) {
          following = state.input.charCodeAt(state.position + 1);
          if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
            break;
          }
        } else if (ch === 35) {
          preceding = state.input.charCodeAt(state.position - 1);
          if (is_WS_OR_EOL(preceding)) {
            break;
          }
        } else if (state.position === state.lineStart && testDocumentSeparator(state) || withinFlowCollection && is_FLOW_INDICATOR(ch)) {
          break;
        } else if (is_EOL(ch)) {
          _line = state.line;
          _lineStart = state.lineStart;
          _lineIndent = state.lineIndent;
          skipSeparationSpace(state, false, -1);
          if (state.lineIndent >= nodeIndent) {
            hasPendingContent = true;
            ch = state.input.charCodeAt(state.position);
            continue;
          } else {
            state.position = captureEnd;
            state.line = _line;
            state.lineStart = _lineStart;
            state.lineIndent = _lineIndent;
            break;
          }
        }
        if (hasPendingContent) {
          captureSegment(state, captureStart, captureEnd, false);
          writeFoldedLines(state, state.line - _line);
          captureStart = captureEnd = state.position;
          hasPendingContent = false;
        }
        if (!is_WHITE_SPACE(ch)) {
          captureEnd = state.position + 1;
        }
        ch = state.input.charCodeAt(++state.position);
      }
      captureSegment(state, captureStart, captureEnd, false);
      if (state.result) {
        return true;
      }
      state.kind = _kind;
      state.result = _result;
      return false;
    }
    function readSingleQuotedScalar(state, nodeIndent) {
      var ch, captureStart, captureEnd;
      ch = state.input.charCodeAt(state.position);
      if (ch !== 39) {
        return false;
      }
      state.kind = "scalar";
      state.result = "";
      state.position++;
      captureStart = captureEnd = state.position;
      while ((ch = state.input.charCodeAt(state.position)) !== 0) {
        if (ch === 39) {
          captureSegment(state, captureStart, state.position, true);
          ch = state.input.charCodeAt(++state.position);
          if (ch === 39) {
            captureStart = state.position;
            state.position++;
            captureEnd = state.position;
          } else {
            return true;
          }
        } else if (is_EOL(ch)) {
          captureSegment(state, captureStart, captureEnd, true);
          writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
          captureStart = captureEnd = state.position;
        } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
          throwError(state, "unexpected end of the document within a single quoted scalar");
        } else {
          state.position++;
          captureEnd = state.position;
        }
      }
      throwError(state, "unexpected end of the stream within a single quoted scalar");
    }
    function readDoubleQuotedScalar(state, nodeIndent) {
      var captureStart, captureEnd, hexLength, hexResult, tmp, ch;
      ch = state.input.charCodeAt(state.position);
      if (ch !== 34) {
        return false;
      }
      state.kind = "scalar";
      state.result = "";
      state.position++;
      captureStart = captureEnd = state.position;
      while ((ch = state.input.charCodeAt(state.position)) !== 0) {
        if (ch === 34) {
          captureSegment(state, captureStart, state.position, true);
          state.position++;
          return true;
        } else if (ch === 92) {
          captureSegment(state, captureStart, state.position, true);
          ch = state.input.charCodeAt(++state.position);
          if (is_EOL(ch)) {
            skipSeparationSpace(state, false, nodeIndent);
          } else if (ch < 256 && simpleEscapeCheck[ch]) {
            state.result += simpleEscapeMap[ch];
            state.position++;
          } else if ((tmp = escapedHexLen(ch)) > 0) {
            hexLength = tmp;
            hexResult = 0;
            for (; hexLength > 0; hexLength--) {
              ch = state.input.charCodeAt(++state.position);
              if ((tmp = fromHexCode(ch)) >= 0) {
                hexResult = (hexResult << 4) + tmp;
              } else {
                throwError(state, "expected hexadecimal character");
              }
            }
            state.result += charFromCodepoint(hexResult);
            state.position++;
          } else {
            throwError(state, "unknown escape sequence");
          }
          captureStart = captureEnd = state.position;
        } else if (is_EOL(ch)) {
          captureSegment(state, captureStart, captureEnd, true);
          writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
          captureStart = captureEnd = state.position;
        } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
          throwError(state, "unexpected end of the document within a double quoted scalar");
        } else {
          state.position++;
          captureEnd = state.position;
        }
      }
      throwError(state, "unexpected end of the stream within a double quoted scalar");
    }
    function readFlowCollection(state, nodeIndent) {
      var readNext = true, _line, _lineStart, _pos, _tag = state.tag, _result, _anchor = state.anchor, following, terminator, isPair, isExplicitPair, isMapping, overridableKeys = /* @__PURE__ */ Object.create(null), keyNode, keyTag, valueNode, ch;
      ch = state.input.charCodeAt(state.position);
      if (ch === 91) {
        terminator = 93;
        isMapping = false;
        _result = [];
      } else if (ch === 123) {
        terminator = 125;
        isMapping = true;
        _result = {};
      } else {
        return false;
      }
      if (state.anchor !== null) {
        state.anchorMap[state.anchor] = _result;
      }
      ch = state.input.charCodeAt(++state.position);
      while (ch !== 0) {
        skipSeparationSpace(state, true, nodeIndent);
        ch = state.input.charCodeAt(state.position);
        if (ch === terminator) {
          state.position++;
          state.tag = _tag;
          state.anchor = _anchor;
          state.kind = isMapping ? "mapping" : "sequence";
          state.result = _result;
          return true;
        } else if (!readNext) {
          throwError(state, "missed comma between flow collection entries");
        } else if (ch === 44) {
          throwError(state, "expected the node content, but found ','");
        }
        keyTag = keyNode = valueNode = null;
        isPair = isExplicitPair = false;
        if (ch === 63) {
          following = state.input.charCodeAt(state.position + 1);
          if (is_WS_OR_EOL(following)) {
            isPair = isExplicitPair = true;
            state.position++;
            skipSeparationSpace(state, true, nodeIndent);
          }
        }
        _line = state.line;
        _lineStart = state.lineStart;
        _pos = state.position;
        composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
        keyTag = state.tag;
        keyNode = state.result;
        skipSeparationSpace(state, true, nodeIndent);
        ch = state.input.charCodeAt(state.position);
        if ((isExplicitPair || state.line === _line) && ch === 58) {
          isPair = true;
          ch = state.input.charCodeAt(++state.position);
          skipSeparationSpace(state, true, nodeIndent);
          composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
          valueNode = state.result;
        }
        if (isMapping) {
          storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos);
        } else if (isPair) {
          _result.push(storeMappingPair(state, null, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos));
        } else {
          _result.push(keyNode);
        }
        skipSeparationSpace(state, true, nodeIndent);
        ch = state.input.charCodeAt(state.position);
        if (ch === 44) {
          readNext = true;
          ch = state.input.charCodeAt(++state.position);
        } else {
          readNext = false;
        }
      }
      throwError(state, "unexpected end of the stream within a flow collection");
    }
    function readBlockScalar(state, nodeIndent) {
      var captureStart, folding, chomping = CHOMPING_CLIP, didReadContent = false, detectedIndent = false, textIndent = nodeIndent, emptyLines = 0, atMoreIndented = false, tmp, ch;
      ch = state.input.charCodeAt(state.position);
      if (ch === 124) {
        folding = false;
      } else if (ch === 62) {
        folding = true;
      } else {
        return false;
      }
      state.kind = "scalar";
      state.result = "";
      while (ch !== 0) {
        ch = state.input.charCodeAt(++state.position);
        if (ch === 43 || ch === 45) {
          if (CHOMPING_CLIP === chomping) {
            chomping = ch === 43 ? CHOMPING_KEEP : CHOMPING_STRIP;
          } else {
            throwError(state, "repeat of a chomping mode identifier");
          }
        } else if ((tmp = fromDecimalCode(ch)) >= 0) {
          if (tmp === 0) {
            throwError(state, "bad explicit indentation width of a block scalar; it cannot be less than one");
          } else if (!detectedIndent) {
            textIndent = nodeIndent + tmp - 1;
            detectedIndent = true;
          } else {
            throwError(state, "repeat of an indentation width identifier");
          }
        } else {
          break;
        }
      }
      if (is_WHITE_SPACE(ch)) {
        do {
          ch = state.input.charCodeAt(++state.position);
        } while (is_WHITE_SPACE(ch));
        if (ch === 35) {
          do {
            ch = state.input.charCodeAt(++state.position);
          } while (!is_EOL(ch) && ch !== 0);
        }
      }
      while (ch !== 0) {
        readLineBreak(state);
        state.lineIndent = 0;
        ch = state.input.charCodeAt(state.position);
        while ((!detectedIndent || state.lineIndent < textIndent) && ch === 32) {
          state.lineIndent++;
          ch = state.input.charCodeAt(++state.position);
        }
        if (!detectedIndent && state.lineIndent > textIndent) {
          textIndent = state.lineIndent;
        }
        if (is_EOL(ch)) {
          emptyLines++;
          continue;
        }
        if (state.lineIndent < textIndent) {
          if (chomping === CHOMPING_KEEP) {
            state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
          } else if (chomping === CHOMPING_CLIP) {
            if (didReadContent) {
              state.result += "\n";
            }
          }
          break;
        }
        if (folding) {
          if (is_WHITE_SPACE(ch)) {
            atMoreIndented = true;
            state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
          } else if (atMoreIndented) {
            atMoreIndented = false;
            state.result += common.repeat("\n", emptyLines + 1);
          } else if (emptyLines === 0) {
            if (didReadContent) {
              state.result += " ";
            }
          } else {
            state.result += common.repeat("\n", emptyLines);
          }
        } else {
          state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
        }
        didReadContent = true;
        detectedIndent = true;
        emptyLines = 0;
        captureStart = state.position;
        while (!is_EOL(ch) && ch !== 0) {
          ch = state.input.charCodeAt(++state.position);
        }
        captureSegment(state, captureStart, state.position, false);
      }
      return true;
    }
    function readBlockSequence(state, nodeIndent) {
      var _line, _tag = state.tag, _anchor = state.anchor, _result = [], following, detected = false, ch;
      if (state.firstTabInLine !== -1)
        return false;
      if (state.anchor !== null) {
        state.anchorMap[state.anchor] = _result;
      }
      ch = state.input.charCodeAt(state.position);
      while (ch !== 0) {
        if (state.firstTabInLine !== -1) {
          state.position = state.firstTabInLine;
          throwError(state, "tab characters must not be used in indentation");
        }
        if (ch !== 45) {
          break;
        }
        following = state.input.charCodeAt(state.position + 1);
        if (!is_WS_OR_EOL(following)) {
          break;
        }
        detected = true;
        state.position++;
        if (skipSeparationSpace(state, true, -1)) {
          if (state.lineIndent <= nodeIndent) {
            _result.push(null);
            ch = state.input.charCodeAt(state.position);
            continue;
          }
        }
        _line = state.line;
        composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
        _result.push(state.result);
        skipSeparationSpace(state, true, -1);
        ch = state.input.charCodeAt(state.position);
        if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
          throwError(state, "bad indentation of a sequence entry");
        } else if (state.lineIndent < nodeIndent) {
          break;
        }
      }
      if (detected) {
        state.tag = _tag;
        state.anchor = _anchor;
        state.kind = "sequence";
        state.result = _result;
        return true;
      }
      return false;
    }
    function readBlockMapping(state, nodeIndent, flowIndent) {
      var following, allowCompact, _line, _keyLine, _keyLineStart, _keyPos, _tag = state.tag, _anchor = state.anchor, _result = {}, overridableKeys = /* @__PURE__ */ Object.create(null), keyTag = null, keyNode = null, valueNode = null, atExplicitKey = false, detected = false, ch;
      if (state.firstTabInLine !== -1)
        return false;
      if (state.anchor !== null) {
        state.anchorMap[state.anchor] = _result;
      }
      ch = state.input.charCodeAt(state.position);
      while (ch !== 0) {
        if (!atExplicitKey && state.firstTabInLine !== -1) {
          state.position = state.firstTabInLine;
          throwError(state, "tab characters must not be used in indentation");
        }
        following = state.input.charCodeAt(state.position + 1);
        _line = state.line;
        if ((ch === 63 || ch === 58) && is_WS_OR_EOL(following)) {
          if (ch === 63) {
            if (atExplicitKey) {
              storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
              keyTag = keyNode = valueNode = null;
            }
            detected = true;
            atExplicitKey = true;
            allowCompact = true;
          } else if (atExplicitKey) {
            atExplicitKey = false;
            allowCompact = true;
          } else {
            throwError(state, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line");
          }
          state.position += 1;
          ch = following;
        } else {
          _keyLine = state.line;
          _keyLineStart = state.lineStart;
          _keyPos = state.position;
          if (!composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {
            break;
          }
          if (state.line === _line) {
            ch = state.input.charCodeAt(state.position);
            while (is_WHITE_SPACE(ch)) {
              ch = state.input.charCodeAt(++state.position);
            }
            if (ch === 58) {
              ch = state.input.charCodeAt(++state.position);
              if (!is_WS_OR_EOL(ch)) {
                throwError(state, "a whitespace character is expected after the key-value separator within a block mapping");
              }
              if (atExplicitKey) {
                storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
                keyTag = keyNode = valueNode = null;
              }
              detected = true;
              atExplicitKey = false;
              allowCompact = false;
              keyTag = state.tag;
              keyNode = state.result;
            } else if (detected) {
              throwError(state, "can not read an implicit mapping pair; a colon is missed");
            } else {
              state.tag = _tag;
              state.anchor = _anchor;
              return true;
            }
          } else if (detected) {
            throwError(state, "can not read a block mapping entry; a multiline key may not be an implicit key");
          } else {
            state.tag = _tag;
            state.anchor = _anchor;
            return true;
          }
        }
        if (state.line === _line || state.lineIndent > nodeIndent) {
          if (atExplicitKey) {
            _keyLine = state.line;
            _keyLineStart = state.lineStart;
            _keyPos = state.position;
          }
          if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
            if (atExplicitKey) {
              keyNode = state.result;
            } else {
              valueNode = state.result;
            }
          }
          if (!atExplicitKey) {
            storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _keyLine, _keyLineStart, _keyPos);
            keyTag = keyNode = valueNode = null;
          }
          skipSeparationSpace(state, true, -1);
          ch = state.input.charCodeAt(state.position);
        }
        if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
          throwError(state, "bad indentation of a mapping entry");
        } else if (state.lineIndent < nodeIndent) {
          break;
        }
      }
      if (atExplicitKey) {
        storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
      }
      if (detected) {
        state.tag = _tag;
        state.anchor = _anchor;
        state.kind = "mapping";
        state.result = _result;
      }
      return detected;
    }
    function readTagProperty(state) {
      var _position, isVerbatim = false, isNamed = false, tagHandle, tagName, ch;
      ch = state.input.charCodeAt(state.position);
      if (ch !== 33)
        return false;
      if (state.tag !== null) {
        throwError(state, "duplication of a tag property");
      }
      ch = state.input.charCodeAt(++state.position);
      if (ch === 60) {
        isVerbatim = true;
        ch = state.input.charCodeAt(++state.position);
      } else if (ch === 33) {
        isNamed = true;
        tagHandle = "!!";
        ch = state.input.charCodeAt(++state.position);
      } else {
        tagHandle = "!";
      }
      _position = state.position;
      if (isVerbatim) {
        do {
          ch = state.input.charCodeAt(++state.position);
        } while (ch !== 0 && ch !== 62);
        if (state.position < state.length) {
          tagName = state.input.slice(_position, state.position);
          ch = state.input.charCodeAt(++state.position);
        } else {
          throwError(state, "unexpected end of the stream within a verbatim tag");
        }
      } else {
        while (ch !== 0 && !is_WS_OR_EOL(ch)) {
          if (ch === 33) {
            if (!isNamed) {
              tagHandle = state.input.slice(_position - 1, state.position + 1);
              if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
                throwError(state, "named tag handle cannot contain such characters");
              }
              isNamed = true;
              _position = state.position + 1;
            } else {
              throwError(state, "tag suffix cannot contain exclamation marks");
            }
          }
          ch = state.input.charCodeAt(++state.position);
        }
        tagName = state.input.slice(_position, state.position);
        if (PATTERN_FLOW_INDICATORS.test(tagName)) {
          throwError(state, "tag suffix cannot contain flow indicator characters");
        }
      }
      if (tagName && !PATTERN_TAG_URI.test(tagName)) {
        throwError(state, "tag name cannot contain such characters: " + tagName);
      }
      try {
        tagName = decodeURIComponent(tagName);
      } catch (err) {
        throwError(state, "tag name is malformed: " + tagName);
      }
      if (isVerbatim) {
        state.tag = tagName;
      } else if (_hasOwnProperty.call(state.tagMap, tagHandle)) {
        state.tag = state.tagMap[tagHandle] + tagName;
      } else if (tagHandle === "!") {
        state.tag = "!" + tagName;
      } else if (tagHandle === "!!") {
        state.tag = "tag:yaml.org,2002:" + tagName;
      } else {
        throwError(state, 'undeclared tag handle "' + tagHandle + '"');
      }
      return true;
    }
    function readAnchorProperty(state) {
      var _position, ch;
      ch = state.input.charCodeAt(state.position);
      if (ch !== 38)
        return false;
      if (state.anchor !== null) {
        throwError(state, "duplication of an anchor property");
      }
      ch = state.input.charCodeAt(++state.position);
      _position = state.position;
      while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      if (state.position === _position) {
        throwError(state, "name of an anchor node must contain at least one character");
      }
      state.anchor = state.input.slice(_position, state.position);
      return true;
    }
    function readAlias(state) {
      var _position, alias, ch;
      ch = state.input.charCodeAt(state.position);
      if (ch !== 42)
        return false;
      ch = state.input.charCodeAt(++state.position);
      _position = state.position;
      while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      if (state.position === _position) {
        throwError(state, "name of an alias node must contain at least one character");
      }
      alias = state.input.slice(_position, state.position);
      if (!_hasOwnProperty.call(state.anchorMap, alias)) {
        throwError(state, 'unidentified alias "' + alias + '"');
      }
      state.result = state.anchorMap[alias];
      skipSeparationSpace(state, true, -1);
      return true;
    }
    function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
      var allowBlockStyles, allowBlockScalars, allowBlockCollections, indentStatus = 1, atNewLine = false, hasContent = false, typeIndex, typeQuantity, typeList, type, flowIndent, blockIndent;
      if (state.listener !== null) {
        state.listener("open", state);
      }
      state.tag = null;
      state.anchor = null;
      state.kind = null;
      state.result = null;
      allowBlockStyles = allowBlockScalars = allowBlockCollections = CONTEXT_BLOCK_OUT === nodeContext || CONTEXT_BLOCK_IN === nodeContext;
      if (allowToSeek) {
        if (skipSeparationSpace(state, true, -1)) {
          atNewLine = true;
          if (state.lineIndent > parentIndent) {
            indentStatus = 1;
          } else if (state.lineIndent === parentIndent) {
            indentStatus = 0;
          } else if (state.lineIndent < parentIndent) {
            indentStatus = -1;
          }
        }
      }
      if (indentStatus === 1) {
        while (readTagProperty(state) || readAnchorProperty(state)) {
          if (skipSeparationSpace(state, true, -1)) {
            atNewLine = true;
            allowBlockCollections = allowBlockStyles;
            if (state.lineIndent > parentIndent) {
              indentStatus = 1;
            } else if (state.lineIndent === parentIndent) {
              indentStatus = 0;
            } else if (state.lineIndent < parentIndent) {
              indentStatus = -1;
            }
          } else {
            allowBlockCollections = false;
          }
        }
      }
      if (allowBlockCollections) {
        allowBlockCollections = atNewLine || allowCompact;
      }
      if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
        if (CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext) {
          flowIndent = parentIndent;
        } else {
          flowIndent = parentIndent + 1;
        }
        blockIndent = state.position - state.lineStart;
        if (indentStatus === 1) {
          if (allowBlockCollections && (readBlockSequence(state, blockIndent) || readBlockMapping(state, blockIndent, flowIndent)) || readFlowCollection(state, flowIndent)) {
            hasContent = true;
          } else {
            if (allowBlockScalars && readBlockScalar(state, flowIndent) || readSingleQuotedScalar(state, flowIndent) || readDoubleQuotedScalar(state, flowIndent)) {
              hasContent = true;
            } else if (readAlias(state)) {
              hasContent = true;
              if (state.tag !== null || state.anchor !== null) {
                throwError(state, "alias node should not have any properties");
              }
            } else if (readPlainScalar(state, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
              hasContent = true;
              if (state.tag === null) {
                state.tag = "?";
              }
            }
            if (state.anchor !== null) {
              state.anchorMap[state.anchor] = state.result;
            }
          }
        } else if (indentStatus === 0) {
          hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
        }
      }
      if (state.tag === null) {
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
      } else if (state.tag === "?") {
        if (state.result !== null && state.kind !== "scalar") {
          throwError(state, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + state.kind + '"');
        }
        for (typeIndex = 0, typeQuantity = state.implicitTypes.length; typeIndex < typeQuantity; typeIndex += 1) {
          type = state.implicitTypes[typeIndex];
          if (type.resolve(state.result)) {
            state.result = type.construct(state.result);
            state.tag = type.tag;
            if (state.anchor !== null) {
              state.anchorMap[state.anchor] = state.result;
            }
            break;
          }
        }
      } else if (state.tag !== "!") {
        if (_hasOwnProperty.call(state.typeMap[state.kind || "fallback"], state.tag)) {
          type = state.typeMap[state.kind || "fallback"][state.tag];
        } else {
          type = null;
          typeList = state.typeMap.multi[state.kind || "fallback"];
          for (typeIndex = 0, typeQuantity = typeList.length; typeIndex < typeQuantity; typeIndex += 1) {
            if (state.tag.slice(0, typeList[typeIndex].tag.length) === typeList[typeIndex].tag) {
              type = typeList[typeIndex];
              break;
            }
          }
        }
        if (!type) {
          throwError(state, "unknown tag !<" + state.tag + ">");
        }
        if (state.result !== null && type.kind !== state.kind) {
          throwError(state, "unacceptable node kind for !<" + state.tag + '> tag; it should be "' + type.kind + '", not "' + state.kind + '"');
        }
        if (!type.resolve(state.result, state.tag)) {
          throwError(state, "cannot resolve a node with !<" + state.tag + "> explicit tag");
        } else {
          state.result = type.construct(state.result, state.tag);
          if (state.anchor !== null) {
            state.anchorMap[state.anchor] = state.result;
          }
        }
      }
      if (state.listener !== null) {
        state.listener("close", state);
      }
      return state.tag !== null || state.anchor !== null || hasContent;
    }
    function readDocument(state) {
      var documentStart = state.position, _position, directiveName, directiveArgs, hasDirectives = false, ch;
      state.version = null;
      state.checkLineBreaks = state.legacy;
      state.tagMap = /* @__PURE__ */ Object.create(null);
      state.anchorMap = /* @__PURE__ */ Object.create(null);
      while ((ch = state.input.charCodeAt(state.position)) !== 0) {
        skipSeparationSpace(state, true, -1);
        ch = state.input.charCodeAt(state.position);
        if (state.lineIndent > 0 || ch !== 37) {
          break;
        }
        hasDirectives = true;
        ch = state.input.charCodeAt(++state.position);
        _position = state.position;
        while (ch !== 0 && !is_WS_OR_EOL(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }
        directiveName = state.input.slice(_position, state.position);
        directiveArgs = [];
        if (directiveName.length < 1) {
          throwError(state, "directive name must not be less than one character in length");
        }
        while (ch !== 0) {
          while (is_WHITE_SPACE(ch)) {
            ch = state.input.charCodeAt(++state.position);
          }
          if (ch === 35) {
            do {
              ch = state.input.charCodeAt(++state.position);
            } while (ch !== 0 && !is_EOL(ch));
            break;
          }
          if (is_EOL(ch))
            break;
          _position = state.position;
          while (ch !== 0 && !is_WS_OR_EOL(ch)) {
            ch = state.input.charCodeAt(++state.position);
          }
          directiveArgs.push(state.input.slice(_position, state.position));
        }
        if (ch !== 0)
          readLineBreak(state);
        if (_hasOwnProperty.call(directiveHandlers, directiveName)) {
          directiveHandlers[directiveName](state, directiveName, directiveArgs);
        } else {
          throwWarning(state, 'unknown document directive "' + directiveName + '"');
        }
      }
      skipSeparationSpace(state, true, -1);
      if (state.lineIndent === 0 && state.input.charCodeAt(state.position) === 45 && state.input.charCodeAt(state.position + 1) === 45 && state.input.charCodeAt(state.position + 2) === 45) {
        state.position += 3;
        skipSeparationSpace(state, true, -1);
      } else if (hasDirectives) {
        throwError(state, "directives end mark is expected");
      }
      composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
      skipSeparationSpace(state, true, -1);
      if (state.checkLineBreaks && PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position))) {
        throwWarning(state, "non-ASCII line breaks are interpreted as content");
      }
      state.documents.push(state.result);
      if (state.position === state.lineStart && testDocumentSeparator(state)) {
        if (state.input.charCodeAt(state.position) === 46) {
          state.position += 3;
          skipSeparationSpace(state, true, -1);
        }
        return;
      }
      if (state.position < state.length - 1) {
        throwError(state, "end of the stream or a document separator is expected");
      } else {
        return;
      }
    }
    function loadDocuments(input, options) {
      input = String(input);
      options = options || {};
      if (input.length !== 0) {
        if (input.charCodeAt(input.length - 1) !== 10 && input.charCodeAt(input.length - 1) !== 13) {
          input += "\n";
        }
        if (input.charCodeAt(0) === 65279) {
          input = input.slice(1);
        }
      }
      var state = new State(input, options);
      var nullpos = input.indexOf("\0");
      if (nullpos !== -1) {
        state.position = nullpos;
        throwError(state, "null byte is not allowed in input");
      }
      state.input += "\0";
      while (state.input.charCodeAt(state.position) === 32) {
        state.lineIndent += 1;
        state.position += 1;
      }
      while (state.position < state.length - 1) {
        readDocument(state);
      }
      return state.documents;
    }
    function loadAll(input, iterator, options) {
      if (iterator !== null && typeof iterator === "object" && typeof options === "undefined") {
        options = iterator;
        iterator = null;
      }
      var documents = loadDocuments(input, options);
      if (typeof iterator !== "function") {
        return documents;
      }
      for (var index = 0, length = documents.length; index < length; index += 1) {
        iterator(documents[index]);
      }
    }
    function load(input, options) {
      var documents = loadDocuments(input, options);
      if (documents.length === 0) {
        return void 0;
      } else if (documents.length === 1) {
        return documents[0];
      }
      throw new YAMLException("expected a single document in the stream, but found more");
    }
    module2.exports.loadAll = loadAll;
    module2.exports.load = load;
  }
});

// node_modules/js-yaml/lib/dumper.js
var require_dumper = __commonJS({
  "node_modules/js-yaml/lib/dumper.js"(exports2, module2) {
    "use strict";
    var common = require_common();
    var YAMLException = require_exception();
    var DEFAULT_SCHEMA = require_default();
    var _toString = Object.prototype.toString;
    var _hasOwnProperty = Object.prototype.hasOwnProperty;
    var CHAR_BOM = 65279;
    var CHAR_TAB = 9;
    var CHAR_LINE_FEED = 10;
    var CHAR_CARRIAGE_RETURN = 13;
    var CHAR_SPACE = 32;
    var CHAR_EXCLAMATION = 33;
    var CHAR_DOUBLE_QUOTE = 34;
    var CHAR_SHARP = 35;
    var CHAR_PERCENT = 37;
    var CHAR_AMPERSAND = 38;
    var CHAR_SINGLE_QUOTE = 39;
    var CHAR_ASTERISK = 42;
    var CHAR_COMMA = 44;
    var CHAR_MINUS = 45;
    var CHAR_COLON = 58;
    var CHAR_EQUALS = 61;
    var CHAR_GREATER_THAN = 62;
    var CHAR_QUESTION = 63;
    var CHAR_COMMERCIAL_AT = 64;
    var CHAR_LEFT_SQUARE_BRACKET = 91;
    var CHAR_RIGHT_SQUARE_BRACKET = 93;
    var CHAR_GRAVE_ACCENT = 96;
    var CHAR_LEFT_CURLY_BRACKET = 123;
    var CHAR_VERTICAL_LINE = 124;
    var CHAR_RIGHT_CURLY_BRACKET = 125;
    var ESCAPE_SEQUENCES = {};
    ESCAPE_SEQUENCES[0] = "\\0";
    ESCAPE_SEQUENCES[7] = "\\a";
    ESCAPE_SEQUENCES[8] = "\\b";
    ESCAPE_SEQUENCES[9] = "\\t";
    ESCAPE_SEQUENCES[10] = "\\n";
    ESCAPE_SEQUENCES[11] = "\\v";
    ESCAPE_SEQUENCES[12] = "\\f";
    ESCAPE_SEQUENCES[13] = "\\r";
    ESCAPE_SEQUENCES[27] = "\\e";
    ESCAPE_SEQUENCES[34] = '\\"';
    ESCAPE_SEQUENCES[92] = "\\\\";
    ESCAPE_SEQUENCES[133] = "\\N";
    ESCAPE_SEQUENCES[160] = "\\_";
    ESCAPE_SEQUENCES[8232] = "\\L";
    ESCAPE_SEQUENCES[8233] = "\\P";
    var DEPRECATED_BOOLEANS_SYNTAX = [
      "y",
      "Y",
      "yes",
      "Yes",
      "YES",
      "on",
      "On",
      "ON",
      "n",
      "N",
      "no",
      "No",
      "NO",
      "off",
      "Off",
      "OFF"
    ];
    var DEPRECATED_BASE60_SYNTAX = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
    function compileStyleMap(schema, map) {
      var result, keys, index, length, tag, style, type;
      if (map === null)
        return {};
      result = {};
      keys = Object.keys(map);
      for (index = 0, length = keys.length; index < length; index += 1) {
        tag = keys[index];
        style = String(map[tag]);
        if (tag.slice(0, 2) === "!!") {
          tag = "tag:yaml.org,2002:" + tag.slice(2);
        }
        type = schema.compiledTypeMap["fallback"][tag];
        if (type && _hasOwnProperty.call(type.styleAliases, style)) {
          style = type.styleAliases[style];
        }
        result[tag] = style;
      }
      return result;
    }
    function encodeHex(character) {
      var string, handle, length;
      string = character.toString(16).toUpperCase();
      if (character <= 255) {
        handle = "x";
        length = 2;
      } else if (character <= 65535) {
        handle = "u";
        length = 4;
      } else if (character <= 4294967295) {
        handle = "U";
        length = 8;
      } else {
        throw new YAMLException("code point within a string may not be greater than 0xFFFFFFFF");
      }
      return "\\" + handle + common.repeat("0", length - string.length) + string;
    }
    var QUOTING_TYPE_SINGLE = 1;
    var QUOTING_TYPE_DOUBLE = 2;
    function State(options) {
      this.schema = options["schema"] || DEFAULT_SCHEMA;
      this.indent = Math.max(1, options["indent"] || 2);
      this.noArrayIndent = options["noArrayIndent"] || false;
      this.skipInvalid = options["skipInvalid"] || false;
      this.flowLevel = common.isNothing(options["flowLevel"]) ? -1 : options["flowLevel"];
      this.styleMap = compileStyleMap(this.schema, options["styles"] || null);
      this.sortKeys = options["sortKeys"] || false;
      this.lineWidth = options["lineWidth"] || 80;
      this.noRefs = options["noRefs"] || false;
      this.noCompatMode = options["noCompatMode"] || false;
      this.condenseFlow = options["condenseFlow"] || false;
      this.quotingType = options["quotingType"] === '"' ? QUOTING_TYPE_DOUBLE : QUOTING_TYPE_SINGLE;
      this.forceQuotes = options["forceQuotes"] || false;
      this.replacer = typeof options["replacer"] === "function" ? options["replacer"] : null;
      this.implicitTypes = this.schema.compiledImplicit;
      this.explicitTypes = this.schema.compiledExplicit;
      this.tag = null;
      this.result = "";
      this.duplicates = [];
      this.usedDuplicates = null;
    }
    function indentString(string, spaces) {
      var ind = common.repeat(" ", spaces), position = 0, next = -1, result = "", line, length = string.length;
      while (position < length) {
        next = string.indexOf("\n", position);
        if (next === -1) {
          line = string.slice(position);
          position = length;
        } else {
          line = string.slice(position, next + 1);
          position = next + 1;
        }
        if (line.length && line !== "\n")
          result += ind;
        result += line;
      }
      return result;
    }
    function generateNextLine(state, level) {
      return "\n" + common.repeat(" ", state.indent * level);
    }
    function testImplicitResolving(state, str) {
      var index, length, type;
      for (index = 0, length = state.implicitTypes.length; index < length; index += 1) {
        type = state.implicitTypes[index];
        if (type.resolve(str)) {
          return true;
        }
      }
      return false;
    }
    function isWhitespace(c) {
      return c === CHAR_SPACE || c === CHAR_TAB;
    }
    function isPrintable(c) {
      return 32 <= c && c <= 126 || 161 <= c && c <= 55295 && c !== 8232 && c !== 8233 || 57344 <= c && c <= 65533 && c !== CHAR_BOM || 65536 <= c && c <= 1114111;
    }
    function isNsCharOrWhitespace(c) {
      return isPrintable(c) && c !== CHAR_BOM && c !== CHAR_CARRIAGE_RETURN && c !== CHAR_LINE_FEED;
    }
    function isPlainSafe(c, prev, inblock) {
      var cIsNsCharOrWhitespace = isNsCharOrWhitespace(c);
      var cIsNsChar = cIsNsCharOrWhitespace && !isWhitespace(c);
      return (
        // ns-plain-safe
        (inblock ? (
          // c = flow-in
          cIsNsCharOrWhitespace
        ) : cIsNsCharOrWhitespace && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET) && c !== CHAR_SHARP && !(prev === CHAR_COLON && !cIsNsChar) || isNsCharOrWhitespace(prev) && !isWhitespace(prev) && c === CHAR_SHARP || prev === CHAR_COLON && cIsNsChar
      );
    }
    function isPlainSafeFirst(c) {
      return isPrintable(c) && c !== CHAR_BOM && !isWhitespace(c) && c !== CHAR_MINUS && c !== CHAR_QUESTION && c !== CHAR_COLON && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET && c !== CHAR_SHARP && c !== CHAR_AMPERSAND && c !== CHAR_ASTERISK && c !== CHAR_EXCLAMATION && c !== CHAR_VERTICAL_LINE && c !== CHAR_EQUALS && c !== CHAR_GREATER_THAN && c !== CHAR_SINGLE_QUOTE && c !== CHAR_DOUBLE_QUOTE && c !== CHAR_PERCENT && c !== CHAR_COMMERCIAL_AT && c !== CHAR_GRAVE_ACCENT;
    }
    function isPlainSafeLast(c) {
      return !isWhitespace(c) && c !== CHAR_COLON;
    }
    function codePointAt(string, pos) {
      var first = string.charCodeAt(pos), second;
      if (first >= 55296 && first <= 56319 && pos + 1 < string.length) {
        second = string.charCodeAt(pos + 1);
        if (second >= 56320 && second <= 57343) {
          return (first - 55296) * 1024 + second - 56320 + 65536;
        }
      }
      return first;
    }
    function needIndentIndicator(string) {
      var leadingSpaceRe = /^\n* /;
      return leadingSpaceRe.test(string);
    }
    var STYLE_PLAIN = 1;
    var STYLE_SINGLE = 2;
    var STYLE_LITERAL = 3;
    var STYLE_FOLDED = 4;
    var STYLE_DOUBLE = 5;
    function chooseScalarStyle(string, singleLineOnly, indentPerLevel, lineWidth, testAmbiguousType, quotingType, forceQuotes, inblock) {
      var i;
      var char = 0;
      var prevChar = null;
      var hasLineBreak = false;
      var hasFoldableLine = false;
      var shouldTrackWidth = lineWidth !== -1;
      var previousLineBreak = -1;
      var plain = isPlainSafeFirst(codePointAt(string, 0)) && isPlainSafeLast(codePointAt(string, string.length - 1));
      if (singleLineOnly || forceQuotes) {
        for (i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
          char = codePointAt(string, i);
          if (!isPrintable(char)) {
            return STYLE_DOUBLE;
          }
          plain = plain && isPlainSafe(char, prevChar, inblock);
          prevChar = char;
        }
      } else {
        for (i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
          char = codePointAt(string, i);
          if (char === CHAR_LINE_FEED) {
            hasLineBreak = true;
            if (shouldTrackWidth) {
              hasFoldableLine = hasFoldableLine || // Foldable line = too long, and not more-indented.
              i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ";
              previousLineBreak = i;
            }
          } else if (!isPrintable(char)) {
            return STYLE_DOUBLE;
          }
          plain = plain && isPlainSafe(char, prevChar, inblock);
          prevChar = char;
        }
        hasFoldableLine = hasFoldableLine || shouldTrackWidth && (i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ");
      }
      if (!hasLineBreak && !hasFoldableLine) {
        if (plain && !forceQuotes && !testAmbiguousType(string)) {
          return STYLE_PLAIN;
        }
        return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
      }
      if (indentPerLevel > 9 && needIndentIndicator(string)) {
        return STYLE_DOUBLE;
      }
      if (!forceQuotes) {
        return hasFoldableLine ? STYLE_FOLDED : STYLE_LITERAL;
      }
      return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
    }
    function writeScalar(state, string, level, iskey, inblock) {
      state.dump = function() {
        if (string.length === 0) {
          return state.quotingType === QUOTING_TYPE_DOUBLE ? '""' : "''";
        }
        if (!state.noCompatMode) {
          if (DEPRECATED_BOOLEANS_SYNTAX.indexOf(string) !== -1 || DEPRECATED_BASE60_SYNTAX.test(string)) {
            return state.quotingType === QUOTING_TYPE_DOUBLE ? '"' + string + '"' : "'" + string + "'";
          }
        }
        var indent = state.indent * Math.max(1, level);
        var lineWidth = state.lineWidth === -1 ? -1 : Math.max(Math.min(state.lineWidth, 40), state.lineWidth - indent);
        var singleLineOnly = iskey || state.flowLevel > -1 && level >= state.flowLevel;
        function testAmbiguity(string2) {
          return testImplicitResolving(state, string2);
        }
        switch (chooseScalarStyle(
          string,
          singleLineOnly,
          state.indent,
          lineWidth,
          testAmbiguity,
          state.quotingType,
          state.forceQuotes && !iskey,
          inblock
        )) {
          case STYLE_PLAIN:
            return string;
          case STYLE_SINGLE:
            return "'" + string.replace(/'/g, "''") + "'";
          case STYLE_LITERAL:
            return "|" + blockHeader(string, state.indent) + dropEndingNewline(indentString(string, indent));
          case STYLE_FOLDED:
            return ">" + blockHeader(string, state.indent) + dropEndingNewline(indentString(foldString(string, lineWidth), indent));
          case STYLE_DOUBLE:
            return '"' + escapeString(string, lineWidth) + '"';
          default:
            throw new YAMLException("impossible error: invalid scalar style");
        }
      }();
    }
    function blockHeader(string, indentPerLevel) {
      var indentIndicator = needIndentIndicator(string) ? String(indentPerLevel) : "";
      var clip = string[string.length - 1] === "\n";
      var keep = clip && (string[string.length - 2] === "\n" || string === "\n");
      var chomp = keep ? "+" : clip ? "" : "-";
      return indentIndicator + chomp + "\n";
    }
    function dropEndingNewline(string) {
      return string[string.length - 1] === "\n" ? string.slice(0, -1) : string;
    }
    function foldString(string, width) {
      var lineRe = /(\n+)([^\n]*)/g;
      var result = function() {
        var nextLF = string.indexOf("\n");
        nextLF = nextLF !== -1 ? nextLF : string.length;
        lineRe.lastIndex = nextLF;
        return foldLine(string.slice(0, nextLF), width);
      }();
      var prevMoreIndented = string[0] === "\n" || string[0] === " ";
      var moreIndented;
      var match;
      while (match = lineRe.exec(string)) {
        var prefix = match[1], line = match[2];
        moreIndented = line[0] === " ";
        result += prefix + (!prevMoreIndented && !moreIndented && line !== "" ? "\n" : "") + foldLine(line, width);
        prevMoreIndented = moreIndented;
      }
      return result;
    }
    function foldLine(line, width) {
      if (line === "" || line[0] === " ")
        return line;
      var breakRe = / [^ ]/g;
      var match;
      var start = 0, end, curr = 0, next = 0;
      var result = "";
      while (match = breakRe.exec(line)) {
        next = match.index;
        if (next - start > width) {
          end = curr > start ? curr : next;
          result += "\n" + line.slice(start, end);
          start = end + 1;
        }
        curr = next;
      }
      result += "\n";
      if (line.length - start > width && curr > start) {
        result += line.slice(start, curr) + "\n" + line.slice(curr + 1);
      } else {
        result += line.slice(start);
      }
      return result.slice(1);
    }
    function escapeString(string) {
      var result = "";
      var char = 0;
      var escapeSeq;
      for (var i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
        char = codePointAt(string, i);
        escapeSeq = ESCAPE_SEQUENCES[char];
        if (!escapeSeq && isPrintable(char)) {
          result += string[i];
          if (char >= 65536)
            result += string[i + 1];
        } else {
          result += escapeSeq || encodeHex(char);
        }
      }
      return result;
    }
    function writeFlowSequence(state, level, object) {
      var _result = "", _tag = state.tag, index, length, value;
      for (index = 0, length = object.length; index < length; index += 1) {
        value = object[index];
        if (state.replacer) {
          value = state.replacer.call(object, String(index), value);
        }
        if (writeNode(state, level, value, false, false) || typeof value === "undefined" && writeNode(state, level, null, false, false)) {
          if (_result !== "")
            _result += "," + (!state.condenseFlow ? " " : "");
          _result += state.dump;
        }
      }
      state.tag = _tag;
      state.dump = "[" + _result + "]";
    }
    function writeBlockSequence(state, level, object, compact) {
      var _result = "", _tag = state.tag, index, length, value;
      for (index = 0, length = object.length; index < length; index += 1) {
        value = object[index];
        if (state.replacer) {
          value = state.replacer.call(object, String(index), value);
        }
        if (writeNode(state, level + 1, value, true, true, false, true) || typeof value === "undefined" && writeNode(state, level + 1, null, true, true, false, true)) {
          if (!compact || _result !== "") {
            _result += generateNextLine(state, level);
          }
          if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
            _result += "-";
          } else {
            _result += "- ";
          }
          _result += state.dump;
        }
      }
      state.tag = _tag;
      state.dump = _result || "[]";
    }
    function writeFlowMapping(state, level, object) {
      var _result = "", _tag = state.tag, objectKeyList = Object.keys(object), index, length, objectKey, objectValue, pairBuffer;
      for (index = 0, length = objectKeyList.length; index < length; index += 1) {
        pairBuffer = "";
        if (_result !== "")
          pairBuffer += ", ";
        if (state.condenseFlow)
          pairBuffer += '"';
        objectKey = objectKeyList[index];
        objectValue = object[objectKey];
        if (state.replacer) {
          objectValue = state.replacer.call(object, objectKey, objectValue);
        }
        if (!writeNode(state, level, objectKey, false, false)) {
          continue;
        }
        if (state.dump.length > 1024)
          pairBuffer += "? ";
        pairBuffer += state.dump + (state.condenseFlow ? '"' : "") + ":" + (state.condenseFlow ? "" : " ");
        if (!writeNode(state, level, objectValue, false, false)) {
          continue;
        }
        pairBuffer += state.dump;
        _result += pairBuffer;
      }
      state.tag = _tag;
      state.dump = "{" + _result + "}";
    }
    function writeBlockMapping(state, level, object, compact) {
      var _result = "", _tag = state.tag, objectKeyList = Object.keys(object), index, length, objectKey, objectValue, explicitPair, pairBuffer;
      if (state.sortKeys === true) {
        objectKeyList.sort();
      } else if (typeof state.sortKeys === "function") {
        objectKeyList.sort(state.sortKeys);
      } else if (state.sortKeys) {
        throw new YAMLException("sortKeys must be a boolean or a function");
      }
      for (index = 0, length = objectKeyList.length; index < length; index += 1) {
        pairBuffer = "";
        if (!compact || _result !== "") {
          pairBuffer += generateNextLine(state, level);
        }
        objectKey = objectKeyList[index];
        objectValue = object[objectKey];
        if (state.replacer) {
          objectValue = state.replacer.call(object, objectKey, objectValue);
        }
        if (!writeNode(state, level + 1, objectKey, true, true, true)) {
          continue;
        }
        explicitPair = state.tag !== null && state.tag !== "?" || state.dump && state.dump.length > 1024;
        if (explicitPair) {
          if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
            pairBuffer += "?";
          } else {
            pairBuffer += "? ";
          }
        }
        pairBuffer += state.dump;
        if (explicitPair) {
          pairBuffer += generateNextLine(state, level);
        }
        if (!writeNode(state, level + 1, objectValue, true, explicitPair)) {
          continue;
        }
        if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
          pairBuffer += ":";
        } else {
          pairBuffer += ": ";
        }
        pairBuffer += state.dump;
        _result += pairBuffer;
      }
      state.tag = _tag;
      state.dump = _result || "{}";
    }
    function detectType(state, object, explicit) {
      var _result, typeList, index, length, type, style;
      typeList = explicit ? state.explicitTypes : state.implicitTypes;
      for (index = 0, length = typeList.length; index < length; index += 1) {
        type = typeList[index];
        if ((type.instanceOf || type.predicate) && (!type.instanceOf || typeof object === "object" && object instanceof type.instanceOf) && (!type.predicate || type.predicate(object))) {
          if (explicit) {
            if (type.multi && type.representName) {
              state.tag = type.representName(object);
            } else {
              state.tag = type.tag;
            }
          } else {
            state.tag = "?";
          }
          if (type.represent) {
            style = state.styleMap[type.tag] || type.defaultStyle;
            if (_toString.call(type.represent) === "[object Function]") {
              _result = type.represent(object, style);
            } else if (_hasOwnProperty.call(type.represent, style)) {
              _result = type.represent[style](object, style);
            } else {
              throw new YAMLException("!<" + type.tag + '> tag resolver accepts not "' + style + '" style');
            }
            state.dump = _result;
          }
          return true;
        }
      }
      return false;
    }
    function writeNode(state, level, object, block, compact, iskey, isblockseq) {
      state.tag = null;
      state.dump = object;
      if (!detectType(state, object, false)) {
        detectType(state, object, true);
      }
      var type = _toString.call(state.dump);
      var inblock = block;
      var tagStr;
      if (block) {
        block = state.flowLevel < 0 || state.flowLevel > level;
      }
      var objectOrArray = type === "[object Object]" || type === "[object Array]", duplicateIndex, duplicate;
      if (objectOrArray) {
        duplicateIndex = state.duplicates.indexOf(object);
        duplicate = duplicateIndex !== -1;
      }
      if (state.tag !== null && state.tag !== "?" || duplicate || state.indent !== 2 && level > 0) {
        compact = false;
      }
      if (duplicate && state.usedDuplicates[duplicateIndex]) {
        state.dump = "*ref_" + duplicateIndex;
      } else {
        if (objectOrArray && duplicate && !state.usedDuplicates[duplicateIndex]) {
          state.usedDuplicates[duplicateIndex] = true;
        }
        if (type === "[object Object]") {
          if (block && Object.keys(state.dump).length !== 0) {
            writeBlockMapping(state, level, state.dump, compact);
            if (duplicate) {
              state.dump = "&ref_" + duplicateIndex + state.dump;
            }
          } else {
            writeFlowMapping(state, level, state.dump);
            if (duplicate) {
              state.dump = "&ref_" + duplicateIndex + " " + state.dump;
            }
          }
        } else if (type === "[object Array]") {
          if (block && state.dump.length !== 0) {
            if (state.noArrayIndent && !isblockseq && level > 0) {
              writeBlockSequence(state, level - 1, state.dump, compact);
            } else {
              writeBlockSequence(state, level, state.dump, compact);
            }
            if (duplicate) {
              state.dump = "&ref_" + duplicateIndex + state.dump;
            }
          } else {
            writeFlowSequence(state, level, state.dump);
            if (duplicate) {
              state.dump = "&ref_" + duplicateIndex + " " + state.dump;
            }
          }
        } else if (type === "[object String]") {
          if (state.tag !== "?") {
            writeScalar(state, state.dump, level, iskey, inblock);
          }
        } else if (type === "[object Undefined]") {
          return false;
        } else {
          if (state.skipInvalid)
            return false;
          throw new YAMLException("unacceptable kind of an object to dump " + type);
        }
        if (state.tag !== null && state.tag !== "?") {
          tagStr = encodeURI(
            state.tag[0] === "!" ? state.tag.slice(1) : state.tag
          ).replace(/!/g, "%21");
          if (state.tag[0] === "!") {
            tagStr = "!" + tagStr;
          } else if (tagStr.slice(0, 18) === "tag:yaml.org,2002:") {
            tagStr = "!!" + tagStr.slice(18);
          } else {
            tagStr = "!<" + tagStr + ">";
          }
          state.dump = tagStr + " " + state.dump;
        }
      }
      return true;
    }
    function getDuplicateReferences(object, state) {
      var objects = [], duplicatesIndexes = [], index, length;
      inspectNode(object, objects, duplicatesIndexes);
      for (index = 0, length = duplicatesIndexes.length; index < length; index += 1) {
        state.duplicates.push(objects[duplicatesIndexes[index]]);
      }
      state.usedDuplicates = new Array(length);
    }
    function inspectNode(object, objects, duplicatesIndexes) {
      var objectKeyList, index, length;
      if (object !== null && typeof object === "object") {
        index = objects.indexOf(object);
        if (index !== -1) {
          if (duplicatesIndexes.indexOf(index) === -1) {
            duplicatesIndexes.push(index);
          }
        } else {
          objects.push(object);
          if (Array.isArray(object)) {
            for (index = 0, length = object.length; index < length; index += 1) {
              inspectNode(object[index], objects, duplicatesIndexes);
            }
          } else {
            objectKeyList = Object.keys(object);
            for (index = 0, length = objectKeyList.length; index < length; index += 1) {
              inspectNode(object[objectKeyList[index]], objects, duplicatesIndexes);
            }
          }
        }
      }
    }
    function dump(input, options) {
      options = options || {};
      var state = new State(options);
      if (!state.noRefs)
        getDuplicateReferences(input, state);
      var value = input;
      if (state.replacer) {
        value = state.replacer.call({ "": value }, "", value);
      }
      if (writeNode(state, 0, value, true, true))
        return state.dump + "\n";
      return "";
    }
    module2.exports.dump = dump;
  }
});

// node_modules/js-yaml/index.js
var require_js_yaml = __commonJS({
  "node_modules/js-yaml/index.js"(exports2, module2) {
    "use strict";
    var loader = require_loader();
    var dumper = require_dumper();
    function renamed(from, to) {
      return function() {
        throw new Error("Function yaml." + from + " is removed in js-yaml 4. Use yaml." + to + " instead, which is now safe by default.");
      };
    }
    module2.exports.Type = require_type();
    module2.exports.Schema = require_schema();
    module2.exports.FAILSAFE_SCHEMA = require_failsafe();
    module2.exports.JSON_SCHEMA = require_json2();
    module2.exports.CORE_SCHEMA = require_core2();
    module2.exports.DEFAULT_SCHEMA = require_default();
    module2.exports.load = loader.load;
    module2.exports.loadAll = loader.loadAll;
    module2.exports.dump = dumper.dump;
    module2.exports.YAMLException = require_exception();
    module2.exports.types = {
      binary: require_binary(),
      float: require_float(),
      map: require_map(),
      null: require_null(),
      pairs: require_pairs(),
      set: require_set(),
      timestamp: require_timestamp(),
      bool: require_bool(),
      int: require_int(),
      merge: require_merge(),
      omap: require_omap(),
      seq: require_seq(),
      str: require_str()
    };
    module2.exports.safeLoad = renamed("safeLoad", "load");
    module2.exports.safeLoadAll = renamed("safeLoadAll", "loadAll");
    module2.exports.safeDump = renamed("safeDump", "dump");
  }
});

// out/lib/parser/YamlParser.js
var require_YamlParser = __commonJS({
  "out/lib/parser/YamlParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.YamlParser = void 0;
    var fs = require("fs");
    var yaml = require_js_yaml();
    var path = require("path");
    var YamlParser = class {
      constructor() {
        this._actionsArchiveRoot = this.findArchiveRoot(__dirname);
      }
      getHostParameterEntries(actionFolder) {
        var _a;
        const parameterMap = {};
        try {
          const file = path.resolve(this._actionsArchiveRoot, actionFolder, "action.yml");
          console.log(`loading action yaml file: ${file}`);
          const fileContents = fs.readFileSync(file, "utf8");
          const data = yaml.load(fileContents);
          for (const [name, inputInfo] of Object.entries(data.inputs)) {
            const typedData = {
              name,
              required: (_a = inputInfo.required) !== null && _a !== void 0 ? _a : false,
              defaultValue: inputInfo.default
            };
            parameterMap[name] = typedData;
          }
          return parameterMap;
        } catch (e) {
          throw new Error(`Error parsing yaml file for ${actionFolder}: ${e}`);
        }
      }
      findArchiveRoot(startSearchFolder) {
        let candidateDir = startSearchFolder;
        const fsRoot = path.parse(candidateDir).root;
        do {
          const candidateActionYml = path.join(candidateDir, "action.yml");
          if (fs.existsSync(candidateActionYml)) {
            const actionInfo = yaml.load(fs.readFileSync(candidateActionYml, "utf-8"));
            if (actionInfo.name === "powerplatform-actions") {
              return candidateDir;
            }
          } else {
            candidateDir = path.resolve(candidateDir, "..");
          }
        } while (candidateDir !== fsRoot);
        throw new Error(`Cannot find pp-actions' archive root folder. Started search at: ${startSearchFolder}`);
      }
    };
    exports2.YamlParser = YamlParser;
  }
});

// node_modules/fs-extra/lib/fs/index.js
var require_fs2 = __commonJS({
  "node_modules/fs-extra/lib/fs/index.js"(exports2) {
    "use strict";
    var u = require_universalify().fromCallback;
    var fs = require_graceful_fs();
    var api = [
      "access",
      "appendFile",
      "chmod",
      "chown",
      "close",
      "copyFile",
      "fchmod",
      "fchown",
      "fdatasync",
      "fstat",
      "fsync",
      "ftruncate",
      "futimes",
      "lchmod",
      "lchown",
      "link",
      "lstat",
      "mkdir",
      "mkdtemp",
      "open",
      "opendir",
      "readdir",
      "readFile",
      "readlink",
      "realpath",
      "rename",
      "rm",
      "rmdir",
      "stat",
      "symlink",
      "truncate",
      "unlink",
      "utimes",
      "writeFile"
    ].filter((key) => {
      return typeof fs[key] === "function";
    });
    Object.assign(exports2, fs);
    api.forEach((method) => {
      exports2[method] = u(fs[method]);
    });
    exports2.exists = function(filename, callback) {
      if (typeof callback === "function") {
        return fs.exists(filename, callback);
      }
      return new Promise((resolve) => {
        return fs.exists(filename, resolve);
      });
    };
    exports2.read = function(fd, buffer, offset, length, position, callback) {
      if (typeof callback === "function") {
        return fs.read(fd, buffer, offset, length, position, callback);
      }
      return new Promise((resolve, reject) => {
        fs.read(fd, buffer, offset, length, position, (err, bytesRead, buffer2) => {
          if (err)
            return reject(err);
          resolve({ bytesRead, buffer: buffer2 });
        });
      });
    };
    exports2.write = function(fd, buffer, ...args) {
      if (typeof args[args.length - 1] === "function") {
        return fs.write(fd, buffer, ...args);
      }
      return new Promise((resolve, reject) => {
        fs.write(fd, buffer, ...args, (err, bytesWritten, buffer2) => {
          if (err)
            return reject(err);
          resolve({ bytesWritten, buffer: buffer2 });
        });
      });
    };
    if (typeof fs.writev === "function") {
      exports2.writev = function(fd, buffers, ...args) {
        if (typeof args[args.length - 1] === "function") {
          return fs.writev(fd, buffers, ...args);
        }
        return new Promise((resolve, reject) => {
          fs.writev(fd, buffers, ...args, (err, bytesWritten, buffers2) => {
            if (err)
              return reject(err);
            resolve({ bytesWritten, buffers: buffers2 });
          });
        });
      };
    }
    if (typeof fs.realpath.native === "function") {
      exports2.realpath.native = u(fs.realpath.native);
    } else {
      process.emitWarning(
        "fs.realpath.native is not a function. Is fs being monkey-patched?",
        "Warning",
        "fs-extra-WARN0003"
      );
    }
  }
});

// node_modules/fs-extra/lib/mkdirs/utils.js
var require_utils4 = __commonJS({
  "node_modules/fs-extra/lib/mkdirs/utils.js"(exports2, module2) {
    "use strict";
    var path = require("path");
    module2.exports.checkPath = function checkPath(pth) {
      if (process.platform === "win32") {
        const pathHasInvalidWinCharacters = /[<>:"|?*]/.test(pth.replace(path.parse(pth).root, ""));
        if (pathHasInvalidWinCharacters) {
          const error = new Error(`Path contains invalid characters: ${pth}`);
          error.code = "EINVAL";
          throw error;
        }
      }
    };
  }
});

// node_modules/fs-extra/lib/mkdirs/make-dir.js
var require_make_dir2 = __commonJS({
  "node_modules/fs-extra/lib/mkdirs/make-dir.js"(exports2, module2) {
    "use strict";
    var fs = require_fs2();
    var { checkPath } = require_utils4();
    var getMode = (options) => {
      const defaults = { mode: 511 };
      if (typeof options === "number")
        return options;
      return { ...defaults, ...options }.mode;
    };
    module2.exports.makeDir = async (dir, options) => {
      checkPath(dir);
      return fs.mkdir(dir, {
        mode: getMode(options),
        recursive: true
      });
    };
    module2.exports.makeDirSync = (dir, options) => {
      checkPath(dir);
      return fs.mkdirSync(dir, {
        mode: getMode(options),
        recursive: true
      });
    };
  }
});

// node_modules/fs-extra/lib/mkdirs/index.js
var require_mkdirs2 = __commonJS({
  "node_modules/fs-extra/lib/mkdirs/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    var { makeDir: _makeDir, makeDirSync } = require_make_dir2();
    var makeDir = u(_makeDir);
    module2.exports = {
      mkdirs: makeDir,
      mkdirsSync: makeDirSync,
      // alias
      mkdirp: makeDir,
      mkdirpSync: makeDirSync,
      ensureDir: makeDir,
      ensureDirSync: makeDirSync
    };
  }
});

// node_modules/fs-extra/lib/path-exists/index.js
var require_path_exists2 = __commonJS({
  "node_modules/fs-extra/lib/path-exists/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    var fs = require_fs2();
    function pathExists(path) {
      return fs.access(path).then(() => true).catch(() => false);
    }
    module2.exports = {
      pathExists: u(pathExists),
      pathExistsSync: fs.existsSync
    };
  }
});

// node_modules/fs-extra/lib/util/utimes.js
var require_utimes2 = __commonJS({
  "node_modules/fs-extra/lib/util/utimes.js"(exports2, module2) {
    "use strict";
    var fs = require_graceful_fs();
    function utimesMillis(path, atime, mtime, callback) {
      fs.open(path, "r+", (err, fd) => {
        if (err)
          return callback(err);
        fs.futimes(fd, atime, mtime, (futimesErr) => {
          fs.close(fd, (closeErr) => {
            if (callback)
              callback(futimesErr || closeErr);
          });
        });
      });
    }
    function utimesMillisSync(path, atime, mtime) {
      const fd = fs.openSync(path, "r+");
      fs.futimesSync(fd, atime, mtime);
      return fs.closeSync(fd);
    }
    module2.exports = {
      utimesMillis,
      utimesMillisSync
    };
  }
});

// node_modules/fs-extra/lib/util/stat.js
var require_stat2 = __commonJS({
  "node_modules/fs-extra/lib/util/stat.js"(exports2, module2) {
    "use strict";
    var fs = require_fs2();
    var path = require("path");
    var util = require("util");
    function getStats(src, dest, opts) {
      const statFunc = opts.dereference ? (file) => fs.stat(file, { bigint: true }) : (file) => fs.lstat(file, { bigint: true });
      return Promise.all([
        statFunc(src),
        statFunc(dest).catch((err) => {
          if (err.code === "ENOENT")
            return null;
          throw err;
        })
      ]).then(([srcStat, destStat]) => ({ srcStat, destStat }));
    }
    function getStatsSync(src, dest, opts) {
      let destStat;
      const statFunc = opts.dereference ? (file) => fs.statSync(file, { bigint: true }) : (file) => fs.lstatSync(file, { bigint: true });
      const srcStat = statFunc(src);
      try {
        destStat = statFunc(dest);
      } catch (err) {
        if (err.code === "ENOENT")
          return { srcStat, destStat: null };
        throw err;
      }
      return { srcStat, destStat };
    }
    function checkPaths(src, dest, funcName, opts, cb) {
      util.callbackify(getStats)(src, dest, opts, (err, stats) => {
        if (err)
          return cb(err);
        const { srcStat, destStat } = stats;
        if (destStat) {
          if (areIdentical(srcStat, destStat)) {
            const srcBaseName = path.basename(src);
            const destBaseName = path.basename(dest);
            if (funcName === "move" && srcBaseName !== destBaseName && srcBaseName.toLowerCase() === destBaseName.toLowerCase()) {
              return cb(null, { srcStat, destStat, isChangingCase: true });
            }
            return cb(new Error("Source and destination must not be the same."));
          }
          if (srcStat.isDirectory() && !destStat.isDirectory()) {
            return cb(new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`));
          }
          if (!srcStat.isDirectory() && destStat.isDirectory()) {
            return cb(new Error(`Cannot overwrite directory '${dest}' with non-directory '${src}'.`));
          }
        }
        if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
          return cb(new Error(errMsg(src, dest, funcName)));
        }
        return cb(null, { srcStat, destStat });
      });
    }
    function checkPathsSync(src, dest, funcName, opts) {
      const { srcStat, destStat } = getStatsSync(src, dest, opts);
      if (destStat) {
        if (areIdentical(srcStat, destStat)) {
          const srcBaseName = path.basename(src);
          const destBaseName = path.basename(dest);
          if (funcName === "move" && srcBaseName !== destBaseName && srcBaseName.toLowerCase() === destBaseName.toLowerCase()) {
            return { srcStat, destStat, isChangingCase: true };
          }
          throw new Error("Source and destination must not be the same.");
        }
        if (srcStat.isDirectory() && !destStat.isDirectory()) {
          throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`);
        }
        if (!srcStat.isDirectory() && destStat.isDirectory()) {
          throw new Error(`Cannot overwrite directory '${dest}' with non-directory '${src}'.`);
        }
      }
      if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
        throw new Error(errMsg(src, dest, funcName));
      }
      return { srcStat, destStat };
    }
    function checkParentPaths(src, srcStat, dest, funcName, cb) {
      const srcParent = path.resolve(path.dirname(src));
      const destParent = path.resolve(path.dirname(dest));
      if (destParent === srcParent || destParent === path.parse(destParent).root)
        return cb();
      fs.stat(destParent, { bigint: true }, (err, destStat) => {
        if (err) {
          if (err.code === "ENOENT")
            return cb();
          return cb(err);
        }
        if (areIdentical(srcStat, destStat)) {
          return cb(new Error(errMsg(src, dest, funcName)));
        }
        return checkParentPaths(src, srcStat, destParent, funcName, cb);
      });
    }
    function checkParentPathsSync(src, srcStat, dest, funcName) {
      const srcParent = path.resolve(path.dirname(src));
      const destParent = path.resolve(path.dirname(dest));
      if (destParent === srcParent || destParent === path.parse(destParent).root)
        return;
      let destStat;
      try {
        destStat = fs.statSync(destParent, { bigint: true });
      } catch (err) {
        if (err.code === "ENOENT")
          return;
        throw err;
      }
      if (areIdentical(srcStat, destStat)) {
        throw new Error(errMsg(src, dest, funcName));
      }
      return checkParentPathsSync(src, srcStat, destParent, funcName);
    }
    function areIdentical(srcStat, destStat) {
      return destStat.ino && destStat.dev && destStat.ino === srcStat.ino && destStat.dev === srcStat.dev;
    }
    function isSrcSubdir(src, dest) {
      const srcArr = path.resolve(src).split(path.sep).filter((i) => i);
      const destArr = path.resolve(dest).split(path.sep).filter((i) => i);
      return srcArr.reduce((acc, cur, i) => acc && destArr[i] === cur, true);
    }
    function errMsg(src, dest, funcName) {
      return `Cannot ${funcName} '${src}' to a subdirectory of itself, '${dest}'.`;
    }
    module2.exports = {
      checkPaths,
      checkPathsSync,
      checkParentPaths,
      checkParentPathsSync,
      isSrcSubdir,
      areIdentical
    };
  }
});

// node_modules/fs-extra/lib/copy/copy.js
var require_copy3 = __commonJS({
  "node_modules/fs-extra/lib/copy/copy.js"(exports2, module2) {
    "use strict";
    var fs = require_graceful_fs();
    var path = require("path");
    var mkdirs = require_mkdirs2().mkdirs;
    var pathExists = require_path_exists2().pathExists;
    var utimesMillis = require_utimes2().utimesMillis;
    var stat = require_stat2();
    function copy(src, dest, opts, cb) {
      if (typeof opts === "function" && !cb) {
        cb = opts;
        opts = {};
      } else if (typeof opts === "function") {
        opts = { filter: opts };
      }
      cb = cb || function() {
      };
      opts = opts || {};
      opts.clobber = "clobber" in opts ? !!opts.clobber : true;
      opts.overwrite = "overwrite" in opts ? !!opts.overwrite : opts.clobber;
      if (opts.preserveTimestamps && process.arch === "ia32") {
        process.emitWarning(
          "Using the preserveTimestamps option in 32-bit node is not recommended;\n\n	see https://github.com/jprichardson/node-fs-extra/issues/269",
          "Warning",
          "fs-extra-WARN0001"
        );
      }
      stat.checkPaths(src, dest, "copy", opts, (err, stats) => {
        if (err)
          return cb(err);
        const { srcStat, destStat } = stats;
        stat.checkParentPaths(src, srcStat, dest, "copy", (err2) => {
          if (err2)
            return cb(err2);
          if (opts.filter)
            return handleFilter(checkParentDir, destStat, src, dest, opts, cb);
          return checkParentDir(destStat, src, dest, opts, cb);
        });
      });
    }
    function checkParentDir(destStat, src, dest, opts, cb) {
      const destParent = path.dirname(dest);
      pathExists(destParent, (err, dirExists) => {
        if (err)
          return cb(err);
        if (dirExists)
          return getStats(destStat, src, dest, opts, cb);
        mkdirs(destParent, (err2) => {
          if (err2)
            return cb(err2);
          return getStats(destStat, src, dest, opts, cb);
        });
      });
    }
    function handleFilter(onInclude, destStat, src, dest, opts, cb) {
      Promise.resolve(opts.filter(src, dest)).then((include) => {
        if (include)
          return onInclude(destStat, src, dest, opts, cb);
        return cb();
      }, (error) => cb(error));
    }
    function startCopy(destStat, src, dest, opts, cb) {
      if (opts.filter)
        return handleFilter(getStats, destStat, src, dest, opts, cb);
      return getStats(destStat, src, dest, opts, cb);
    }
    function getStats(destStat, src, dest, opts, cb) {
      const stat2 = opts.dereference ? fs.stat : fs.lstat;
      stat2(src, (err, srcStat) => {
        if (err)
          return cb(err);
        if (srcStat.isDirectory())
          return onDir(srcStat, destStat, src, dest, opts, cb);
        else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice())
          return onFile(srcStat, destStat, src, dest, opts, cb);
        else if (srcStat.isSymbolicLink())
          return onLink(destStat, src, dest, opts, cb);
        else if (srcStat.isSocket())
          return cb(new Error(`Cannot copy a socket file: ${src}`));
        else if (srcStat.isFIFO())
          return cb(new Error(`Cannot copy a FIFO pipe: ${src}`));
        return cb(new Error(`Unknown file: ${src}`));
      });
    }
    function onFile(srcStat, destStat, src, dest, opts, cb) {
      if (!destStat)
        return copyFile(srcStat, src, dest, opts, cb);
      return mayCopyFile(srcStat, src, dest, opts, cb);
    }
    function mayCopyFile(srcStat, src, dest, opts, cb) {
      if (opts.overwrite) {
        fs.unlink(dest, (err) => {
          if (err)
            return cb(err);
          return copyFile(srcStat, src, dest, opts, cb);
        });
      } else if (opts.errorOnExist) {
        return cb(new Error(`'${dest}' already exists`));
      } else
        return cb();
    }
    function copyFile(srcStat, src, dest, opts, cb) {
      fs.copyFile(src, dest, (err) => {
        if (err)
          return cb(err);
        if (opts.preserveTimestamps)
          return handleTimestampsAndMode(srcStat.mode, src, dest, cb);
        return setDestMode(dest, srcStat.mode, cb);
      });
    }
    function handleTimestampsAndMode(srcMode, src, dest, cb) {
      if (fileIsNotWritable(srcMode)) {
        return makeFileWritable(dest, srcMode, (err) => {
          if (err)
            return cb(err);
          return setDestTimestampsAndMode(srcMode, src, dest, cb);
        });
      }
      return setDestTimestampsAndMode(srcMode, src, dest, cb);
    }
    function fileIsNotWritable(srcMode) {
      return (srcMode & 128) === 0;
    }
    function makeFileWritable(dest, srcMode, cb) {
      return setDestMode(dest, srcMode | 128, cb);
    }
    function setDestTimestampsAndMode(srcMode, src, dest, cb) {
      setDestTimestamps(src, dest, (err) => {
        if (err)
          return cb(err);
        return setDestMode(dest, srcMode, cb);
      });
    }
    function setDestMode(dest, srcMode, cb) {
      return fs.chmod(dest, srcMode, cb);
    }
    function setDestTimestamps(src, dest, cb) {
      fs.stat(src, (err, updatedSrcStat) => {
        if (err)
          return cb(err);
        return utimesMillis(dest, updatedSrcStat.atime, updatedSrcStat.mtime, cb);
      });
    }
    function onDir(srcStat, destStat, src, dest, opts, cb) {
      if (!destStat)
        return mkDirAndCopy(srcStat.mode, src, dest, opts, cb);
      return copyDir(src, dest, opts, cb);
    }
    function mkDirAndCopy(srcMode, src, dest, opts, cb) {
      fs.mkdir(dest, (err) => {
        if (err)
          return cb(err);
        copyDir(src, dest, opts, (err2) => {
          if (err2)
            return cb(err2);
          return setDestMode(dest, srcMode, cb);
        });
      });
    }
    function copyDir(src, dest, opts, cb) {
      fs.readdir(src, (err, items) => {
        if (err)
          return cb(err);
        return copyDirItems(items, src, dest, opts, cb);
      });
    }
    function copyDirItems(items, src, dest, opts, cb) {
      const item = items.pop();
      if (!item)
        return cb();
      return copyDirItem(items, item, src, dest, opts, cb);
    }
    function copyDirItem(items, item, src, dest, opts, cb) {
      const srcItem = path.join(src, item);
      const destItem = path.join(dest, item);
      stat.checkPaths(srcItem, destItem, "copy", opts, (err, stats) => {
        if (err)
          return cb(err);
        const { destStat } = stats;
        startCopy(destStat, srcItem, destItem, opts, (err2) => {
          if (err2)
            return cb(err2);
          return copyDirItems(items, src, dest, opts, cb);
        });
      });
    }
    function onLink(destStat, src, dest, opts, cb) {
      fs.readlink(src, (err, resolvedSrc) => {
        if (err)
          return cb(err);
        if (opts.dereference) {
          resolvedSrc = path.resolve(process.cwd(), resolvedSrc);
        }
        if (!destStat) {
          return fs.symlink(resolvedSrc, dest, cb);
        } else {
          fs.readlink(dest, (err2, resolvedDest) => {
            if (err2) {
              if (err2.code === "EINVAL" || err2.code === "UNKNOWN")
                return fs.symlink(resolvedSrc, dest, cb);
              return cb(err2);
            }
            if (opts.dereference) {
              resolvedDest = path.resolve(process.cwd(), resolvedDest);
            }
            if (stat.isSrcSubdir(resolvedSrc, resolvedDest)) {
              return cb(new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`));
            }
            if (destStat.isDirectory() && stat.isSrcSubdir(resolvedDest, resolvedSrc)) {
              return cb(new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`));
            }
            return copyLink(resolvedSrc, dest, cb);
          });
        }
      });
    }
    function copyLink(resolvedSrc, dest, cb) {
      fs.unlink(dest, (err) => {
        if (err)
          return cb(err);
        return fs.symlink(resolvedSrc, dest, cb);
      });
    }
    module2.exports = copy;
  }
});

// node_modules/fs-extra/lib/copy/copy-sync.js
var require_copy_sync2 = __commonJS({
  "node_modules/fs-extra/lib/copy/copy-sync.js"(exports2, module2) {
    "use strict";
    var fs = require_graceful_fs();
    var path = require("path");
    var mkdirsSync = require_mkdirs2().mkdirsSync;
    var utimesMillisSync = require_utimes2().utimesMillisSync;
    var stat = require_stat2();
    function copySync(src, dest, opts) {
      if (typeof opts === "function") {
        opts = { filter: opts };
      }
      opts = opts || {};
      opts.clobber = "clobber" in opts ? !!opts.clobber : true;
      opts.overwrite = "overwrite" in opts ? !!opts.overwrite : opts.clobber;
      if (opts.preserveTimestamps && process.arch === "ia32") {
        process.emitWarning(
          "Using the preserveTimestamps option in 32-bit node is not recommended;\n\n	see https://github.com/jprichardson/node-fs-extra/issues/269",
          "Warning",
          "fs-extra-WARN0002"
        );
      }
      const { srcStat, destStat } = stat.checkPathsSync(src, dest, "copy", opts);
      stat.checkParentPathsSync(src, srcStat, dest, "copy");
      return handleFilterAndCopy(destStat, src, dest, opts);
    }
    function handleFilterAndCopy(destStat, src, dest, opts) {
      if (opts.filter && !opts.filter(src, dest))
        return;
      const destParent = path.dirname(dest);
      if (!fs.existsSync(destParent))
        mkdirsSync(destParent);
      return getStats(destStat, src, dest, opts);
    }
    function startCopy(destStat, src, dest, opts) {
      if (opts.filter && !opts.filter(src, dest))
        return;
      return getStats(destStat, src, dest, opts);
    }
    function getStats(destStat, src, dest, opts) {
      const statSync = opts.dereference ? fs.statSync : fs.lstatSync;
      const srcStat = statSync(src);
      if (srcStat.isDirectory())
        return onDir(srcStat, destStat, src, dest, opts);
      else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice())
        return onFile(srcStat, destStat, src, dest, opts);
      else if (srcStat.isSymbolicLink())
        return onLink(destStat, src, dest, opts);
      else if (srcStat.isSocket())
        throw new Error(`Cannot copy a socket file: ${src}`);
      else if (srcStat.isFIFO())
        throw new Error(`Cannot copy a FIFO pipe: ${src}`);
      throw new Error(`Unknown file: ${src}`);
    }
    function onFile(srcStat, destStat, src, dest, opts) {
      if (!destStat)
        return copyFile(srcStat, src, dest, opts);
      return mayCopyFile(srcStat, src, dest, opts);
    }
    function mayCopyFile(srcStat, src, dest, opts) {
      if (opts.overwrite) {
        fs.unlinkSync(dest);
        return copyFile(srcStat, src, dest, opts);
      } else if (opts.errorOnExist) {
        throw new Error(`'${dest}' already exists`);
      }
    }
    function copyFile(srcStat, src, dest, opts) {
      fs.copyFileSync(src, dest);
      if (opts.preserveTimestamps)
        handleTimestamps(srcStat.mode, src, dest);
      return setDestMode(dest, srcStat.mode);
    }
    function handleTimestamps(srcMode, src, dest) {
      if (fileIsNotWritable(srcMode))
        makeFileWritable(dest, srcMode);
      return setDestTimestamps(src, dest);
    }
    function fileIsNotWritable(srcMode) {
      return (srcMode & 128) === 0;
    }
    function makeFileWritable(dest, srcMode) {
      return setDestMode(dest, srcMode | 128);
    }
    function setDestMode(dest, srcMode) {
      return fs.chmodSync(dest, srcMode);
    }
    function setDestTimestamps(src, dest) {
      const updatedSrcStat = fs.statSync(src);
      return utimesMillisSync(dest, updatedSrcStat.atime, updatedSrcStat.mtime);
    }
    function onDir(srcStat, destStat, src, dest, opts) {
      if (!destStat)
        return mkDirAndCopy(srcStat.mode, src, dest, opts);
      return copyDir(src, dest, opts);
    }
    function mkDirAndCopy(srcMode, src, dest, opts) {
      fs.mkdirSync(dest);
      copyDir(src, dest, opts);
      return setDestMode(dest, srcMode);
    }
    function copyDir(src, dest, opts) {
      fs.readdirSync(src).forEach((item) => copyDirItem(item, src, dest, opts));
    }
    function copyDirItem(item, src, dest, opts) {
      const srcItem = path.join(src, item);
      const destItem = path.join(dest, item);
      const { destStat } = stat.checkPathsSync(srcItem, destItem, "copy", opts);
      return startCopy(destStat, srcItem, destItem, opts);
    }
    function onLink(destStat, src, dest, opts) {
      let resolvedSrc = fs.readlinkSync(src);
      if (opts.dereference) {
        resolvedSrc = path.resolve(process.cwd(), resolvedSrc);
      }
      if (!destStat) {
        return fs.symlinkSync(resolvedSrc, dest);
      } else {
        let resolvedDest;
        try {
          resolvedDest = fs.readlinkSync(dest);
        } catch (err) {
          if (err.code === "EINVAL" || err.code === "UNKNOWN")
            return fs.symlinkSync(resolvedSrc, dest);
          throw err;
        }
        if (opts.dereference) {
          resolvedDest = path.resolve(process.cwd(), resolvedDest);
        }
        if (stat.isSrcSubdir(resolvedSrc, resolvedDest)) {
          throw new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`);
        }
        if (fs.statSync(dest).isDirectory() && stat.isSrcSubdir(resolvedDest, resolvedSrc)) {
          throw new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`);
        }
        return copyLink(resolvedSrc, dest);
      }
    }
    function copyLink(resolvedSrc, dest) {
      fs.unlinkSync(dest);
      return fs.symlinkSync(resolvedSrc, dest);
    }
    module2.exports = copySync;
  }
});

// node_modules/fs-extra/lib/copy/index.js
var require_copy4 = __commonJS({
  "node_modules/fs-extra/lib/copy/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    module2.exports = {
      copy: u(require_copy3()),
      copySync: require_copy_sync2()
    };
  }
});

// node_modules/fs-extra/lib/remove/rimraf.js
var require_rimraf = __commonJS({
  "node_modules/fs-extra/lib/remove/rimraf.js"(exports2, module2) {
    "use strict";
    var fs = require_graceful_fs();
    var path = require("path");
    var assert = require("assert");
    var isWindows = process.platform === "win32";
    function defaults(options) {
      const methods = [
        "unlink",
        "chmod",
        "stat",
        "lstat",
        "rmdir",
        "readdir"
      ];
      methods.forEach((m) => {
        options[m] = options[m] || fs[m];
        m = m + "Sync";
        options[m] = options[m] || fs[m];
      });
      options.maxBusyTries = options.maxBusyTries || 3;
    }
    function rimraf(p, options, cb) {
      let busyTries = 0;
      if (typeof options === "function") {
        cb = options;
        options = {};
      }
      assert(p, "rimraf: missing path");
      assert.strictEqual(typeof p, "string", "rimraf: path should be a string");
      assert.strictEqual(typeof cb, "function", "rimraf: callback function required");
      assert(options, "rimraf: invalid options argument provided");
      assert.strictEqual(typeof options, "object", "rimraf: options should be object");
      defaults(options);
      rimraf_(p, options, function CB(er) {
        if (er) {
          if ((er.code === "EBUSY" || er.code === "ENOTEMPTY" || er.code === "EPERM") && busyTries < options.maxBusyTries) {
            busyTries++;
            const time = busyTries * 100;
            return setTimeout(() => rimraf_(p, options, CB), time);
          }
          if (er.code === "ENOENT")
            er = null;
        }
        cb(er);
      });
    }
    function rimraf_(p, options, cb) {
      assert(p);
      assert(options);
      assert(typeof cb === "function");
      options.lstat(p, (er, st) => {
        if (er && er.code === "ENOENT") {
          return cb(null);
        }
        if (er && er.code === "EPERM" && isWindows) {
          return fixWinEPERM(p, options, er, cb);
        }
        if (st && st.isDirectory()) {
          return rmdir(p, options, er, cb);
        }
        options.unlink(p, (er2) => {
          if (er2) {
            if (er2.code === "ENOENT") {
              return cb(null);
            }
            if (er2.code === "EPERM") {
              return isWindows ? fixWinEPERM(p, options, er2, cb) : rmdir(p, options, er2, cb);
            }
            if (er2.code === "EISDIR") {
              return rmdir(p, options, er2, cb);
            }
          }
          return cb(er2);
        });
      });
    }
    function fixWinEPERM(p, options, er, cb) {
      assert(p);
      assert(options);
      assert(typeof cb === "function");
      options.chmod(p, 438, (er2) => {
        if (er2) {
          cb(er2.code === "ENOENT" ? null : er);
        } else {
          options.stat(p, (er3, stats) => {
            if (er3) {
              cb(er3.code === "ENOENT" ? null : er);
            } else if (stats.isDirectory()) {
              rmdir(p, options, er, cb);
            } else {
              options.unlink(p, cb);
            }
          });
        }
      });
    }
    function fixWinEPERMSync(p, options, er) {
      let stats;
      assert(p);
      assert(options);
      try {
        options.chmodSync(p, 438);
      } catch (er2) {
        if (er2.code === "ENOENT") {
          return;
        } else {
          throw er;
        }
      }
      try {
        stats = options.statSync(p);
      } catch (er3) {
        if (er3.code === "ENOENT") {
          return;
        } else {
          throw er;
        }
      }
      if (stats.isDirectory()) {
        rmdirSync(p, options, er);
      } else {
        options.unlinkSync(p);
      }
    }
    function rmdir(p, options, originalEr, cb) {
      assert(p);
      assert(options);
      assert(typeof cb === "function");
      options.rmdir(p, (er) => {
        if (er && (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM")) {
          rmkids(p, options, cb);
        } else if (er && er.code === "ENOTDIR") {
          cb(originalEr);
        } else {
          cb(er);
        }
      });
    }
    function rmkids(p, options, cb) {
      assert(p);
      assert(options);
      assert(typeof cb === "function");
      options.readdir(p, (er, files) => {
        if (er)
          return cb(er);
        let n = files.length;
        let errState;
        if (n === 0)
          return options.rmdir(p, cb);
        files.forEach((f) => {
          rimraf(path.join(p, f), options, (er2) => {
            if (errState) {
              return;
            }
            if (er2)
              return cb(errState = er2);
            if (--n === 0) {
              options.rmdir(p, cb);
            }
          });
        });
      });
    }
    function rimrafSync(p, options) {
      let st;
      options = options || {};
      defaults(options);
      assert(p, "rimraf: missing path");
      assert.strictEqual(typeof p, "string", "rimraf: path should be a string");
      assert(options, "rimraf: missing options");
      assert.strictEqual(typeof options, "object", "rimraf: options should be object");
      try {
        st = options.lstatSync(p);
      } catch (er) {
        if (er.code === "ENOENT") {
          return;
        }
        if (er.code === "EPERM" && isWindows) {
          fixWinEPERMSync(p, options, er);
        }
      }
      try {
        if (st && st.isDirectory()) {
          rmdirSync(p, options, null);
        } else {
          options.unlinkSync(p);
        }
      } catch (er) {
        if (er.code === "ENOENT") {
          return;
        } else if (er.code === "EPERM") {
          return isWindows ? fixWinEPERMSync(p, options, er) : rmdirSync(p, options, er);
        } else if (er.code !== "EISDIR") {
          throw er;
        }
        rmdirSync(p, options, er);
      }
    }
    function rmdirSync(p, options, originalEr) {
      assert(p);
      assert(options);
      try {
        options.rmdirSync(p);
      } catch (er) {
        if (er.code === "ENOTDIR") {
          throw originalEr;
        } else if (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM") {
          rmkidsSync(p, options);
        } else if (er.code !== "ENOENT") {
          throw er;
        }
      }
    }
    function rmkidsSync(p, options) {
      assert(p);
      assert(options);
      options.readdirSync(p).forEach((f) => rimrafSync(path.join(p, f), options));
      if (isWindows) {
        const startTime = Date.now();
        do {
          try {
            const ret = options.rmdirSync(p, options);
            return ret;
          } catch {
          }
        } while (Date.now() - startTime < 500);
      } else {
        const ret = options.rmdirSync(p, options);
        return ret;
      }
    }
    module2.exports = rimraf;
    rimraf.sync = rimrafSync;
  }
});

// node_modules/fs-extra/lib/remove/index.js
var require_remove2 = __commonJS({
  "node_modules/fs-extra/lib/remove/index.js"(exports2, module2) {
    "use strict";
    var fs = require_graceful_fs();
    var u = require_universalify().fromCallback;
    var rimraf = require_rimraf();
    function remove(path, callback) {
      if (fs.rm)
        return fs.rm(path, { recursive: true, force: true }, callback);
      rimraf(path, callback);
    }
    function removeSync(path) {
      if (fs.rmSync)
        return fs.rmSync(path, { recursive: true, force: true });
      rimraf.sync(path);
    }
    module2.exports = {
      remove: u(remove),
      removeSync
    };
  }
});

// node_modules/fs-extra/lib/empty/index.js
var require_empty2 = __commonJS({
  "node_modules/fs-extra/lib/empty/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    var fs = require_fs2();
    var path = require("path");
    var mkdir = require_mkdirs2();
    var remove = require_remove2();
    var emptyDir = u(async function emptyDir2(dir) {
      let items;
      try {
        items = await fs.readdir(dir);
      } catch {
        return mkdir.mkdirs(dir);
      }
      return Promise.all(items.map((item) => remove.remove(path.join(dir, item))));
    });
    function emptyDirSync(dir) {
      let items;
      try {
        items = fs.readdirSync(dir);
      } catch {
        return mkdir.mkdirsSync(dir);
      }
      items.forEach((item) => {
        item = path.join(dir, item);
        remove.removeSync(item);
      });
    }
    module2.exports = {
      emptyDirSync,
      emptydirSync: emptyDirSync,
      emptyDir,
      emptydir: emptyDir
    };
  }
});

// node_modules/fs-extra/lib/ensure/file.js
var require_file2 = __commonJS({
  "node_modules/fs-extra/lib/ensure/file.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    var path = require("path");
    var fs = require_graceful_fs();
    var mkdir = require_mkdirs2();
    function createFile(file, callback) {
      function makeFile() {
        fs.writeFile(file, "", (err) => {
          if (err)
            return callback(err);
          callback();
        });
      }
      fs.stat(file, (err, stats) => {
        if (!err && stats.isFile())
          return callback();
        const dir = path.dirname(file);
        fs.stat(dir, (err2, stats2) => {
          if (err2) {
            if (err2.code === "ENOENT") {
              return mkdir.mkdirs(dir, (err3) => {
                if (err3)
                  return callback(err3);
                makeFile();
              });
            }
            return callback(err2);
          }
          if (stats2.isDirectory())
            makeFile();
          else {
            fs.readdir(dir, (err3) => {
              if (err3)
                return callback(err3);
            });
          }
        });
      });
    }
    function createFileSync(file) {
      let stats;
      try {
        stats = fs.statSync(file);
      } catch {
      }
      if (stats && stats.isFile())
        return;
      const dir = path.dirname(file);
      try {
        if (!fs.statSync(dir).isDirectory()) {
          fs.readdirSync(dir);
        }
      } catch (err) {
        if (err && err.code === "ENOENT")
          mkdir.mkdirsSync(dir);
        else
          throw err;
      }
      fs.writeFileSync(file, "");
    }
    module2.exports = {
      createFile: u(createFile),
      createFileSync
    };
  }
});

// node_modules/fs-extra/lib/ensure/link.js
var require_link2 = __commonJS({
  "node_modules/fs-extra/lib/ensure/link.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    var path = require("path");
    var fs = require_graceful_fs();
    var mkdir = require_mkdirs2();
    var pathExists = require_path_exists2().pathExists;
    var { areIdentical } = require_stat2();
    function createLink(srcpath, dstpath, callback) {
      function makeLink(srcpath2, dstpath2) {
        fs.link(srcpath2, dstpath2, (err) => {
          if (err)
            return callback(err);
          callback(null);
        });
      }
      fs.lstat(dstpath, (_, dstStat) => {
        fs.lstat(srcpath, (err, srcStat) => {
          if (err) {
            err.message = err.message.replace("lstat", "ensureLink");
            return callback(err);
          }
          if (dstStat && areIdentical(srcStat, dstStat))
            return callback(null);
          const dir = path.dirname(dstpath);
          pathExists(dir, (err2, dirExists) => {
            if (err2)
              return callback(err2);
            if (dirExists)
              return makeLink(srcpath, dstpath);
            mkdir.mkdirs(dir, (err3) => {
              if (err3)
                return callback(err3);
              makeLink(srcpath, dstpath);
            });
          });
        });
      });
    }
    function createLinkSync(srcpath, dstpath) {
      let dstStat;
      try {
        dstStat = fs.lstatSync(dstpath);
      } catch {
      }
      try {
        const srcStat = fs.lstatSync(srcpath);
        if (dstStat && areIdentical(srcStat, dstStat))
          return;
      } catch (err) {
        err.message = err.message.replace("lstat", "ensureLink");
        throw err;
      }
      const dir = path.dirname(dstpath);
      const dirExists = fs.existsSync(dir);
      if (dirExists)
        return fs.linkSync(srcpath, dstpath);
      mkdir.mkdirsSync(dir);
      return fs.linkSync(srcpath, dstpath);
    }
    module2.exports = {
      createLink: u(createLink),
      createLinkSync
    };
  }
});

// node_modules/fs-extra/lib/ensure/symlink-paths.js
var require_symlink_paths2 = __commonJS({
  "node_modules/fs-extra/lib/ensure/symlink-paths.js"(exports2, module2) {
    "use strict";
    var path = require("path");
    var fs = require_graceful_fs();
    var pathExists = require_path_exists2().pathExists;
    function symlinkPaths(srcpath, dstpath, callback) {
      if (path.isAbsolute(srcpath)) {
        return fs.lstat(srcpath, (err) => {
          if (err) {
            err.message = err.message.replace("lstat", "ensureSymlink");
            return callback(err);
          }
          return callback(null, {
            toCwd: srcpath,
            toDst: srcpath
          });
        });
      } else {
        const dstdir = path.dirname(dstpath);
        const relativeToDst = path.join(dstdir, srcpath);
        return pathExists(relativeToDst, (err, exists) => {
          if (err)
            return callback(err);
          if (exists) {
            return callback(null, {
              toCwd: relativeToDst,
              toDst: srcpath
            });
          } else {
            return fs.lstat(srcpath, (err2) => {
              if (err2) {
                err2.message = err2.message.replace("lstat", "ensureSymlink");
                return callback(err2);
              }
              return callback(null, {
                toCwd: srcpath,
                toDst: path.relative(dstdir, srcpath)
              });
            });
          }
        });
      }
    }
    function symlinkPathsSync(srcpath, dstpath) {
      let exists;
      if (path.isAbsolute(srcpath)) {
        exists = fs.existsSync(srcpath);
        if (!exists)
          throw new Error("absolute srcpath does not exist");
        return {
          toCwd: srcpath,
          toDst: srcpath
        };
      } else {
        const dstdir = path.dirname(dstpath);
        const relativeToDst = path.join(dstdir, srcpath);
        exists = fs.existsSync(relativeToDst);
        if (exists) {
          return {
            toCwd: relativeToDst,
            toDst: srcpath
          };
        } else {
          exists = fs.existsSync(srcpath);
          if (!exists)
            throw new Error("relative srcpath does not exist");
          return {
            toCwd: srcpath,
            toDst: path.relative(dstdir, srcpath)
          };
        }
      }
    }
    module2.exports = {
      symlinkPaths,
      symlinkPathsSync
    };
  }
});

// node_modules/fs-extra/lib/ensure/symlink-type.js
var require_symlink_type2 = __commonJS({
  "node_modules/fs-extra/lib/ensure/symlink-type.js"(exports2, module2) {
    "use strict";
    var fs = require_graceful_fs();
    function symlinkType(srcpath, type, callback) {
      callback = typeof type === "function" ? type : callback;
      type = typeof type === "function" ? false : type;
      if (type)
        return callback(null, type);
      fs.lstat(srcpath, (err, stats) => {
        if (err)
          return callback(null, "file");
        type = stats && stats.isDirectory() ? "dir" : "file";
        callback(null, type);
      });
    }
    function symlinkTypeSync(srcpath, type) {
      let stats;
      if (type)
        return type;
      try {
        stats = fs.lstatSync(srcpath);
      } catch {
        return "file";
      }
      return stats && stats.isDirectory() ? "dir" : "file";
    }
    module2.exports = {
      symlinkType,
      symlinkTypeSync
    };
  }
});

// node_modules/fs-extra/lib/ensure/symlink.js
var require_symlink2 = __commonJS({
  "node_modules/fs-extra/lib/ensure/symlink.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    var path = require("path");
    var fs = require_fs2();
    var _mkdirs = require_mkdirs2();
    var mkdirs = _mkdirs.mkdirs;
    var mkdirsSync = _mkdirs.mkdirsSync;
    var _symlinkPaths = require_symlink_paths2();
    var symlinkPaths = _symlinkPaths.symlinkPaths;
    var symlinkPathsSync = _symlinkPaths.symlinkPathsSync;
    var _symlinkType = require_symlink_type2();
    var symlinkType = _symlinkType.symlinkType;
    var symlinkTypeSync = _symlinkType.symlinkTypeSync;
    var pathExists = require_path_exists2().pathExists;
    var { areIdentical } = require_stat2();
    function createSymlink(srcpath, dstpath, type, callback) {
      callback = typeof type === "function" ? type : callback;
      type = typeof type === "function" ? false : type;
      fs.lstat(dstpath, (err, stats) => {
        if (!err && stats.isSymbolicLink()) {
          Promise.all([
            fs.stat(srcpath),
            fs.stat(dstpath)
          ]).then(([srcStat, dstStat]) => {
            if (areIdentical(srcStat, dstStat))
              return callback(null);
            _createSymlink(srcpath, dstpath, type, callback);
          });
        } else
          _createSymlink(srcpath, dstpath, type, callback);
      });
    }
    function _createSymlink(srcpath, dstpath, type, callback) {
      symlinkPaths(srcpath, dstpath, (err, relative) => {
        if (err)
          return callback(err);
        srcpath = relative.toDst;
        symlinkType(relative.toCwd, type, (err2, type2) => {
          if (err2)
            return callback(err2);
          const dir = path.dirname(dstpath);
          pathExists(dir, (err3, dirExists) => {
            if (err3)
              return callback(err3);
            if (dirExists)
              return fs.symlink(srcpath, dstpath, type2, callback);
            mkdirs(dir, (err4) => {
              if (err4)
                return callback(err4);
              fs.symlink(srcpath, dstpath, type2, callback);
            });
          });
        });
      });
    }
    function createSymlinkSync(srcpath, dstpath, type) {
      let stats;
      try {
        stats = fs.lstatSync(dstpath);
      } catch {
      }
      if (stats && stats.isSymbolicLink()) {
        const srcStat = fs.statSync(srcpath);
        const dstStat = fs.statSync(dstpath);
        if (areIdentical(srcStat, dstStat))
          return;
      }
      const relative = symlinkPathsSync(srcpath, dstpath);
      srcpath = relative.toDst;
      type = symlinkTypeSync(relative.toCwd, type);
      const dir = path.dirname(dstpath);
      const exists = fs.existsSync(dir);
      if (exists)
        return fs.symlinkSync(srcpath, dstpath, type);
      mkdirsSync(dir);
      return fs.symlinkSync(srcpath, dstpath, type);
    }
    module2.exports = {
      createSymlink: u(createSymlink),
      createSymlinkSync
    };
  }
});

// node_modules/fs-extra/lib/ensure/index.js
var require_ensure2 = __commonJS({
  "node_modules/fs-extra/lib/ensure/index.js"(exports2, module2) {
    "use strict";
    var { createFile, createFileSync } = require_file2();
    var { createLink, createLinkSync } = require_link2();
    var { createSymlink, createSymlinkSync } = require_symlink2();
    module2.exports = {
      // file
      createFile,
      createFileSync,
      ensureFile: createFile,
      ensureFileSync: createFileSync,
      // link
      createLink,
      createLinkSync,
      ensureLink: createLink,
      ensureLinkSync: createLinkSync,
      // symlink
      createSymlink,
      createSymlinkSync,
      ensureSymlink: createSymlink,
      ensureSymlinkSync: createSymlinkSync
    };
  }
});

// node_modules/fs-extra/lib/json/jsonfile.js
var require_jsonfile3 = __commonJS({
  "node_modules/fs-extra/lib/json/jsonfile.js"(exports2, module2) {
    "use strict";
    var jsonFile = require_jsonfile();
    module2.exports = {
      // jsonfile exports
      readJson: jsonFile.readFile,
      readJsonSync: jsonFile.readFileSync,
      writeJson: jsonFile.writeFile,
      writeJsonSync: jsonFile.writeFileSync
    };
  }
});

// node_modules/fs-extra/lib/output-file/index.js
var require_output_file2 = __commonJS({
  "node_modules/fs-extra/lib/output-file/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    var fs = require_graceful_fs();
    var path = require("path");
    var mkdir = require_mkdirs2();
    var pathExists = require_path_exists2().pathExists;
    function outputFile(file, data, encoding, callback) {
      if (typeof encoding === "function") {
        callback = encoding;
        encoding = "utf8";
      }
      const dir = path.dirname(file);
      pathExists(dir, (err, itDoes) => {
        if (err)
          return callback(err);
        if (itDoes)
          return fs.writeFile(file, data, encoding, callback);
        mkdir.mkdirs(dir, (err2) => {
          if (err2)
            return callback(err2);
          fs.writeFile(file, data, encoding, callback);
        });
      });
    }
    function outputFileSync(file, ...args) {
      const dir = path.dirname(file);
      if (fs.existsSync(dir)) {
        return fs.writeFileSync(file, ...args);
      }
      mkdir.mkdirsSync(dir);
      fs.writeFileSync(file, ...args);
    }
    module2.exports = {
      outputFile: u(outputFile),
      outputFileSync
    };
  }
});

// node_modules/fs-extra/lib/json/output-json.js
var require_output_json2 = __commonJS({
  "node_modules/fs-extra/lib/json/output-json.js"(exports2, module2) {
    "use strict";
    var { stringify: stringify2 } = require_utils2();
    var { outputFile } = require_output_file2();
    async function outputJson(file, data, options = {}) {
      const str = stringify2(data, options);
      await outputFile(file, str, options);
    }
    module2.exports = outputJson;
  }
});

// node_modules/fs-extra/lib/json/output-json-sync.js
var require_output_json_sync2 = __commonJS({
  "node_modules/fs-extra/lib/json/output-json-sync.js"(exports2, module2) {
    "use strict";
    var { stringify: stringify2 } = require_utils2();
    var { outputFileSync } = require_output_file2();
    function outputJsonSync(file, data, options) {
      const str = stringify2(data, options);
      outputFileSync(file, str, options);
    }
    module2.exports = outputJsonSync;
  }
});

// node_modules/fs-extra/lib/json/index.js
var require_json3 = __commonJS({
  "node_modules/fs-extra/lib/json/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromPromise;
    var jsonFile = require_jsonfile3();
    jsonFile.outputJson = u(require_output_json2());
    jsonFile.outputJsonSync = require_output_json_sync2();
    jsonFile.outputJSON = jsonFile.outputJson;
    jsonFile.outputJSONSync = jsonFile.outputJsonSync;
    jsonFile.writeJSON = jsonFile.writeJson;
    jsonFile.writeJSONSync = jsonFile.writeJsonSync;
    jsonFile.readJSON = jsonFile.readJson;
    jsonFile.readJSONSync = jsonFile.readJsonSync;
    module2.exports = jsonFile;
  }
});

// node_modules/fs-extra/lib/move/move.js
var require_move3 = __commonJS({
  "node_modules/fs-extra/lib/move/move.js"(exports2, module2) {
    "use strict";
    var fs = require_graceful_fs();
    var path = require("path");
    var copy = require_copy4().copy;
    var remove = require_remove2().remove;
    var mkdirp = require_mkdirs2().mkdirp;
    var pathExists = require_path_exists2().pathExists;
    var stat = require_stat2();
    function move(src, dest, opts, cb) {
      if (typeof opts === "function") {
        cb = opts;
        opts = {};
      }
      opts = opts || {};
      const overwrite = opts.overwrite || opts.clobber || false;
      stat.checkPaths(src, dest, "move", opts, (err, stats) => {
        if (err)
          return cb(err);
        const { srcStat, isChangingCase = false } = stats;
        stat.checkParentPaths(src, srcStat, dest, "move", (err2) => {
          if (err2)
            return cb(err2);
          if (isParentRoot(dest))
            return doRename(src, dest, overwrite, isChangingCase, cb);
          mkdirp(path.dirname(dest), (err3) => {
            if (err3)
              return cb(err3);
            return doRename(src, dest, overwrite, isChangingCase, cb);
          });
        });
      });
    }
    function isParentRoot(dest) {
      const parent = path.dirname(dest);
      const parsedPath = path.parse(parent);
      return parsedPath.root === parent;
    }
    function doRename(src, dest, overwrite, isChangingCase, cb) {
      if (isChangingCase)
        return rename(src, dest, overwrite, cb);
      if (overwrite) {
        return remove(dest, (err) => {
          if (err)
            return cb(err);
          return rename(src, dest, overwrite, cb);
        });
      }
      pathExists(dest, (err, destExists) => {
        if (err)
          return cb(err);
        if (destExists)
          return cb(new Error("dest already exists."));
        return rename(src, dest, overwrite, cb);
      });
    }
    function rename(src, dest, overwrite, cb) {
      fs.rename(src, dest, (err) => {
        if (!err)
          return cb();
        if (err.code !== "EXDEV")
          return cb(err);
        return moveAcrossDevice(src, dest, overwrite, cb);
      });
    }
    function moveAcrossDevice(src, dest, overwrite, cb) {
      const opts = {
        overwrite,
        errorOnExist: true
      };
      copy(src, dest, opts, (err) => {
        if (err)
          return cb(err);
        return remove(src, cb);
      });
    }
    module2.exports = move;
  }
});

// node_modules/fs-extra/lib/move/move-sync.js
var require_move_sync2 = __commonJS({
  "node_modules/fs-extra/lib/move/move-sync.js"(exports2, module2) {
    "use strict";
    var fs = require_graceful_fs();
    var path = require("path");
    var copySync = require_copy4().copySync;
    var removeSync = require_remove2().removeSync;
    var mkdirpSync = require_mkdirs2().mkdirpSync;
    var stat = require_stat2();
    function moveSync(src, dest, opts) {
      opts = opts || {};
      const overwrite = opts.overwrite || opts.clobber || false;
      const { srcStat, isChangingCase = false } = stat.checkPathsSync(src, dest, "move", opts);
      stat.checkParentPathsSync(src, srcStat, dest, "move");
      if (!isParentRoot(dest))
        mkdirpSync(path.dirname(dest));
      return doRename(src, dest, overwrite, isChangingCase);
    }
    function isParentRoot(dest) {
      const parent = path.dirname(dest);
      const parsedPath = path.parse(parent);
      return parsedPath.root === parent;
    }
    function doRename(src, dest, overwrite, isChangingCase) {
      if (isChangingCase)
        return rename(src, dest, overwrite);
      if (overwrite) {
        removeSync(dest);
        return rename(src, dest, overwrite);
      }
      if (fs.existsSync(dest))
        throw new Error("dest already exists.");
      return rename(src, dest, overwrite);
    }
    function rename(src, dest, overwrite) {
      try {
        fs.renameSync(src, dest);
      } catch (err) {
        if (err.code !== "EXDEV")
          throw err;
        return moveAcrossDevice(src, dest, overwrite);
      }
    }
    function moveAcrossDevice(src, dest, overwrite) {
      const opts = {
        overwrite,
        errorOnExist: true
      };
      copySync(src, dest, opts);
      return removeSync(src);
    }
    module2.exports = moveSync;
  }
});

// node_modules/fs-extra/lib/move/index.js
var require_move4 = __commonJS({
  "node_modules/fs-extra/lib/move/index.js"(exports2, module2) {
    "use strict";
    var u = require_universalify().fromCallback;
    module2.exports = {
      move: u(require_move3()),
      moveSync: require_move_sync2()
    };
  }
});

// node_modules/fs-extra/lib/index.js
var require_lib3 = __commonJS({
  "node_modules/fs-extra/lib/index.js"(exports2, module2) {
    "use strict";
    module2.exports = {
      // Export promiseified graceful-fs:
      ...require_fs2(),
      // Export extra methods:
      ...require_copy4(),
      ...require_empty2(),
      ...require_ensure2(),
      ...require_json3(),
      ...require_mkdirs2(),
      ...require_move4(),
      ...require_output_file2(),
      ...require_path_exists2(),
      ...require_remove2()
    };
  }
});

// node_modules/traverse/index.js
var require_traverse = __commonJS({
  "node_modules/traverse/index.js"(exports2, module2) {
    module2.exports = Traverse;
    function Traverse(obj) {
      if (!(this instanceof Traverse))
        return new Traverse(obj);
      this.value = obj;
    }
    Traverse.prototype.get = function(ps) {
      var node = this.value;
      for (var i = 0; i < ps.length; i++) {
        var key = ps[i];
        if (!Object.hasOwnProperty.call(node, key)) {
          node = void 0;
          break;
        }
        node = node[key];
      }
      return node;
    };
    Traverse.prototype.set = function(ps, value) {
      var node = this.value;
      for (var i = 0; i < ps.length - 1; i++) {
        var key = ps[i];
        if (!Object.hasOwnProperty.call(node, key))
          node[key] = {};
        node = node[key];
      }
      node[ps[i]] = value;
      return value;
    };
    Traverse.prototype.map = function(cb) {
      return walk(this.value, cb, true);
    };
    Traverse.prototype.forEach = function(cb) {
      this.value = walk(this.value, cb, false);
      return this.value;
    };
    Traverse.prototype.reduce = function(cb, init) {
      var skip = arguments.length === 1;
      var acc = skip ? this.value : init;
      this.forEach(function(x) {
        if (!this.isRoot || !skip) {
          acc = cb.call(this, acc, x);
        }
      });
      return acc;
    };
    Traverse.prototype.deepEqual = function(obj) {
      if (arguments.length !== 1) {
        throw new Error(
          "deepEqual requires exactly one object to compare against"
        );
      }
      var equal = true;
      var node = obj;
      this.forEach(function(y) {
        var notEqual = function() {
          equal = false;
          return void 0;
        }.bind(this);
        if (!this.isRoot) {
          if (typeof node !== "object")
            return notEqual();
          node = node[this.key];
        }
        var x = node;
        this.post(function() {
          node = x;
        });
        var toS = function(o) {
          return Object.prototype.toString.call(o);
        };
        if (this.circular) {
          if (Traverse(obj).get(this.circular.path) !== x)
            notEqual();
        } else if (typeof x !== typeof y) {
          notEqual();
        } else if (x === null || y === null || x === void 0 || y === void 0) {
          if (x !== y)
            notEqual();
        } else if (x.__proto__ !== y.__proto__) {
          notEqual();
        } else if (x === y) {
        } else if (typeof x === "function") {
          if (x instanceof RegExp) {
            if (x.toString() != y.toString())
              notEqual();
          } else if (x !== y)
            notEqual();
        } else if (typeof x === "object") {
          if (toS(y) === "[object Arguments]" || toS(x) === "[object Arguments]") {
            if (toS(x) !== toS(y)) {
              notEqual();
            }
          } else if (x instanceof Date || y instanceof Date) {
            if (!(x instanceof Date) || !(y instanceof Date) || x.getTime() !== y.getTime()) {
              notEqual();
            }
          } else {
            var kx = Object.keys(x);
            var ky = Object.keys(y);
            if (kx.length !== ky.length)
              return notEqual();
            for (var i = 0; i < kx.length; i++) {
              var k = kx[i];
              if (!Object.hasOwnProperty.call(y, k)) {
                notEqual();
              }
            }
          }
        }
      });
      return equal;
    };
    Traverse.prototype.paths = function() {
      var acc = [];
      this.forEach(function(x) {
        acc.push(this.path);
      });
      return acc;
    };
    Traverse.prototype.nodes = function() {
      var acc = [];
      this.forEach(function(x) {
        acc.push(this.node);
      });
      return acc;
    };
    Traverse.prototype.clone = function() {
      var parents = [], nodes = [];
      return function clone(src) {
        for (var i = 0; i < parents.length; i++) {
          if (parents[i] === src) {
            return nodes[i];
          }
        }
        if (typeof src === "object" && src !== null) {
          var dst = copy(src);
          parents.push(src);
          nodes.push(dst);
          Object.keys(src).forEach(function(key) {
            dst[key] = clone(src[key]);
          });
          parents.pop();
          nodes.pop();
          return dst;
        } else {
          return src;
        }
      }(this.value);
    };
    function walk(root, cb, immutable) {
      var path = [];
      var parents = [];
      var alive = true;
      return function walker(node_) {
        var node = immutable ? copy(node_) : node_;
        var modifiers = {};
        var state = {
          node,
          node_,
          path: [].concat(path),
          parent: parents.slice(-1)[0],
          key: path.slice(-1)[0],
          isRoot: path.length === 0,
          level: path.length,
          circular: null,
          update: function(x) {
            if (!state.isRoot) {
              state.parent.node[state.key] = x;
            }
            state.node = x;
          },
          "delete": function() {
            delete state.parent.node[state.key];
          },
          remove: function() {
            if (Array.isArray(state.parent.node)) {
              state.parent.node.splice(state.key, 1);
            } else {
              delete state.parent.node[state.key];
            }
          },
          before: function(f) {
            modifiers.before = f;
          },
          after: function(f) {
            modifiers.after = f;
          },
          pre: function(f) {
            modifiers.pre = f;
          },
          post: function(f) {
            modifiers.post = f;
          },
          stop: function() {
            alive = false;
          }
        };
        if (!alive)
          return state;
        if (typeof node === "object" && node !== null) {
          state.isLeaf = Object.keys(node).length == 0;
          for (var i = 0; i < parents.length; i++) {
            if (parents[i].node_ === node_) {
              state.circular = parents[i];
              break;
            }
          }
        } else {
          state.isLeaf = true;
        }
        state.notLeaf = !state.isLeaf;
        state.notRoot = !state.isRoot;
        var ret = cb.call(state, state.node);
        if (ret !== void 0 && state.update)
          state.update(ret);
        if (modifiers.before)
          modifiers.before.call(state, state.node);
        if (typeof state.node == "object" && state.node !== null && !state.circular) {
          parents.push(state);
          var keys = Object.keys(state.node);
          keys.forEach(function(key, i2) {
            path.push(key);
            if (modifiers.pre)
              modifiers.pre.call(state, state.node[key], key);
            var child = walker(state.node[key]);
            if (immutable && Object.hasOwnProperty.call(state.node, key)) {
              state.node[key] = child.node;
            }
            child.isLast = i2 == keys.length - 1;
            child.isFirst = i2 == 0;
            if (modifiers.post)
              modifiers.post.call(state, child);
            path.pop();
          });
          parents.pop();
        }
        if (modifiers.after)
          modifiers.after.call(state, state.node);
        return state;
      }(root).node;
    }
    Object.keys(Traverse.prototype).forEach(function(key) {
      Traverse[key] = function(obj) {
        var args = [].slice.call(arguments, 1);
        var t = Traverse(obj);
        return t[key].apply(t, args);
      };
    });
    function copy(src) {
      if (typeof src === "object" && src !== null) {
        var dst;
        if (Array.isArray(src)) {
          dst = [];
        } else if (src instanceof Date) {
          dst = new Date(src);
        } else if (src instanceof Boolean) {
          dst = new Boolean(src);
        } else if (src instanceof Number) {
          dst = new Number(src);
        } else if (src instanceof String) {
          dst = new String(src);
        } else {
          dst = Object.create(Object.getPrototypeOf(src));
        }
        Object.keys(src).forEach(function(key) {
          dst[key] = src[key];
        });
        return dst;
      } else
        return src;
    }
  }
});

// node_modules/chainsaw/index.js
var require_chainsaw = __commonJS({
  "node_modules/chainsaw/index.js"(exports2, module2) {
    var Traverse = require_traverse();
    var EventEmitter = require("events").EventEmitter;
    module2.exports = Chainsaw;
    function Chainsaw(builder) {
      var saw = Chainsaw.saw(builder, {});
      var r = builder.call(saw.handlers, saw);
      if (r !== void 0)
        saw.handlers = r;
      saw.record();
      return saw.chain();
    }
    Chainsaw.light = function ChainsawLight(builder) {
      var saw = Chainsaw.saw(builder, {});
      var r = builder.call(saw.handlers, saw);
      if (r !== void 0)
        saw.handlers = r;
      return saw.chain();
    };
    Chainsaw.saw = function(builder, handlers) {
      var saw = new EventEmitter();
      saw.handlers = handlers;
      saw.actions = [];
      saw.chain = function() {
        var ch = Traverse(saw.handlers).map(function(node) {
          if (this.isRoot)
            return node;
          var ps = this.path;
          if (typeof node === "function") {
            this.update(function() {
              saw.actions.push({
                path: ps,
                args: [].slice.call(arguments)
              });
              return ch;
            });
          }
        });
        process.nextTick(function() {
          saw.emit("begin");
          saw.next();
        });
        return ch;
      };
      saw.pop = function() {
        return saw.actions.shift();
      };
      saw.next = function() {
        var action = saw.pop();
        if (!action) {
          saw.emit("end");
        } else if (!action.trap) {
          var node = saw.handlers;
          action.path.forEach(function(key) {
            node = node[key];
          });
          node.apply(saw.handlers, action.args);
        }
      };
      saw.nest = function(cb) {
        var args = [].slice.call(arguments, 1);
        var autonext = true;
        if (typeof cb === "boolean") {
          var autonext = cb;
          cb = args.shift();
        }
        var s = Chainsaw.saw(builder, {});
        var r = builder.call(s.handlers, s);
        if (r !== void 0)
          s.handlers = r;
        if ("undefined" !== typeof saw.step) {
          s.record();
        }
        cb.apply(s.chain(), args);
        if (autonext !== false)
          s.on("end", saw.next);
      };
      saw.record = function() {
        upgradeChainsaw(saw);
      };
      ["trap", "down", "jump"].forEach(function(method) {
        saw[method] = function() {
          throw new Error("To use the trap, down and jump features, please call record() first to start recording actions.");
        };
      });
      return saw;
    };
    function upgradeChainsaw(saw) {
      saw.step = 0;
      saw.pop = function() {
        return saw.actions[saw.step++];
      };
      saw.trap = function(name, cb) {
        var ps = Array.isArray(name) ? name : [name];
        saw.actions.push({
          path: ps,
          step: saw.step,
          cb,
          trap: true
        });
      };
      saw.down = function(name) {
        var ps = (Array.isArray(name) ? name : [name]).join("/");
        var i = saw.actions.slice(saw.step).map(function(x) {
          if (x.trap && x.step <= saw.step)
            return false;
          return x.path.join("/") == ps;
        }).indexOf(true);
        if (i >= 0)
          saw.step += i;
        else
          saw.step = saw.actions.length;
        var act = saw.actions[saw.step - 1];
        if (act && act.trap) {
          saw.step = act.step;
          act.cb();
        } else
          saw.next();
      };
      saw.jump = function(step) {
        saw.step = step;
        saw.next();
      };
    }
  }
});

// node_modules/buffers/index.js
var require_buffers = __commonJS({
  "node_modules/buffers/index.js"(exports2, module2) {
    module2.exports = Buffers;
    function Buffers(bufs) {
      if (!(this instanceof Buffers))
        return new Buffers(bufs);
      this.buffers = bufs || [];
      this.length = this.buffers.reduce(function(size, buf) {
        return size + buf.length;
      }, 0);
    }
    Buffers.prototype.push = function() {
      for (var i = 0; i < arguments.length; i++) {
        if (!Buffer.isBuffer(arguments[i])) {
          throw new TypeError("Tried to push a non-buffer");
        }
      }
      for (var i = 0; i < arguments.length; i++) {
        var buf = arguments[i];
        this.buffers.push(buf);
        this.length += buf.length;
      }
      return this.length;
    };
    Buffers.prototype.unshift = function() {
      for (var i = 0; i < arguments.length; i++) {
        if (!Buffer.isBuffer(arguments[i])) {
          throw new TypeError("Tried to unshift a non-buffer");
        }
      }
      for (var i = 0; i < arguments.length; i++) {
        var buf = arguments[i];
        this.buffers.unshift(buf);
        this.length += buf.length;
      }
      return this.length;
    };
    Buffers.prototype.copy = function(dst, dStart, start, end) {
      return this.slice(start, end).copy(dst, dStart, 0, end - start);
    };
    Buffers.prototype.splice = function(i, howMany) {
      var buffers = this.buffers;
      var index = i >= 0 ? i : this.length - i;
      var reps = [].slice.call(arguments, 2);
      if (howMany === void 0) {
        howMany = this.length - index;
      } else if (howMany > this.length - index) {
        howMany = this.length - index;
      }
      for (var i = 0; i < reps.length; i++) {
        this.length += reps[i].length;
      }
      var removed = new Buffers();
      var bytes = 0;
      var startBytes = 0;
      for (var ii = 0; ii < buffers.length && startBytes + buffers[ii].length < index; ii++) {
        startBytes += buffers[ii].length;
      }
      if (index - startBytes > 0) {
        var start = index - startBytes;
        if (start + howMany < buffers[ii].length) {
          removed.push(buffers[ii].slice(start, start + howMany));
          var orig = buffers[ii];
          var buf0 = new Buffer(start);
          for (var i = 0; i < start; i++) {
            buf0[i] = orig[i];
          }
          var buf1 = new Buffer(orig.length - start - howMany);
          for (var i = start + howMany; i < orig.length; i++) {
            buf1[i - howMany - start] = orig[i];
          }
          if (reps.length > 0) {
            var reps_ = reps.slice();
            reps_.unshift(buf0);
            reps_.push(buf1);
            buffers.splice.apply(buffers, [ii, 1].concat(reps_));
            ii += reps_.length;
            reps = [];
          } else {
            buffers.splice(ii, 1, buf0, buf1);
            ii += 2;
          }
        } else {
          removed.push(buffers[ii].slice(start));
          buffers[ii] = buffers[ii].slice(0, start);
          ii++;
        }
      }
      if (reps.length > 0) {
        buffers.splice.apply(buffers, [ii, 0].concat(reps));
        ii += reps.length;
      }
      while (removed.length < howMany) {
        var buf = buffers[ii];
        var len = buf.length;
        var take = Math.min(len, howMany - removed.length);
        if (take === len) {
          removed.push(buf);
          buffers.splice(ii, 1);
        } else {
          removed.push(buf.slice(0, take));
          buffers[ii] = buffers[ii].slice(take);
        }
      }
      this.length -= removed.length;
      return removed;
    };
    Buffers.prototype.slice = function(i, j) {
      var buffers = this.buffers;
      if (j === void 0)
        j = this.length;
      if (i === void 0)
        i = 0;
      if (j > this.length)
        j = this.length;
      var startBytes = 0;
      for (var si = 0; si < buffers.length && startBytes + buffers[si].length <= i; si++) {
        startBytes += buffers[si].length;
      }
      var target = new Buffer(j - i);
      var ti = 0;
      for (var ii = si; ti < j - i && ii < buffers.length; ii++) {
        var len = buffers[ii].length;
        var start = ti === 0 ? i - startBytes : 0;
        var end = ti + len >= j - i ? Math.min(start + (j - i) - ti, len) : len;
        buffers[ii].copy(target, ti, start, end);
        ti += end - start;
      }
      return target;
    };
    Buffers.prototype.pos = function(i) {
      if (i < 0 || i >= this.length)
        throw new Error("oob");
      var l = i, bi = 0, bu = null;
      for (; ; ) {
        bu = this.buffers[bi];
        if (l < bu.length) {
          return { buf: bi, offset: l };
        } else {
          l -= bu.length;
        }
        bi++;
      }
    };
    Buffers.prototype.get = function get(i) {
      var pos = this.pos(i);
      return this.buffers[pos.buf].get(pos.offset);
    };
    Buffers.prototype.set = function set(i, b) {
      var pos = this.pos(i);
      return this.buffers[pos.buf].set(pos.offset, b);
    };
    Buffers.prototype.indexOf = function(needle, offset) {
      if ("string" === typeof needle) {
        needle = new Buffer(needle);
      } else if (needle instanceof Buffer) {
      } else {
        throw new Error("Invalid type for a search string");
      }
      if (!needle.length) {
        return 0;
      }
      if (!this.length) {
        return -1;
      }
      var i = 0, j = 0, match = 0, mstart, pos = 0;
      if (offset) {
        var p = this.pos(offset);
        i = p.buf;
        j = p.offset;
        pos = offset;
      }
      for (; ; ) {
        while (j >= this.buffers[i].length) {
          j = 0;
          i++;
          if (i >= this.buffers.length) {
            return -1;
          }
        }
        var char = this.buffers[i][j];
        if (char == needle[match]) {
          if (match == 0) {
            mstart = {
              i,
              j,
              pos
            };
          }
          match++;
          if (match == needle.length) {
            return mstart.pos;
          }
        } else if (match != 0) {
          i = mstart.i;
          j = mstart.j;
          pos = mstart.pos;
          match = 0;
        }
        j++;
        pos++;
      }
    };
    Buffers.prototype.toBuffer = function() {
      return this.slice();
    };
    Buffers.prototype.toString = function(encoding, start, end) {
      return this.slice(start, end).toString(encoding);
    };
  }
});

// node_modules/binary/lib/vars.js
var require_vars = __commonJS({
  "node_modules/binary/lib/vars.js"(exports2, module2) {
    module2.exports = function(store) {
      function getset(name, value) {
        var node = vars.store;
        var keys = name.split(".");
        keys.slice(0, -1).forEach(function(k) {
          if (node[k] === void 0)
            node[k] = {};
          node = node[k];
        });
        var key = keys[keys.length - 1];
        if (arguments.length == 1) {
          return node[key];
        } else {
          return node[key] = value;
        }
      }
      var vars = {
        get: function(name) {
          return getset(name);
        },
        set: function(name, value) {
          return getset(name, value);
        },
        store: store || {}
      };
      return vars;
    };
  }
});

// node_modules/binary/index.js
var require_binary2 = __commonJS({
  "node_modules/binary/index.js"(exports2, module2) {
    var Chainsaw = require_chainsaw();
    var EventEmitter = require("events").EventEmitter;
    var Buffers = require_buffers();
    var Vars = require_vars();
    var Stream = require("stream").Stream;
    exports2 = module2.exports = function(bufOrEm, eventName) {
      if (Buffer.isBuffer(bufOrEm)) {
        return exports2.parse(bufOrEm);
      }
      var s = exports2.stream();
      if (bufOrEm && bufOrEm.pipe) {
        bufOrEm.pipe(s);
      } else if (bufOrEm) {
        bufOrEm.on(eventName || "data", function(buf) {
          s.write(buf);
        });
        bufOrEm.on("end", function() {
          s.end();
        });
      }
      return s;
    };
    exports2.stream = function(input) {
      if (input)
        return exports2.apply(null, arguments);
      var pending = null;
      function getBytes(bytes, cb, skip) {
        pending = {
          bytes,
          skip,
          cb: function(buf) {
            pending = null;
            cb(buf);
          }
        };
        dispatch();
      }
      var offset = null;
      function dispatch() {
        if (!pending) {
          if (caughtEnd)
            done = true;
          return;
        }
        if (typeof pending === "function") {
          pending();
        } else {
          var bytes = offset + pending.bytes;
          if (buffers.length >= bytes) {
            var buf;
            if (offset == null) {
              buf = buffers.splice(0, bytes);
              if (!pending.skip) {
                buf = buf.slice();
              }
            } else {
              if (!pending.skip) {
                buf = buffers.slice(offset, bytes);
              }
              offset = bytes;
            }
            if (pending.skip) {
              pending.cb();
            } else {
              pending.cb(buf);
            }
          }
        }
      }
      function builder(saw) {
        function next() {
          if (!done)
            saw.next();
        }
        var self = words(function(bytes, cb) {
          return function(name) {
            getBytes(bytes, function(buf) {
              vars.set(name, cb(buf));
              next();
            });
          };
        });
        self.tap = function(cb) {
          saw.nest(cb, vars.store);
        };
        self.into = function(key, cb) {
          if (!vars.get(key))
            vars.set(key, {});
          var parent = vars;
          vars = Vars(parent.get(key));
          saw.nest(function() {
            cb.apply(this, arguments);
            this.tap(function() {
              vars = parent;
            });
          }, vars.store);
        };
        self.flush = function() {
          vars.store = {};
          next();
        };
        self.loop = function(cb) {
          var end = false;
          saw.nest(false, function loop() {
            this.vars = vars.store;
            cb.call(this, function() {
              end = true;
              next();
            }, vars.store);
            this.tap(function() {
              if (end)
                saw.next();
              else
                loop.call(this);
            }.bind(this));
          }, vars.store);
        };
        self.buffer = function(name, bytes) {
          if (typeof bytes === "string") {
            bytes = vars.get(bytes);
          }
          getBytes(bytes, function(buf) {
            vars.set(name, buf);
            next();
          });
        };
        self.skip = function(bytes) {
          if (typeof bytes === "string") {
            bytes = vars.get(bytes);
          }
          getBytes(bytes, function() {
            next();
          });
        };
        self.scan = function find(name, search) {
          if (typeof search === "string") {
            search = new Buffer(search);
          } else if (!Buffer.isBuffer(search)) {
            throw new Error("search must be a Buffer or a string");
          }
          var taken = 0;
          pending = function() {
            var pos = buffers.indexOf(search, offset + taken);
            var i = pos - offset - taken;
            if (pos !== -1) {
              pending = null;
              if (offset != null) {
                vars.set(
                  name,
                  buffers.slice(offset, offset + taken + i)
                );
                offset += taken + i + search.length;
              } else {
                vars.set(
                  name,
                  buffers.slice(0, taken + i)
                );
                buffers.splice(0, taken + i + search.length);
              }
              next();
              dispatch();
            } else {
              i = Math.max(buffers.length - search.length - offset - taken, 0);
            }
            taken += i;
          };
          dispatch();
        };
        self.peek = function(cb) {
          offset = 0;
          saw.nest(function() {
            cb.call(this, vars.store);
            this.tap(function() {
              offset = null;
            });
          });
        };
        return self;
      }
      ;
      var stream = Chainsaw.light(builder);
      stream.writable = true;
      var buffers = Buffers();
      stream.write = function(buf) {
        buffers.push(buf);
        dispatch();
      };
      var vars = Vars();
      var done = false, caughtEnd = false;
      stream.end = function() {
        caughtEnd = true;
      };
      stream.pipe = Stream.prototype.pipe;
      Object.getOwnPropertyNames(EventEmitter.prototype).forEach(function(name) {
        stream[name] = EventEmitter.prototype[name];
      });
      return stream;
    };
    exports2.parse = function parse2(buffer) {
      var self = words(function(bytes, cb) {
        return function(name) {
          if (offset + bytes <= buffer.length) {
            var buf = buffer.slice(offset, offset + bytes);
            offset += bytes;
            vars.set(name, cb(buf));
          } else {
            vars.set(name, null);
          }
          return self;
        };
      });
      var offset = 0;
      var vars = Vars();
      self.vars = vars.store;
      self.tap = function(cb) {
        cb.call(self, vars.store);
        return self;
      };
      self.into = function(key, cb) {
        if (!vars.get(key)) {
          vars.set(key, {});
        }
        var parent = vars;
        vars = Vars(parent.get(key));
        cb.call(self, vars.store);
        vars = parent;
        return self;
      };
      self.loop = function(cb) {
        var end = false;
        var ender = function() {
          end = true;
        };
        while (end === false) {
          cb.call(self, ender, vars.store);
        }
        return self;
      };
      self.buffer = function(name, size) {
        if (typeof size === "string") {
          size = vars.get(size);
        }
        var buf = buffer.slice(offset, Math.min(buffer.length, offset + size));
        offset += size;
        vars.set(name, buf);
        return self;
      };
      self.skip = function(bytes) {
        if (typeof bytes === "string") {
          bytes = vars.get(bytes);
        }
        offset += bytes;
        return self;
      };
      self.scan = function(name, search) {
        if (typeof search === "string") {
          search = new Buffer(search);
        } else if (!Buffer.isBuffer(search)) {
          throw new Error("search must be a Buffer or a string");
        }
        vars.set(name, null);
        for (var i = 0; i + offset <= buffer.length - search.length + 1; i++) {
          for (var j = 0; j < search.length && buffer[offset + i + j] === search[j]; j++)
            ;
          if (j === search.length)
            break;
        }
        vars.set(name, buffer.slice(offset, offset + i));
        offset += i + search.length;
        return self;
      };
      self.peek = function(cb) {
        var was = offset;
        cb.call(self, vars.store);
        offset = was;
        return self;
      };
      self.flush = function() {
        vars.store = {};
        return self;
      };
      self.eof = function() {
        return offset >= buffer.length;
      };
      return self;
    };
    function decodeLEu(bytes) {
      var acc = 0;
      for (var i = 0; i < bytes.length; i++) {
        acc += Math.pow(256, i) * bytes[i];
      }
      return acc;
    }
    function decodeBEu(bytes) {
      var acc = 0;
      for (var i = 0; i < bytes.length; i++) {
        acc += Math.pow(256, bytes.length - i - 1) * bytes[i];
      }
      return acc;
    }
    function decodeBEs(bytes) {
      var val = decodeBEu(bytes);
      if ((bytes[0] & 128) == 128) {
        val -= Math.pow(256, bytes.length);
      }
      return val;
    }
    function decodeLEs(bytes) {
      var val = decodeLEu(bytes);
      if ((bytes[bytes.length - 1] & 128) == 128) {
        val -= Math.pow(256, bytes.length);
      }
      return val;
    }
    function words(decode) {
      var self = {};
      [1, 2, 4, 8].forEach(function(bytes) {
        var bits = bytes * 8;
        self["word" + bits + "le"] = self["word" + bits + "lu"] = decode(bytes, decodeLEu);
        self["word" + bits + "ls"] = decode(bytes, decodeLEs);
        self["word" + bits + "be"] = self["word" + bits + "bu"] = decode(bytes, decodeBEu);
        self["word" + bits + "bs"] = decode(bytes, decodeBEs);
      });
      self.word8 = self.word8u = self.word8be;
      self.word8s = self.word8bs;
      return self;
    }
  }
});

// node_modules/unzip-stream/lib/matcher-stream.js
var require_matcher_stream = __commonJS({
  "node_modules/unzip-stream/lib/matcher-stream.js"(exports2, module2) {
    var Transform = require("stream").Transform;
    var util = require("util");
    function MatcherStream(patternDesc, matchFn) {
      if (!(this instanceof MatcherStream)) {
        return new MatcherStream();
      }
      Transform.call(this);
      var p = typeof patternDesc === "object" ? patternDesc.pattern : patternDesc;
      this.pattern = Buffer.isBuffer(p) ? p : Buffer.from(p);
      this.requiredLength = this.pattern.length;
      if (patternDesc.requiredExtraSize)
        this.requiredLength += patternDesc.requiredExtraSize;
      this.data = new Buffer("");
      this.bytesSoFar = 0;
      this.matchFn = matchFn;
    }
    util.inherits(MatcherStream, Transform);
    MatcherStream.prototype.checkDataChunk = function(ignoreMatchZero) {
      var enoughData = this.data.length >= this.requiredLength;
      if (!enoughData) {
        return;
      }
      var matchIndex = this.data.indexOf(this.pattern, ignoreMatchZero ? 1 : 0);
      if (matchIndex >= 0 && matchIndex + this.requiredLength > this.data.length) {
        if (matchIndex > 0) {
          var packet = this.data.slice(0, matchIndex);
          this.push(packet);
          this.bytesSoFar += matchIndex;
          this.data = this.data.slice(matchIndex);
        }
        return;
      }
      if (matchIndex === -1) {
        var packetLen = this.data.length - this.requiredLength + 1;
        var packet = this.data.slice(0, packetLen);
        this.push(packet);
        this.bytesSoFar += packetLen;
        this.data = this.data.slice(packetLen);
        return;
      }
      if (matchIndex > 0) {
        var packet = this.data.slice(0, matchIndex);
        this.data = this.data.slice(matchIndex);
        this.push(packet);
        this.bytesSoFar += matchIndex;
      }
      var finished = this.matchFn ? this.matchFn(this.data, this.bytesSoFar) : true;
      if (finished) {
        this.data = new Buffer("");
        return;
      }
      return true;
    };
    MatcherStream.prototype._transform = function(chunk, encoding, cb) {
      this.data = Buffer.concat([this.data, chunk]);
      var firstIteration = true;
      while (this.checkDataChunk(!firstIteration)) {
        firstIteration = false;
      }
      cb();
    };
    MatcherStream.prototype._flush = function(cb) {
      if (this.data.length > 0) {
        var firstIteration = true;
        while (this.checkDataChunk(!firstIteration)) {
          firstIteration = false;
        }
      }
      if (this.data.length > 0) {
        this.push(this.data);
        this.data = null;
      }
      cb();
    };
    module2.exports = MatcherStream;
  }
});

// node_modules/unzip-stream/lib/entry.js
var require_entry = __commonJS({
  "node_modules/unzip-stream/lib/entry.js"(exports2, module2) {
    "use strict";
    var stream = require("stream");
    var inherits = require("util").inherits;
    function Entry() {
      if (!(this instanceof Entry)) {
        return new Entry();
      }
      stream.PassThrough.call(this);
      this.path = null;
      this.type = null;
      this.isDirectory = false;
    }
    inherits(Entry, stream.PassThrough);
    Entry.prototype.autodrain = function() {
      return this.pipe(new stream.Transform({ transform: function(d, e, cb) {
        cb();
      } }));
    };
    module2.exports = Entry;
  }
});

// node_modules/unzip-stream/lib/unzip-stream.js
var require_unzip_stream = __commonJS({
  "node_modules/unzip-stream/lib/unzip-stream.js"(exports2, module2) {
    "use strict";
    var binary = require_binary2();
    var stream = require("stream");
    var util = require("util");
    var zlib = require("zlib");
    var MatcherStream = require_matcher_stream();
    var Entry = require_entry();
    var states = {
      STREAM_START: 0,
      START: 1,
      LOCAL_FILE_HEADER: 2,
      LOCAL_FILE_HEADER_SUFFIX: 3,
      FILE_DATA: 4,
      FILE_DATA_END: 5,
      DATA_DESCRIPTOR: 6,
      CENTRAL_DIRECTORY_FILE_HEADER: 7,
      CENTRAL_DIRECTORY_FILE_HEADER_SUFFIX: 8,
      CDIR64_END: 9,
      CDIR64_END_DATA_SECTOR: 10,
      CDIR64_LOCATOR: 11,
      CENTRAL_DIRECTORY_END: 12,
      CENTRAL_DIRECTORY_END_COMMENT: 13,
      TRAILING_JUNK: 14,
      ERROR: 99
    };
    var FOUR_GIGS = 4294967296;
    var SIG_LOCAL_FILE_HEADER = 67324752;
    var SIG_DATA_DESCRIPTOR = 134695760;
    var SIG_CDIR_RECORD = 33639248;
    var SIG_CDIR64_RECORD_END = 101075792;
    var SIG_CDIR64_LOCATOR_END = 117853008;
    var SIG_CDIR_RECORD_END = 101010256;
    function UnzipStream(options) {
      if (!(this instanceof UnzipStream)) {
        return new UnzipStream(options);
      }
      stream.Transform.call(this);
      this.options = options || {};
      this.data = new Buffer("");
      this.state = states.STREAM_START;
      this.skippedBytes = 0;
      this.parsedEntity = null;
      this.outStreamInfo = {};
    }
    util.inherits(UnzipStream, stream.Transform);
    UnzipStream.prototype.processDataChunk = function(chunk) {
      var requiredLength;
      switch (this.state) {
        case states.STREAM_START:
        case states.START:
          requiredLength = 4;
          break;
        case states.LOCAL_FILE_HEADER:
          requiredLength = 26;
          break;
        case states.LOCAL_FILE_HEADER_SUFFIX:
          requiredLength = this.parsedEntity.fileNameLength + this.parsedEntity.extraFieldLength;
          break;
        case states.DATA_DESCRIPTOR:
          requiredLength = 12;
          break;
        case states.CENTRAL_DIRECTORY_FILE_HEADER:
          requiredLength = 42;
          break;
        case states.CENTRAL_DIRECTORY_FILE_HEADER_SUFFIX:
          requiredLength = this.parsedEntity.fileNameLength + this.parsedEntity.extraFieldLength + this.parsedEntity.fileCommentLength;
          break;
        case states.CDIR64_END:
          requiredLength = 52;
          break;
        case states.CDIR64_END_DATA_SECTOR:
          requiredLength = this.parsedEntity.centralDirectoryRecordSize - 44;
          break;
        case states.CDIR64_LOCATOR:
          requiredLength = 16;
          break;
        case states.CENTRAL_DIRECTORY_END:
          requiredLength = 18;
          break;
        case states.CENTRAL_DIRECTORY_END_COMMENT:
          requiredLength = this.parsedEntity.commentLength;
          break;
        case states.FILE_DATA:
          return 0;
        case states.FILE_DATA_END:
          return 0;
        case states.TRAILING_JUNK:
          if (this.options.debug)
            console.log("found", chunk.length, "bytes of TRAILING_JUNK");
          return chunk.length;
        default:
          return chunk.length;
      }
      var chunkLength = chunk.length;
      if (chunkLength < requiredLength) {
        return 0;
      }
      switch (this.state) {
        case states.STREAM_START:
        case states.START:
          var signature = chunk.readUInt32LE(0);
          switch (signature) {
            case SIG_LOCAL_FILE_HEADER:
              this.state = states.LOCAL_FILE_HEADER;
              break;
            case SIG_CDIR_RECORD:
              this.state = states.CENTRAL_DIRECTORY_FILE_HEADER;
              break;
            case SIG_CDIR64_RECORD_END:
              this.state = states.CDIR64_END;
              break;
            case SIG_CDIR64_LOCATOR_END:
              this.state = states.CDIR64_LOCATOR;
              break;
            case SIG_CDIR_RECORD_END:
              this.state = states.CENTRAL_DIRECTORY_END;
              break;
            default:
              var isStreamStart = this.state === states.STREAM_START;
              if (!isStreamStart && (signature & 65535) !== 19280 && this.skippedBytes < 26) {
                var remaining = signature;
                var toSkip = 4;
                for (var i = 1; i < 4 && remaining !== 0; i++) {
                  remaining = remaining >>> 8;
                  if ((remaining & 255) === 80) {
                    toSkip = i;
                    break;
                  }
                }
                this.skippedBytes += toSkip;
                if (this.options.debug)
                  console.log("Skipped", this.skippedBytes, "bytes");
                return toSkip;
              }
              this.state = states.ERROR;
              var errMsg = isStreamStart ? "Not a valid zip file" : "Invalid signature in zip file";
              if (this.options.debug) {
                var sig = chunk.readUInt32LE(0);
                var asString;
                try {
                  asString = chunk.slice(0, 4).toString();
                } catch (e) {
                }
                console.log("Unexpected signature in zip file: 0x" + sig.toString(16), '"' + asString + '", skipped', this.skippedBytes, "bytes");
              }
              this.emit("error", new Error(errMsg));
              return chunk.length;
          }
          this.skippedBytes = 0;
          return requiredLength;
        case states.LOCAL_FILE_HEADER:
          this.parsedEntity = this._readFile(chunk);
          this.state = states.LOCAL_FILE_HEADER_SUFFIX;
          return requiredLength;
        case states.LOCAL_FILE_HEADER_SUFFIX:
          var entry = new Entry();
          var isUtf8 = (this.parsedEntity.flags & 2048) !== 0;
          entry.path = this._decodeString(chunk.slice(0, this.parsedEntity.fileNameLength), isUtf8);
          var extraDataBuffer = chunk.slice(this.parsedEntity.fileNameLength, this.parsedEntity.fileNameLength + this.parsedEntity.extraFieldLength);
          var extra = this._readExtraFields(extraDataBuffer);
          if (extra && extra.parsed) {
            if (extra.parsed.path && !isUtf8) {
              entry.path = extra.parsed.path;
            }
            if (Number.isFinite(extra.parsed.uncompressedSize) && this.parsedEntity.uncompressedSize === FOUR_GIGS - 1) {
              this.parsedEntity.uncompressedSize = extra.parsed.uncompressedSize;
            }
            if (Number.isFinite(extra.parsed.compressedSize) && this.parsedEntity.compressedSize === FOUR_GIGS - 1) {
              this.parsedEntity.compressedSize = extra.parsed.compressedSize;
            }
          }
          this.parsedEntity.extra = extra.parsed || {};
          if (this.options.debug) {
            const debugObj = Object.assign({}, this.parsedEntity, {
              path: entry.path,
              flags: "0x" + this.parsedEntity.flags.toString(16),
              extraFields: extra && extra.debug
            });
            console.log("decoded LOCAL_FILE_HEADER:", JSON.stringify(debugObj, null, 2));
          }
          this._prepareOutStream(this.parsedEntity, entry);
          this.emit("entry", entry);
          this.state = states.FILE_DATA;
          return requiredLength;
        case states.CENTRAL_DIRECTORY_FILE_HEADER:
          this.parsedEntity = this._readCentralDirectoryEntry(chunk);
          this.state = states.CENTRAL_DIRECTORY_FILE_HEADER_SUFFIX;
          return requiredLength;
        case states.CENTRAL_DIRECTORY_FILE_HEADER_SUFFIX:
          var isUtf8 = (this.parsedEntity.flags & 2048) !== 0;
          var path = this._decodeString(chunk.slice(0, this.parsedEntity.fileNameLength), isUtf8);
          var extraDataBuffer = chunk.slice(this.parsedEntity.fileNameLength, this.parsedEntity.fileNameLength + this.parsedEntity.extraFieldLength);
          var extra = this._readExtraFields(extraDataBuffer);
          if (extra && extra.parsed && extra.parsed.path && !isUtf8) {
            path = extra.parsed.path;
          }
          this.parsedEntity.extra = extra.parsed;
          var isUnix = (this.parsedEntity.versionMadeBy & 65280) >> 8 === 3;
          var unixAttrs, isSymlink;
          if (isUnix) {
            unixAttrs = this.parsedEntity.externalFileAttributes >>> 16;
            var fileType = unixAttrs >>> 12;
            isSymlink = (fileType & 10) === 10;
          }
          if (this.options.debug) {
            const debugObj = Object.assign({}, this.parsedEntity, {
              path,
              flags: "0x" + this.parsedEntity.flags.toString(16),
              unixAttrs: unixAttrs && "0" + unixAttrs.toString(8),
              isSymlink,
              extraFields: extra.debug
            });
            console.log("decoded CENTRAL_DIRECTORY_FILE_HEADER:", JSON.stringify(debugObj, null, 2));
          }
          this.state = states.START;
          return requiredLength;
        case states.CDIR64_END:
          this.parsedEntity = this._readEndOfCentralDirectory64(chunk);
          if (this.options.debug) {
            console.log("decoded CDIR64_END_RECORD:", this.parsedEntity);
          }
          this.state = states.CDIR64_END_DATA_SECTOR;
          return requiredLength;
        case states.CDIR64_END_DATA_SECTOR:
          this.state = states.START;
          return requiredLength;
        case states.CDIR64_LOCATOR:
          this.state = states.START;
          return requiredLength;
        case states.CENTRAL_DIRECTORY_END:
          this.parsedEntity = this._readEndOfCentralDirectory(chunk);
          if (this.options.debug) {
            console.log("decoded CENTRAL_DIRECTORY_END:", this.parsedEntity);
          }
          this.state = states.CENTRAL_DIRECTORY_END_COMMENT;
          return requiredLength;
        case states.CENTRAL_DIRECTORY_END_COMMENT:
          if (this.options.debug) {
            console.log("decoded CENTRAL_DIRECTORY_END_COMMENT:", chunk.slice(0, requiredLength).toString());
          }
          this.state = states.TRAILING_JUNK;
          return requiredLength;
        case states.ERROR:
          return chunk.length;
        default:
          console.log("didn't handle state #", this.state, "discarding");
          return chunk.length;
      }
    };
    UnzipStream.prototype._prepareOutStream = function(vars, entry) {
      var self = this;
      var isDirectory = vars.uncompressedSize === 0 && /[\/\\]$/.test(entry.path);
      entry.path = entry.path.replace(/^([/\\]*[.]+[/\\]+)*[/\\]*/, "");
      entry.type = isDirectory ? "Directory" : "File";
      entry.isDirectory = isDirectory;
      var fileSizeKnown = !(vars.flags & 8);
      if (fileSizeKnown) {
        entry.size = vars.uncompressedSize;
      }
      var isVersionSupported = vars.versionsNeededToExtract <= 45;
      this.outStreamInfo = {
        stream: null,
        limit: fileSizeKnown ? vars.compressedSize : -1,
        written: 0
      };
      if (!fileSizeKnown) {
        var pattern = new Buffer(4);
        pattern.writeUInt32LE(SIG_DATA_DESCRIPTOR, 0);
        var zip64Mode = vars.extra.zip64Mode;
        var extraSize = zip64Mode ? 20 : 12;
        var searchPattern = {
          pattern,
          requiredExtraSize: extraSize
        };
        var matcherStream = new MatcherStream(searchPattern, function(matchedChunk, sizeSoFar) {
          var vars2 = self._readDataDescriptor(matchedChunk, zip64Mode);
          var compressedSizeMatches = vars2.compressedSize === sizeSoFar;
          if (!zip64Mode && !compressedSizeMatches && sizeSoFar >= FOUR_GIGS) {
            var overflown = sizeSoFar - FOUR_GIGS;
            while (overflown >= 0) {
              compressedSizeMatches = vars2.compressedSize === overflown;
              if (compressedSizeMatches)
                break;
              overflown -= FOUR_GIGS;
            }
          }
          if (!compressedSizeMatches) {
            return;
          }
          self.state = states.FILE_DATA_END;
          var sliceOffset = zip64Mode ? 24 : 16;
          if (self.data.length > 0) {
            self.data = Buffer.concat([matchedChunk.slice(sliceOffset), self.data]);
          } else {
            self.data = matchedChunk.slice(sliceOffset);
          }
          return true;
        });
        this.outStreamInfo.stream = matcherStream;
      } else {
        this.outStreamInfo.stream = new stream.PassThrough();
      }
      var isEncrypted = vars.flags & 1 || vars.flags & 64;
      if (isEncrypted || !isVersionSupported) {
        var message = isEncrypted ? "Encrypted files are not supported!" : "Zip version " + Math.floor(vars.versionsNeededToExtract / 10) + "." + vars.versionsNeededToExtract % 10 + " is not supported";
        entry.skip = true;
        setImmediate(() => {
          entry.emit("error", new Error(message));
        });
        this.outStreamInfo.stream.pipe(new Entry().autodrain());
        return;
      }
      var isCompressed = vars.compressionMethod > 0;
      if (isCompressed) {
        var inflater = zlib.createInflateRaw();
        inflater.on("error", function(err) {
          self.state = states.ERROR;
          self.emit("error", err);
        });
        this.outStreamInfo.stream.pipe(inflater).pipe(entry);
      } else {
        this.outStreamInfo.stream.pipe(entry);
      }
      if (this._drainAllEntries) {
        entry.autodrain();
      }
    };
    UnzipStream.prototype._readFile = function(data) {
      var vars = binary.parse(data).word16lu("versionsNeededToExtract").word16lu("flags").word16lu("compressionMethod").word16lu("lastModifiedTime").word16lu("lastModifiedDate").word32lu("crc32").word32lu("compressedSize").word32lu("uncompressedSize").word16lu("fileNameLength").word16lu("extraFieldLength").vars;
      return vars;
    };
    UnzipStream.prototype._readExtraFields = function(data) {
      var extra = {};
      var result = { parsed: extra };
      if (this.options.debug) {
        result.debug = [];
      }
      var index = 0;
      while (index < data.length) {
        var vars = binary.parse(data).skip(index).word16lu("extraId").word16lu("extraSize").vars;
        index += 4;
        var fieldType = void 0;
        switch (vars.extraId) {
          case 1:
            fieldType = "Zip64 extended information extra field";
            var z64vars = binary.parse(data.slice(index, index + vars.extraSize)).word64lu("uncompressedSize").word64lu("compressedSize").word64lu("offsetToLocalHeader").word32lu("diskStartNumber").vars;
            if (z64vars.uncompressedSize !== null) {
              extra.uncompressedSize = z64vars.uncompressedSize;
            }
            if (z64vars.compressedSize !== null) {
              extra.compressedSize = z64vars.compressedSize;
            }
            extra.zip64Mode = true;
            break;
          case 10:
            fieldType = "NTFS extra field";
            break;
          case 21589:
            fieldType = "extended timestamp";
            var timestampFields = data.readUInt8(index);
            var offset = 1;
            if (vars.extraSize >= offset + 4 && timestampFields & 1) {
              extra.mtime = new Date(data.readUInt32LE(index + offset) * 1e3);
              offset += 4;
            }
            if (vars.extraSize >= offset + 4 && timestampFields & 2) {
              extra.atime = new Date(data.readUInt32LE(index + offset) * 1e3);
              offset += 4;
            }
            if (vars.extraSize >= offset + 4 && timestampFields & 4) {
              extra.ctime = new Date(data.readUInt32LE(index + offset) * 1e3);
            }
            break;
          case 28789:
            fieldType = "Info-ZIP Unicode Path Extra Field";
            var fieldVer = data.readUInt8(index);
            if (fieldVer === 1) {
              var offset = 1;
              var nameCrc32 = data.readUInt32LE(index + offset);
              offset += 4;
              var pathBuffer = data.slice(index + offset);
              extra.path = pathBuffer.toString();
            }
            break;
          case 13:
          case 22613:
            fieldType = vars.extraId === 13 ? "PKWARE Unix" : "Info-ZIP UNIX (type 1)";
            var offset = 0;
            if (vars.extraSize >= 8) {
              var atime = new Date(data.readUInt32LE(index + offset) * 1e3);
              offset += 4;
              var mtime = new Date(data.readUInt32LE(index + offset) * 1e3);
              offset += 4;
              extra.atime = atime;
              extra.mtime = mtime;
              if (vars.extraSize >= 12) {
                var uid = data.readUInt16LE(index + offset);
                offset += 2;
                var gid = data.readUInt16LE(index + offset);
                offset += 2;
                extra.uid = uid;
                extra.gid = gid;
              }
            }
            break;
          case 30805:
            fieldType = "Info-ZIP UNIX (type 2)";
            var offset = 0;
            if (vars.extraSize >= 4) {
              var uid = data.readUInt16LE(index + offset);
              offset += 2;
              var gid = data.readUInt16LE(index + offset);
              offset += 2;
              extra.uid = uid;
              extra.gid = gid;
            }
            break;
          case 30837:
            fieldType = "Info-ZIP New Unix";
            var offset = 0;
            var extraVer = data.readUInt8(index);
            offset += 1;
            if (extraVer === 1) {
              var uidSize = data.readUInt8(index + offset);
              offset += 1;
              if (uidSize <= 6) {
                extra.uid = data.readUIntLE(index + offset, uidSize);
              }
              offset += uidSize;
              var gidSize = data.readUInt8(index + offset);
              offset += 1;
              if (gidSize <= 6) {
                extra.gid = data.readUIntLE(index + offset, gidSize);
              }
            }
            break;
          case 30062:
            fieldType = "ASi Unix";
            var offset = 0;
            if (vars.extraSize >= 14) {
              var crc = data.readUInt32LE(index + offset);
              offset += 4;
              var mode = data.readUInt16LE(index + offset);
              offset += 2;
              var sizdev = data.readUInt32LE(index + offset);
              offset += 4;
              var uid = data.readUInt16LE(index + offset);
              offset += 2;
              var gid = data.readUInt16LE(index + offset);
              offset += 2;
              extra.mode = mode;
              extra.uid = uid;
              extra.gid = gid;
              if (vars.extraSize > 14) {
                var start = index + offset;
                var end = index + vars.extraSize - 14;
                var symlinkName = this._decodeString(data.slice(start, end));
                extra.symlink = symlinkName;
              }
            }
            break;
        }
        if (this.options.debug) {
          result.debug.push({
            extraId: "0x" + vars.extraId.toString(16),
            description: fieldType,
            data: data.slice(index, index + vars.extraSize).inspect()
          });
        }
        index += vars.extraSize;
      }
      return result;
    };
    UnzipStream.prototype._readDataDescriptor = function(data, zip64Mode) {
      if (zip64Mode) {
        var vars = binary.parse(data).word32lu("dataDescriptorSignature").word32lu("crc32").word64lu("compressedSize").word64lu("uncompressedSize").vars;
        return vars;
      }
      var vars = binary.parse(data).word32lu("dataDescriptorSignature").word32lu("crc32").word32lu("compressedSize").word32lu("uncompressedSize").vars;
      return vars;
    };
    UnzipStream.prototype._readCentralDirectoryEntry = function(data) {
      var vars = binary.parse(data).word16lu("versionMadeBy").word16lu("versionsNeededToExtract").word16lu("flags").word16lu("compressionMethod").word16lu("lastModifiedTime").word16lu("lastModifiedDate").word32lu("crc32").word32lu("compressedSize").word32lu("uncompressedSize").word16lu("fileNameLength").word16lu("extraFieldLength").word16lu("fileCommentLength").word16lu("diskNumber").word16lu("internalFileAttributes").word32lu("externalFileAttributes").word32lu("offsetToLocalFileHeader").vars;
      return vars;
    };
    UnzipStream.prototype._readEndOfCentralDirectory64 = function(data) {
      var vars = binary.parse(data).word64lu("centralDirectoryRecordSize").word16lu("versionMadeBy").word16lu("versionsNeededToExtract").word32lu("diskNumber").word32lu("diskNumberWithCentralDirectoryStart").word64lu("centralDirectoryEntries").word64lu("totalCentralDirectoryEntries").word64lu("sizeOfCentralDirectory").word64lu("offsetToStartOfCentralDirectory").vars;
      return vars;
    };
    UnzipStream.prototype._readEndOfCentralDirectory = function(data) {
      var vars = binary.parse(data).word16lu("diskNumber").word16lu("diskStart").word16lu("centralDirectoryEntries").word16lu("totalCentralDirectoryEntries").word32lu("sizeOfCentralDirectory").word32lu("offsetToStartOfCentralDirectory").word16lu("commentLength").vars;
      return vars;
    };
    var cp437 = "\0\u263A\u263B\u2665\u2666\u2663\u2660\u2022\u25D8\u25CB\u25D9\u2642\u2640\u266A\u266B\u263C\u25BA\u25C4\u2195\u203C\xB6\xA7\u25AC\u21A8\u2191\u2193\u2192\u2190\u221F\u2194\u25B2\u25BC !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\u2302\xC7\xFC\xE9\xE2\xE4\xE0\xE5\xE7\xEA\xEB\xE8\xEF\xEE\xEC\xC4\xC5\xC9\xE6\xC6\xF4\xF6\xF2\xFB\xF9\xFF\xD6\xDC\xA2\xA3\xA5\u20A7\u0192\xE1\xED\xF3\xFA\xF1\xD1\xAA\xBA\xBF\u2310\xAC\xBD\xBC\xA1\xAB\xBB\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255D\u255C\u255B\u2510\u2514\u2534\u252C\u251C\u2500\u253C\u255E\u255F\u255A\u2554\u2569\u2566\u2560\u2550\u256C\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256B\u256A\u2518\u250C\u2588\u2584\u258C\u2590\u2580\u03B1\xDF\u0393\u03C0\u03A3\u03C3\xB5\u03C4\u03A6\u0398\u03A9\u03B4\u221E\u03C6\u03B5\u2229\u2261\xB1\u2265\u2264\u2320\u2321\xF7\u2248\xB0\u2219\xB7\u221A\u207F\xB2\u25A0 ";
    UnzipStream.prototype._decodeString = function(buffer, isUtf8) {
      if (isUtf8) {
        return buffer.toString("utf8");
      }
      if (this.options.decodeString) {
        return this.options.decodeString(buffer);
      }
      let result = "";
      for (var i = 0; i < buffer.length; i++) {
        result += cp437[buffer[i]];
      }
      return result;
    };
    UnzipStream.prototype._parseOrOutput = function(encoding, cb) {
      var consume;
      while ((consume = this.processDataChunk(this.data)) > 0) {
        this.data = this.data.slice(consume);
        if (this.data.length === 0)
          break;
      }
      if (this.state === states.FILE_DATA) {
        if (this.outStreamInfo.limit >= 0) {
          var remaining = this.outStreamInfo.limit - this.outStreamInfo.written;
          var packet;
          if (remaining < this.data.length) {
            packet = this.data.slice(0, remaining);
            this.data = this.data.slice(remaining);
          } else {
            packet = this.data;
            this.data = new Buffer("");
          }
          this.outStreamInfo.written += packet.length;
          if (this.outStreamInfo.limit === this.outStreamInfo.written) {
            this.state = states.START;
            this.outStreamInfo.stream.end(packet, encoding, cb);
          } else {
            this.outStreamInfo.stream.write(packet, encoding, cb);
          }
        } else {
          var packet = this.data;
          this.data = new Buffer("");
          this.outStreamInfo.written += packet.length;
          var outputStream = this.outStreamInfo.stream;
          outputStream.write(packet, encoding, () => {
            if (this.state === states.FILE_DATA_END) {
              this.state = states.START;
              return outputStream.end(cb);
            }
            cb();
          });
        }
        return;
      }
      cb();
    };
    UnzipStream.prototype.drainAll = function() {
      this._drainAllEntries = true;
    };
    UnzipStream.prototype._transform = function(chunk, encoding, cb) {
      var self = this;
      if (self.data.length > 0) {
        self.data = Buffer.concat([self.data, chunk]);
      } else {
        self.data = chunk;
      }
      var startDataLength = self.data.length;
      var done = function() {
        if (self.data.length > 0 && self.data.length < startDataLength) {
          startDataLength = self.data.length;
          self._parseOrOutput(encoding, done);
          return;
        }
        cb();
      };
      self._parseOrOutput(encoding, done);
    };
    UnzipStream.prototype._flush = function(cb) {
      var self = this;
      if (self.data.length > 0) {
        self._parseOrOutput("buffer", function() {
          if (self.data.length > 0)
            return setImmediate(function() {
              self._flush(cb);
            });
          cb();
        });
        return;
      }
      if (self.state === states.FILE_DATA) {
        return cb(new Error("Stream finished in an invalid state, uncompression failed"));
      }
      setImmediate(cb);
    };
    module2.exports = UnzipStream;
  }
});

// node_modules/unzip-stream/lib/parser-stream.js
var require_parser_stream = __commonJS({
  "node_modules/unzip-stream/lib/parser-stream.js"(exports2, module2) {
    var Transform = require("stream").Transform;
    var util = require("util");
    var UnzipStream = require_unzip_stream();
    function ParserStream(opts) {
      if (!(this instanceof ParserStream)) {
        return new ParserStream(opts);
      }
      var transformOpts = opts || {};
      Transform.call(this, { readableObjectMode: true });
      this.opts = opts || {};
      this.unzipStream = new UnzipStream(this.opts);
      var self = this;
      this.unzipStream.on("entry", function(entry) {
        self.push(entry);
      });
      this.unzipStream.on("error", function(error) {
        self.emit("error", error);
      });
    }
    util.inherits(ParserStream, Transform);
    ParserStream.prototype._transform = function(chunk, encoding, cb) {
      this.unzipStream.write(chunk, encoding, cb);
    };
    ParserStream.prototype._flush = function(cb) {
      var self = this;
      this.unzipStream.end(function() {
        process.nextTick(function() {
          self.emit("close");
        });
        cb();
      });
    };
    ParserStream.prototype.on = function(eventName, fn) {
      if (eventName === "entry") {
        return Transform.prototype.on.call(this, "data", fn);
      }
      return Transform.prototype.on.call(this, eventName, fn);
    };
    ParserStream.prototype.drainAll = function() {
      this.unzipStream.drainAll();
      return this.pipe(new Transform({ objectMode: true, transform: function(d, e, cb) {
        cb();
      } }));
    };
    module2.exports = ParserStream;
  }
});

// node_modules/mkdirp/index.js
var require_mkdirp = __commonJS({
  "node_modules/mkdirp/index.js"(exports2, module2) {
    var path = require("path");
    var fs = require("fs");
    var _0777 = parseInt("0777", 8);
    module2.exports = mkdirP.mkdirp = mkdirP.mkdirP = mkdirP;
    function mkdirP(p, opts, f, made) {
      if (typeof opts === "function") {
        f = opts;
        opts = {};
      } else if (!opts || typeof opts !== "object") {
        opts = { mode: opts };
      }
      var mode = opts.mode;
      var xfs = opts.fs || fs;
      if (mode === void 0) {
        mode = _0777;
      }
      if (!made)
        made = null;
      var cb = f || /* istanbul ignore next */
      function() {
      };
      p = path.resolve(p);
      xfs.mkdir(p, mode, function(er) {
        if (!er) {
          made = made || p;
          return cb(null, made);
        }
        switch (er.code) {
          case "ENOENT":
            if (path.dirname(p) === p)
              return cb(er);
            mkdirP(path.dirname(p), opts, function(er2, made2) {
              if (er2)
                cb(er2, made2);
              else
                mkdirP(p, opts, cb, made2);
            });
            break;
          default:
            xfs.stat(p, function(er2, stat) {
              if (er2 || !stat.isDirectory())
                cb(er, made);
              else
                cb(null, made);
            });
            break;
        }
      });
    }
    mkdirP.sync = function sync(p, opts, made) {
      if (!opts || typeof opts !== "object") {
        opts = { mode: opts };
      }
      var mode = opts.mode;
      var xfs = opts.fs || fs;
      if (mode === void 0) {
        mode = _0777;
      }
      if (!made)
        made = null;
      p = path.resolve(p);
      try {
        xfs.mkdirSync(p, mode);
        made = made || p;
      } catch (err0) {
        switch (err0.code) {
          case "ENOENT":
            made = sync(path.dirname(p), opts, made);
            sync(p, opts, made);
            break;
          default:
            var stat;
            try {
              stat = xfs.statSync(p);
            } catch (err1) {
              throw err0;
            }
            if (!stat.isDirectory())
              throw err0;
            break;
        }
      }
      return made;
    };
  }
});

// node_modules/unzip-stream/lib/extract.js
var require_extract = __commonJS({
  "node_modules/unzip-stream/lib/extract.js"(exports2, module2) {
    var fs = require("fs");
    var path = require("path");
    var util = require("util");
    var mkdirp = require_mkdirp();
    var Transform = require("stream").Transform;
    var UnzipStream = require_unzip_stream();
    function Extract(opts) {
      if (!(this instanceof Extract))
        return new Extract(opts);
      Transform.call(this);
      this.opts = opts || {};
      this.unzipStream = new UnzipStream(this.opts);
      this.unfinishedEntries = 0;
      this.afterFlushWait = false;
      this.createdDirectories = {};
      var self = this;
      this.unzipStream.on("entry", this._processEntry.bind(this));
      this.unzipStream.on("error", function(error) {
        self.emit("error", error);
      });
    }
    util.inherits(Extract, Transform);
    Extract.prototype._transform = function(chunk, encoding, cb) {
      this.unzipStream.write(chunk, encoding, cb);
    };
    Extract.prototype._flush = function(cb) {
      var self = this;
      var allDone = function() {
        process.nextTick(function() {
          self.emit("close");
        });
        cb();
      };
      this.unzipStream.end(function() {
        if (self.unfinishedEntries > 0) {
          self.afterFlushWait = true;
          return self.on("await-finished", allDone);
        }
        allDone();
      });
    };
    Extract.prototype._processEntry = function(entry) {
      var self = this;
      var destPath = path.join(this.opts.path, entry.path);
      var directory = entry.isDirectory ? destPath : path.dirname(destPath);
      this.unfinishedEntries++;
      var writeFileFn = function() {
        var pipedStream = fs.createWriteStream(destPath);
        pipedStream.on("close", function() {
          self.unfinishedEntries--;
          self._notifyAwaiter();
        });
        pipedStream.on("error", function(error) {
          self.emit("error", error);
        });
        entry.pipe(pipedStream);
      };
      if (this.createdDirectories[directory] || directory === ".") {
        return writeFileFn();
      }
      mkdirp(directory, function(err) {
        if (err)
          return self.emit("error", err);
        self.createdDirectories[directory] = true;
        if (entry.isDirectory) {
          self.unfinishedEntries--;
          self._notifyAwaiter();
          return;
        }
        writeFileFn();
      });
    };
    Extract.prototype._notifyAwaiter = function() {
      if (this.afterFlushWait && this.unfinishedEntries === 0) {
        this.emit("await-finished");
        this.afterFlushWait = false;
      }
    };
    module2.exports = Extract;
  }
});

// node_modules/unzip-stream/unzip.js
var require_unzip = __commonJS({
  "node_modules/unzip-stream/unzip.js"(exports2) {
    "use strict";
    exports2.Parse = require_parser_stream();
    exports2.Extract = require_extract();
  }
});

// node_modules/@actions/artifact/lib/internal/path-and-artifact-name-validation.js
var require_path_and_artifact_name_validation = __commonJS({
  "node_modules/@actions/artifact/lib/internal/path-and-artifact-name-validation.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.checkArtifactFilePath = exports2.checkArtifactName = void 0;
    var core_1 = require_core();
    var invalidArtifactFilePathCharacters = /* @__PURE__ */ new Map([
      ['"', ' Double quote "'],
      [":", " Colon :"],
      ["<", " Less than <"],
      [">", " Greater than >"],
      ["|", " Vertical bar |"],
      ["*", " Asterisk *"],
      ["?", " Question mark ?"],
      ["\r", " Carriage return \\r"],
      ["\n", " Line feed \\n"]
    ]);
    var invalidArtifactNameCharacters = new Map([
      ...invalidArtifactFilePathCharacters,
      ["\\", " Backslash \\"],
      ["/", " Forward slash /"]
    ]);
    function checkArtifactName(name) {
      if (!name) {
        throw new Error(`Artifact name: ${name}, is incorrectly provided`);
      }
      for (const [invalidCharacterKey, errorMessageForCharacter] of invalidArtifactNameCharacters) {
        if (name.includes(invalidCharacterKey)) {
          throw new Error(`Artifact name is not valid: ${name}. Contains the following character: ${errorMessageForCharacter}
          
Invalid characters include: ${Array.from(invalidArtifactNameCharacters.values()).toString()}
          
These characters are not allowed in the artifact name due to limitations with certain file systems such as NTFS. To maintain file system agnostic behavior, these characters are intentionally not allowed to prevent potential problems with downloads on different file systems.`);
        }
      }
      core_1.info(`Artifact name is valid!`);
    }
    exports2.checkArtifactName = checkArtifactName;
    function checkArtifactFilePath(path) {
      if (!path) {
        throw new Error(`Artifact path: ${path}, is incorrectly provided`);
      }
      for (const [invalidCharacterKey, errorMessageForCharacter] of invalidArtifactFilePathCharacters) {
        if (path.includes(invalidCharacterKey)) {
          throw new Error(`Artifact path is not valid: ${path}. Contains the following character: ${errorMessageForCharacter}
          
Invalid characters include: ${Array.from(invalidArtifactFilePathCharacters.values()).toString()}
          
The following characters are not allowed in files that are uploaded due to limitations with certain file systems such as NTFS. To maintain file system agnostic behavior, these characters are intentionally not allowed to prevent potential problems with downloads on different file systems.
          `);
        }
      }
    }
    exports2.checkArtifactFilePath = checkArtifactFilePath;
  }
});

// node_modules/@actions/artifact/lib/internal/upload-specification.js
var require_upload_specification = __commonJS({
  "node_modules/@actions/artifact/lib/internal/upload-specification.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getUploadSpecification = void 0;
    var fs = __importStar(require("fs"));
    var core_1 = require_core();
    var path_1 = require("path");
    var path_and_artifact_name_validation_1 = require_path_and_artifact_name_validation();
    function getUploadSpecification(artifactName, rootDirectory, artifactFiles) {
      const specifications = [];
      if (!fs.existsSync(rootDirectory)) {
        throw new Error(`Provided rootDirectory ${rootDirectory} does not exist`);
      }
      if (!fs.lstatSync(rootDirectory).isDirectory()) {
        throw new Error(`Provided rootDirectory ${rootDirectory} is not a valid directory`);
      }
      rootDirectory = path_1.normalize(rootDirectory);
      rootDirectory = path_1.resolve(rootDirectory);
      for (let file of artifactFiles) {
        if (!fs.existsSync(file)) {
          throw new Error(`File ${file} does not exist`);
        }
        if (!fs.lstatSync(file).isDirectory()) {
          file = path_1.normalize(file);
          file = path_1.resolve(file);
          if (!file.startsWith(rootDirectory)) {
            throw new Error(`The rootDirectory: ${rootDirectory} is not a parent directory of the file: ${file}`);
          }
          const uploadPath = file.replace(rootDirectory, "");
          path_and_artifact_name_validation_1.checkArtifactFilePath(uploadPath);
          specifications.push({
            absoluteFilePath: file,
            uploadFilePath: path_1.join(artifactName, uploadPath)
          });
        } else {
          core_1.debug(`Removing ${file} from rawSearchResults because it is a directory`);
        }
      }
      return specifications;
    }
    exports2.getUploadSpecification = getUploadSpecification;
  }
});

// node_modules/fs.realpath/old.js
var require_old = __commonJS({
  "node_modules/fs.realpath/old.js"(exports2) {
    var pathModule = require("path");
    var isWindows = process.platform === "win32";
    var fs = require("fs");
    var DEBUG = process.env.NODE_DEBUG && /fs/.test(process.env.NODE_DEBUG);
    function rethrow() {
      var callback;
      if (DEBUG) {
        var backtrace = new Error();
        callback = debugCallback;
      } else
        callback = missingCallback;
      return callback;
      function debugCallback(err) {
        if (err) {
          backtrace.message = err.message;
          err = backtrace;
          missingCallback(err);
        }
      }
      function missingCallback(err) {
        if (err) {
          if (process.throwDeprecation)
            throw err;
          else if (!process.noDeprecation) {
            var msg = "fs: missing callback " + (err.stack || err.message);
            if (process.traceDeprecation)
              console.trace(msg);
            else
              console.error(msg);
          }
        }
      }
    }
    function maybeCallback(cb) {
      return typeof cb === "function" ? cb : rethrow();
    }
    var normalize = pathModule.normalize;
    if (isWindows) {
      nextPartRe = /(.*?)(?:[\/\\]+|$)/g;
    } else {
      nextPartRe = /(.*?)(?:[\/]+|$)/g;
    }
    var nextPartRe;
    if (isWindows) {
      splitRootRe = /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/;
    } else {
      splitRootRe = /^[\/]*/;
    }
    var splitRootRe;
    exports2.realpathSync = function realpathSync(p, cache) {
      p = pathModule.resolve(p);
      if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
        return cache[p];
      }
      var original = p, seenLinks = {}, knownHard = {};
      var pos;
      var current;
      var base;
      var previous;
      start();
      function start() {
        var m = splitRootRe.exec(p);
        pos = m[0].length;
        current = m[0];
        base = m[0];
        previous = "";
        if (isWindows && !knownHard[base]) {
          fs.lstatSync(base);
          knownHard[base] = true;
        }
      }
      while (pos < p.length) {
        nextPartRe.lastIndex = pos;
        var result = nextPartRe.exec(p);
        previous = current;
        current += result[0];
        base = previous + result[1];
        pos = nextPartRe.lastIndex;
        if (knownHard[base] || cache && cache[base] === base) {
          continue;
        }
        var resolvedLink;
        if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
          resolvedLink = cache[base];
        } else {
          var stat = fs.lstatSync(base);
          if (!stat.isSymbolicLink()) {
            knownHard[base] = true;
            if (cache)
              cache[base] = base;
            continue;
          }
          var linkTarget = null;
          if (!isWindows) {
            var id = stat.dev.toString(32) + ":" + stat.ino.toString(32);
            if (seenLinks.hasOwnProperty(id)) {
              linkTarget = seenLinks[id];
            }
          }
          if (linkTarget === null) {
            fs.statSync(base);
            linkTarget = fs.readlinkSync(base);
          }
          resolvedLink = pathModule.resolve(previous, linkTarget);
          if (cache)
            cache[base] = resolvedLink;
          if (!isWindows)
            seenLinks[id] = linkTarget;
        }
        p = pathModule.resolve(resolvedLink, p.slice(pos));
        start();
      }
      if (cache)
        cache[original] = p;
      return p;
    };
    exports2.realpath = function realpath(p, cache, cb) {
      if (typeof cb !== "function") {
        cb = maybeCallback(cache);
        cache = null;
      }
      p = pathModule.resolve(p);
      if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
        return process.nextTick(cb.bind(null, null, cache[p]));
      }
      var original = p, seenLinks = {}, knownHard = {};
      var pos;
      var current;
      var base;
      var previous;
      start();
      function start() {
        var m = splitRootRe.exec(p);
        pos = m[0].length;
        current = m[0];
        base = m[0];
        previous = "";
        if (isWindows && !knownHard[base]) {
          fs.lstat(base, function(err) {
            if (err)
              return cb(err);
            knownHard[base] = true;
            LOOP();
          });
        } else {
          process.nextTick(LOOP);
        }
      }
      function LOOP() {
        if (pos >= p.length) {
          if (cache)
            cache[original] = p;
          return cb(null, p);
        }
        nextPartRe.lastIndex = pos;
        var result = nextPartRe.exec(p);
        previous = current;
        current += result[0];
        base = previous + result[1];
        pos = nextPartRe.lastIndex;
        if (knownHard[base] || cache && cache[base] === base) {
          return process.nextTick(LOOP);
        }
        if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
          return gotResolvedLink(cache[base]);
        }
        return fs.lstat(base, gotStat);
      }
      function gotStat(err, stat) {
        if (err)
          return cb(err);
        if (!stat.isSymbolicLink()) {
          knownHard[base] = true;
          if (cache)
            cache[base] = base;
          return process.nextTick(LOOP);
        }
        if (!isWindows) {
          var id = stat.dev.toString(32) + ":" + stat.ino.toString(32);
          if (seenLinks.hasOwnProperty(id)) {
            return gotTarget(null, seenLinks[id], base);
          }
        }
        fs.stat(base, function(err2) {
          if (err2)
            return cb(err2);
          fs.readlink(base, function(err3, target) {
            if (!isWindows)
              seenLinks[id] = target;
            gotTarget(err3, target);
          });
        });
      }
      function gotTarget(err, target, base2) {
        if (err)
          return cb(err);
        var resolvedLink = pathModule.resolve(previous, target);
        if (cache)
          cache[base2] = resolvedLink;
        gotResolvedLink(resolvedLink);
      }
      function gotResolvedLink(resolvedLink) {
        p = pathModule.resolve(resolvedLink, p.slice(pos));
        start();
      }
    };
  }
});

// node_modules/fs.realpath/index.js
var require_fs3 = __commonJS({
  "node_modules/fs.realpath/index.js"(exports2, module2) {
    module2.exports = realpath;
    realpath.realpath = realpath;
    realpath.sync = realpathSync;
    realpath.realpathSync = realpathSync;
    realpath.monkeypatch = monkeypatch;
    realpath.unmonkeypatch = unmonkeypatch;
    var fs = require("fs");
    var origRealpath = fs.realpath;
    var origRealpathSync = fs.realpathSync;
    var version2 = process.version;
    var ok = /^v[0-5]\./.test(version2);
    var old = require_old();
    function newError(er) {
      return er && er.syscall === "realpath" && (er.code === "ELOOP" || er.code === "ENOMEM" || er.code === "ENAMETOOLONG");
    }
    function realpath(p, cache, cb) {
      if (ok) {
        return origRealpath(p, cache, cb);
      }
      if (typeof cache === "function") {
        cb = cache;
        cache = null;
      }
      origRealpath(p, cache, function(er, result) {
        if (newError(er)) {
          old.realpath(p, cache, cb);
        } else {
          cb(er, result);
        }
      });
    }
    function realpathSync(p, cache) {
      if (ok) {
        return origRealpathSync(p, cache);
      }
      try {
        return origRealpathSync(p, cache);
      } catch (er) {
        if (newError(er)) {
          return old.realpathSync(p, cache);
        } else {
          throw er;
        }
      }
    }
    function monkeypatch() {
      fs.realpath = realpath;
      fs.realpathSync = realpathSync;
    }
    function unmonkeypatch() {
      fs.realpath = origRealpath;
      fs.realpathSync = origRealpathSync;
    }
  }
});

// node_modules/concat-map/index.js
var require_concat_map = __commonJS({
  "node_modules/concat-map/index.js"(exports2, module2) {
    module2.exports = function(xs, fn) {
      var res = [];
      for (var i = 0; i < xs.length; i++) {
        var x = fn(xs[i], i);
        if (isArray(x))
          res.push.apply(res, x);
        else
          res.push(x);
      }
      return res;
    };
    var isArray = Array.isArray || function(xs) {
      return Object.prototype.toString.call(xs) === "[object Array]";
    };
  }
});

// node_modules/brace-expansion/index.js
var require_brace_expansion2 = __commonJS({
  "node_modules/brace-expansion/index.js"(exports2, module2) {
    var concatMap = require_concat_map();
    var balanced = require_balanced_match();
    module2.exports = expandTop;
    var escSlash = "\0SLASH" + Math.random() + "\0";
    var escOpen = "\0OPEN" + Math.random() + "\0";
    var escClose = "\0CLOSE" + Math.random() + "\0";
    var escComma = "\0COMMA" + Math.random() + "\0";
    var escPeriod = "\0PERIOD" + Math.random() + "\0";
    function numeric(str) {
      return parseInt(str, 10) == str ? parseInt(str, 10) : str.charCodeAt(0);
    }
    function escapeBraces(str) {
      return str.split("\\\\").join(escSlash).split("\\{").join(escOpen).split("\\}").join(escClose).split("\\,").join(escComma).split("\\.").join(escPeriod);
    }
    function unescapeBraces(str) {
      return str.split(escSlash).join("\\").split(escOpen).join("{").split(escClose).join("}").split(escComma).join(",").split(escPeriod).join(".");
    }
    function parseCommaParts(str) {
      if (!str)
        return [""];
      var parts = [];
      var m = balanced("{", "}", str);
      if (!m)
        return str.split(",");
      var pre = m.pre;
      var body = m.body;
      var post = m.post;
      var p = pre.split(",");
      p[p.length - 1] += "{" + body + "}";
      var postParts = parseCommaParts(post);
      if (post.length) {
        p[p.length - 1] += postParts.shift();
        p.push.apply(p, postParts);
      }
      parts.push.apply(parts, p);
      return parts;
    }
    function expandTop(str) {
      if (!str)
        return [];
      if (str.substr(0, 2) === "{}") {
        str = "\\{\\}" + str.substr(2);
      }
      return expand(escapeBraces(str), true).map(unescapeBraces);
    }
    function embrace(str) {
      return "{" + str + "}";
    }
    function isPadded(el) {
      return /^-?0\d/.test(el);
    }
    function lte(i, y) {
      return i <= y;
    }
    function gte(i, y) {
      return i >= y;
    }
    function expand(str, isTop) {
      var expansions = [];
      var m = balanced("{", "}", str);
      if (!m || /\$$/.test(m.pre))
        return [str];
      var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
      var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
      var isSequence = isNumericSequence || isAlphaSequence;
      var isOptions = m.body.indexOf(",") >= 0;
      if (!isSequence && !isOptions) {
        if (m.post.match(/,.*\}/)) {
          str = m.pre + "{" + m.body + escClose + m.post;
          return expand(str);
        }
        return [str];
      }
      var n;
      if (isSequence) {
        n = m.body.split(/\.\./);
      } else {
        n = parseCommaParts(m.body);
        if (n.length === 1) {
          n = expand(n[0], false).map(embrace);
          if (n.length === 1) {
            var post = m.post.length ? expand(m.post, false) : [""];
            return post.map(function(p) {
              return m.pre + n[0] + p;
            });
          }
        }
      }
      var pre = m.pre;
      var post = m.post.length ? expand(m.post, false) : [""];
      var N;
      if (isSequence) {
        var x = numeric(n[0]);
        var y = numeric(n[1]);
        var width = Math.max(n[0].length, n[1].length);
        var incr = n.length == 3 ? Math.abs(numeric(n[2])) : 1;
        var test = lte;
        var reverse = y < x;
        if (reverse) {
          incr *= -1;
          test = gte;
        }
        var pad = n.some(isPadded);
        N = [];
        for (var i = x; test(i, y); i += incr) {
          var c;
          if (isAlphaSequence) {
            c = String.fromCharCode(i);
            if (c === "\\")
              c = "";
          } else {
            c = String(i);
            if (pad) {
              var need = width - c.length;
              if (need > 0) {
                var z = new Array(need + 1).join("0");
                if (i < 0)
                  c = "-" + z + c.slice(1);
                else
                  c = z + c;
              }
            }
          }
          N.push(c);
        }
      } else {
        N = concatMap(n, function(el) {
          return expand(el, false);
        });
      }
      for (var j = 0; j < N.length; j++) {
        for (var k = 0; k < post.length; k++) {
          var expansion = pre + N[j] + post[k];
          if (!isTop || isSequence || expansion)
            expansions.push(expansion);
        }
      }
      return expansions;
    }
  }
});

// node_modules/minimatch/minimatch.js
var require_minimatch = __commonJS({
  "node_modules/minimatch/minimatch.js"(exports2, module2) {
    module2.exports = minimatch;
    minimatch.Minimatch = Minimatch;
    var path = function() {
      try {
        return require("path");
      } catch (e) {
      }
    }() || {
      sep: "/"
    };
    minimatch.sep = path.sep;
    var GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {};
    var expand = require_brace_expansion2();
    var plTypes = {
      "!": { open: "(?:(?!(?:", close: "))[^/]*?)" },
      "?": { open: "(?:", close: ")?" },
      "+": { open: "(?:", close: ")+" },
      "*": { open: "(?:", close: ")*" },
      "@": { open: "(?:", close: ")" }
    };
    var qmark = "[^/]";
    var star = qmark + "*?";
    var twoStarDot = "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?";
    var twoStarNoDot = "(?:(?!(?:\\/|^)\\.).)*?";
    var reSpecials = charSet("().*{}+?[]^$\\!");
    function charSet(s) {
      return s.split("").reduce(function(set, c) {
        set[c] = true;
        return set;
      }, {});
    }
    var slashSplit = /\/+/;
    minimatch.filter = filter;
    function filter(pattern, options) {
      options = options || {};
      return function(p, i, list) {
        return minimatch(p, pattern, options);
      };
    }
    function ext(a, b) {
      b = b || {};
      var t = {};
      Object.keys(a).forEach(function(k) {
        t[k] = a[k];
      });
      Object.keys(b).forEach(function(k) {
        t[k] = b[k];
      });
      return t;
    }
    minimatch.defaults = function(def) {
      if (!def || typeof def !== "object" || !Object.keys(def).length) {
        return minimatch;
      }
      var orig = minimatch;
      var m = function minimatch2(p, pattern, options) {
        return orig(p, pattern, ext(def, options));
      };
      m.Minimatch = function Minimatch2(pattern, options) {
        return new orig.Minimatch(pattern, ext(def, options));
      };
      m.Minimatch.defaults = function defaults(options) {
        return orig.defaults(ext(def, options)).Minimatch;
      };
      m.filter = function filter2(pattern, options) {
        return orig.filter(pattern, ext(def, options));
      };
      m.defaults = function defaults(options) {
        return orig.defaults(ext(def, options));
      };
      m.makeRe = function makeRe2(pattern, options) {
        return orig.makeRe(pattern, ext(def, options));
      };
      m.braceExpand = function braceExpand2(pattern, options) {
        return orig.braceExpand(pattern, ext(def, options));
      };
      m.match = function(list, pattern, options) {
        return orig.match(list, pattern, ext(def, options));
      };
      return m;
    };
    Minimatch.defaults = function(def) {
      return minimatch.defaults(def).Minimatch;
    };
    function minimatch(p, pattern, options) {
      assertValidPattern(pattern);
      if (!options)
        options = {};
      if (!options.nocomment && pattern.charAt(0) === "#") {
        return false;
      }
      return new Minimatch(pattern, options).match(p);
    }
    function Minimatch(pattern, options) {
      if (!(this instanceof Minimatch)) {
        return new Minimatch(pattern, options);
      }
      assertValidPattern(pattern);
      if (!options)
        options = {};
      pattern = pattern.trim();
      if (!options.allowWindowsEscape && path.sep !== "/") {
        pattern = pattern.split(path.sep).join("/");
      }
      this.options = options;
      this.set = [];
      this.pattern = pattern;
      this.regexp = null;
      this.negate = false;
      this.comment = false;
      this.empty = false;
      this.partial = !!options.partial;
      this.make();
    }
    Minimatch.prototype.debug = function() {
    };
    Minimatch.prototype.make = make;
    function make() {
      var pattern = this.pattern;
      var options = this.options;
      if (!options.nocomment && pattern.charAt(0) === "#") {
        this.comment = true;
        return;
      }
      if (!pattern) {
        this.empty = true;
        return;
      }
      this.parseNegate();
      var set = this.globSet = this.braceExpand();
      if (options.debug)
        this.debug = function debug() {
          console.error.apply(console, arguments);
        };
      this.debug(this.pattern, set);
      set = this.globParts = set.map(function(s) {
        return s.split(slashSplit);
      });
      this.debug(this.pattern, set);
      set = set.map(function(s, si, set2) {
        return s.map(this.parse, this);
      }, this);
      this.debug(this.pattern, set);
      set = set.filter(function(s) {
        return s.indexOf(false) === -1;
      });
      this.debug(this.pattern, set);
      this.set = set;
    }
    Minimatch.prototype.parseNegate = parseNegate;
    function parseNegate() {
      var pattern = this.pattern;
      var negate = false;
      var options = this.options;
      var negateOffset = 0;
      if (options.nonegate)
        return;
      for (var i = 0, l = pattern.length; i < l && pattern.charAt(i) === "!"; i++) {
        negate = !negate;
        negateOffset++;
      }
      if (negateOffset)
        this.pattern = pattern.substr(negateOffset);
      this.negate = negate;
    }
    minimatch.braceExpand = function(pattern, options) {
      return braceExpand(pattern, options);
    };
    Minimatch.prototype.braceExpand = braceExpand;
    function braceExpand(pattern, options) {
      if (!options) {
        if (this instanceof Minimatch) {
          options = this.options;
        } else {
          options = {};
        }
      }
      pattern = typeof pattern === "undefined" ? this.pattern : pattern;
      assertValidPattern(pattern);
      if (options.nobrace || !/\{(?:(?!\{).)*\}/.test(pattern)) {
        return [pattern];
      }
      return expand(pattern);
    }
    var MAX_PATTERN_LENGTH = 1024 * 64;
    var assertValidPattern = function(pattern) {
      if (typeof pattern !== "string") {
        throw new TypeError("invalid pattern");
      }
      if (pattern.length > MAX_PATTERN_LENGTH) {
        throw new TypeError("pattern is too long");
      }
    };
    Minimatch.prototype.parse = parse2;
    var SUBPARSE = {};
    function parse2(pattern, isSub) {
      assertValidPattern(pattern);
      var options = this.options;
      if (pattern === "**") {
        if (!options.noglobstar)
          return GLOBSTAR;
        else
          pattern = "*";
      }
      if (pattern === "")
        return "";
      var re = "";
      var hasMagic = !!options.nocase;
      var escaping = false;
      var patternListStack = [];
      var negativeLists = [];
      var stateChar;
      var inClass = false;
      var reClassStart = -1;
      var classStart = -1;
      var patternStart = pattern.charAt(0) === "." ? "" : options.dot ? "(?!(?:^|\\/)\\.{1,2}(?:$|\\/))" : "(?!\\.)";
      var self = this;
      function clearStateChar() {
        if (stateChar) {
          switch (stateChar) {
            case "*":
              re += star;
              hasMagic = true;
              break;
            case "?":
              re += qmark;
              hasMagic = true;
              break;
            default:
              re += "\\" + stateChar;
              break;
          }
          self.debug("clearStateChar %j %j", stateChar, re);
          stateChar = false;
        }
      }
      for (var i = 0, len = pattern.length, c; i < len && (c = pattern.charAt(i)); i++) {
        this.debug("%s	%s %s %j", pattern, i, re, c);
        if (escaping && reSpecials[c]) {
          re += "\\" + c;
          escaping = false;
          continue;
        }
        switch (c) {
          case "/": {
            return false;
          }
          case "\\":
            clearStateChar();
            escaping = true;
            continue;
          case "?":
          case "*":
          case "+":
          case "@":
          case "!":
            this.debug("%s	%s %s %j <-- stateChar", pattern, i, re, c);
            if (inClass) {
              this.debug("  in class");
              if (c === "!" && i === classStart + 1)
                c = "^";
              re += c;
              continue;
            }
            self.debug("call clearStateChar %j", stateChar);
            clearStateChar();
            stateChar = c;
            if (options.noext)
              clearStateChar();
            continue;
          case "(":
            if (inClass) {
              re += "(";
              continue;
            }
            if (!stateChar) {
              re += "\\(";
              continue;
            }
            patternListStack.push({
              type: stateChar,
              start: i - 1,
              reStart: re.length,
              open: plTypes[stateChar].open,
              close: plTypes[stateChar].close
            });
            re += stateChar === "!" ? "(?:(?!(?:" : "(?:";
            this.debug("plType %j %j", stateChar, re);
            stateChar = false;
            continue;
          case ")":
            if (inClass || !patternListStack.length) {
              re += "\\)";
              continue;
            }
            clearStateChar();
            hasMagic = true;
            var pl = patternListStack.pop();
            re += pl.close;
            if (pl.type === "!") {
              negativeLists.push(pl);
            }
            pl.reEnd = re.length;
            continue;
          case "|":
            if (inClass || !patternListStack.length || escaping) {
              re += "\\|";
              escaping = false;
              continue;
            }
            clearStateChar();
            re += "|";
            continue;
          case "[":
            clearStateChar();
            if (inClass) {
              re += "\\" + c;
              continue;
            }
            inClass = true;
            classStart = i;
            reClassStart = re.length;
            re += c;
            continue;
          case "]":
            if (i === classStart + 1 || !inClass) {
              re += "\\" + c;
              escaping = false;
              continue;
            }
            var cs = pattern.substring(classStart + 1, i);
            try {
              RegExp("[" + cs + "]");
            } catch (er) {
              var sp = this.parse(cs, SUBPARSE);
              re = re.substr(0, reClassStart) + "\\[" + sp[0] + "\\]";
              hasMagic = hasMagic || sp[1];
              inClass = false;
              continue;
            }
            hasMagic = true;
            inClass = false;
            re += c;
            continue;
          default:
            clearStateChar();
            if (escaping) {
              escaping = false;
            } else if (reSpecials[c] && !(c === "^" && inClass)) {
              re += "\\";
            }
            re += c;
        }
      }
      if (inClass) {
        cs = pattern.substr(classStart + 1);
        sp = this.parse(cs, SUBPARSE);
        re = re.substr(0, reClassStart) + "\\[" + sp[0];
        hasMagic = hasMagic || sp[1];
      }
      for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
        var tail = re.slice(pl.reStart + pl.open.length);
        this.debug("setting tail", re, pl);
        tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function(_, $1, $2) {
          if (!$2) {
            $2 = "\\";
          }
          return $1 + $1 + $2 + "|";
        });
        this.debug("tail=%j\n   %s", tail, tail, pl, re);
        var t = pl.type === "*" ? star : pl.type === "?" ? qmark : "\\" + pl.type;
        hasMagic = true;
        re = re.slice(0, pl.reStart) + t + "\\(" + tail;
      }
      clearStateChar();
      if (escaping) {
        re += "\\\\";
      }
      var addPatternStart = false;
      switch (re.charAt(0)) {
        case "[":
        case ".":
        case "(":
          addPatternStart = true;
      }
      for (var n = negativeLists.length - 1; n > -1; n--) {
        var nl = negativeLists[n];
        var nlBefore = re.slice(0, nl.reStart);
        var nlFirst = re.slice(nl.reStart, nl.reEnd - 8);
        var nlLast = re.slice(nl.reEnd - 8, nl.reEnd);
        var nlAfter = re.slice(nl.reEnd);
        nlLast += nlAfter;
        var openParensBefore = nlBefore.split("(").length - 1;
        var cleanAfter = nlAfter;
        for (i = 0; i < openParensBefore; i++) {
          cleanAfter = cleanAfter.replace(/\)[+*?]?/, "");
        }
        nlAfter = cleanAfter;
        var dollar = "";
        if (nlAfter === "" && isSub !== SUBPARSE) {
          dollar = "$";
        }
        var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast;
        re = newRe;
      }
      if (re !== "" && hasMagic) {
        re = "(?=.)" + re;
      }
      if (addPatternStart) {
        re = patternStart + re;
      }
      if (isSub === SUBPARSE) {
        return [re, hasMagic];
      }
      if (!hasMagic) {
        return globUnescape(pattern);
      }
      var flags = options.nocase ? "i" : "";
      try {
        var regExp = new RegExp("^" + re + "$", flags);
      } catch (er) {
        return new RegExp("$.");
      }
      regExp._glob = pattern;
      regExp._src = re;
      return regExp;
    }
    minimatch.makeRe = function(pattern, options) {
      return new Minimatch(pattern, options || {}).makeRe();
    };
    Minimatch.prototype.makeRe = makeRe;
    function makeRe() {
      if (this.regexp || this.regexp === false)
        return this.regexp;
      var set = this.set;
      if (!set.length) {
        this.regexp = false;
        return this.regexp;
      }
      var options = this.options;
      var twoStar = options.noglobstar ? star : options.dot ? twoStarDot : twoStarNoDot;
      var flags = options.nocase ? "i" : "";
      var re = set.map(function(pattern) {
        return pattern.map(function(p) {
          return p === GLOBSTAR ? twoStar : typeof p === "string" ? regExpEscape(p) : p._src;
        }).join("\\/");
      }).join("|");
      re = "^(?:" + re + ")$";
      if (this.negate)
        re = "^(?!" + re + ").*$";
      try {
        this.regexp = new RegExp(re, flags);
      } catch (ex) {
        this.regexp = false;
      }
      return this.regexp;
    }
    minimatch.match = function(list, pattern, options) {
      options = options || {};
      var mm = new Minimatch(pattern, options);
      list = list.filter(function(f) {
        return mm.match(f);
      });
      if (mm.options.nonull && !list.length) {
        list.push(pattern);
      }
      return list;
    };
    Minimatch.prototype.match = function match(f, partial) {
      if (typeof partial === "undefined")
        partial = this.partial;
      this.debug("match", f, this.pattern);
      if (this.comment)
        return false;
      if (this.empty)
        return f === "";
      if (f === "/" && partial)
        return true;
      var options = this.options;
      if (path.sep !== "/") {
        f = f.split(path.sep).join("/");
      }
      f = f.split(slashSplit);
      this.debug(this.pattern, "split", f);
      var set = this.set;
      this.debug(this.pattern, "set", set);
      var filename;
      var i;
      for (i = f.length - 1; i >= 0; i--) {
        filename = f[i];
        if (filename)
          break;
      }
      for (i = 0; i < set.length; i++) {
        var pattern = set[i];
        var file = f;
        if (options.matchBase && pattern.length === 1) {
          file = [filename];
        }
        var hit = this.matchOne(file, pattern, partial);
        if (hit) {
          if (options.flipNegate)
            return true;
          return !this.negate;
        }
      }
      if (options.flipNegate)
        return false;
      return this.negate;
    };
    Minimatch.prototype.matchOne = function(file, pattern, partial) {
      var options = this.options;
      this.debug(
        "matchOne",
        { "this": this, file, pattern }
      );
      this.debug("matchOne", file.length, pattern.length);
      for (var fi = 0, pi = 0, fl = file.length, pl = pattern.length; fi < fl && pi < pl; fi++, pi++) {
        this.debug("matchOne loop");
        var p = pattern[pi];
        var f = file[fi];
        this.debug(pattern, p, f);
        if (p === false)
          return false;
        if (p === GLOBSTAR) {
          this.debug("GLOBSTAR", [pattern, p, f]);
          var fr = fi;
          var pr = pi + 1;
          if (pr === pl) {
            this.debug("** at the end");
            for (; fi < fl; fi++) {
              if (file[fi] === "." || file[fi] === ".." || !options.dot && file[fi].charAt(0) === ".")
                return false;
            }
            return true;
          }
          while (fr < fl) {
            var swallowee = file[fr];
            this.debug("\nglobstar while", file, fr, pattern, pr, swallowee);
            if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
              this.debug("globstar found match!", fr, fl, swallowee);
              return true;
            } else {
              if (swallowee === "." || swallowee === ".." || !options.dot && swallowee.charAt(0) === ".") {
                this.debug("dot detected!", file, fr, pattern, pr);
                break;
              }
              this.debug("globstar swallow a segment, and continue");
              fr++;
            }
          }
          if (partial) {
            this.debug("\n>>> no match, partial?", file, fr, pattern, pr);
            if (fr === fl)
              return true;
          }
          return false;
        }
        var hit;
        if (typeof p === "string") {
          hit = f === p;
          this.debug("string match", p, f, hit);
        } else {
          hit = f.match(p);
          this.debug("pattern match", p, f, hit);
        }
        if (!hit)
          return false;
      }
      if (fi === fl && pi === pl) {
        return true;
      } else if (fi === fl) {
        return partial;
      } else if (pi === pl) {
        return fi === fl - 1 && file[fi] === "";
      }
      throw new Error("wtf?");
    };
    function globUnescape(s) {
      return s.replace(/\\(.)/g, "$1");
    }
    function regExpEscape(s) {
      return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }
  }
});

// node_modules/inherits/inherits_browser.js
var require_inherits_browser = __commonJS({
  "node_modules/inherits/inherits_browser.js"(exports2, module2) {
    if (typeof Object.create === "function") {
      module2.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
        }
      };
    } else {
      module2.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          var TempCtor = function() {
          };
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        }
      };
    }
  }
});

// node_modules/inherits/inherits.js
var require_inherits = __commonJS({
  "node_modules/inherits/inherits.js"(exports2, module2) {
    try {
      util = require("util");
      if (typeof util.inherits !== "function")
        throw "";
      module2.exports = util.inherits;
    } catch (e) {
      module2.exports = require_inherits_browser();
    }
    var util;
  }
});

// node_modules/path-is-absolute/index.js
var require_path_is_absolute = __commonJS({
  "node_modules/path-is-absolute/index.js"(exports2, module2) {
    "use strict";
    function posix(path) {
      return path.charAt(0) === "/";
    }
    function win32(path) {
      var splitDeviceRe = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;
      var result = splitDeviceRe.exec(path);
      var device = result[1] || "";
      var isUnc = Boolean(device && device.charAt(1) !== ":");
      return Boolean(result[2] || isUnc);
    }
    module2.exports = process.platform === "win32" ? win32 : posix;
    module2.exports.posix = posix;
    module2.exports.win32 = win32;
  }
});

// node_modules/rimraf/node_modules/glob/common.js
var require_common2 = __commonJS({
  "node_modules/rimraf/node_modules/glob/common.js"(exports2) {
    exports2.setopts = setopts;
    exports2.ownProp = ownProp;
    exports2.makeAbs = makeAbs;
    exports2.finish = finish;
    exports2.mark = mark;
    exports2.isIgnored = isIgnored;
    exports2.childrenIgnored = childrenIgnored;
    function ownProp(obj, field) {
      return Object.prototype.hasOwnProperty.call(obj, field);
    }
    var fs = require("fs");
    var path = require("path");
    var minimatch = require_minimatch();
    var isAbsolute = require_path_is_absolute();
    var Minimatch = minimatch.Minimatch;
    function alphasort(a, b) {
      return a.localeCompare(b, "en");
    }
    function setupIgnores(self, options) {
      self.ignore = options.ignore || [];
      if (!Array.isArray(self.ignore))
        self.ignore = [self.ignore];
      if (self.ignore.length) {
        self.ignore = self.ignore.map(ignoreMap);
      }
    }
    function ignoreMap(pattern) {
      var gmatcher = null;
      if (pattern.slice(-3) === "/**") {
        var gpattern = pattern.replace(/(\/\*\*)+$/, "");
        gmatcher = new Minimatch(gpattern, { dot: true });
      }
      return {
        matcher: new Minimatch(pattern, { dot: true }),
        gmatcher
      };
    }
    function setopts(self, pattern, options) {
      if (!options)
        options = {};
      if (options.matchBase && -1 === pattern.indexOf("/")) {
        if (options.noglobstar) {
          throw new Error("base matching requires globstar");
        }
        pattern = "**/" + pattern;
      }
      self.silent = !!options.silent;
      self.pattern = pattern;
      self.strict = options.strict !== false;
      self.realpath = !!options.realpath;
      self.realpathCache = options.realpathCache || /* @__PURE__ */ Object.create(null);
      self.follow = !!options.follow;
      self.dot = !!options.dot;
      self.mark = !!options.mark;
      self.nodir = !!options.nodir;
      if (self.nodir)
        self.mark = true;
      self.sync = !!options.sync;
      self.nounique = !!options.nounique;
      self.nonull = !!options.nonull;
      self.nosort = !!options.nosort;
      self.nocase = !!options.nocase;
      self.stat = !!options.stat;
      self.noprocess = !!options.noprocess;
      self.absolute = !!options.absolute;
      self.fs = options.fs || fs;
      self.maxLength = options.maxLength || Infinity;
      self.cache = options.cache || /* @__PURE__ */ Object.create(null);
      self.statCache = options.statCache || /* @__PURE__ */ Object.create(null);
      self.symlinks = options.symlinks || /* @__PURE__ */ Object.create(null);
      setupIgnores(self, options);
      self.changedCwd = false;
      var cwd = process.cwd();
      if (!ownProp(options, "cwd"))
        self.cwd = cwd;
      else {
        self.cwd = path.resolve(options.cwd);
        self.changedCwd = self.cwd !== cwd;
      }
      self.root = options.root || path.resolve(self.cwd, "/");
      self.root = path.resolve(self.root);
      if (process.platform === "win32")
        self.root = self.root.replace(/\\/g, "/");
      self.cwdAbs = isAbsolute(self.cwd) ? self.cwd : makeAbs(self, self.cwd);
      if (process.platform === "win32")
        self.cwdAbs = self.cwdAbs.replace(/\\/g, "/");
      self.nomount = !!options.nomount;
      options.nonegate = true;
      options.nocomment = true;
      options.allowWindowsEscape = false;
      self.minimatch = new Minimatch(pattern, options);
      self.options = self.minimatch.options;
    }
    function finish(self) {
      var nou = self.nounique;
      var all = nou ? [] : /* @__PURE__ */ Object.create(null);
      for (var i = 0, l = self.matches.length; i < l; i++) {
        var matches = self.matches[i];
        if (!matches || Object.keys(matches).length === 0) {
          if (self.nonull) {
            var literal = self.minimatch.globSet[i];
            if (nou)
              all.push(literal);
            else
              all[literal] = true;
          }
        } else {
          var m = Object.keys(matches);
          if (nou)
            all.push.apply(all, m);
          else
            m.forEach(function(m2) {
              all[m2] = true;
            });
        }
      }
      if (!nou)
        all = Object.keys(all);
      if (!self.nosort)
        all = all.sort(alphasort);
      if (self.mark) {
        for (var i = 0; i < all.length; i++) {
          all[i] = self._mark(all[i]);
        }
        if (self.nodir) {
          all = all.filter(function(e) {
            var notDir = !/\/$/.test(e);
            var c = self.cache[e] || self.cache[makeAbs(self, e)];
            if (notDir && c)
              notDir = c !== "DIR" && !Array.isArray(c);
            return notDir;
          });
        }
      }
      if (self.ignore.length)
        all = all.filter(function(m2) {
          return !isIgnored(self, m2);
        });
      self.found = all;
    }
    function mark(self, p) {
      var abs = makeAbs(self, p);
      var c = self.cache[abs];
      var m = p;
      if (c) {
        var isDir = c === "DIR" || Array.isArray(c);
        var slash = p.slice(-1) === "/";
        if (isDir && !slash)
          m += "/";
        else if (!isDir && slash)
          m = m.slice(0, -1);
        if (m !== p) {
          var mabs = makeAbs(self, m);
          self.statCache[mabs] = self.statCache[abs];
          self.cache[mabs] = self.cache[abs];
        }
      }
      return m;
    }
    function makeAbs(self, f) {
      var abs = f;
      if (f.charAt(0) === "/") {
        abs = path.join(self.root, f);
      } else if (isAbsolute(f) || f === "") {
        abs = f;
      } else if (self.changedCwd) {
        abs = path.resolve(self.cwd, f);
      } else {
        abs = path.resolve(f);
      }
      if (process.platform === "win32")
        abs = abs.replace(/\\/g, "/");
      return abs;
    }
    function isIgnored(self, path2) {
      if (!self.ignore.length)
        return false;
      return self.ignore.some(function(item) {
        return item.matcher.match(path2) || !!(item.gmatcher && item.gmatcher.match(path2));
      });
    }
    function childrenIgnored(self, path2) {
      if (!self.ignore.length)
        return false;
      return self.ignore.some(function(item) {
        return !!(item.gmatcher && item.gmatcher.match(path2));
      });
    }
  }
});

// node_modules/rimraf/node_modules/glob/sync.js
var require_sync = __commonJS({
  "node_modules/rimraf/node_modules/glob/sync.js"(exports2, module2) {
    module2.exports = globSync;
    globSync.GlobSync = GlobSync;
    var rp = require_fs3();
    var minimatch = require_minimatch();
    var Minimatch = minimatch.Minimatch;
    var Glob = require_glob2().Glob;
    var util = require("util");
    var path = require("path");
    var assert = require("assert");
    var isAbsolute = require_path_is_absolute();
    var common = require_common2();
    var setopts = common.setopts;
    var ownProp = common.ownProp;
    var childrenIgnored = common.childrenIgnored;
    var isIgnored = common.isIgnored;
    function globSync(pattern, options) {
      if (typeof options === "function" || arguments.length === 3)
        throw new TypeError("callback provided to sync glob\nSee: https://github.com/isaacs/node-glob/issues/167");
      return new GlobSync(pattern, options).found;
    }
    function GlobSync(pattern, options) {
      if (!pattern)
        throw new Error("must provide pattern");
      if (typeof options === "function" || arguments.length === 3)
        throw new TypeError("callback provided to sync glob\nSee: https://github.com/isaacs/node-glob/issues/167");
      if (!(this instanceof GlobSync))
        return new GlobSync(pattern, options);
      setopts(this, pattern, options);
      if (this.noprocess)
        return this;
      var n = this.minimatch.set.length;
      this.matches = new Array(n);
      for (var i = 0; i < n; i++) {
        this._process(this.minimatch.set[i], i, false);
      }
      this._finish();
    }
    GlobSync.prototype._finish = function() {
      assert.ok(this instanceof GlobSync);
      if (this.realpath) {
        var self = this;
        this.matches.forEach(function(matchset, index) {
          var set = self.matches[index] = /* @__PURE__ */ Object.create(null);
          for (var p in matchset) {
            try {
              p = self._makeAbs(p);
              var real = rp.realpathSync(p, self.realpathCache);
              set[real] = true;
            } catch (er) {
              if (er.syscall === "stat")
                set[self._makeAbs(p)] = true;
              else
                throw er;
            }
          }
        });
      }
      common.finish(this);
    };
    GlobSync.prototype._process = function(pattern, index, inGlobStar) {
      assert.ok(this instanceof GlobSync);
      var n = 0;
      while (typeof pattern[n] === "string") {
        n++;
      }
      var prefix;
      switch (n) {
        case pattern.length:
          this._processSimple(pattern.join("/"), index);
          return;
        case 0:
          prefix = null;
          break;
        default:
          prefix = pattern.slice(0, n).join("/");
          break;
      }
      var remain = pattern.slice(n);
      var read;
      if (prefix === null)
        read = ".";
      else if (isAbsolute(prefix) || isAbsolute(pattern.map(function(p) {
        return typeof p === "string" ? p : "[*]";
      }).join("/"))) {
        if (!prefix || !isAbsolute(prefix))
          prefix = "/" + prefix;
        read = prefix;
      } else
        read = prefix;
      var abs = this._makeAbs(read);
      if (childrenIgnored(this, read))
        return;
      var isGlobStar = remain[0] === minimatch.GLOBSTAR;
      if (isGlobStar)
        this._processGlobStar(prefix, read, abs, remain, index, inGlobStar);
      else
        this._processReaddir(prefix, read, abs, remain, index, inGlobStar);
    };
    GlobSync.prototype._processReaddir = function(prefix, read, abs, remain, index, inGlobStar) {
      var entries = this._readdir(abs, inGlobStar);
      if (!entries)
        return;
      var pn = remain[0];
      var negate = !!this.minimatch.negate;
      var rawGlob = pn._glob;
      var dotOk = this.dot || rawGlob.charAt(0) === ".";
      var matchedEntries = [];
      for (var i = 0; i < entries.length; i++) {
        var e = entries[i];
        if (e.charAt(0) !== "." || dotOk) {
          var m;
          if (negate && !prefix) {
            m = !e.match(pn);
          } else {
            m = e.match(pn);
          }
          if (m)
            matchedEntries.push(e);
        }
      }
      var len = matchedEntries.length;
      if (len === 0)
        return;
      if (remain.length === 1 && !this.mark && !this.stat) {
        if (!this.matches[index])
          this.matches[index] = /* @__PURE__ */ Object.create(null);
        for (var i = 0; i < len; i++) {
          var e = matchedEntries[i];
          if (prefix) {
            if (prefix.slice(-1) !== "/")
              e = prefix + "/" + e;
            else
              e = prefix + e;
          }
          if (e.charAt(0) === "/" && !this.nomount) {
            e = path.join(this.root, e);
          }
          this._emitMatch(index, e);
        }
        return;
      }
      remain.shift();
      for (var i = 0; i < len; i++) {
        var e = matchedEntries[i];
        var newPattern;
        if (prefix)
          newPattern = [prefix, e];
        else
          newPattern = [e];
        this._process(newPattern.concat(remain), index, inGlobStar);
      }
    };
    GlobSync.prototype._emitMatch = function(index, e) {
      if (isIgnored(this, e))
        return;
      var abs = this._makeAbs(e);
      if (this.mark)
        e = this._mark(e);
      if (this.absolute) {
        e = abs;
      }
      if (this.matches[index][e])
        return;
      if (this.nodir) {
        var c = this.cache[abs];
        if (c === "DIR" || Array.isArray(c))
          return;
      }
      this.matches[index][e] = true;
      if (this.stat)
        this._stat(e);
    };
    GlobSync.prototype._readdirInGlobStar = function(abs) {
      if (this.follow)
        return this._readdir(abs, false);
      var entries;
      var lstat;
      var stat;
      try {
        lstat = this.fs.lstatSync(abs);
      } catch (er) {
        if (er.code === "ENOENT") {
          return null;
        }
      }
      var isSym = lstat && lstat.isSymbolicLink();
      this.symlinks[abs] = isSym;
      if (!isSym && lstat && !lstat.isDirectory())
        this.cache[abs] = "FILE";
      else
        entries = this._readdir(abs, false);
      return entries;
    };
    GlobSync.prototype._readdir = function(abs, inGlobStar) {
      var entries;
      if (inGlobStar && !ownProp(this.symlinks, abs))
        return this._readdirInGlobStar(abs);
      if (ownProp(this.cache, abs)) {
        var c = this.cache[abs];
        if (!c || c === "FILE")
          return null;
        if (Array.isArray(c))
          return c;
      }
      try {
        return this._readdirEntries(abs, this.fs.readdirSync(abs));
      } catch (er) {
        this._readdirError(abs, er);
        return null;
      }
    };
    GlobSync.prototype._readdirEntries = function(abs, entries) {
      if (!this.mark && !this.stat) {
        for (var i = 0; i < entries.length; i++) {
          var e = entries[i];
          if (abs === "/")
            e = abs + e;
          else
            e = abs + "/" + e;
          this.cache[e] = true;
        }
      }
      this.cache[abs] = entries;
      return entries;
    };
    GlobSync.prototype._readdirError = function(f, er) {
      switch (er.code) {
        case "ENOTSUP":
        case "ENOTDIR":
          var abs = this._makeAbs(f);
          this.cache[abs] = "FILE";
          if (abs === this.cwdAbs) {
            var error = new Error(er.code + " invalid cwd " + this.cwd);
            error.path = this.cwd;
            error.code = er.code;
            throw error;
          }
          break;
        case "ENOENT":
        case "ELOOP":
        case "ENAMETOOLONG":
        case "UNKNOWN":
          this.cache[this._makeAbs(f)] = false;
          break;
        default:
          this.cache[this._makeAbs(f)] = false;
          if (this.strict)
            throw er;
          if (!this.silent)
            console.error("glob error", er);
          break;
      }
    };
    GlobSync.prototype._processGlobStar = function(prefix, read, abs, remain, index, inGlobStar) {
      var entries = this._readdir(abs, inGlobStar);
      if (!entries)
        return;
      var remainWithoutGlobStar = remain.slice(1);
      var gspref = prefix ? [prefix] : [];
      var noGlobStar = gspref.concat(remainWithoutGlobStar);
      this._process(noGlobStar, index, false);
      var len = entries.length;
      var isSym = this.symlinks[abs];
      if (isSym && inGlobStar)
        return;
      for (var i = 0; i < len; i++) {
        var e = entries[i];
        if (e.charAt(0) === "." && !this.dot)
          continue;
        var instead = gspref.concat(entries[i], remainWithoutGlobStar);
        this._process(instead, index, true);
        var below = gspref.concat(entries[i], remain);
        this._process(below, index, true);
      }
    };
    GlobSync.prototype._processSimple = function(prefix, index) {
      var exists = this._stat(prefix);
      if (!this.matches[index])
        this.matches[index] = /* @__PURE__ */ Object.create(null);
      if (!exists)
        return;
      if (prefix && isAbsolute(prefix) && !this.nomount) {
        var trail = /[\/\\]$/.test(prefix);
        if (prefix.charAt(0) === "/") {
          prefix = path.join(this.root, prefix);
        } else {
          prefix = path.resolve(this.root, prefix);
          if (trail)
            prefix += "/";
        }
      }
      if (process.platform === "win32")
        prefix = prefix.replace(/\\/g, "/");
      this._emitMatch(index, prefix);
    };
    GlobSync.prototype._stat = function(f) {
      var abs = this._makeAbs(f);
      var needDir = f.slice(-1) === "/";
      if (f.length > this.maxLength)
        return false;
      if (!this.stat && ownProp(this.cache, abs)) {
        var c = this.cache[abs];
        if (Array.isArray(c))
          c = "DIR";
        if (!needDir || c === "DIR")
          return c;
        if (needDir && c === "FILE")
          return false;
      }
      var exists;
      var stat = this.statCache[abs];
      if (!stat) {
        var lstat;
        try {
          lstat = this.fs.lstatSync(abs);
        } catch (er) {
          if (er && (er.code === "ENOENT" || er.code === "ENOTDIR")) {
            this.statCache[abs] = false;
            return false;
          }
        }
        if (lstat && lstat.isSymbolicLink()) {
          try {
            stat = this.fs.statSync(abs);
          } catch (er) {
            stat = lstat;
          }
        } else {
          stat = lstat;
        }
      }
      this.statCache[abs] = stat;
      var c = true;
      if (stat)
        c = stat.isDirectory() ? "DIR" : "FILE";
      this.cache[abs] = this.cache[abs] || c;
      if (needDir && c === "FILE")
        return false;
      return c;
    };
    GlobSync.prototype._mark = function(p) {
      return common.mark(this, p);
    };
    GlobSync.prototype._makeAbs = function(f) {
      return common.makeAbs(this, f);
    };
  }
});

// node_modules/wrappy/wrappy.js
var require_wrappy = __commonJS({
  "node_modules/wrappy/wrappy.js"(exports2, module2) {
    module2.exports = wrappy;
    function wrappy(fn, cb) {
      if (fn && cb)
        return wrappy(fn)(cb);
      if (typeof fn !== "function")
        throw new TypeError("need wrapper function");
      Object.keys(fn).forEach(function(k) {
        wrapper[k] = fn[k];
      });
      return wrapper;
      function wrapper() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        var ret = fn.apply(this, args);
        var cb2 = args[args.length - 1];
        if (typeof ret === "function" && ret !== cb2) {
          Object.keys(cb2).forEach(function(k) {
            ret[k] = cb2[k];
          });
        }
        return ret;
      }
    }
  }
});

// node_modules/once/once.js
var require_once = __commonJS({
  "node_modules/once/once.js"(exports2, module2) {
    var wrappy = require_wrappy();
    module2.exports = wrappy(once);
    module2.exports.strict = wrappy(onceStrict);
    once.proto = once(function() {
      Object.defineProperty(Function.prototype, "once", {
        value: function() {
          return once(this);
        },
        configurable: true
      });
      Object.defineProperty(Function.prototype, "onceStrict", {
        value: function() {
          return onceStrict(this);
        },
        configurable: true
      });
    });
    function once(fn) {
      var f = function() {
        if (f.called)
          return f.value;
        f.called = true;
        return f.value = fn.apply(this, arguments);
      };
      f.called = false;
      return f;
    }
    function onceStrict(fn) {
      var f = function() {
        if (f.called)
          throw new Error(f.onceError);
        f.called = true;
        return f.value = fn.apply(this, arguments);
      };
      var name = fn.name || "Function wrapped with `once`";
      f.onceError = name + " shouldn't be called more than once";
      f.called = false;
      return f;
    }
  }
});

// node_modules/inflight/inflight.js
var require_inflight = __commonJS({
  "node_modules/inflight/inflight.js"(exports2, module2) {
    var wrappy = require_wrappy();
    var reqs = /* @__PURE__ */ Object.create(null);
    var once = require_once();
    module2.exports = wrappy(inflight);
    function inflight(key, cb) {
      if (reqs[key]) {
        reqs[key].push(cb);
        return null;
      } else {
        reqs[key] = [cb];
        return makeres(key);
      }
    }
    function makeres(key) {
      return once(function RES() {
        var cbs = reqs[key];
        var len = cbs.length;
        var args = slice(arguments);
        try {
          for (var i = 0; i < len; i++) {
            cbs[i].apply(null, args);
          }
        } finally {
          if (cbs.length > len) {
            cbs.splice(0, len);
            process.nextTick(function() {
              RES.apply(null, args);
            });
          } else {
            delete reqs[key];
          }
        }
      });
    }
    function slice(args) {
      var length = args.length;
      var array = [];
      for (var i = 0; i < length; i++)
        array[i] = args[i];
      return array;
    }
  }
});

// node_modules/rimraf/node_modules/glob/glob.js
var require_glob2 = __commonJS({
  "node_modules/rimraf/node_modules/glob/glob.js"(exports2, module2) {
    module2.exports = glob;
    var rp = require_fs3();
    var minimatch = require_minimatch();
    var Minimatch = minimatch.Minimatch;
    var inherits = require_inherits();
    var EE = require("events").EventEmitter;
    var path = require("path");
    var assert = require("assert");
    var isAbsolute = require_path_is_absolute();
    var globSync = require_sync();
    var common = require_common2();
    var setopts = common.setopts;
    var ownProp = common.ownProp;
    var inflight = require_inflight();
    var util = require("util");
    var childrenIgnored = common.childrenIgnored;
    var isIgnored = common.isIgnored;
    var once = require_once();
    function glob(pattern, options, cb) {
      if (typeof options === "function")
        cb = options, options = {};
      if (!options)
        options = {};
      if (options.sync) {
        if (cb)
          throw new TypeError("callback provided to sync glob");
        return globSync(pattern, options);
      }
      return new Glob(pattern, options, cb);
    }
    glob.sync = globSync;
    var GlobSync = glob.GlobSync = globSync.GlobSync;
    glob.glob = glob;
    function extend(origin, add) {
      if (add === null || typeof add !== "object") {
        return origin;
      }
      var keys = Object.keys(add);
      var i = keys.length;
      while (i--) {
        origin[keys[i]] = add[keys[i]];
      }
      return origin;
    }
    glob.hasMagic = function(pattern, options_) {
      var options = extend({}, options_);
      options.noprocess = true;
      var g = new Glob(pattern, options);
      var set = g.minimatch.set;
      if (!pattern)
        return false;
      if (set.length > 1)
        return true;
      for (var j = 0; j < set[0].length; j++) {
        if (typeof set[0][j] !== "string")
          return true;
      }
      return false;
    };
    glob.Glob = Glob;
    inherits(Glob, EE);
    function Glob(pattern, options, cb) {
      if (typeof options === "function") {
        cb = options;
        options = null;
      }
      if (options && options.sync) {
        if (cb)
          throw new TypeError("callback provided to sync glob");
        return new GlobSync(pattern, options);
      }
      if (!(this instanceof Glob))
        return new Glob(pattern, options, cb);
      setopts(this, pattern, options);
      this._didRealPath = false;
      var n = this.minimatch.set.length;
      this.matches = new Array(n);
      if (typeof cb === "function") {
        cb = once(cb);
        this.on("error", cb);
        this.on("end", function(matches) {
          cb(null, matches);
        });
      }
      var self = this;
      this._processing = 0;
      this._emitQueue = [];
      this._processQueue = [];
      this.paused = false;
      if (this.noprocess)
        return this;
      if (n === 0)
        return done();
      var sync = true;
      for (var i = 0; i < n; i++) {
        this._process(this.minimatch.set[i], i, false, done);
      }
      sync = false;
      function done() {
        --self._processing;
        if (self._processing <= 0) {
          if (sync) {
            process.nextTick(function() {
              self._finish();
            });
          } else {
            self._finish();
          }
        }
      }
    }
    Glob.prototype._finish = function() {
      assert(this instanceof Glob);
      if (this.aborted)
        return;
      if (this.realpath && !this._didRealpath)
        return this._realpath();
      common.finish(this);
      this.emit("end", this.found);
    };
    Glob.prototype._realpath = function() {
      if (this._didRealpath)
        return;
      this._didRealpath = true;
      var n = this.matches.length;
      if (n === 0)
        return this._finish();
      var self = this;
      for (var i = 0; i < this.matches.length; i++)
        this._realpathSet(i, next);
      function next() {
        if (--n === 0)
          self._finish();
      }
    };
    Glob.prototype._realpathSet = function(index, cb) {
      var matchset = this.matches[index];
      if (!matchset)
        return cb();
      var found = Object.keys(matchset);
      var self = this;
      var n = found.length;
      if (n === 0)
        return cb();
      var set = this.matches[index] = /* @__PURE__ */ Object.create(null);
      found.forEach(function(p, i) {
        p = self._makeAbs(p);
        rp.realpath(p, self.realpathCache, function(er, real) {
          if (!er)
            set[real] = true;
          else if (er.syscall === "stat")
            set[p] = true;
          else
            self.emit("error", er);
          if (--n === 0) {
            self.matches[index] = set;
            cb();
          }
        });
      });
    };
    Glob.prototype._mark = function(p) {
      return common.mark(this, p);
    };
    Glob.prototype._makeAbs = function(f) {
      return common.makeAbs(this, f);
    };
    Glob.prototype.abort = function() {
      this.aborted = true;
      this.emit("abort");
    };
    Glob.prototype.pause = function() {
      if (!this.paused) {
        this.paused = true;
        this.emit("pause");
      }
    };
    Glob.prototype.resume = function() {
      if (this.paused) {
        this.emit("resume");
        this.paused = false;
        if (this._emitQueue.length) {
          var eq = this._emitQueue.slice(0);
          this._emitQueue.length = 0;
          for (var i = 0; i < eq.length; i++) {
            var e = eq[i];
            this._emitMatch(e[0], e[1]);
          }
        }
        if (this._processQueue.length) {
          var pq = this._processQueue.slice(0);
          this._processQueue.length = 0;
          for (var i = 0; i < pq.length; i++) {
            var p = pq[i];
            this._processing--;
            this._process(p[0], p[1], p[2], p[3]);
          }
        }
      }
    };
    Glob.prototype._process = function(pattern, index, inGlobStar, cb) {
      assert(this instanceof Glob);
      assert(typeof cb === "function");
      if (this.aborted)
        return;
      this._processing++;
      if (this.paused) {
        this._processQueue.push([pattern, index, inGlobStar, cb]);
        return;
      }
      var n = 0;
      while (typeof pattern[n] === "string") {
        n++;
      }
      var prefix;
      switch (n) {
        case pattern.length:
          this._processSimple(pattern.join("/"), index, cb);
          return;
        case 0:
          prefix = null;
          break;
        default:
          prefix = pattern.slice(0, n).join("/");
          break;
      }
      var remain = pattern.slice(n);
      var read;
      if (prefix === null)
        read = ".";
      else if (isAbsolute(prefix) || isAbsolute(pattern.map(function(p) {
        return typeof p === "string" ? p : "[*]";
      }).join("/"))) {
        if (!prefix || !isAbsolute(prefix))
          prefix = "/" + prefix;
        read = prefix;
      } else
        read = prefix;
      var abs = this._makeAbs(read);
      if (childrenIgnored(this, read))
        return cb();
      var isGlobStar = remain[0] === minimatch.GLOBSTAR;
      if (isGlobStar)
        this._processGlobStar(prefix, read, abs, remain, index, inGlobStar, cb);
      else
        this._processReaddir(prefix, read, abs, remain, index, inGlobStar, cb);
    };
    Glob.prototype._processReaddir = function(prefix, read, abs, remain, index, inGlobStar, cb) {
      var self = this;
      this._readdir(abs, inGlobStar, function(er, entries) {
        return self._processReaddir2(prefix, read, abs, remain, index, inGlobStar, entries, cb);
      });
    };
    Glob.prototype._processReaddir2 = function(prefix, read, abs, remain, index, inGlobStar, entries, cb) {
      if (!entries)
        return cb();
      var pn = remain[0];
      var negate = !!this.minimatch.negate;
      var rawGlob = pn._glob;
      var dotOk = this.dot || rawGlob.charAt(0) === ".";
      var matchedEntries = [];
      for (var i = 0; i < entries.length; i++) {
        var e = entries[i];
        if (e.charAt(0) !== "." || dotOk) {
          var m;
          if (negate && !prefix) {
            m = !e.match(pn);
          } else {
            m = e.match(pn);
          }
          if (m)
            matchedEntries.push(e);
        }
      }
      var len = matchedEntries.length;
      if (len === 0)
        return cb();
      if (remain.length === 1 && !this.mark && !this.stat) {
        if (!this.matches[index])
          this.matches[index] = /* @__PURE__ */ Object.create(null);
        for (var i = 0; i < len; i++) {
          var e = matchedEntries[i];
          if (prefix) {
            if (prefix !== "/")
              e = prefix + "/" + e;
            else
              e = prefix + e;
          }
          if (e.charAt(0) === "/" && !this.nomount) {
            e = path.join(this.root, e);
          }
          this._emitMatch(index, e);
        }
        return cb();
      }
      remain.shift();
      for (var i = 0; i < len; i++) {
        var e = matchedEntries[i];
        var newPattern;
        if (prefix) {
          if (prefix !== "/")
            e = prefix + "/" + e;
          else
            e = prefix + e;
        }
        this._process([e].concat(remain), index, inGlobStar, cb);
      }
      cb();
    };
    Glob.prototype._emitMatch = function(index, e) {
      if (this.aborted)
        return;
      if (isIgnored(this, e))
        return;
      if (this.paused) {
        this._emitQueue.push([index, e]);
        return;
      }
      var abs = isAbsolute(e) ? e : this._makeAbs(e);
      if (this.mark)
        e = this._mark(e);
      if (this.absolute)
        e = abs;
      if (this.matches[index][e])
        return;
      if (this.nodir) {
        var c = this.cache[abs];
        if (c === "DIR" || Array.isArray(c))
          return;
      }
      this.matches[index][e] = true;
      var st = this.statCache[abs];
      if (st)
        this.emit("stat", e, st);
      this.emit("match", e);
    };
    Glob.prototype._readdirInGlobStar = function(abs, cb) {
      if (this.aborted)
        return;
      if (this.follow)
        return this._readdir(abs, false, cb);
      var lstatkey = "lstat\0" + abs;
      var self = this;
      var lstatcb = inflight(lstatkey, lstatcb_);
      if (lstatcb)
        self.fs.lstat(abs, lstatcb);
      function lstatcb_(er, lstat) {
        if (er && er.code === "ENOENT")
          return cb();
        var isSym = lstat && lstat.isSymbolicLink();
        self.symlinks[abs] = isSym;
        if (!isSym && lstat && !lstat.isDirectory()) {
          self.cache[abs] = "FILE";
          cb();
        } else
          self._readdir(abs, false, cb);
      }
    };
    Glob.prototype._readdir = function(abs, inGlobStar, cb) {
      if (this.aborted)
        return;
      cb = inflight("readdir\0" + abs + "\0" + inGlobStar, cb);
      if (!cb)
        return;
      if (inGlobStar && !ownProp(this.symlinks, abs))
        return this._readdirInGlobStar(abs, cb);
      if (ownProp(this.cache, abs)) {
        var c = this.cache[abs];
        if (!c || c === "FILE")
          return cb();
        if (Array.isArray(c))
          return cb(null, c);
      }
      var self = this;
      self.fs.readdir(abs, readdirCb(this, abs, cb));
    };
    function readdirCb(self, abs, cb) {
      return function(er, entries) {
        if (er)
          self._readdirError(abs, er, cb);
        else
          self._readdirEntries(abs, entries, cb);
      };
    }
    Glob.prototype._readdirEntries = function(abs, entries, cb) {
      if (this.aborted)
        return;
      if (!this.mark && !this.stat) {
        for (var i = 0; i < entries.length; i++) {
          var e = entries[i];
          if (abs === "/")
            e = abs + e;
          else
            e = abs + "/" + e;
          this.cache[e] = true;
        }
      }
      this.cache[abs] = entries;
      return cb(null, entries);
    };
    Glob.prototype._readdirError = function(f, er, cb) {
      if (this.aborted)
        return;
      switch (er.code) {
        case "ENOTSUP":
        case "ENOTDIR":
          var abs = this._makeAbs(f);
          this.cache[abs] = "FILE";
          if (abs === this.cwdAbs) {
            var error = new Error(er.code + " invalid cwd " + this.cwd);
            error.path = this.cwd;
            error.code = er.code;
            this.emit("error", error);
            this.abort();
          }
          break;
        case "ENOENT":
        case "ELOOP":
        case "ENAMETOOLONG":
        case "UNKNOWN":
          this.cache[this._makeAbs(f)] = false;
          break;
        default:
          this.cache[this._makeAbs(f)] = false;
          if (this.strict) {
            this.emit("error", er);
            this.abort();
          }
          if (!this.silent)
            console.error("glob error", er);
          break;
      }
      return cb();
    };
    Glob.prototype._processGlobStar = function(prefix, read, abs, remain, index, inGlobStar, cb) {
      var self = this;
      this._readdir(abs, inGlobStar, function(er, entries) {
        self._processGlobStar2(prefix, read, abs, remain, index, inGlobStar, entries, cb);
      });
    };
    Glob.prototype._processGlobStar2 = function(prefix, read, abs, remain, index, inGlobStar, entries, cb) {
      if (!entries)
        return cb();
      var remainWithoutGlobStar = remain.slice(1);
      var gspref = prefix ? [prefix] : [];
      var noGlobStar = gspref.concat(remainWithoutGlobStar);
      this._process(noGlobStar, index, false, cb);
      var isSym = this.symlinks[abs];
      var len = entries.length;
      if (isSym && inGlobStar)
        return cb();
      for (var i = 0; i < len; i++) {
        var e = entries[i];
        if (e.charAt(0) === "." && !this.dot)
          continue;
        var instead = gspref.concat(entries[i], remainWithoutGlobStar);
        this._process(instead, index, true, cb);
        var below = gspref.concat(entries[i], remain);
        this._process(below, index, true, cb);
      }
      cb();
    };
    Glob.prototype._processSimple = function(prefix, index, cb) {
      var self = this;
      this._stat(prefix, function(er, exists) {
        self._processSimple2(prefix, index, er, exists, cb);
      });
    };
    Glob.prototype._processSimple2 = function(prefix, index, er, exists, cb) {
      if (!this.matches[index])
        this.matches[index] = /* @__PURE__ */ Object.create(null);
      if (!exists)
        return cb();
      if (prefix && isAbsolute(prefix) && !this.nomount) {
        var trail = /[\/\\]$/.test(prefix);
        if (prefix.charAt(0) === "/") {
          prefix = path.join(this.root, prefix);
        } else {
          prefix = path.resolve(this.root, prefix);
          if (trail)
            prefix += "/";
        }
      }
      if (process.platform === "win32")
        prefix = prefix.replace(/\\/g, "/");
      this._emitMatch(index, prefix);
      cb();
    };
    Glob.prototype._stat = function(f, cb) {
      var abs = this._makeAbs(f);
      var needDir = f.slice(-1) === "/";
      if (f.length > this.maxLength)
        return cb();
      if (!this.stat && ownProp(this.cache, abs)) {
        var c = this.cache[abs];
        if (Array.isArray(c))
          c = "DIR";
        if (!needDir || c === "DIR")
          return cb(null, c);
        if (needDir && c === "FILE")
          return cb();
      }
      var exists;
      var stat = this.statCache[abs];
      if (stat !== void 0) {
        if (stat === false)
          return cb(null, stat);
        else {
          var type = stat.isDirectory() ? "DIR" : "FILE";
          if (needDir && type === "FILE")
            return cb();
          else
            return cb(null, type, stat);
        }
      }
      var self = this;
      var statcb = inflight("stat\0" + abs, lstatcb_);
      if (statcb)
        self.fs.lstat(abs, statcb);
      function lstatcb_(er, lstat) {
        if (lstat && lstat.isSymbolicLink()) {
          return self.fs.stat(abs, function(er2, stat2) {
            if (er2)
              self._stat2(f, abs, null, lstat, cb);
            else
              self._stat2(f, abs, er2, stat2, cb);
          });
        } else {
          self._stat2(f, abs, er, lstat, cb);
        }
      }
    };
    Glob.prototype._stat2 = function(f, abs, er, stat, cb) {
      if (er && (er.code === "ENOENT" || er.code === "ENOTDIR")) {
        this.statCache[abs] = false;
        return cb();
      }
      var needDir = f.slice(-1) === "/";
      this.statCache[abs] = stat;
      if (abs.slice(-1) === "/" && stat && !stat.isDirectory())
        return cb(null, false, stat);
      var c = true;
      if (stat)
        c = stat.isDirectory() ? "DIR" : "FILE";
      this.cache[abs] = this.cache[abs] || c;
      if (needDir && c === "FILE")
        return cb();
      return cb(null, c, stat);
    };
  }
});

// node_modules/rimraf/rimraf.js
var require_rimraf2 = __commonJS({
  "node_modules/rimraf/rimraf.js"(exports2, module2) {
    var assert = require("assert");
    var path = require("path");
    var fs = require("fs");
    var glob = void 0;
    try {
      glob = require_glob2();
    } catch (_err) {
    }
    var defaultGlobOpts = {
      nosort: true,
      silent: true
    };
    var timeout = 0;
    var isWindows = process.platform === "win32";
    var defaults = (options) => {
      const methods = [
        "unlink",
        "chmod",
        "stat",
        "lstat",
        "rmdir",
        "readdir"
      ];
      methods.forEach((m) => {
        options[m] = options[m] || fs[m];
        m = m + "Sync";
        options[m] = options[m] || fs[m];
      });
      options.maxBusyTries = options.maxBusyTries || 3;
      options.emfileWait = options.emfileWait || 1e3;
      if (options.glob === false) {
        options.disableGlob = true;
      }
      if (options.disableGlob !== true && glob === void 0) {
        throw Error("glob dependency not found, set `options.disableGlob = true` if intentional");
      }
      options.disableGlob = options.disableGlob || false;
      options.glob = options.glob || defaultGlobOpts;
    };
    var rimraf = (p, options, cb) => {
      if (typeof options === "function") {
        cb = options;
        options = {};
      }
      assert(p, "rimraf: missing path");
      assert.equal(typeof p, "string", "rimraf: path should be a string");
      assert.equal(typeof cb, "function", "rimraf: callback function required");
      assert(options, "rimraf: invalid options argument provided");
      assert.equal(typeof options, "object", "rimraf: options should be object");
      defaults(options);
      let busyTries = 0;
      let errState = null;
      let n = 0;
      const next = (er) => {
        errState = errState || er;
        if (--n === 0)
          cb(errState);
      };
      const afterGlob = (er, results) => {
        if (er)
          return cb(er);
        n = results.length;
        if (n === 0)
          return cb();
        results.forEach((p2) => {
          const CB = (er2) => {
            if (er2) {
              if ((er2.code === "EBUSY" || er2.code === "ENOTEMPTY" || er2.code === "EPERM") && busyTries < options.maxBusyTries) {
                busyTries++;
                return setTimeout(() => rimraf_(p2, options, CB), busyTries * 100);
              }
              if (er2.code === "EMFILE" && timeout < options.emfileWait) {
                return setTimeout(() => rimraf_(p2, options, CB), timeout++);
              }
              if (er2.code === "ENOENT")
                er2 = null;
            }
            timeout = 0;
            next(er2);
          };
          rimraf_(p2, options, CB);
        });
      };
      if (options.disableGlob || !glob.hasMagic(p))
        return afterGlob(null, [p]);
      options.lstat(p, (er, stat) => {
        if (!er)
          return afterGlob(null, [p]);
        glob(p, options.glob, afterGlob);
      });
    };
    var rimraf_ = (p, options, cb) => {
      assert(p);
      assert(options);
      assert(typeof cb === "function");
      options.lstat(p, (er, st) => {
        if (er && er.code === "ENOENT")
          return cb(null);
        if (er && er.code === "EPERM" && isWindows)
          fixWinEPERM(p, options, er, cb);
        if (st && st.isDirectory())
          return rmdir(p, options, er, cb);
        options.unlink(p, (er2) => {
          if (er2) {
            if (er2.code === "ENOENT")
              return cb(null);
            if (er2.code === "EPERM")
              return isWindows ? fixWinEPERM(p, options, er2, cb) : rmdir(p, options, er2, cb);
            if (er2.code === "EISDIR")
              return rmdir(p, options, er2, cb);
          }
          return cb(er2);
        });
      });
    };
    var fixWinEPERM = (p, options, er, cb) => {
      assert(p);
      assert(options);
      assert(typeof cb === "function");
      options.chmod(p, 438, (er2) => {
        if (er2)
          cb(er2.code === "ENOENT" ? null : er);
        else
          options.stat(p, (er3, stats) => {
            if (er3)
              cb(er3.code === "ENOENT" ? null : er);
            else if (stats.isDirectory())
              rmdir(p, options, er, cb);
            else
              options.unlink(p, cb);
          });
      });
    };
    var fixWinEPERMSync = (p, options, er) => {
      assert(p);
      assert(options);
      try {
        options.chmodSync(p, 438);
      } catch (er2) {
        if (er2.code === "ENOENT")
          return;
        else
          throw er;
      }
      let stats;
      try {
        stats = options.statSync(p);
      } catch (er3) {
        if (er3.code === "ENOENT")
          return;
        else
          throw er;
      }
      if (stats.isDirectory())
        rmdirSync(p, options, er);
      else
        options.unlinkSync(p);
    };
    var rmdir = (p, options, originalEr, cb) => {
      assert(p);
      assert(options);
      assert(typeof cb === "function");
      options.rmdir(p, (er) => {
        if (er && (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM"))
          rmkids(p, options, cb);
        else if (er && er.code === "ENOTDIR")
          cb(originalEr);
        else
          cb(er);
      });
    };
    var rmkids = (p, options, cb) => {
      assert(p);
      assert(options);
      assert(typeof cb === "function");
      options.readdir(p, (er, files) => {
        if (er)
          return cb(er);
        let n = files.length;
        if (n === 0)
          return options.rmdir(p, cb);
        let errState;
        files.forEach((f) => {
          rimraf(path.join(p, f), options, (er2) => {
            if (errState)
              return;
            if (er2)
              return cb(errState = er2);
            if (--n === 0)
              options.rmdir(p, cb);
          });
        });
      });
    };
    var rimrafSync = (p, options) => {
      options = options || {};
      defaults(options);
      assert(p, "rimraf: missing path");
      assert.equal(typeof p, "string", "rimraf: path should be a string");
      assert(options, "rimraf: missing options");
      assert.equal(typeof options, "object", "rimraf: options should be object");
      let results;
      if (options.disableGlob || !glob.hasMagic(p)) {
        results = [p];
      } else {
        try {
          options.lstatSync(p);
          results = [p];
        } catch (er) {
          results = glob.sync(p, options.glob);
        }
      }
      if (!results.length)
        return;
      for (let i = 0; i < results.length; i++) {
        const p2 = results[i];
        let st;
        try {
          st = options.lstatSync(p2);
        } catch (er) {
          if (er.code === "ENOENT")
            return;
          if (er.code === "EPERM" && isWindows)
            fixWinEPERMSync(p2, options, er);
        }
        try {
          if (st && st.isDirectory())
            rmdirSync(p2, options, null);
          else
            options.unlinkSync(p2);
        } catch (er) {
          if (er.code === "ENOENT")
            return;
          if (er.code === "EPERM")
            return isWindows ? fixWinEPERMSync(p2, options, er) : rmdirSync(p2, options, er);
          if (er.code !== "EISDIR")
            throw er;
          rmdirSync(p2, options, er);
        }
      }
    };
    var rmdirSync = (p, options, originalEr) => {
      assert(p);
      assert(options);
      try {
        options.rmdirSync(p);
      } catch (er) {
        if (er.code === "ENOENT")
          return;
        if (er.code === "ENOTDIR")
          throw originalEr;
        if (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM")
          rmkidsSync(p, options);
      }
    };
    var rmkidsSync = (p, options) => {
      assert(p);
      assert(options);
      options.readdirSync(p).forEach((f) => rimrafSync(path.join(p, f), options));
      const retries = isWindows ? 100 : 1;
      let i = 0;
      do {
        let threw = true;
        try {
          const ret = options.rmdirSync(p, options);
          threw = false;
          return ret;
        } finally {
          if (++i < retries && threw)
            continue;
        }
      } while (true);
    };
    module2.exports = rimraf;
    rimraf.sync = rimrafSync;
  }
});

// node_modules/tmp/lib/tmp.js
var require_tmp = __commonJS({
  "node_modules/tmp/lib/tmp.js"(exports2, module2) {
    var fs = require("fs");
    var os = require("os");
    var path = require("path");
    var crypto4 = require("crypto");
    var _c = { fs: fs.constants, os: os.constants };
    var rimraf = require_rimraf2();
    var RANDOM_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var TEMPLATE_PATTERN = /XXXXXX/;
    var DEFAULT_TRIES = 3;
    var CREATE_FLAGS = (_c.O_CREAT || _c.fs.O_CREAT) | (_c.O_EXCL || _c.fs.O_EXCL) | (_c.O_RDWR || _c.fs.O_RDWR);
    var IS_WIN32 = os.platform() === "win32";
    var EBADF = _c.EBADF || _c.os.errno.EBADF;
    var ENOENT = _c.ENOENT || _c.os.errno.ENOENT;
    var DIR_MODE = 448;
    var FILE_MODE = 384;
    var EXIT = "exit";
    var _removeObjects = [];
    var FN_RMDIR_SYNC = fs.rmdirSync.bind(fs);
    var FN_RIMRAF_SYNC = rimraf.sync;
    var _gracefulCleanup = false;
    function tmpName(options, callback) {
      const args = _parseArguments(options, callback), opts = args[0], cb = args[1];
      try {
        _assertAndSanitizeOptions(opts);
      } catch (err) {
        return cb(err);
      }
      let tries = opts.tries;
      (function _getUniqueName() {
        try {
          const name = _generateTmpName(opts);
          fs.stat(name, function(err) {
            if (!err) {
              if (tries-- > 0)
                return _getUniqueName();
              return cb(new Error("Could not get a unique tmp filename, max tries reached " + name));
            }
            cb(null, name);
          });
        } catch (err) {
          cb(err);
        }
      })();
    }
    function tmpNameSync(options) {
      const args = _parseArguments(options), opts = args[0];
      _assertAndSanitizeOptions(opts);
      let tries = opts.tries;
      do {
        const name = _generateTmpName(opts);
        try {
          fs.statSync(name);
        } catch (e) {
          return name;
        }
      } while (tries-- > 0);
      throw new Error("Could not get a unique tmp filename, max tries reached");
    }
    function file(options, callback) {
      const args = _parseArguments(options, callback), opts = args[0], cb = args[1];
      tmpName(opts, function _tmpNameCreated(err, name) {
        if (err)
          return cb(err);
        fs.open(name, CREATE_FLAGS, opts.mode || FILE_MODE, function _fileCreated(err2, fd) {
          if (err2)
            return cb(err2);
          if (opts.discardDescriptor) {
            return fs.close(fd, function _discardCallback(possibleErr) {
              return cb(possibleErr, name, void 0, _prepareTmpFileRemoveCallback(name, -1, opts, false));
            });
          } else {
            const discardOrDetachDescriptor = opts.discardDescriptor || opts.detachDescriptor;
            cb(null, name, fd, _prepareTmpFileRemoveCallback(name, discardOrDetachDescriptor ? -1 : fd, opts, false));
          }
        });
      });
    }
    function fileSync(options) {
      const args = _parseArguments(options), opts = args[0];
      const discardOrDetachDescriptor = opts.discardDescriptor || opts.detachDescriptor;
      const name = tmpNameSync(opts);
      var fd = fs.openSync(name, CREATE_FLAGS, opts.mode || FILE_MODE);
      if (opts.discardDescriptor) {
        fs.closeSync(fd);
        fd = void 0;
      }
      return {
        name,
        fd,
        removeCallback: _prepareTmpFileRemoveCallback(name, discardOrDetachDescriptor ? -1 : fd, opts, true)
      };
    }
    function dir(options, callback) {
      const args = _parseArguments(options, callback), opts = args[0], cb = args[1];
      tmpName(opts, function _tmpNameCreated(err, name) {
        if (err)
          return cb(err);
        fs.mkdir(name, opts.mode || DIR_MODE, function _dirCreated(err2) {
          if (err2)
            return cb(err2);
          cb(null, name, _prepareTmpDirRemoveCallback(name, opts, false));
        });
      });
    }
    function dirSync(options) {
      const args = _parseArguments(options), opts = args[0];
      const name = tmpNameSync(opts);
      fs.mkdirSync(name, opts.mode || DIR_MODE);
      return {
        name,
        removeCallback: _prepareTmpDirRemoveCallback(name, opts, true)
      };
    }
    function _removeFileAsync(fdPath, next) {
      const _handler = function(err) {
        if (err && !_isENOENT(err)) {
          return next(err);
        }
        next();
      };
      if (0 <= fdPath[0])
        fs.close(fdPath[0], function() {
          fs.unlink(fdPath[1], _handler);
        });
      else
        fs.unlink(fdPath[1], _handler);
    }
    function _removeFileSync(fdPath) {
      let rethrownException = null;
      try {
        if (0 <= fdPath[0])
          fs.closeSync(fdPath[0]);
      } catch (e) {
        if (!_isEBADF(e) && !_isENOENT(e))
          throw e;
      } finally {
        try {
          fs.unlinkSync(fdPath[1]);
        } catch (e) {
          if (!_isENOENT(e))
            rethrownException = e;
        }
      }
      if (rethrownException !== null) {
        throw rethrownException;
      }
    }
    function _prepareTmpFileRemoveCallback(name, fd, opts, sync) {
      const removeCallbackSync = _prepareRemoveCallback(_removeFileSync, [fd, name], sync);
      const removeCallback = _prepareRemoveCallback(_removeFileAsync, [fd, name], sync, removeCallbackSync);
      if (!opts.keep)
        _removeObjects.unshift(removeCallbackSync);
      return sync ? removeCallbackSync : removeCallback;
    }
    function _prepareTmpDirRemoveCallback(name, opts, sync) {
      const removeFunction = opts.unsafeCleanup ? rimraf : fs.rmdir.bind(fs);
      const removeFunctionSync = opts.unsafeCleanup ? FN_RIMRAF_SYNC : FN_RMDIR_SYNC;
      const removeCallbackSync = _prepareRemoveCallback(removeFunctionSync, name, sync);
      const removeCallback = _prepareRemoveCallback(removeFunction, name, sync, removeCallbackSync);
      if (!opts.keep)
        _removeObjects.unshift(removeCallbackSync);
      return sync ? removeCallbackSync : removeCallback;
    }
    function _prepareRemoveCallback(removeFunction, fileOrDirName, sync, cleanupCallbackSync) {
      let called = false;
      return function _cleanupCallback(next) {
        if (!called) {
          const toRemove = cleanupCallbackSync || _cleanupCallback;
          const index = _removeObjects.indexOf(toRemove);
          if (index >= 0)
            _removeObjects.splice(index, 1);
          called = true;
          if (sync || removeFunction === FN_RMDIR_SYNC || removeFunction === FN_RIMRAF_SYNC) {
            return removeFunction(fileOrDirName);
          } else {
            return removeFunction(fileOrDirName, next || function() {
            });
          }
        }
      };
    }
    function _garbageCollector() {
      if (!_gracefulCleanup)
        return;
      while (_removeObjects.length) {
        try {
          _removeObjects[0]();
        } catch (e) {
        }
      }
    }
    function _randomChars(howMany) {
      let value = [], rnd = null;
      try {
        rnd = crypto4.randomBytes(howMany);
      } catch (e) {
        rnd = crypto4.pseudoRandomBytes(howMany);
      }
      for (var i = 0; i < howMany; i++) {
        value.push(RANDOM_CHARS[rnd[i] % RANDOM_CHARS.length]);
      }
      return value.join("");
    }
    function _isBlank(s) {
      return s === null || _isUndefined(s) || !s.trim();
    }
    function _isUndefined(obj) {
      return typeof obj === "undefined";
    }
    function _parseArguments(options, callback) {
      if (typeof options === "function") {
        return [{}, options];
      }
      if (_isUndefined(options)) {
        return [{}, callback];
      }
      const actualOptions = {};
      for (const key of Object.getOwnPropertyNames(options)) {
        actualOptions[key] = options[key];
      }
      return [actualOptions, callback];
    }
    function _generateTmpName(opts) {
      const tmpDir = opts.tmpdir;
      if (!_isUndefined(opts.name))
        return path.join(tmpDir, opts.dir, opts.name);
      if (!_isUndefined(opts.template))
        return path.join(tmpDir, opts.dir, opts.template).replace(TEMPLATE_PATTERN, _randomChars(6));
      const name = [
        opts.prefix ? opts.prefix : "tmp",
        "-",
        process.pid,
        "-",
        _randomChars(12),
        opts.postfix ? "-" + opts.postfix : ""
      ].join("");
      return path.join(tmpDir, opts.dir, name);
    }
    function _assertAndSanitizeOptions(options) {
      options.tmpdir = _getTmpDir(options);
      const tmpDir = options.tmpdir;
      if (!_isUndefined(options.name))
        _assertIsRelative(options.name, "name", tmpDir);
      if (!_isUndefined(options.dir))
        _assertIsRelative(options.dir, "dir", tmpDir);
      if (!_isUndefined(options.template)) {
        _assertIsRelative(options.template, "template", tmpDir);
        if (!options.template.match(TEMPLATE_PATTERN))
          throw new Error(`Invalid template, found "${options.template}".`);
      }
      if (!_isUndefined(options.tries) && isNaN(options.tries) || options.tries < 0)
        throw new Error(`Invalid tries, found "${options.tries}".`);
      options.tries = _isUndefined(options.name) ? options.tries || DEFAULT_TRIES : 1;
      options.keep = !!options.keep;
      options.detachDescriptor = !!options.detachDescriptor;
      options.discardDescriptor = !!options.discardDescriptor;
      options.unsafeCleanup = !!options.unsafeCleanup;
      options.dir = _isUndefined(options.dir) ? "" : path.relative(tmpDir, _resolvePath(options.dir, tmpDir));
      options.template = _isUndefined(options.template) ? void 0 : path.relative(tmpDir, _resolvePath(options.template, tmpDir));
      options.template = _isBlank(options.template) ? void 0 : path.relative(options.dir, options.template);
      options.name = _isUndefined(options.name) ? void 0 : _sanitizeName(options.name);
      options.prefix = _isUndefined(options.prefix) ? "" : options.prefix;
      options.postfix = _isUndefined(options.postfix) ? "" : options.postfix;
    }
    function _resolvePath(name, tmpDir) {
      const sanitizedName = _sanitizeName(name);
      if (sanitizedName.startsWith(tmpDir)) {
        return path.resolve(sanitizedName);
      } else {
        return path.resolve(path.join(tmpDir, sanitizedName));
      }
    }
    function _sanitizeName(name) {
      if (_isBlank(name)) {
        return name;
      }
      return name.replace(/["']/g, "");
    }
    function _assertIsRelative(name, option, tmpDir) {
      if (option === "name") {
        if (path.isAbsolute(name))
          throw new Error(`${option} option must not contain an absolute path, found "${name}".`);
        let basename = path.basename(name);
        if (basename === ".." || basename === "." || basename !== name)
          throw new Error(`${option} option must not contain a path, found "${name}".`);
      } else {
        if (path.isAbsolute(name) && !name.startsWith(tmpDir)) {
          throw new Error(`${option} option must be relative to "${tmpDir}", found "${name}".`);
        }
        let resolvedPath = _resolvePath(name, tmpDir);
        if (!resolvedPath.startsWith(tmpDir))
          throw new Error(`${option} option must be relative to "${tmpDir}", found "${resolvedPath}".`);
      }
    }
    function _isEBADF(error) {
      return _isExpectedError(error, -EBADF, "EBADF");
    }
    function _isENOENT(error) {
      return _isExpectedError(error, -ENOENT, "ENOENT");
    }
    function _isExpectedError(error, errno, code) {
      return IS_WIN32 ? error.code === code : error.code === code && error.errno === errno;
    }
    function setGracefulCleanup() {
      _gracefulCleanup = true;
    }
    function _getTmpDir(options) {
      return path.resolve(_sanitizeName(options && options.tmpdir || os.tmpdir()));
    }
    process.addListener(EXIT, _garbageCollector);
    Object.defineProperty(module2.exports, "tmpdir", {
      enumerable: true,
      configurable: false,
      get: function() {
        return _getTmpDir();
      }
    });
    module2.exports.dir = dir;
    module2.exports.dirSync = dirSync;
    module2.exports.file = file;
    module2.exports.fileSync = fileSync;
    module2.exports.tmpName = tmpName;
    module2.exports.tmpNameSync = tmpNameSync;
    module2.exports.setGracefulCleanup = setGracefulCleanup;
  }
});

// node_modules/tmp-promise/index.js
var require_tmp_promise = __commonJS({
  "node_modules/tmp-promise/index.js"(exports2, module2) {
    "use strict";
    var { promisify } = require("util");
    var tmp = require_tmp();
    module2.exports.fileSync = tmp.fileSync;
    var fileWithOptions = promisify(
      (options, cb) => tmp.file(
        options,
        (err, path, fd, cleanup) => err ? cb(err) : cb(void 0, { path, fd, cleanup: promisify(cleanup) })
      )
    );
    module2.exports.file = async (options) => fileWithOptions(options);
    module2.exports.withFile = async function withFile(fn, options) {
      const { path, fd, cleanup } = await module2.exports.file(options);
      try {
        return await fn({ path, fd });
      } finally {
        await cleanup();
      }
    };
    module2.exports.dirSync = tmp.dirSync;
    var dirWithOptions = promisify(
      (options, cb) => tmp.dir(
        options,
        (err, path, cleanup) => err ? cb(err) : cb(void 0, { path, cleanup: promisify(cleanup) })
      )
    );
    module2.exports.dir = async (options) => dirWithOptions(options);
    module2.exports.withDir = async function withDir(fn, options) {
      const { path, cleanup } = await module2.exports.dir(options);
      try {
        return await fn({ path });
      } finally {
        await cleanup();
      }
    };
    module2.exports.tmpNameSync = tmp.tmpNameSync;
    module2.exports.tmpName = promisify(tmp.tmpName);
    module2.exports.tmpdir = tmp.tmpdir;
    module2.exports.setGracefulCleanup = tmp.setGracefulCleanup;
  }
});

// node_modules/@actions/artifact/lib/internal/config-variables.js
var require_config_variables = __commonJS({
  "node_modules/@actions/artifact/lib/internal/config-variables.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getRetentionDays = exports2.getWorkSpaceDirectory = exports2.getWorkFlowRunId = exports2.getRuntimeUrl = exports2.getRuntimeToken = exports2.getDownloadFileConcurrency = exports2.getInitialRetryIntervalInMilliseconds = exports2.getRetryMultiplier = exports2.getRetryLimit = exports2.getUploadChunkSize = exports2.getUploadFileConcurrency = void 0;
    function getUploadFileConcurrency() {
      return 2;
    }
    exports2.getUploadFileConcurrency = getUploadFileConcurrency;
    function getUploadChunkSize() {
      return 8 * 1024 * 1024;
    }
    exports2.getUploadChunkSize = getUploadChunkSize;
    function getRetryLimit() {
      return 5;
    }
    exports2.getRetryLimit = getRetryLimit;
    function getRetryMultiplier() {
      return 1.5;
    }
    exports2.getRetryMultiplier = getRetryMultiplier;
    function getInitialRetryIntervalInMilliseconds() {
      return 3e3;
    }
    exports2.getInitialRetryIntervalInMilliseconds = getInitialRetryIntervalInMilliseconds;
    function getDownloadFileConcurrency() {
      return 2;
    }
    exports2.getDownloadFileConcurrency = getDownloadFileConcurrency;
    function getRuntimeToken() {
      const token = process.env["ACTIONS_RUNTIME_TOKEN"];
      if (!token) {
        throw new Error("Unable to get ACTIONS_RUNTIME_TOKEN env variable");
      }
      return token;
    }
    exports2.getRuntimeToken = getRuntimeToken;
    function getRuntimeUrl() {
      const runtimeUrl = process.env["ACTIONS_RUNTIME_URL"];
      if (!runtimeUrl) {
        throw new Error("Unable to get ACTIONS_RUNTIME_URL env variable");
      }
      return runtimeUrl;
    }
    exports2.getRuntimeUrl = getRuntimeUrl;
    function getWorkFlowRunId() {
      const workFlowRunId = process.env["GITHUB_RUN_ID"];
      if (!workFlowRunId) {
        throw new Error("Unable to get GITHUB_RUN_ID env variable");
      }
      return workFlowRunId;
    }
    exports2.getWorkFlowRunId = getWorkFlowRunId;
    function getWorkSpaceDirectory() {
      const workspaceDirectory = process.env["GITHUB_WORKSPACE"];
      if (!workspaceDirectory) {
        throw new Error("Unable to get GITHUB_WORKSPACE env variable");
      }
      return workspaceDirectory;
    }
    exports2.getWorkSpaceDirectory = getWorkSpaceDirectory;
    function getRetentionDays() {
      return process.env["GITHUB_RETENTION_DAYS"];
    }
    exports2.getRetentionDays = getRetentionDays;
  }
});

// node_modules/@actions/artifact/lib/internal/crc64.js
var require_crc64 = __commonJS({
  "node_modules/@actions/artifact/lib/internal/crc64.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var PREGEN_POLY_TABLE = [
      BigInt("0x0000000000000000"),
      BigInt("0x7F6EF0C830358979"),
      BigInt("0xFEDDE190606B12F2"),
      BigInt("0x81B31158505E9B8B"),
      BigInt("0xC962E5739841B68F"),
      BigInt("0xB60C15BBA8743FF6"),
      BigInt("0x37BF04E3F82AA47D"),
      BigInt("0x48D1F42BC81F2D04"),
      BigInt("0xA61CECB46814FE75"),
      BigInt("0xD9721C7C5821770C"),
      BigInt("0x58C10D24087FEC87"),
      BigInt("0x27AFFDEC384A65FE"),
      BigInt("0x6F7E09C7F05548FA"),
      BigInt("0x1010F90FC060C183"),
      BigInt("0x91A3E857903E5A08"),
      BigInt("0xEECD189FA00BD371"),
      BigInt("0x78E0FF3B88BE6F81"),
      BigInt("0x078E0FF3B88BE6F8"),
      BigInt("0x863D1EABE8D57D73"),
      BigInt("0xF953EE63D8E0F40A"),
      BigInt("0xB1821A4810FFD90E"),
      BigInt("0xCEECEA8020CA5077"),
      BigInt("0x4F5FFBD87094CBFC"),
      BigInt("0x30310B1040A14285"),
      BigInt("0xDEFC138FE0AA91F4"),
      BigInt("0xA192E347D09F188D"),
      BigInt("0x2021F21F80C18306"),
      BigInt("0x5F4F02D7B0F40A7F"),
      BigInt("0x179EF6FC78EB277B"),
      BigInt("0x68F0063448DEAE02"),
      BigInt("0xE943176C18803589"),
      BigInt("0x962DE7A428B5BCF0"),
      BigInt("0xF1C1FE77117CDF02"),
      BigInt("0x8EAF0EBF2149567B"),
      BigInt("0x0F1C1FE77117CDF0"),
      BigInt("0x7072EF2F41224489"),
      BigInt("0x38A31B04893D698D"),
      BigInt("0x47CDEBCCB908E0F4"),
      BigInt("0xC67EFA94E9567B7F"),
      BigInt("0xB9100A5CD963F206"),
      BigInt("0x57DD12C379682177"),
      BigInt("0x28B3E20B495DA80E"),
      BigInt("0xA900F35319033385"),
      BigInt("0xD66E039B2936BAFC"),
      BigInt("0x9EBFF7B0E12997F8"),
      BigInt("0xE1D10778D11C1E81"),
      BigInt("0x606216208142850A"),
      BigInt("0x1F0CE6E8B1770C73"),
      BigInt("0x8921014C99C2B083"),
      BigInt("0xF64FF184A9F739FA"),
      BigInt("0x77FCE0DCF9A9A271"),
      BigInt("0x08921014C99C2B08"),
      BigInt("0x4043E43F0183060C"),
      BigInt("0x3F2D14F731B68F75"),
      BigInt("0xBE9E05AF61E814FE"),
      BigInt("0xC1F0F56751DD9D87"),
      BigInt("0x2F3DEDF8F1D64EF6"),
      BigInt("0x50531D30C1E3C78F"),
      BigInt("0xD1E00C6891BD5C04"),
      BigInt("0xAE8EFCA0A188D57D"),
      BigInt("0xE65F088B6997F879"),
      BigInt("0x9931F84359A27100"),
      BigInt("0x1882E91B09FCEA8B"),
      BigInt("0x67EC19D339C963F2"),
      BigInt("0xD75ADABD7A6E2D6F"),
      BigInt("0xA8342A754A5BA416"),
      BigInt("0x29873B2D1A053F9D"),
      BigInt("0x56E9CBE52A30B6E4"),
      BigInt("0x1E383FCEE22F9BE0"),
      BigInt("0x6156CF06D21A1299"),
      BigInt("0xE0E5DE5E82448912"),
      BigInt("0x9F8B2E96B271006B"),
      BigInt("0x71463609127AD31A"),
      BigInt("0x0E28C6C1224F5A63"),
      BigInt("0x8F9BD7997211C1E8"),
      BigInt("0xF0F5275142244891"),
      BigInt("0xB824D37A8A3B6595"),
      BigInt("0xC74A23B2BA0EECEC"),
      BigInt("0x46F932EAEA507767"),
      BigInt("0x3997C222DA65FE1E"),
      BigInt("0xAFBA2586F2D042EE"),
      BigInt("0xD0D4D54EC2E5CB97"),
      BigInt("0x5167C41692BB501C"),
      BigInt("0x2E0934DEA28ED965"),
      BigInt("0x66D8C0F56A91F461"),
      BigInt("0x19B6303D5AA47D18"),
      BigInt("0x980521650AFAE693"),
      BigInt("0xE76BD1AD3ACF6FEA"),
      BigInt("0x09A6C9329AC4BC9B"),
      BigInt("0x76C839FAAAF135E2"),
      BigInt("0xF77B28A2FAAFAE69"),
      BigInt("0x8815D86ACA9A2710"),
      BigInt("0xC0C42C4102850A14"),
      BigInt("0xBFAADC8932B0836D"),
      BigInt("0x3E19CDD162EE18E6"),
      BigInt("0x41773D1952DB919F"),
      BigInt("0x269B24CA6B12F26D"),
      BigInt("0x59F5D4025B277B14"),
      BigInt("0xD846C55A0B79E09F"),
      BigInt("0xA72835923B4C69E6"),
      BigInt("0xEFF9C1B9F35344E2"),
      BigInt("0x90973171C366CD9B"),
      BigInt("0x1124202993385610"),
      BigInt("0x6E4AD0E1A30DDF69"),
      BigInt("0x8087C87E03060C18"),
      BigInt("0xFFE938B633338561"),
      BigInt("0x7E5A29EE636D1EEA"),
      BigInt("0x0134D92653589793"),
      BigInt("0x49E52D0D9B47BA97"),
      BigInt("0x368BDDC5AB7233EE"),
      BigInt("0xB738CC9DFB2CA865"),
      BigInt("0xC8563C55CB19211C"),
      BigInt("0x5E7BDBF1E3AC9DEC"),
      BigInt("0x21152B39D3991495"),
      BigInt("0xA0A63A6183C78F1E"),
      BigInt("0xDFC8CAA9B3F20667"),
      BigInt("0x97193E827BED2B63"),
      BigInt("0xE877CE4A4BD8A21A"),
      BigInt("0x69C4DF121B863991"),
      BigInt("0x16AA2FDA2BB3B0E8"),
      BigInt("0xF86737458BB86399"),
      BigInt("0x8709C78DBB8DEAE0"),
      BigInt("0x06BAD6D5EBD3716B"),
      BigInt("0x79D4261DDBE6F812"),
      BigInt("0x3105D23613F9D516"),
      BigInt("0x4E6B22FE23CC5C6F"),
      BigInt("0xCFD833A67392C7E4"),
      BigInt("0xB0B6C36E43A74E9D"),
      BigInt("0x9A6C9329AC4BC9B5"),
      BigInt("0xE50263E19C7E40CC"),
      BigInt("0x64B172B9CC20DB47"),
      BigInt("0x1BDF8271FC15523E"),
      BigInt("0x530E765A340A7F3A"),
      BigInt("0x2C608692043FF643"),
      BigInt("0xADD397CA54616DC8"),
      BigInt("0xD2BD67026454E4B1"),
      BigInt("0x3C707F9DC45F37C0"),
      BigInt("0x431E8F55F46ABEB9"),
      BigInt("0xC2AD9E0DA4342532"),
      BigInt("0xBDC36EC59401AC4B"),
      BigInt("0xF5129AEE5C1E814F"),
      BigInt("0x8A7C6A266C2B0836"),
      BigInt("0x0BCF7B7E3C7593BD"),
      BigInt("0x74A18BB60C401AC4"),
      BigInt("0xE28C6C1224F5A634"),
      BigInt("0x9DE29CDA14C02F4D"),
      BigInt("0x1C518D82449EB4C6"),
      BigInt("0x633F7D4A74AB3DBF"),
      BigInt("0x2BEE8961BCB410BB"),
      BigInt("0x548079A98C8199C2"),
      BigInt("0xD53368F1DCDF0249"),
      BigInt("0xAA5D9839ECEA8B30"),
      BigInt("0x449080A64CE15841"),
      BigInt("0x3BFE706E7CD4D138"),
      BigInt("0xBA4D61362C8A4AB3"),
      BigInt("0xC52391FE1CBFC3CA"),
      BigInt("0x8DF265D5D4A0EECE"),
      BigInt("0xF29C951DE49567B7"),
      BigInt("0x732F8445B4CBFC3C"),
      BigInt("0x0C41748D84FE7545"),
      BigInt("0x6BAD6D5EBD3716B7"),
      BigInt("0x14C39D968D029FCE"),
      BigInt("0x95708CCEDD5C0445"),
      BigInt("0xEA1E7C06ED698D3C"),
      BigInt("0xA2CF882D2576A038"),
      BigInt("0xDDA178E515432941"),
      BigInt("0x5C1269BD451DB2CA"),
      BigInt("0x237C997575283BB3"),
      BigInt("0xCDB181EAD523E8C2"),
      BigInt("0xB2DF7122E51661BB"),
      BigInt("0x336C607AB548FA30"),
      BigInt("0x4C0290B2857D7349"),
      BigInt("0x04D364994D625E4D"),
      BigInt("0x7BBD94517D57D734"),
      BigInt("0xFA0E85092D094CBF"),
      BigInt("0x856075C11D3CC5C6"),
      BigInt("0x134D926535897936"),
      BigInt("0x6C2362AD05BCF04F"),
      BigInt("0xED9073F555E26BC4"),
      BigInt("0x92FE833D65D7E2BD"),
      BigInt("0xDA2F7716ADC8CFB9"),
      BigInt("0xA54187DE9DFD46C0"),
      BigInt("0x24F29686CDA3DD4B"),
      BigInt("0x5B9C664EFD965432"),
      BigInt("0xB5517ED15D9D8743"),
      BigInt("0xCA3F8E196DA80E3A"),
      BigInt("0x4B8C9F413DF695B1"),
      BigInt("0x34E26F890DC31CC8"),
      BigInt("0x7C339BA2C5DC31CC"),
      BigInt("0x035D6B6AF5E9B8B5"),
      BigInt("0x82EE7A32A5B7233E"),
      BigInt("0xFD808AFA9582AA47"),
      BigInt("0x4D364994D625E4DA"),
      BigInt("0x3258B95CE6106DA3"),
      BigInt("0xB3EBA804B64EF628"),
      BigInt("0xCC8558CC867B7F51"),
      BigInt("0x8454ACE74E645255"),
      BigInt("0xFB3A5C2F7E51DB2C"),
      BigInt("0x7A894D772E0F40A7"),
      BigInt("0x05E7BDBF1E3AC9DE"),
      BigInt("0xEB2AA520BE311AAF"),
      BigInt("0x944455E88E0493D6"),
      BigInt("0x15F744B0DE5A085D"),
      BigInt("0x6A99B478EE6F8124"),
      BigInt("0x224840532670AC20"),
      BigInt("0x5D26B09B16452559"),
      BigInt("0xDC95A1C3461BBED2"),
      BigInt("0xA3FB510B762E37AB"),
      BigInt("0x35D6B6AF5E9B8B5B"),
      BigInt("0x4AB846676EAE0222"),
      BigInt("0xCB0B573F3EF099A9"),
      BigInt("0xB465A7F70EC510D0"),
      BigInt("0xFCB453DCC6DA3DD4"),
      BigInt("0x83DAA314F6EFB4AD"),
      BigInt("0x0269B24CA6B12F26"),
      BigInt("0x7D0742849684A65F"),
      BigInt("0x93CA5A1B368F752E"),
      BigInt("0xECA4AAD306BAFC57"),
      BigInt("0x6D17BB8B56E467DC"),
      BigInt("0x12794B4366D1EEA5"),
      BigInt("0x5AA8BF68AECEC3A1"),
      BigInt("0x25C64FA09EFB4AD8"),
      BigInt("0xA4755EF8CEA5D153"),
      BigInt("0xDB1BAE30FE90582A"),
      BigInt("0xBCF7B7E3C7593BD8"),
      BigInt("0xC399472BF76CB2A1"),
      BigInt("0x422A5673A732292A"),
      BigInt("0x3D44A6BB9707A053"),
      BigInt("0x759552905F188D57"),
      BigInt("0x0AFBA2586F2D042E"),
      BigInt("0x8B48B3003F739FA5"),
      BigInt("0xF42643C80F4616DC"),
      BigInt("0x1AEB5B57AF4DC5AD"),
      BigInt("0x6585AB9F9F784CD4"),
      BigInt("0xE436BAC7CF26D75F"),
      BigInt("0x9B584A0FFF135E26"),
      BigInt("0xD389BE24370C7322"),
      BigInt("0xACE74EEC0739FA5B"),
      BigInt("0x2D545FB4576761D0"),
      BigInt("0x523AAF7C6752E8A9"),
      BigInt("0xC41748D84FE75459"),
      BigInt("0xBB79B8107FD2DD20"),
      BigInt("0x3ACAA9482F8C46AB"),
      BigInt("0x45A459801FB9CFD2"),
      BigInt("0x0D75ADABD7A6E2D6"),
      BigInt("0x721B5D63E7936BAF"),
      BigInt("0xF3A84C3BB7CDF024"),
      BigInt("0x8CC6BCF387F8795D"),
      BigInt("0x620BA46C27F3AA2C"),
      BigInt("0x1D6554A417C62355"),
      BigInt("0x9CD645FC4798B8DE"),
      BigInt("0xE3B8B53477AD31A7"),
      BigInt("0xAB69411FBFB21CA3"),
      BigInt("0xD407B1D78F8795DA"),
      BigInt("0x55B4A08FDFD90E51"),
      BigInt("0x2ADA5047EFEC8728")
    ];
    var CRC64 = class {
      constructor() {
        this._crc = BigInt(0);
      }
      update(data) {
        const buffer = typeof data === "string" ? Buffer.from(data) : data;
        let crc = CRC64.flip64Bits(this._crc);
        for (const dataByte of buffer) {
          const crcByte = Number(crc & BigInt(255));
          crc = PREGEN_POLY_TABLE[crcByte ^ dataByte] ^ crc >> BigInt(8);
        }
        this._crc = CRC64.flip64Bits(crc);
      }
      digest(encoding) {
        switch (encoding) {
          case "hex":
            return this._crc.toString(16).toUpperCase();
          case "base64":
            return this.toBuffer().toString("base64");
          default:
            return this.toBuffer();
        }
      }
      toBuffer() {
        return Buffer.from([0, 8, 16, 24, 32, 40, 48, 56].map((s) => Number(this._crc >> BigInt(s) & BigInt(255))));
      }
      static flip64Bits(n) {
        return (BigInt(1) << BigInt(64)) - BigInt(1) - n;
      }
    };
    exports2.default = CRC64;
  }
});

// node_modules/@actions/artifact/lib/internal/utils.js
var require_utils5 = __commonJS({
  "node_modules/@actions/artifact/lib/internal/utils.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.digestForStream = exports2.sleep = exports2.getProperRetention = exports2.rmFile = exports2.getFileSize = exports2.createEmptyFilesForArtifact = exports2.createDirectoriesForArtifact = exports2.displayHttpDiagnostics = exports2.getArtifactUrl = exports2.createHttpClient = exports2.getUploadHeaders = exports2.getDownloadHeaders = exports2.getContentRange = exports2.tryGetRetryAfterValueTimeInMilliseconds = exports2.isThrottledStatusCode = exports2.isRetryableStatusCode = exports2.isForbiddenStatusCode = exports2.isSuccessStatusCode = exports2.getApiVersion = exports2.parseEnvNumber = exports2.getExponentialRetryTimeInMilliseconds = void 0;
    var crypto_1 = __importDefault(require("crypto"));
    var fs_1 = require("fs");
    var core_1 = require_core();
    var http_client_1 = require_lib2();
    var auth_1 = require_auth();
    var config_variables_1 = require_config_variables();
    var crc64_1 = __importDefault(require_crc64());
    function getExponentialRetryTimeInMilliseconds(retryCount) {
      if (retryCount < 0) {
        throw new Error("RetryCount should not be negative");
      } else if (retryCount === 0) {
        return config_variables_1.getInitialRetryIntervalInMilliseconds();
      }
      const minTime = config_variables_1.getInitialRetryIntervalInMilliseconds() * config_variables_1.getRetryMultiplier() * retryCount;
      const maxTime = minTime * config_variables_1.getRetryMultiplier();
      return Math.trunc(Math.random() * (maxTime - minTime) + minTime);
    }
    exports2.getExponentialRetryTimeInMilliseconds = getExponentialRetryTimeInMilliseconds;
    function parseEnvNumber(key) {
      const value = Number(process.env[key]);
      if (Number.isNaN(value) || value < 0) {
        return void 0;
      }
      return value;
    }
    exports2.parseEnvNumber = parseEnvNumber;
    function getApiVersion() {
      return "6.0-preview";
    }
    exports2.getApiVersion = getApiVersion;
    function isSuccessStatusCode(statusCode) {
      if (!statusCode) {
        return false;
      }
      return statusCode >= 200 && statusCode < 300;
    }
    exports2.isSuccessStatusCode = isSuccessStatusCode;
    function isForbiddenStatusCode(statusCode) {
      if (!statusCode) {
        return false;
      }
      return statusCode === http_client_1.HttpCodes.Forbidden;
    }
    exports2.isForbiddenStatusCode = isForbiddenStatusCode;
    function isRetryableStatusCode(statusCode) {
      if (!statusCode) {
        return false;
      }
      const retryableStatusCodes = [
        http_client_1.HttpCodes.BadGateway,
        http_client_1.HttpCodes.GatewayTimeout,
        http_client_1.HttpCodes.InternalServerError,
        http_client_1.HttpCodes.ServiceUnavailable,
        http_client_1.HttpCodes.TooManyRequests,
        413
        // Payload Too Large
      ];
      return retryableStatusCodes.includes(statusCode);
    }
    exports2.isRetryableStatusCode = isRetryableStatusCode;
    function isThrottledStatusCode(statusCode) {
      if (!statusCode) {
        return false;
      }
      return statusCode === http_client_1.HttpCodes.TooManyRequests;
    }
    exports2.isThrottledStatusCode = isThrottledStatusCode;
    function tryGetRetryAfterValueTimeInMilliseconds(headers) {
      if (headers["retry-after"]) {
        const retryTime = Number(headers["retry-after"]);
        if (!isNaN(retryTime)) {
          core_1.info(`Retry-After header is present with a value of ${retryTime}`);
          return retryTime * 1e3;
        }
        core_1.info(`Returned retry-after header value: ${retryTime} is non-numeric and cannot be used`);
        return void 0;
      }
      core_1.info(`No retry-after header was found. Dumping all headers for diagnostic purposes`);
      console.log(headers);
      return void 0;
    }
    exports2.tryGetRetryAfterValueTimeInMilliseconds = tryGetRetryAfterValueTimeInMilliseconds;
    function getContentRange(start, end, total) {
      return `bytes ${start}-${end}/${total}`;
    }
    exports2.getContentRange = getContentRange;
    function getDownloadHeaders(contentType, isKeepAlive, acceptGzip) {
      const requestOptions = {};
      if (contentType) {
        requestOptions["Content-Type"] = contentType;
      }
      if (isKeepAlive) {
        requestOptions["Connection"] = "Keep-Alive";
        requestOptions["Keep-Alive"] = "10";
      }
      if (acceptGzip) {
        requestOptions["Accept-Encoding"] = "gzip";
        requestOptions["Accept"] = `application/octet-stream;api-version=${getApiVersion()}`;
      } else {
        requestOptions["Accept"] = `application/json;api-version=${getApiVersion()}`;
      }
      return requestOptions;
    }
    exports2.getDownloadHeaders = getDownloadHeaders;
    function getUploadHeaders(contentType, isKeepAlive, isGzip, uncompressedLength, contentLength, contentRange, digest) {
      const requestOptions = {};
      requestOptions["Accept"] = `application/json;api-version=${getApiVersion()}`;
      if (contentType) {
        requestOptions["Content-Type"] = contentType;
      }
      if (isKeepAlive) {
        requestOptions["Connection"] = "Keep-Alive";
        requestOptions["Keep-Alive"] = "10";
      }
      if (isGzip) {
        requestOptions["Content-Encoding"] = "gzip";
        requestOptions["x-tfs-filelength"] = uncompressedLength;
      }
      if (contentLength) {
        requestOptions["Content-Length"] = contentLength;
      }
      if (contentRange) {
        requestOptions["Content-Range"] = contentRange;
      }
      if (digest) {
        requestOptions["x-actions-results-crc64"] = digest.crc64;
        requestOptions["x-actions-results-md5"] = digest.md5;
      }
      return requestOptions;
    }
    exports2.getUploadHeaders = getUploadHeaders;
    function createHttpClient(userAgent) {
      return new http_client_1.HttpClient(userAgent, [
        new auth_1.BearerCredentialHandler(config_variables_1.getRuntimeToken())
      ]);
    }
    exports2.createHttpClient = createHttpClient;
    function getArtifactUrl() {
      const artifactUrl = `${config_variables_1.getRuntimeUrl()}_apis/pipelines/workflows/${config_variables_1.getWorkFlowRunId()}/artifacts?api-version=${getApiVersion()}`;
      core_1.debug(`Artifact Url: ${artifactUrl}`);
      return artifactUrl;
    }
    exports2.getArtifactUrl = getArtifactUrl;
    function displayHttpDiagnostics(response) {
      core_1.info(`##### Begin Diagnostic HTTP information #####
Status Code: ${response.message.statusCode}
Status Message: ${response.message.statusMessage}
Header Information: ${JSON.stringify(response.message.headers, void 0, 2)}
###### End Diagnostic HTTP information ######`);
    }
    exports2.displayHttpDiagnostics = displayHttpDiagnostics;
    function createDirectoriesForArtifact(directories) {
      return __awaiter2(this, void 0, void 0, function* () {
        for (const directory of directories) {
          yield fs_1.promises.mkdir(directory, {
            recursive: true
          });
        }
      });
    }
    exports2.createDirectoriesForArtifact = createDirectoriesForArtifact;
    function createEmptyFilesForArtifact(emptyFilesToCreate) {
      return __awaiter2(this, void 0, void 0, function* () {
        for (const filePath of emptyFilesToCreate) {
          yield (yield fs_1.promises.open(filePath, "w")).close();
        }
      });
    }
    exports2.createEmptyFilesForArtifact = createEmptyFilesForArtifact;
    function getFileSize(filePath) {
      return __awaiter2(this, void 0, void 0, function* () {
        const stats = yield fs_1.promises.stat(filePath);
        core_1.debug(`${filePath} size:(${stats.size}) blksize:(${stats.blksize}) blocks:(${stats.blocks})`);
        return stats.size;
      });
    }
    exports2.getFileSize = getFileSize;
    function rmFile(filePath) {
      return __awaiter2(this, void 0, void 0, function* () {
        yield fs_1.promises.unlink(filePath);
      });
    }
    exports2.rmFile = rmFile;
    function getProperRetention(retentionInput, retentionSetting) {
      if (retentionInput < 0) {
        throw new Error("Invalid retention, minimum value is 1.");
      }
      let retention = retentionInput;
      if (retentionSetting) {
        const maxRetention = parseInt(retentionSetting);
        if (!isNaN(maxRetention) && maxRetention < retention) {
          core_1.warning(`Retention days is greater than the max value allowed by the repository setting, reduce retention to ${maxRetention} days`);
          retention = maxRetention;
        }
      }
      return retention;
    }
    exports2.getProperRetention = getProperRetention;
    function sleep(milliseconds) {
      return __awaiter2(this, void 0, void 0, function* () {
        return new Promise((resolve) => setTimeout(resolve, milliseconds));
      });
    }
    exports2.sleep = sleep;
    function digestForStream(stream) {
      return __awaiter2(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
          const crc64 = new crc64_1.default();
          const md52 = crypto_1.default.createHash("md5");
          stream.on("data", (data) => {
            crc64.update(data);
            md52.update(data);
          }).on("end", () => resolve({
            crc64: crc64.digest("base64"),
            md5: md52.digest("base64")
          })).on("error", reject);
        });
      });
    }
    exports2.digestForStream = digestForStream;
  }
});

// node_modules/@actions/artifact/lib/internal/status-reporter.js
var require_status_reporter = __commonJS({
  "node_modules/@actions/artifact/lib/internal/status-reporter.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.StatusReporter = void 0;
    var core_1 = require_core();
    var StatusReporter = class {
      constructor(displayFrequencyInMilliseconds) {
        this.totalNumberOfFilesToProcess = 0;
        this.processedCount = 0;
        this.largeFiles = /* @__PURE__ */ new Map();
        this.totalFileStatus = void 0;
        this.displayFrequencyInMilliseconds = displayFrequencyInMilliseconds;
      }
      setTotalNumberOfFilesToProcess(fileTotal) {
        this.totalNumberOfFilesToProcess = fileTotal;
        this.processedCount = 0;
      }
      start() {
        this.totalFileStatus = setInterval(() => {
          const percentage = this.formatPercentage(this.processedCount, this.totalNumberOfFilesToProcess);
          core_1.info(`Total file count: ${this.totalNumberOfFilesToProcess} ---- Processed file #${this.processedCount} (${percentage.slice(0, percentage.indexOf(".") + 2)}%)`);
        }, this.displayFrequencyInMilliseconds);
      }
      // if there is a large file that is being uploaded in chunks, this is used to display extra information about the status of the upload
      updateLargeFileStatus(fileName, chunkStartIndex, chunkEndIndex, totalUploadFileSize) {
        const percentage = this.formatPercentage(chunkEndIndex, totalUploadFileSize);
        core_1.info(`Uploaded ${fileName} (${percentage.slice(0, percentage.indexOf(".") + 2)}%) bytes ${chunkStartIndex}:${chunkEndIndex}`);
      }
      stop() {
        if (this.totalFileStatus) {
          clearInterval(this.totalFileStatus);
        }
      }
      incrementProcessedCount() {
        this.processedCount++;
      }
      formatPercentage(numerator, denominator) {
        return (numerator / denominator * 100).toFixed(4).toString();
      }
    };
    exports2.StatusReporter = StatusReporter;
  }
});

// node_modules/@actions/artifact/lib/internal/http-manager.js
var require_http_manager = __commonJS({
  "node_modules/@actions/artifact/lib/internal/http-manager.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.HttpManager = void 0;
    var utils_1 = require_utils5();
    var HttpManager = class {
      constructor(clientCount, userAgent) {
        if (clientCount < 1) {
          throw new Error("There must be at least one client");
        }
        this.userAgent = userAgent;
        this.clients = new Array(clientCount).fill(utils_1.createHttpClient(userAgent));
      }
      getClient(index) {
        return this.clients[index];
      }
      // client disposal is necessary if a keep-alive connection is used to properly close the connection
      // for more information see: https://github.com/actions/http-client/blob/04e5ad73cd3fd1f5610a32116b0759eddf6570d2/index.ts#L292
      disposeAndReplaceClient(index) {
        this.clients[index].dispose();
        this.clients[index] = utils_1.createHttpClient(this.userAgent);
      }
      disposeAndReplaceAllClients() {
        for (const [index] of this.clients.entries()) {
          this.disposeAndReplaceClient(index);
        }
      }
    };
    exports2.HttpManager = HttpManager;
  }
});

// node_modules/@actions/artifact/lib/internal/upload-gzip.js
var require_upload_gzip = __commonJS({
  "node_modules/@actions/artifact/lib/internal/upload-gzip.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __asyncValues = exports2 && exports2.__asyncValues || function(o) {
      if (!Symbol.asyncIterator)
        throw new TypeError("Symbol.asyncIterator is not defined.");
      var m = o[Symbol.asyncIterator], i;
      return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
        return this;
      }, i);
      function verb(n) {
        i[n] = o[n] && function(v) {
          return new Promise(function(resolve, reject) {
            v = o[n](v), settle(resolve, reject, v.done, v.value);
          });
        };
      }
      function settle(resolve, reject, d, v) {
        Promise.resolve(v).then(function(v2) {
          resolve({ value: v2, done: d });
        }, reject);
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createGZipFileInBuffer = exports2.createGZipFileOnDisk = void 0;
    var fs = __importStar(require("fs"));
    var zlib = __importStar(require("zlib"));
    var util_1 = require("util");
    var stat = util_1.promisify(fs.stat);
    var gzipExemptFileExtensions = [
      ".gzip",
      ".zip",
      ".tar.lz",
      ".tar.gz",
      ".tar.bz2",
      ".7z"
    ];
    function createGZipFileOnDisk(originalFilePath, tempFilePath) {
      return __awaiter2(this, void 0, void 0, function* () {
        for (const gzipExemptExtension of gzipExemptFileExtensions) {
          if (originalFilePath.endsWith(gzipExemptExtension)) {
            return Number.MAX_SAFE_INTEGER;
          }
        }
        return new Promise((resolve, reject) => {
          const inputStream = fs.createReadStream(originalFilePath);
          const gzip = zlib.createGzip();
          const outputStream = fs.createWriteStream(tempFilePath);
          inputStream.pipe(gzip).pipe(outputStream);
          outputStream.on("finish", () => __awaiter2(this, void 0, void 0, function* () {
            const size = (yield stat(tempFilePath)).size;
            resolve(size);
          }));
          outputStream.on("error", (error) => {
            console.log(error);
            reject;
          });
        });
      });
    }
    exports2.createGZipFileOnDisk = createGZipFileOnDisk;
    function createGZipFileInBuffer(originalFilePath) {
      return __awaiter2(this, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter2(this, void 0, void 0, function* () {
          var e_1, _a;
          const inputStream = fs.createReadStream(originalFilePath);
          const gzip = zlib.createGzip();
          inputStream.pipe(gzip);
          const chunks = [];
          try {
            for (var gzip_1 = __asyncValues(gzip), gzip_1_1; gzip_1_1 = yield gzip_1.next(), !gzip_1_1.done; ) {
              const chunk = gzip_1_1.value;
              chunks.push(chunk);
            }
          } catch (e_1_1) {
            e_1 = { error: e_1_1 };
          } finally {
            try {
              if (gzip_1_1 && !gzip_1_1.done && (_a = gzip_1.return))
                yield _a.call(gzip_1);
            } finally {
              if (e_1)
                throw e_1.error;
            }
          }
          resolve(Buffer.concat(chunks));
        }));
      });
    }
    exports2.createGZipFileInBuffer = createGZipFileInBuffer;
  }
});

// node_modules/@actions/artifact/lib/internal/requestUtils.js
var require_requestUtils = __commonJS({
  "node_modules/@actions/artifact/lib/internal/requestUtils.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.retryHttpClientRequest = exports2.retry = void 0;
    var utils_1 = require_utils5();
    var core2 = __importStar(require_core());
    var config_variables_1 = require_config_variables();
    function retry(name, operation, customErrorMessages, maxAttempts) {
      return __awaiter2(this, void 0, void 0, function* () {
        let response = void 0;
        let statusCode = void 0;
        let isRetryable = false;
        let errorMessage = "";
        let customErrorInformation = void 0;
        let attempt = 1;
        while (attempt <= maxAttempts) {
          try {
            response = yield operation();
            statusCode = response.message.statusCode;
            if (utils_1.isSuccessStatusCode(statusCode)) {
              return response;
            }
            if (statusCode) {
              customErrorInformation = customErrorMessages.get(statusCode);
            }
            isRetryable = utils_1.isRetryableStatusCode(statusCode);
            errorMessage = `Artifact service responded with ${statusCode}`;
          } catch (error) {
            isRetryable = true;
            errorMessage = error.message;
          }
          if (!isRetryable) {
            core2.info(`${name} - Error is not retryable`);
            if (response) {
              utils_1.displayHttpDiagnostics(response);
            }
            break;
          }
          core2.info(`${name} - Attempt ${attempt} of ${maxAttempts} failed with error: ${errorMessage}`);
          yield utils_1.sleep(utils_1.getExponentialRetryTimeInMilliseconds(attempt));
          attempt++;
        }
        if (response) {
          utils_1.displayHttpDiagnostics(response);
        }
        if (customErrorInformation) {
          throw Error(`${name} failed: ${customErrorInformation}`);
        }
        throw Error(`${name} failed: ${errorMessage}`);
      });
    }
    exports2.retry = retry;
    function retryHttpClientRequest(name, method, customErrorMessages = /* @__PURE__ */ new Map(), maxAttempts = config_variables_1.getRetryLimit()) {
      return __awaiter2(this, void 0, void 0, function* () {
        return yield retry(name, method, customErrorMessages, maxAttempts);
      });
    }
    exports2.retryHttpClientRequest = retryHttpClientRequest;
  }
});

// node_modules/@actions/artifact/lib/internal/upload-http-client.js
var require_upload_http_client = __commonJS({
  "node_modules/@actions/artifact/lib/internal/upload-http-client.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.UploadHttpClient = void 0;
    var fs = __importStar(require("fs"));
    var core2 = __importStar(require_core());
    var tmp = __importStar(require_tmp_promise());
    var stream = __importStar(require("stream"));
    var utils_1 = require_utils5();
    var config_variables_1 = require_config_variables();
    var util_1 = require("util");
    var url_1 = require("url");
    var perf_hooks_1 = require("perf_hooks");
    var status_reporter_1 = require_status_reporter();
    var http_client_1 = require_lib2();
    var http_manager_1 = require_http_manager();
    var upload_gzip_1 = require_upload_gzip();
    var requestUtils_1 = require_requestUtils();
    var stat = util_1.promisify(fs.stat);
    var UploadHttpClient = class {
      constructor() {
        this.uploadHttpManager = new http_manager_1.HttpManager(config_variables_1.getUploadFileConcurrency(), "@actions/artifact-upload");
        this.statusReporter = new status_reporter_1.StatusReporter(1e4);
      }
      /**
       * Creates a file container for the new artifact in the remote blob storage/file service
       * @param {string} artifactName Name of the artifact being created
       * @returns The response from the Artifact Service if the file container was successfully created
       */
      createArtifactInFileContainer(artifactName, options) {
        return __awaiter2(this, void 0, void 0, function* () {
          const parameters = {
            Type: "actions_storage",
            Name: artifactName
          };
          if (options && options.retentionDays) {
            const maxRetentionStr = config_variables_1.getRetentionDays();
            parameters.RetentionDays = utils_1.getProperRetention(options.retentionDays, maxRetentionStr);
          }
          const data = JSON.stringify(parameters, null, 2);
          const artifactUrl = utils_1.getArtifactUrl();
          const client = this.uploadHttpManager.getClient(0);
          const headers = utils_1.getUploadHeaders("application/json", false);
          const customErrorMessages = /* @__PURE__ */ new Map([
            [
              http_client_1.HttpCodes.Forbidden,
              "Artifact storage quota has been hit. Unable to upload any new artifacts"
            ],
            [
              http_client_1.HttpCodes.BadRequest,
              `The artifact name ${artifactName} is not valid. Request URL ${artifactUrl}`
            ]
          ]);
          const response = yield requestUtils_1.retryHttpClientRequest("Create Artifact Container", () => __awaiter2(this, void 0, void 0, function* () {
            return client.post(artifactUrl, data, headers);
          }), customErrorMessages);
          const body = yield response.readBody();
          return JSON.parse(body);
        });
      }
      /**
       * Concurrently upload all of the files in chunks
       * @param {string} uploadUrl Base Url for the artifact that was created
       * @param {SearchResult[]} filesToUpload A list of information about the files being uploaded
       * @returns The size of all the files uploaded in bytes
       */
      uploadArtifactToFileContainer(uploadUrl, filesToUpload, options) {
        return __awaiter2(this, void 0, void 0, function* () {
          const FILE_CONCURRENCY = config_variables_1.getUploadFileConcurrency();
          const MAX_CHUNK_SIZE = config_variables_1.getUploadChunkSize();
          core2.debug(`File Concurrency: ${FILE_CONCURRENCY}, and Chunk Size: ${MAX_CHUNK_SIZE}`);
          const parameters = [];
          let continueOnError = true;
          if (options) {
            if (options.continueOnError === false) {
              continueOnError = false;
            }
          }
          for (const file of filesToUpload) {
            const resourceUrl = new url_1.URL(uploadUrl);
            resourceUrl.searchParams.append("itemPath", file.uploadFilePath);
            parameters.push({
              file: file.absoluteFilePath,
              resourceUrl: resourceUrl.toString(),
              maxChunkSize: MAX_CHUNK_SIZE,
              continueOnError
            });
          }
          const parallelUploads = [...new Array(FILE_CONCURRENCY).keys()];
          const failedItemsToReport = [];
          let currentFile = 0;
          let completedFiles = 0;
          let uploadFileSize = 0;
          let totalFileSize = 0;
          let abortPendingFileUploads = false;
          this.statusReporter.setTotalNumberOfFilesToProcess(filesToUpload.length);
          this.statusReporter.start();
          yield Promise.all(parallelUploads.map((index) => __awaiter2(this, void 0, void 0, function* () {
            while (currentFile < filesToUpload.length) {
              const currentFileParameters = parameters[currentFile];
              currentFile += 1;
              if (abortPendingFileUploads) {
                failedItemsToReport.push(currentFileParameters.file);
                continue;
              }
              const startTime = perf_hooks_1.performance.now();
              const uploadFileResult = yield this.uploadFileAsync(index, currentFileParameters);
              if (core2.isDebug()) {
                core2.debug(`File: ${++completedFiles}/${filesToUpload.length}. ${currentFileParameters.file} took ${(perf_hooks_1.performance.now() - startTime).toFixed(3)} milliseconds to finish upload`);
              }
              uploadFileSize += uploadFileResult.successfulUploadSize;
              totalFileSize += uploadFileResult.totalSize;
              if (uploadFileResult.isSuccess === false) {
                failedItemsToReport.push(currentFileParameters.file);
                if (!continueOnError) {
                  core2.error(`aborting artifact upload`);
                  abortPendingFileUploads = true;
                }
              }
              this.statusReporter.incrementProcessedCount();
            }
          })));
          this.statusReporter.stop();
          this.uploadHttpManager.disposeAndReplaceAllClients();
          core2.info(`Total size of all the files uploaded is ${uploadFileSize} bytes`);
          return {
            uploadSize: uploadFileSize,
            totalSize: totalFileSize,
            failedItems: failedItemsToReport
          };
        });
      }
      /**
       * Asynchronously uploads a file. The file is compressed and uploaded using GZip if it is determined to save space.
       * If the upload file is bigger than the max chunk size it will be uploaded via multiple calls
       * @param {number} httpClientIndex The index of the httpClient that is being used to make all of the calls
       * @param {UploadFileParameters} parameters Information about the file that needs to be uploaded
       * @returns The size of the file that was uploaded in bytes along with any failed uploads
       */
      uploadFileAsync(httpClientIndex, parameters) {
        return __awaiter2(this, void 0, void 0, function* () {
          const fileStat = yield stat(parameters.file);
          const totalFileSize = fileStat.size;
          const isFIFO = fileStat.isFIFO();
          let offset = 0;
          let isUploadSuccessful = true;
          let failedChunkSizes = 0;
          let uploadFileSize = 0;
          let isGzip = true;
          if (!isFIFO && totalFileSize < 65536) {
            core2.debug(`${parameters.file} is less than 64k in size. Creating a gzip file in-memory to potentially reduce the upload size`);
            const buffer = yield upload_gzip_1.createGZipFileInBuffer(parameters.file);
            let openUploadStream;
            if (totalFileSize < buffer.byteLength) {
              core2.debug(`The gzip file created for ${parameters.file} did not help with reducing the size of the file. The original file will be uploaded as-is`);
              openUploadStream = () => fs.createReadStream(parameters.file);
              isGzip = false;
              uploadFileSize = totalFileSize;
            } else {
              core2.debug(`A gzip file created for ${parameters.file} helped with reducing the size of the original file. The file will be uploaded using gzip.`);
              openUploadStream = () => {
                const passThrough = new stream.PassThrough();
                passThrough.end(buffer);
                return passThrough;
              };
              uploadFileSize = buffer.byteLength;
            }
            const result = yield this.uploadChunk(httpClientIndex, parameters.resourceUrl, openUploadStream, 0, uploadFileSize - 1, uploadFileSize, isGzip, totalFileSize);
            if (!result) {
              isUploadSuccessful = false;
              failedChunkSizes += uploadFileSize;
              core2.warning(`Aborting upload for ${parameters.file} due to failure`);
            }
            return {
              isSuccess: isUploadSuccessful,
              successfulUploadSize: uploadFileSize - failedChunkSizes,
              totalSize: totalFileSize
            };
          } else {
            const tempFile = yield tmp.file();
            core2.debug(`${parameters.file} is greater than 64k in size. Creating a gzip file on-disk ${tempFile.path} to potentially reduce the upload size`);
            uploadFileSize = yield upload_gzip_1.createGZipFileOnDisk(parameters.file, tempFile.path);
            let uploadFilePath = tempFile.path;
            if (!isFIFO && totalFileSize < uploadFileSize) {
              core2.debug(`The gzip file created for ${parameters.file} did not help with reducing the size of the file. The original file will be uploaded as-is`);
              uploadFileSize = totalFileSize;
              uploadFilePath = parameters.file;
              isGzip = false;
            } else {
              core2.debug(`The gzip file created for ${parameters.file} is smaller than the original file. The file will be uploaded using gzip.`);
            }
            let abortFileUpload = false;
            while (offset < uploadFileSize) {
              const chunkSize = Math.min(uploadFileSize - offset, parameters.maxChunkSize);
              const startChunkIndex = offset;
              const endChunkIndex = offset + chunkSize - 1;
              offset += parameters.maxChunkSize;
              if (abortFileUpload) {
                failedChunkSizes += chunkSize;
                continue;
              }
              const result = yield this.uploadChunk(httpClientIndex, parameters.resourceUrl, () => fs.createReadStream(uploadFilePath, {
                start: startChunkIndex,
                end: endChunkIndex,
                autoClose: false
              }), startChunkIndex, endChunkIndex, uploadFileSize, isGzip, totalFileSize);
              if (!result) {
                isUploadSuccessful = false;
                failedChunkSizes += chunkSize;
                core2.warning(`Aborting upload for ${parameters.file} due to failure`);
                abortFileUpload = true;
              } else {
                if (uploadFileSize > 8388608) {
                  this.statusReporter.updateLargeFileStatus(parameters.file, startChunkIndex, endChunkIndex, uploadFileSize);
                }
              }
            }
            core2.debug(`deleting temporary gzip file ${tempFile.path}`);
            yield tempFile.cleanup();
            return {
              isSuccess: isUploadSuccessful,
              successfulUploadSize: uploadFileSize - failedChunkSizes,
              totalSize: totalFileSize
            };
          }
        });
      }
      /**
       * Uploads a chunk of an individual file to the specified resourceUrl. If the upload fails and the status code
       * indicates a retryable status, we try to upload the chunk as well
       * @param {number} httpClientIndex The index of the httpClient being used to make all the necessary calls
       * @param {string} resourceUrl Url of the resource that the chunk will be uploaded to
       * @param {NodeJS.ReadableStream} openStream Stream of the file that will be uploaded
       * @param {number} start Starting byte index of file that the chunk belongs to
       * @param {number} end Ending byte index of file that the chunk belongs to
       * @param {number} uploadFileSize Total size of the file in bytes that is being uploaded
       * @param {boolean} isGzip Denotes if we are uploading a Gzip compressed stream
       * @param {number} totalFileSize Original total size of the file that is being uploaded
       * @returns if the chunk was successfully uploaded
       */
      uploadChunk(httpClientIndex, resourceUrl, openStream, start, end, uploadFileSize, isGzip, totalFileSize) {
        return __awaiter2(this, void 0, void 0, function* () {
          const digest = yield utils_1.digestForStream(openStream());
          const headers = utils_1.getUploadHeaders("application/octet-stream", true, isGzip, totalFileSize, end - start + 1, utils_1.getContentRange(start, end, uploadFileSize), digest);
          const uploadChunkRequest = () => __awaiter2(this, void 0, void 0, function* () {
            const client = this.uploadHttpManager.getClient(httpClientIndex);
            return yield client.sendStream("PUT", resourceUrl, openStream(), headers);
          });
          let retryCount = 0;
          const retryLimit = config_variables_1.getRetryLimit();
          const incrementAndCheckRetryLimit = (response) => {
            retryCount++;
            if (retryCount > retryLimit) {
              if (response) {
                utils_1.displayHttpDiagnostics(response);
              }
              core2.info(`Retry limit has been reached for chunk at offset ${start} to ${resourceUrl}`);
              return true;
            }
            return false;
          };
          const backOff = (retryAfterValue) => __awaiter2(this, void 0, void 0, function* () {
            this.uploadHttpManager.disposeAndReplaceClient(httpClientIndex);
            if (retryAfterValue) {
              core2.info(`Backoff due to too many requests, retry #${retryCount}. Waiting for ${retryAfterValue} milliseconds before continuing the upload`);
              yield utils_1.sleep(retryAfterValue);
            } else {
              const backoffTime = utils_1.getExponentialRetryTimeInMilliseconds(retryCount);
              core2.info(`Exponential backoff for retry #${retryCount}. Waiting for ${backoffTime} milliseconds before continuing the upload at offset ${start}`);
              yield utils_1.sleep(backoffTime);
            }
            core2.info(`Finished backoff for retry #${retryCount}, continuing with upload`);
            return;
          });
          while (retryCount <= retryLimit) {
            let response;
            try {
              response = yield uploadChunkRequest();
            } catch (error) {
              core2.info(`An error has been caught http-client index ${httpClientIndex}, retrying the upload`);
              console.log(error);
              if (incrementAndCheckRetryLimit()) {
                return false;
              }
              yield backOff();
              continue;
            }
            yield response.readBody();
            if (utils_1.isSuccessStatusCode(response.message.statusCode)) {
              return true;
            } else if (utils_1.isRetryableStatusCode(response.message.statusCode)) {
              core2.info(`A ${response.message.statusCode} status code has been received, will attempt to retry the upload`);
              if (incrementAndCheckRetryLimit(response)) {
                return false;
              }
              utils_1.isThrottledStatusCode(response.message.statusCode) ? yield backOff(utils_1.tryGetRetryAfterValueTimeInMilliseconds(response.message.headers)) : yield backOff();
            } else {
              core2.error(`Unexpected response. Unable to upload chunk to ${resourceUrl}`);
              utils_1.displayHttpDiagnostics(response);
              return false;
            }
          }
          return false;
        });
      }
      /**
       * Updates the size of the artifact from -1 which was initially set when the container was first created for the artifact.
       * Updating the size indicates that we are done uploading all the contents of the artifact
       */
      patchArtifactSize(size, artifactName) {
        return __awaiter2(this, void 0, void 0, function* () {
          const resourceUrl = new url_1.URL(utils_1.getArtifactUrl());
          resourceUrl.searchParams.append("artifactName", artifactName);
          const parameters = { Size: size };
          const data = JSON.stringify(parameters, null, 2);
          core2.debug(`URL is ${resourceUrl.toString()}`);
          const client = this.uploadHttpManager.getClient(0);
          const headers = utils_1.getUploadHeaders("application/json", false);
          const customErrorMessages = /* @__PURE__ */ new Map([
            [
              http_client_1.HttpCodes.NotFound,
              `An Artifact with the name ${artifactName} was not found`
            ]
          ]);
          const response = yield requestUtils_1.retryHttpClientRequest("Finalize artifact upload", () => __awaiter2(this, void 0, void 0, function* () {
            return client.patch(resourceUrl.toString(), data, headers);
          }), customErrorMessages);
          yield response.readBody();
          core2.debug(`Artifact ${artifactName} has been successfully uploaded, total size in bytes: ${size}`);
        });
      }
    };
    exports2.UploadHttpClient = UploadHttpClient;
  }
});

// node_modules/@actions/artifact/lib/internal/download-http-client.js
var require_download_http_client = __commonJS({
  "node_modules/@actions/artifact/lib/internal/download-http-client.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.DownloadHttpClient = void 0;
    var fs = __importStar(require("fs"));
    var core2 = __importStar(require_core());
    var zlib = __importStar(require("zlib"));
    var utils_1 = require_utils5();
    var url_1 = require("url");
    var status_reporter_1 = require_status_reporter();
    var perf_hooks_1 = require("perf_hooks");
    var http_manager_1 = require_http_manager();
    var config_variables_1 = require_config_variables();
    var requestUtils_1 = require_requestUtils();
    var DownloadHttpClient = class {
      constructor() {
        this.downloadHttpManager = new http_manager_1.HttpManager(config_variables_1.getDownloadFileConcurrency(), "@actions/artifact-download");
        this.statusReporter = new status_reporter_1.StatusReporter(1e3);
      }
      /**
       * Gets a list of all artifacts that are in a specific container
       */
      listArtifacts() {
        return __awaiter2(this, void 0, void 0, function* () {
          const artifactUrl = utils_1.getArtifactUrl();
          const client = this.downloadHttpManager.getClient(0);
          const headers = utils_1.getDownloadHeaders("application/json");
          const response = yield requestUtils_1.retryHttpClientRequest("List Artifacts", () => __awaiter2(this, void 0, void 0, function* () {
            return client.get(artifactUrl, headers);
          }));
          const body = yield response.readBody();
          return JSON.parse(body);
        });
      }
      /**
       * Fetches a set of container items that describe the contents of an artifact
       * @param artifactName the name of the artifact
       * @param containerUrl the artifact container URL for the run
       */
      getContainerItems(artifactName, containerUrl) {
        return __awaiter2(this, void 0, void 0, function* () {
          const resourceUrl = new url_1.URL(containerUrl);
          resourceUrl.searchParams.append("itemPath", artifactName);
          const client = this.downloadHttpManager.getClient(0);
          const headers = utils_1.getDownloadHeaders("application/json");
          const response = yield requestUtils_1.retryHttpClientRequest("Get Container Items", () => __awaiter2(this, void 0, void 0, function* () {
            return client.get(resourceUrl.toString(), headers);
          }));
          const body = yield response.readBody();
          return JSON.parse(body);
        });
      }
      /**
       * Concurrently downloads all the files that are part of an artifact
       * @param downloadItems information about what items to download and where to save them
       */
      downloadSingleArtifact(downloadItems) {
        return __awaiter2(this, void 0, void 0, function* () {
          const DOWNLOAD_CONCURRENCY = config_variables_1.getDownloadFileConcurrency();
          core2.debug(`Download file concurrency is set to ${DOWNLOAD_CONCURRENCY}`);
          const parallelDownloads = [...new Array(DOWNLOAD_CONCURRENCY).keys()];
          let currentFile = 0;
          let downloadedFiles = 0;
          core2.info(`Total number of files that will be downloaded: ${downloadItems.length}`);
          this.statusReporter.setTotalNumberOfFilesToProcess(downloadItems.length);
          this.statusReporter.start();
          yield Promise.all(parallelDownloads.map((index) => __awaiter2(this, void 0, void 0, function* () {
            while (currentFile < downloadItems.length) {
              const currentFileToDownload = downloadItems[currentFile];
              currentFile += 1;
              const startTime = perf_hooks_1.performance.now();
              yield this.downloadIndividualFile(index, currentFileToDownload.sourceLocation, currentFileToDownload.targetPath);
              if (core2.isDebug()) {
                core2.debug(`File: ${++downloadedFiles}/${downloadItems.length}. ${currentFileToDownload.targetPath} took ${(perf_hooks_1.performance.now() - startTime).toFixed(3)} milliseconds to finish downloading`);
              }
              this.statusReporter.incrementProcessedCount();
            }
          }))).catch((error) => {
            throw new Error(`Unable to download the artifact: ${error}`);
          }).finally(() => {
            this.statusReporter.stop();
            this.downloadHttpManager.disposeAndReplaceAllClients();
          });
        });
      }
      /**
       * Downloads an individual file
       * @param httpClientIndex the index of the http client that is used to make all of the calls
       * @param artifactLocation origin location where a file will be downloaded from
       * @param downloadPath destination location for the file being downloaded
       */
      downloadIndividualFile(httpClientIndex, artifactLocation, downloadPath) {
        return __awaiter2(this, void 0, void 0, function* () {
          let retryCount = 0;
          const retryLimit = config_variables_1.getRetryLimit();
          let destinationStream = fs.createWriteStream(downloadPath);
          const headers = utils_1.getDownloadHeaders("application/json", true, true);
          const makeDownloadRequest = () => __awaiter2(this, void 0, void 0, function* () {
            const client = this.downloadHttpManager.getClient(httpClientIndex);
            return yield client.get(artifactLocation, headers);
          });
          const isGzip = (incomingHeaders) => {
            return "content-encoding" in incomingHeaders && incomingHeaders["content-encoding"] === "gzip";
          };
          const backOff = (retryAfterValue) => __awaiter2(this, void 0, void 0, function* () {
            retryCount++;
            if (retryCount > retryLimit) {
              return Promise.reject(new Error(`Retry limit has been reached. Unable to download ${artifactLocation}`));
            } else {
              this.downloadHttpManager.disposeAndReplaceClient(httpClientIndex);
              if (retryAfterValue) {
                core2.info(`Backoff due to too many requests, retry #${retryCount}. Waiting for ${retryAfterValue} milliseconds before continuing the download`);
                yield utils_1.sleep(retryAfterValue);
              } else {
                const backoffTime = utils_1.getExponentialRetryTimeInMilliseconds(retryCount);
                core2.info(`Exponential backoff for retry #${retryCount}. Waiting for ${backoffTime} milliseconds before continuing the download`);
                yield utils_1.sleep(backoffTime);
              }
              core2.info(`Finished backoff for retry #${retryCount}, continuing with download`);
            }
          });
          const isAllBytesReceived = (expected, received) => {
            if (!expected || !received || process.env["ACTIONS_ARTIFACT_SKIP_DOWNLOAD_VALIDATION"]) {
              core2.info("Skipping download validation.");
              return true;
            }
            return parseInt(expected) === received;
          };
          const resetDestinationStream = (fileDownloadPath) => __awaiter2(this, void 0, void 0, function* () {
            destinationStream.close();
            yield new Promise((resolve) => {
              destinationStream.on("close", resolve);
              if (destinationStream.writableFinished) {
                resolve();
              }
            });
            yield utils_1.rmFile(fileDownloadPath);
            destinationStream = fs.createWriteStream(fileDownloadPath);
          });
          while (retryCount <= retryLimit) {
            let response;
            try {
              response = yield makeDownloadRequest();
            } catch (error) {
              core2.info("An error occurred while attempting to download a file");
              console.log(error);
              yield backOff();
              continue;
            }
            let forceRetry = false;
            if (utils_1.isSuccessStatusCode(response.message.statusCode)) {
              try {
                const isGzipped = isGzip(response.message.headers);
                yield this.pipeResponseToFile(response, destinationStream, isGzipped);
                if (isGzipped || isAllBytesReceived(response.message.headers["content-length"], yield utils_1.getFileSize(downloadPath))) {
                  return;
                } else {
                  forceRetry = true;
                }
              } catch (error) {
                forceRetry = true;
              }
            }
            if (forceRetry || utils_1.isRetryableStatusCode(response.message.statusCode)) {
              core2.info(`A ${response.message.statusCode} response code has been received while attempting to download an artifact`);
              resetDestinationStream(downloadPath);
              utils_1.isThrottledStatusCode(response.message.statusCode) ? yield backOff(utils_1.tryGetRetryAfterValueTimeInMilliseconds(response.message.headers)) : yield backOff();
            } else {
              utils_1.displayHttpDiagnostics(response);
              return Promise.reject(new Error(`Unexpected http ${response.message.statusCode} during download for ${artifactLocation}`));
            }
          }
        });
      }
      /**
       * Pipes the response from downloading an individual file to the appropriate destination stream while decoding gzip content if necessary
       * @param response the http response received when downloading a file
       * @param destinationStream the stream where the file should be written to
       * @param isGzip a boolean denoting if the content is compressed using gzip and if we need to decode it
       */
      pipeResponseToFile(response, destinationStream, isGzip) {
        return __awaiter2(this, void 0, void 0, function* () {
          yield new Promise((resolve, reject) => {
            if (isGzip) {
              const gunzip = zlib.createGunzip();
              response.message.on("error", (error) => {
                core2.error(`An error occurred while attempting to read the response stream`);
                gunzip.close();
                destinationStream.close();
                reject(error);
              }).pipe(gunzip).on("error", (error) => {
                core2.error(`An error occurred while attempting to decompress the response stream`);
                destinationStream.close();
                reject(error);
              }).pipe(destinationStream).on("close", () => {
                resolve();
              }).on("error", (error) => {
                core2.error(`An error occurred while writing a downloaded file to ${destinationStream.path}`);
                reject(error);
              });
            } else {
              response.message.on("error", (error) => {
                core2.error(`An error occurred while attempting to read the response stream`);
                destinationStream.close();
                reject(error);
              }).pipe(destinationStream).on("close", () => {
                resolve();
              }).on("error", (error) => {
                core2.error(`An error occurred while writing a downloaded file to ${destinationStream.path}`);
                reject(error);
              });
            }
          });
          return;
        });
      }
    };
    exports2.DownloadHttpClient = DownloadHttpClient;
  }
});

// node_modules/@actions/artifact/lib/internal/download-specification.js
var require_download_specification = __commonJS({
  "node_modules/@actions/artifact/lib/internal/download-specification.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getDownloadSpecification = void 0;
    var path = __importStar(require("path"));
    function getDownloadSpecification(artifactName, artifactEntries, downloadPath, includeRootDirectory) {
      const directories = /* @__PURE__ */ new Set();
      const specifications = {
        rootDownloadLocation: includeRootDirectory ? path.join(downloadPath, artifactName) : downloadPath,
        directoryStructure: [],
        emptyFilesToCreate: [],
        filesToDownload: []
      };
      for (const entry of artifactEntries) {
        if (entry.path.startsWith(`${artifactName}/`) || entry.path.startsWith(`${artifactName}\\`)) {
          const normalizedPathEntry = path.normalize(entry.path);
          const filePath = path.join(downloadPath, includeRootDirectory ? normalizedPathEntry : normalizedPathEntry.replace(artifactName, ""));
          if (entry.itemType === "file") {
            directories.add(path.dirname(filePath));
            if (entry.fileLength === 0) {
              specifications.emptyFilesToCreate.push(filePath);
            } else {
              specifications.filesToDownload.push({
                sourceLocation: entry.contentLocation,
                targetPath: filePath
              });
            }
          }
        }
      }
      specifications.directoryStructure = Array.from(directories);
      return specifications;
    }
    exports2.getDownloadSpecification = getDownloadSpecification;
  }
});

// node_modules/@actions/artifact/lib/internal/artifact-client.js
var require_artifact_client = __commonJS({
  "node_modules/@actions/artifact/lib/internal/artifact-client.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.DefaultArtifactClient = void 0;
    var core2 = __importStar(require_core());
    var upload_specification_1 = require_upload_specification();
    var upload_http_client_1 = require_upload_http_client();
    var utils_1 = require_utils5();
    var path_and_artifact_name_validation_1 = require_path_and_artifact_name_validation();
    var download_http_client_1 = require_download_http_client();
    var download_specification_1 = require_download_specification();
    var config_variables_1 = require_config_variables();
    var path_1 = require("path");
    var DefaultArtifactClient = class {
      /**
       * Constructs a DefaultArtifactClient
       */
      static create() {
        return new DefaultArtifactClient();
      }
      /**
       * Uploads an artifact
       */
      uploadArtifact(name, files, rootDirectory, options) {
        return __awaiter2(this, void 0, void 0, function* () {
          core2.info(`Starting artifact upload
For more detailed logs during the artifact upload process, enable step-debugging: https://docs.github.com/actions/monitoring-and-troubleshooting-workflows/enabling-debug-logging#enabling-step-debug-logging`);
          path_and_artifact_name_validation_1.checkArtifactName(name);
          const uploadSpecification = upload_specification_1.getUploadSpecification(name, rootDirectory, files);
          const uploadResponse = {
            artifactName: name,
            artifactItems: [],
            size: 0,
            failedItems: []
          };
          const uploadHttpClient = new upload_http_client_1.UploadHttpClient();
          if (uploadSpecification.length === 0) {
            core2.warning(`No files found that can be uploaded`);
          } else {
            const response = yield uploadHttpClient.createArtifactInFileContainer(name, options);
            if (!response.fileContainerResourceUrl) {
              core2.debug(response.toString());
              throw new Error("No URL provided by the Artifact Service to upload an artifact to");
            }
            core2.debug(`Upload Resource URL: ${response.fileContainerResourceUrl}`);
            core2.info(`Container for artifact "${name}" successfully created. Starting upload of file(s)`);
            const uploadResult = yield uploadHttpClient.uploadArtifactToFileContainer(response.fileContainerResourceUrl, uploadSpecification, options);
            core2.info(`File upload process has finished. Finalizing the artifact upload`);
            yield uploadHttpClient.patchArtifactSize(uploadResult.totalSize, name);
            if (uploadResult.failedItems.length > 0) {
              core2.info(`Upload finished. There were ${uploadResult.failedItems.length} items that failed to upload`);
            } else {
              core2.info(`Artifact has been finalized. All files have been successfully uploaded!`);
            }
            core2.info(`
The raw size of all the files that were specified for upload is ${uploadResult.totalSize} bytes
The size of all the files that were uploaded is ${uploadResult.uploadSize} bytes. This takes into account any gzip compression used to reduce the upload size, time and storage

Note: The size of downloaded zips can differ significantly from the reported size. For more information see: https://github.com/actions/upload-artifact#zipped-artifact-downloads \r
`);
            uploadResponse.artifactItems = uploadSpecification.map((item) => item.absoluteFilePath);
            uploadResponse.size = uploadResult.uploadSize;
            uploadResponse.failedItems = uploadResult.failedItems;
          }
          return uploadResponse;
        });
      }
      downloadArtifact(name, path, options) {
        return __awaiter2(this, void 0, void 0, function* () {
          const downloadHttpClient = new download_http_client_1.DownloadHttpClient();
          const artifacts = yield downloadHttpClient.listArtifacts();
          if (artifacts.count === 0) {
            throw new Error(`Unable to find any artifacts for the associated workflow`);
          }
          const artifactToDownload = artifacts.value.find((artifact) => {
            return artifact.name === name;
          });
          if (!artifactToDownload) {
            throw new Error(`Unable to find an artifact with the name: ${name}`);
          }
          const items = yield downloadHttpClient.getContainerItems(artifactToDownload.name, artifactToDownload.fileContainerResourceUrl);
          if (!path) {
            path = config_variables_1.getWorkSpaceDirectory();
          }
          path = path_1.normalize(path);
          path = path_1.resolve(path);
          const downloadSpecification = download_specification_1.getDownloadSpecification(name, items.value, path, (options === null || options === void 0 ? void 0 : options.createArtifactFolder) || false);
          if (downloadSpecification.filesToDownload.length === 0) {
            core2.info(`No downloadable files were found for the artifact: ${artifactToDownload.name}`);
          } else {
            yield utils_1.createDirectoriesForArtifact(downloadSpecification.directoryStructure);
            core2.info("Directory structure has been setup for the artifact");
            yield utils_1.createEmptyFilesForArtifact(downloadSpecification.emptyFilesToCreate);
            yield downloadHttpClient.downloadSingleArtifact(downloadSpecification.filesToDownload);
          }
          return {
            artifactName: name,
            downloadPath: downloadSpecification.rootDownloadLocation
          };
        });
      }
      downloadAllArtifacts(path) {
        return __awaiter2(this, void 0, void 0, function* () {
          const downloadHttpClient = new download_http_client_1.DownloadHttpClient();
          const response = [];
          const artifacts = yield downloadHttpClient.listArtifacts();
          if (artifacts.count === 0) {
            core2.info("Unable to find any artifacts for the associated workflow");
            return response;
          }
          if (!path) {
            path = config_variables_1.getWorkSpaceDirectory();
          }
          path = path_1.normalize(path);
          path = path_1.resolve(path);
          let downloadedArtifacts = 0;
          while (downloadedArtifacts < artifacts.count) {
            const currentArtifactToDownload = artifacts.value[downloadedArtifacts];
            downloadedArtifacts += 1;
            core2.info(`starting download of artifact ${currentArtifactToDownload.name} : ${downloadedArtifacts}/${artifacts.count}`);
            const items = yield downloadHttpClient.getContainerItems(currentArtifactToDownload.name, currentArtifactToDownload.fileContainerResourceUrl);
            const downloadSpecification = download_specification_1.getDownloadSpecification(currentArtifactToDownload.name, items.value, path, true);
            if (downloadSpecification.filesToDownload.length === 0) {
              core2.info(`No downloadable files were found for any artifact ${currentArtifactToDownload.name}`);
            } else {
              yield utils_1.createDirectoriesForArtifact(downloadSpecification.directoryStructure);
              yield utils_1.createEmptyFilesForArtifact(downloadSpecification.emptyFilesToCreate);
              yield downloadHttpClient.downloadSingleArtifact(downloadSpecification.filesToDownload);
            }
            response.push({
              artifactName: currentArtifactToDownload.name,
              downloadPath: downloadSpecification.rootDownloadLocation
            });
          }
          return response;
        });
      }
    };
    exports2.DefaultArtifactClient = DefaultArtifactClient;
  }
});

// node_modules/@actions/artifact/lib/artifact-client.js
var require_artifact_client2 = __commonJS({
  "node_modules/@actions/artifact/lib/artifact-client.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.create = void 0;
    var artifact_client_1 = require_artifact_client();
    function create() {
      return artifact_client_1.DefaultArtifactClient.create();
    }
    exports2.create = create;
  }
});

// out/lib/host/ActionsLogger.js
var require_ActionsLogger = __commonJS({
  "out/lib/host/ActionsLogger.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var core2 = require_core();
    var ActionsLogger = {
      log: (...args) => console.log(args),
      warn: (...args) => core2.warning(args.join()),
      error: (...args) => core2.error(args.join()),
      debug: (...args) => core2.debug(args.join())
    };
    exports2.default = ActionsLogger;
  }
});

// out/lib/host/ActionsHost.js
var require_ActionsHost = __commonJS({
  "out/lib/host/ActionsHost.js"(exports2) {
    "use strict";
    var __awaiter2 = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ActionsHost = void 0;
    var fs = require_lib3();
    var path = require("path");
    var os = require("os");
    var unzip = require_unzip();
    var core2 = require_core();
    var artifact = require_artifact_client2();
    var ActionsLogger_1 = require_ActionsLogger();
    var ActionsHost = class {
      constructor(artifactStoreName) {
        this.name = "GitHub-Actions";
        this._artifactStoreName = artifactStoreName || "artifacts";
      }
      getInput(entry) {
        const value = core2.getInput(entry.name, { required: entry.required });
        return value && value.trim() !== "" ? value : void 0;
      }
      getArtifactStore() {
        return new ActionsArtifactStore(this._artifactStoreName);
      }
    };
    exports2.ActionsHost = ActionsHost;
    var ActionsArtifactStore = class {
      constructor(subFolder) {
        this._subFolder = subFolder;
        this._resultsDirectory = os.tmpdir();
      }
      getTempFolder() {
        const outputDirectory = this.getOutputDirectory();
        this._resultsDirectory = path.join(outputDirectory, "results");
        ActionsLogger_1.default.debug(`Artifact directory: ${outputDirectory}`);
        return outputDirectory;
      }
      upload(artifactName, files) {
        return __awaiter2(this, void 0, void 0, function* () {
          ActionsLogger_1.default.debug(`files: ${files.join(";")}`);
          yield fs.emptyDir(this._resultsDirectory);
          for (const file of files) {
            if (path.extname(file).toLowerCase() === ".zip") {
              ActionsLogger_1.default.debug(`unzipping ${file} into ${this._resultsDirectory} ...`);
              yield extractToFolder(file, this._resultsDirectory);
            } else {
              ActionsLogger_1.default.debug(`copying ${file} into ${this._resultsDirectory} ...`);
              yield fs.copyFile(file, path.join(this._resultsDirectory, path.basename(file)));
            }
          }
          const client = artifact.create();
          const resultFiles = (yield fs.readdir(this._resultsDirectory)).map((f) => path.resolve(this._resultsDirectory, f));
          if (resultFiles.length > 0) {
            client.uploadArtifact(artifactName, resultFiles, this._resultsDirectory, { continueOnError: true });
          } else {
            ActionsLogger_1.default.warn(`Found no result files`);
          }
        });
      }
      // https://docs.github.com/en/actions/learn-github-actions/environment-variables#default-environment-variables
      getOutputDirectory() {
        let baseOutDir;
        if (process.env.RUNNER_TEMP) {
          baseOutDir = process.env.RUNNER_TEMP;
        } else if (process.env.GITHUB_WORKSPACE) {
          baseOutDir = process.env.GITHUB_WORKSPACE;
        } else {
          baseOutDir = path.join(process.cwd(), "out");
        }
        const outputDirectory = path.join(baseOutDir, this._subFolder);
        fs.emptyDirSync(outputDirectory);
        return outputDirectory;
      }
    };
    function extractToFolder(zipFile, outDirectory) {
      return __awaiter2(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
          fs.createReadStream(zipFile).pipe(unzip.Extract({ path: outDirectory })).on("close", () => {
            resolve(outDirectory);
          }).on("error", (error) => {
            reject(error);
          });
        });
      });
    }
  }
});

// out/lib/auth/getEnvironmentUrl.js
var require_getEnvironmentUrl = __commonJS({
  "out/lib/auth/getEnvironmentUrl.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var core_1 = require_core();
    function getEnvironmentUrl() {
      return (0, core_1.getInput)("environment-url", { required: false });
    }
    exports2.default = getEnvironmentUrl;
  }
});

// out/lib/auth/getCredentials.js
var require_getCredentials = __commonJS({
  "out/lib/auth/getCredentials.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var core_1 = require_core();
    function getCredentials() {
      const usernamePassword = {
        username: getInput("user-name"),
        password: getInput("password-secret"),
        encodePassword: true,
        cloudInstance: getInput("cloud")
      };
      const isUpValid = isUsernamePasswordValid(usernamePassword);
      const clientCredentials = {
        appId: getInput("app-id"),
        clientSecret: getInput("client-secret"),
        encodeSecret: true,
        tenantId: getInput("tenant-id"),
        cloudInstance: getInput("cloud"),
        scheme: ""
        // no MgtIdentity support for Actions yet
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
    exports2.default = getCredentials;
    function getInput(name) {
      return (0, core_1.getInput)(name, { required: false });
    }
    function isUsernamePasswordValid(usernamePassword) {
      return !!usernamePassword.username && !!usernamePassword.password;
    }
    function isClientCredentialsValid(clientCredentials) {
      return !!clientCredentials.appId && !!clientCredentials.clientSecret && !!clientCredentials.tenantId;
    }
  }
});

// out/lib/actionLogger.js
var require_actionLogger = __commonJS({
  "out/lib/actionLogger.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ActionLogger = void 0;
    var core2 = require_core();
    var ActionLogger = class {
      info(...args) {
        core2.info(args.join());
      }
      warn(...args) {
        core2.warning(args.join());
      }
      error(...args) {
        const errorMessage = args.join();
        core2.setFailed(errorMessage);
        core2.error(errorMessage);
      }
      debug(...args) {
        core2.debug(args.join());
      }
      log(...args) {
        console.log(args.join());
      }
    };
    exports2.ActionLogger = ActionLogger;
  }
});

// out/lib/getExePath.js
var require_getExePath = __commonJS({
  "out/lib/getExePath.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var path_1 = require("path");
    function getExePath(...relativePath) {
      const currentDirectory = (0, path_1.resolve)(__dirname);
      const parentDir = (0, path_1.dirname)(currentDirectory);
      let outDirRoot;
      switch ((0, path_1.basename)(parentDir)) {
        case "actions":
          outDirRoot = (0, path_1.resolve)((0, path_1.dirname)(parentDir));
          break;
        case "src":
        case "out":
          outDirRoot = (0, path_1.resolve)(parentDir, "..", "out");
          break;
        default:
          throw Error(`ExeRunner: cannot resolve outDirRoot running from this location: ${path_1.dirname}`);
      }
      return (0, path_1.resolve)(outDirRoot, ...relativePath);
    }
    exports2.default = getExePath;
  }
});

// package.json
var require_package = __commonJS({
  "package.json"(exports2, module2) {
    module2.exports = {
      name: "@microsoft/powerplatform-actions",
      version: "0.1.0",
      description: "Github Action for Power Platform",
      main: "index.js",
      scripts: {
        clean: "scorch",
        build: "node node_modules/gulp/bin/gulp.js",
        test: "node node_modules/gulp/bin/gulp.js test",
        ci: "node node_modules/gulp/bin/gulp.js ci",
        "update-dist": "node node_modules/gulp/bin/gulp.js updateDist"
      },
      author: "PowerApps-ISV-Tools",
      license: "MIT",
      repository: {
        type: "git",
        url: "https://github.com/microsoft/powerplatform-actions.git"
      },
      devDependencies: {
        "@types/async": "^3.2.20",
        "@types/chai": "^4.3.5",
        "@types/fancy-log": "^2.0.0",
        "@types/fs-extra": "^9.0.12",
        "@types/glob": "^8.1.0",
        "@types/js-yaml": "^4.0.3",
        "@types/mocha": "^10.0.1",
        "@types/node": "^20.2.1",
        "@types/sinon": "^10.0.15",
        "@types/sinon-chai": "^3.2.9",
        "@types/unzip-stream": "^0.3.1",
        "@types/uuid": "^9.0.1",
        "@types/yargs": "^17.0.24",
        "@typescript-eslint/eslint-plugin": "^5.59.6",
        "@typescript-eslint/parser": "^5.59.6",
        async: "^3.2.4",
        chai: "^4.3.7",
        dotenv: "^16.0.3",
        esbuild: "^0.17.19",
        eslint: "^8.11.0",
        "fancy-log": "^2.0.0",
        glob: "^10.2.5",
        "glob-parent": "^6.0.2",
        gulp: "^4.0.2",
        "gulp-eslint": "^6.0.0",
        "gulp-mocha": "^8.0.0",
        "gulp-sourcemaps": "^3.0.0",
        "gulp-typescript": "^6.0.0-alpha.1",
        mocha: "^10.2.0",
        "node-fetch": "^3.3.1",
        postcss: "^8.4.23",
        "ps-list": "^8.1.1",
        rewiremock: "^3.14.5",
        sinon: "^15.1.0",
        "sinon-chai": "^3.5.0",
        "ts-node": "^10.9.1",
        "ts-sinon": "^2.0.1",
        typescript: "^5.0.4",
        "unzip-stream": "^0.3.1",
        winston: "^3.8.2",
        yargs: "^17.7.2"
      },
      dependencies: {
        "@actions/artifact": "^1.1.1",
        "@actions/core": "^1.10.0",
        "@microsoft/powerplatform-cli-wrapper": "^0.1.93",
        "date-fns": "^2.30.0",
        "fs-extra": "^10.0.0",
        "js-yaml": "^4.1",
        uuid: "^9.0.0"
      }
    };
  }
});

// out/lib/runnerParameters.js
var require_runnerParameters = __commonJS({
  "out/lib/runnerParameters.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getAutomationAgent = exports2.runnerParameters = void 0;
    var process_1 = require("process");
    var actionLogger_1 = require_actionLogger();
    var getExePath_1 = require_getExePath();
    function getAutomationAgent() {
      const jsonPackage = require_package();
      const productName = jsonPackage.name.split("/")[1];
      return productName + "/" + jsonPackage.version;
    }
    exports2.getAutomationAgent = getAutomationAgent;
    var runnerParameters = {
      runnersDir: (0, getExePath_1.default)(),
      workingDir: process.env["GITHUB_WORKSPACE"] || (0, process_1.cwd)(),
      logger: new actionLogger_1.ActionLogger(),
      agent: getAutomationAgent()
    };
    exports2.runnerParameters = runnerParameters;
  }
});

// out/actions/export-data/index.js
var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
Object.defineProperty(exports, "__esModule", { value: true });
var actions_1 = require_actions();
var core = require_core();
var YamlParser_1 = require_YamlParser();
var ActionsHost_1 = require_ActionsHost();
var getEnvironmentUrl_1 = require_getEnvironmentUrl();
var getCredentials_1 = require_getCredentials();
var runnerParameters_1 = require_runnerParameters();
(() => __awaiter(void 0, void 0, void 0, function* () {
  const taskParser = new YamlParser_1.YamlParser();
  const parameterMap = taskParser.getHostParameterEntries("export-data");
  const actionsHost = new ActionsHost_1.ActionsHost();
  const workingDir = actionsHost.getInput({ name: "working-directory", required: false });
  if (workingDir) {
    runnerParameters_1.runnerParameters.workingDir = workingDir;
  }
  core.startGroup("export-data:");
  yield (0, actions_1.dataExport)({
    credentials: (0, getCredentials_1.default)(),
    environmentUrl: (0, getEnvironmentUrl_1.default)(),
    schemaFile: parameterMap["schema-file"],
    dataFile: parameterMap["data-file"],
    overwrite: parameterMap["overwrite"],
    verbose: {
      name: "verbose",
      required: false,
      defaultValue: false
    }
  }, runnerParameters_1.runnerParameters, actionsHost);
  core.endGroup();
}))().catch((error) => {
  const logger = runnerParameters_1.runnerParameters.logger;
  logger.error(`failed: ${error}`);
  core.endGroup();
});
/*! Bundled license information:

tmp/lib/tmp.js:
  (*!
   * Tmp
   *
   * Copyright (c) 2011-2017 KARASZI Istvan <github@spam.raszi.hu>
   *
   * MIT Licensed
   *)
*/
