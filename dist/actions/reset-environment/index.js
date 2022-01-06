"use strict";
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// node_modules/@actions/core/lib/utils.js
var require_utils = __commonJS({
  "node_modules/@actions/core/lib/utils.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.toCommandValue = void 0;
    function toCommandValue(input) {
      if (input === null || input === void 0) {
        return "";
      } else if (typeof input === "string" || input instanceof String) {
        return input;
      }
      return JSON.stringify(input);
    }
    exports2.toCommandValue = toCommandValue;
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
    var utils_1 = require_utils();
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
    exports2.issueCommand = void 0;
    var fs = __importStar(require("fs"));
    var os = __importStar(require("os"));
    var utils_1 = require_utils();
    function issueCommand(command, message) {
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
    exports2.issueCommand = issueCommand;
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
    exports2.getState = exports2.saveState = exports2.group = exports2.endGroup = exports2.startGroup = exports2.info = exports2.warning = exports2.error = exports2.debug = exports2.isDebug = exports2.setFailed = exports2.setCommandEcho = exports2.setOutput = exports2.getBooleanInput = exports2.getMultilineInput = exports2.getInput = exports2.addPath = exports2.setSecret = exports2.exportVariable = exports2.ExitCode = void 0;
    var command_1 = require_command();
    var file_command_1 = require_file_command();
    var utils_1 = require_utils();
    var os = __importStar(require("os"));
    var path = __importStar(require("path"));
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
        const delimiter = "_GitHubActionsFileCommandDelimeter_";
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand("ENV", commandValue);
      } else {
        command_1.issueCommand("set-env", { name }, convertedVal);
      }
    }
    exports2.exportVariable = exportVariable;
    function setSecret(secret) {
      command_1.issueCommand("add-mask", {}, secret);
    }
    exports2.setSecret = setSecret;
    function addPath(inputPath) {
      const filePath = process.env["GITHUB_PATH"] || "";
      if (filePath) {
        file_command_1.issueCommand("PATH", inputPath);
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
      return inputs;
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
      process.stdout.write(os.EOL);
      command_1.issueCommand("set-output", { name }, value);
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
    function error(message) {
      command_1.issue("error", message instanceof Error ? message.toString() : message);
    }
    exports2.error = error;
    function warning(message) {
      command_1.issue("warning", message instanceof Error ? message.toString() : message);
    }
    exports2.warning = warning;
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
      command_1.issueCommand("save-state", { name }, value);
    }
    exports2.saveState = saveState;
    function getState(name) {
      return process.env[`STATE_${name}`] || "";
    }
    exports2.getState = getState;
  }
});

// out/lib/actionInput.js
var require_actionInput = __commonJS({
  "out/lib/actionInput.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getWorkingDirectory = exports2.getInputAsBool = void 0;
    var core2 = require_core();
    function getInputAsBool(name, required, defaultValue) {
      const textValue = core2.getInput(name, { required });
      return !textValue ? defaultValue : textValue.toLowerCase() === "true";
    }
    exports2.getInputAsBool = getInputAsBool;
    function getWorkingDirectory(name, required, defaultValue) {
      const textValue = core2.getInput(name, { required });
      return !textValue ? defaultValue !== null && defaultValue !== void 0 ? defaultValue : process.cwd() : textValue;
    }
    exports2.getWorkingDirectory = getWorkingDirectory;
  }
});

// out/lib/getExePath.js
var require_getExePath = __commonJS({
  "out/lib/getExePath.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var path_1 = require("path");
    function getExePath(...relativePath) {
      const currentDirectory = path_1.resolve(__dirname);
      const parentDir = path_1.dirname(currentDirectory);
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
    exports2.default = getExePath;
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
        "@types/async": "^3.2.7",
        "@types/chai": "^4.2.20",
        "@types/fancy-log": "^1.3.1",
        "@types/fs-extra": "^9.0.12",
        "@types/glob": "^7.1.4",
        "@types/js-yaml": "^4.0.3",
        "@types/mocha": "^8.2.3",
        "@types/node": "^14.14.35",
        "@types/sinon": "^9.0.11",
        "@types/sinon-chai": "^3.2.5",
        "@types/uuid": "^8.3.0",
        "@types/yargs": "^17.0.2",
        "@typescript-eslint/eslint-plugin": "^4.28.2",
        "@typescript-eslint/parser": "^4.28.2",
        async: "^3.2.0",
        chai: "^4.3.4",
        dotenv: "^8.2.0",
        esbuild: "^0.14.10",
        eslint: "^7.30.0",
        "fancy-log": "^1.3.3",
        glob: "^7.1.7",
        gulp: "^4.0.2",
        "gulp-eslint": "^6.0.0",
        "gulp-mocha": "^8.0.0",
        "gulp-sourcemaps": "^3.0.0",
        "gulp-typescript": "^6.0.0-alpha.1",
        mocha: "^9.0.2",
        "node-fetch": "^2.6.1",
        "ps-list": "^7.2.0",
        rewiremock: "^3.14.3",
        sinon: "^9.2.4",
        "sinon-chai": "^3.5.0",
        "ts-node": "^10.0.0",
        "ts-sinon": "^2.0.1",
        typescript: "^4.3.5",
        "unzip-stream": "^0.3.0",
        winston: "^3.3.3",
        yargs: "^17.0.1"
      },
      dependencies: {
        "@actions/artifact": "^0.5.2",
        "@actions/core": "^1.4.0",
        "@microsoft/powerplatform-cli-wrapper": "^0.1.38",
        "date-fns": "^2.22.1",
        "fs-extra": "^10.0.0",
        "js-yaml": "^4.1",
        uuid: "^8.3.2"
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
      runnersDir: getExePath_1.default(),
      workingDir: process_1.cwd(),
      logger: new actionLogger_1.ActionLogger(),
      agent: getAutomationAgent()
    };
    exports2.runnerParameters = runnerParameters;
  }
});

// out/lib/exeRunner.js
var require_exeRunner = __commonJS({
  "out/lib/exeRunner.js"(exports2) {
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
    exports2.RunnerError = exports2.ExeRunner = void 0;
    var child_process_1 = require("child_process");
    var os = require("os");
    var getExePath_1 = require_getExePath();
    var runnerParameters_1 = require_runnerParameters();
    var process2 = require("process");
    var ExeRunner = class {
      constructor(_workingDir, logger, exeName, exeRelativePath) {
        this._workingDir = _workingDir;
        this.logger = logger;
        if (exeRelativePath) {
          this._exePath = getExePath_1.default(...exeRelativePath, exeName);
        } else {
          this._exePath = exeName;
        }
      }
      get workingDir() {
        return this._workingDir;
      }
      run(args) {
        return __awaiter2(this, void 0, void 0, function* () {
          return new Promise((resolve, reject) => {
            const stdout = new Array();
            const stderr = new Array();
            this.logger.info(`exe: ${this._exePath}, first arg of ${args.length}: ${args.length ? args[0] : "<none>"}`);
            const cp = child_process_1.spawn(this._exePath, args, {
              cwd: this.workingDir,
              env: Object.assign(Object.assign({}, process2.env), { "PP_TOOLS_AUTOMATION_AGENT": runnerParameters_1.getAutomationAgent() })
            });
            cp.stdout.on("data", (data) => stdout.push(...data.toString().split(os.EOL)));
            cp.stderr.on("data", (data) => stderr.push(...data.toString().split(os.EOL)));
            cp.on("exit", (code) => {
              if (code === 0) {
                this.logger.info(`success: ${stdout.join(os.EOL)}`);
                resolve(stdout);
              } else {
                const allOutput = stderr.concat(stdout);
                this.logger.error(`error: ${code}: ${allOutput.join(os.EOL)}`);
                reject(new RunnerError(code !== null && code !== void 0 ? code : 99999, allOutput.join()));
              }
              cp.stdout.destroy();
              cp.stderr.destroy();
            });
          });
        });
      }
      runSync(args) {
        var _a;
        this.logger.info(`exe: ${this._exePath}, first arg of ${args.length}: ${args.length ? args[0] : "<none>"}`);
        const proc = child_process_1.spawnSync(this._exePath, args, {
          cwd: this.workingDir,
          env: Object.assign(Object.assign({}, process2.env), { "PP_TOOLS_AUTOMATION_AGENT": runnerParameters_1.getAutomationAgent() })
        });
        if (proc.status === 0) {
          const output = proc.output.filter((line) => !!line).map((line) => line.toString());
          this.logger.info(`success: ${output.join(os.EOL)}`);
          return output;
        } else {
          const allOutput = proc.stderr.toString().concat(proc.stdout.toString());
          this.logger.error(`error: ${proc.status}: ${allOutput}`);
          throw new RunnerError((_a = proc.status) !== null && _a !== void 0 ? _a : 99999, allOutput);
        }
      }
    };
    exports2.ExeRunner = ExeRunner;
    var RunnerError = class extends Error {
      constructor(exitCode, message) {
        super(message);
        this.exitCode = exitCode;
      }
    };
    exports2.RunnerError = RunnerError;
  }
});

// out/lib/gitRunner.js
var require_gitRunner = __commonJS({
  "out/lib/gitRunner.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.GitRunner = void 0;
    var exeRunner_1 = require_exeRunner();
    var GitRunner = class extends exeRunner_1.ExeRunner {
      constructor(workingDir, logger) {
        super(workingDir, logger, "git");
      }
    };
    exports2.GitRunner = GitRunner;
  }
});

// out/lib/pacRunner.js
var require_pacRunner = __commonJS({
  "out/lib/pacRunner.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.PacRunner = void 0;
    var exeRunner_1 = require_exeRunner();
    var os = require("os");
    var platform = os.platform();
    var programName = platform === "win32" ? "pac.exe" : "pac";
    var programPath = platform === "win32" ? ["pac", "tools"] : ["pac_linux", "tools"];
    var PacRunner = class extends exeRunner_1.ExeRunner {
      constructor(workingDir, logger) {
        super(workingDir, logger, programName, programPath);
      }
    };
    exports2.PacRunner = PacRunner;
  }
});

// out/lib/runnerFactory.js
var require_runnerFactory = __commonJS({
  "out/lib/runnerFactory.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.DefaultRunnerFactory = void 0;
    var actionLogger_1 = require_actionLogger();
    var gitRunner_1 = require_gitRunner();
    var pacRunner_1 = require_pacRunner();
    var RealRunnerFactory = class {
      constructor() {
        this._logger = new actionLogger_1.ActionLogger();
      }
      getRunner(runnerName, workingDir) {
        switch (runnerName) {
          case "pac":
            return new pacRunner_1.PacRunner(workingDir, this._logger);
          case "git":
            return new gitRunner_1.GitRunner(workingDir, this._logger);
          default:
            throw new Error(`Unknown runner type requested: ${runnerName}`);
        }
      }
    };
    exports2.DefaultRunnerFactory = new RealRunnerFactory();
  }
});

// out/lib/auth/getEnvironmentUrl.js
var require_getEnvironmentUrl = __commonJS({
  "out/lib/auth/getEnvironmentUrl.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var core_1 = require_core();
    function getEnvironmentUrl() {
      return core_1.getInput("environment-url", { required: false });
    }
    exports2.default = getEnvironmentUrl;
  }
});

// out/lib/auth/createLegacyRunnerPacAuthenticator.js
var require_createLegacyRunnerPacAuthenticator = __commonJS({
  "out/lib/auth/createLegacyRunnerPacAuthenticator.js"(exports2) {
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
    var getEnvironmentUrl_1 = require_getEnvironmentUrl();
    function createLegacyRunnerPacAuthenticator(pac) {
      return {
        authenticateCdsWithClientCredentials: (parameters) => __awaiter2(this, void 0, void 0, function* () {
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
            parameters.tenantId
          ]);
        }),
        authenticateAdminWithClientCredentials: (parameters) => __awaiter2(this, void 0, void 0, function* () {
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
            parameters.tenantId
          ]);
        }),
        authenticateCdsWithUsernamePassword: (parameters) => __awaiter2(this, void 0, void 0, function* () {
          yield clearAuth();
          yield pac.run([
            "auth",
            "create",
            "--url",
            getEnvironmentUrl_1.default(),
            "--username",
            parameters.username,
            "--password",
            parameters.password
          ]);
        }),
        authenticateAdminWithUsernamePassword: (parameters) => __awaiter2(this, void 0, void 0, function* () {
          yield clearAuth();
          yield pac.run([
            "auth",
            "create",
            "--kind",
            "ADMIN",
            "--username",
            parameters.username,
            "--password",
            parameters.password
          ]);
        })
      };
      function clearAuth() {
        return __awaiter2(this, void 0, void 0, function* () {
          yield pac.run(["auth", "clear"]);
        });
      }
    }
    exports2.default = createLegacyRunnerPacAuthenticator;
  }
});

// out/lib/auth/authHandler.js
var require_authHandler = __commonJS({
  "out/lib/auth/authHandler.js"(exports2) {
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
    exports2.AuthKind = exports2.AuthHandler = void 0;
    var core2 = require_core();
    var createLegacyRunnerPacAuthenticator_1 = require_createLegacyRunnerPacAuthenticator();
    var AuthHandler = class {
      constructor(pac) {
        if ("run" in pac) {
          this._pacAuthenticator = createLegacyRunnerPacAuthenticator_1.default(pac);
        } else {
          this._pacAuthenticator = pac;
        }
      }
      authenticate(authKind) {
        return __awaiter2(this, void 0, void 0, function* () {
          core2.startGroup("authentication");
          this._envUrl = core2.getInput("environment-url", { required: false });
          const authType = this.determineAuthType();
          if (authType === AuthTypes.USERNAME_PASSWORD) {
            yield this.authenticateWithUsernamePassword(authKind);
          } else if (authType == AuthTypes.APPID_SECRET) {
            yield this.authenticateWithClientCredentials(authKind);
          } else {
            throw new Error("Must provide either username/password or app-id/client-secret/tenant-id for authentication!");
          }
          core2.endGroup();
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
          } else if (validSPNAuth) {
            return AuthTypes.APPID_SECRET;
          }
        } catch (error) {
          core2.setFailed(`failed: ${error.message}`);
          throw error;
        }
        return AuthTypes.INVALID_AUTH_TYPE;
      }
      isValidUsernameAuth() {
        this._username = core2.getInput("user-name", { required: false });
        this._password = core2.getInput("password-secret", { required: false });
        return !!this._username && !!this._password;
      }
      isValidSPNAuth() {
        this._appId = core2.getInput("app-id", { required: false });
        this._clientSecret = core2.getInput("client-secret", {
          required: false
        });
        this._tenantId = core2.getInput("tenant-id", { required: false });
        return !!this._appId && !!this._clientSecret && !!this._tenantId;
      }
      authenticateWithClientCredentials(authKind) {
        return __awaiter2(this, void 0, void 0, function* () {
          core2.info(`SPN Authentication : Authenticating with appId: ${this._appId}`);
          if (authKind === AuthKind.CDS) {
            yield this._pacAuthenticator.authenticateCdsWithClientCredentials({
              tenantId: this._tenantId,
              appId: this._appId,
              clientSecret: this._clientSecret
            });
          } else {
            yield this._pacAuthenticator.authenticateAdminWithClientCredentials({
              tenantId: this._tenantId,
              appId: this._appId,
              clientSecret: this._clientSecret
            });
          }
        });
      }
      authenticateWithUsernamePassword(authKind) {
        return __awaiter2(this, void 0, void 0, function* () {
          core2.info(`Username/password Authentication : Authenticating with user: ${this._username}`);
          if (authKind == AuthKind.CDS) {
            yield this._pacAuthenticator.authenticateCdsWithUsernamePassword({
              username: this._username,
              password: this._password
            });
          } else {
            yield this._pacAuthenticator.authenticateAdminWithUsernamePassword({
              username: this._username,
              password: this._password
            });
          }
        });
      }
    };
    exports2.AuthHandler = AuthHandler;
    var AuthTypes;
    (function(AuthTypes2) {
      AuthTypes2[AuthTypes2["USERNAME_PASSWORD"] = 0] = "USERNAME_PASSWORD";
      AuthTypes2[AuthTypes2["APPID_SECRET"] = 1] = "APPID_SECRET";
      AuthTypes2[AuthTypes2["INVALID_AUTH_TYPE"] = 2] = "INVALID_AUTH_TYPE";
    })(AuthTypes || (AuthTypes = {}));
    var AuthKind;
    (function(AuthKind2) {
      AuthKind2[AuthKind2["CDS"] = 0] = "CDS";
      AuthKind2[AuthKind2["ADMIN"] = 1] = "ADMIN";
    })(AuthKind = exports2.AuthKind || (exports2.AuthKind = {}));
  }
});

// out/lib/index.js
var require_lib = __commonJS({
  "out/lib/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.AuthKind = exports2.AuthHandler = exports2.PacRunner = exports2.GitRunner = exports2.ActionLogger = exports2.DefaultRunnerFactory = exports2.RunnerError = exports2.getWorkingDirectory = exports2.getInputAsBool = void 0;
    var actionInput_1 = require_actionInput();
    Object.defineProperty(exports2, "getInputAsBool", { enumerable: true, get: function() {
      return actionInput_1.getInputAsBool;
    } });
    Object.defineProperty(exports2, "getWorkingDirectory", { enumerable: true, get: function() {
      return actionInput_1.getWorkingDirectory;
    } });
    var exeRunner_1 = require_exeRunner();
    Object.defineProperty(exports2, "RunnerError", { enumerable: true, get: function() {
      return exeRunner_1.RunnerError;
    } });
    var runnerFactory_1 = require_runnerFactory();
    Object.defineProperty(exports2, "DefaultRunnerFactory", { enumerable: true, get: function() {
      return runnerFactory_1.DefaultRunnerFactory;
    } });
    var actionLogger_1 = require_actionLogger();
    Object.defineProperty(exports2, "ActionLogger", { enumerable: true, get: function() {
      return actionLogger_1.ActionLogger;
    } });
    var gitRunner_1 = require_gitRunner();
    Object.defineProperty(exports2, "GitRunner", { enumerable: true, get: function() {
      return gitRunner_1.GitRunner;
    } });
    var pacRunner_1 = require_pacRunner();
    Object.defineProperty(exports2, "PacRunner", { enumerable: true, get: function() {
      return pacRunner_1.PacRunner;
    } });
    var authHandler_1 = require_authHandler();
    Object.defineProperty(exports2, "AuthHandler", { enumerable: true, get: function() {
      return authHandler_1.AuthHandler;
    } });
    Object.defineProperty(exports2, "AuthKind", { enumerable: true, get: function() {
      return authHandler_1.AuthKind;
    } });
  }
});

// out/actions/reset-environment/index.js
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
exports.main = void 0;
var core = require_core();
var lib_1 = require_lib();
(() => __awaiter(void 0, void 0, void 0, function* () {
  if (process.env.GITHUB_ACTIONS) {
    yield main(lib_1.DefaultRunnerFactory);
  }
}))();
function main(factory) {
  return __awaiter(this, void 0, void 0, function* () {
    let pac;
    try {
      core.startGroup("reset-environment:");
      const envUrl = core.getInput("environment-url", { required: true });
      pac = factory.getRunner("pac", process.cwd());
      yield new lib_1.AuthHandler(pac).authenticate(lib_1.AuthKind.ADMIN);
      const resetEnvArgs = ["admin", "reset", "--url", envUrl];
      yield pac.run(resetEnvArgs);
      core.info("environment reset");
      core.endGroup();
    } catch (error) {
      core.setFailed(`failed: ${error.message}`);
      throw error;
    } finally {
      yield pac === null || pac === void 0 ? void 0 : pac.run(["auth", "clear"]);
    }
  });
}
exports.main = main;
