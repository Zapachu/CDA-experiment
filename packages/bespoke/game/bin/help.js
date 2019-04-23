"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var path = require("path");
var fs = require("fs");
var inquirer_1 = require("inquirer");
var shelljs_1 = require("shelljs");
var RecentTask;
(function (RecentTask) {
    RecentTask.groupName = 'RecentTask';
    var logPath = path.resolve(__dirname, './help.log');
    function getGroups() {
        return fs.existsSync(logPath) ? [RecentTask.groupName] : [];
    }
    RecentTask.getGroups = getGroups;
    function getLogs() {
        try {
            return fs.readFileSync(logPath).toString().split('\n').map(function (row) { return JSON.parse(row); });
        }
        catch (e) {
            return [];
        }
    }
    RecentTask.getLogs = getLogs;
    function appendLog(_a) {
        var command = _a.command, env = _a.env;
        var logs = getLogs().map(function (log) { return JSON.stringify(log); });
        var newLog = JSON.stringify({ command: command, env: env });
        if (logs.includes(newLog)) {
            return;
        }
        logs.unshift(newLog);
        fs.writeFileSync(logPath, logs.slice(0, 5).join('\n'));
    }
    RecentTask.appendLog = appendLog;
})(RecentTask || (RecentTask = {}));
var Side;
(function (Side) {
    Side["client"] = "client";
    Side["server"] = "server";
})(Side || (Side = {}));
var BuildMode;
(function (BuildMode) {
    BuildMode["dev"] = "dev";
    BuildMode["dist"] = "dist";
    BuildMode["publish"] = "publish";
})(BuildMode || (BuildMode = {}));
(function () {
    return __awaiter(this, void 0, void 0, function () {
        var namespace, namespacePath, group, taskLog, _a, command, _env, namespaces, side, _b, mode, _env, command, dev, _env, _c, withProxy, withLinker, command;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, inquirer_1.prompt([
                        {
                            name: 'group',
                            type: 'list',
                            choices: RecentTask.getGroups().concat(fs.readdirSync(path.resolve(__dirname, '../')).filter(function (name) { return name[0] < 'a'; })),
                            message: 'Group/NameSpace:'
                        }
                    ])];
                case 1:
                    group = (_d.sent()).group;
                    if (!(group === RecentTask.groupName)) return [3 /*break*/, 3];
                    return [4 /*yield*/, inquirer_1.prompt([
                            {
                                name: 'taskLog',
                                type: 'list',
                                choices: RecentTask.getLogs().map(function (log) { return JSON.stringify(log); }),
                                message: 'TaskLog:'
                            }
                        ])];
                case 2:
                    taskLog = (_d.sent()).taskLog;
                    _a = JSON.parse(taskLog), command = _a.command, _env = _a.env;
                    Object.assign(shelljs_1.env, _env);
                    shelljs_1.exec(command);
                    return [2 /*return*/];
                case 3:
                    namespaces = fs.readdirSync(path.resolve(__dirname, "../" + group + "/")).filter(function (name) { return name[0] < 'a'; });
                    if (!!namespaces.length) return [3 /*break*/, 4];
                    namespace = group;
                    namespacePath = namespace;
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, inquirer_1.prompt([
                        {
                            name: 'namespace',
                            type: 'list',
                            choices: namespaces,
                            message: 'NameSpace:'
                        }
                    ])];
                case 5:
                    namespace = (_d.sent()).namespace;
                    namespacePath = group + "/" + namespace;
                    _d.label = 6;
                case 6: return [4 /*yield*/, inquirer_1.prompt([
                        {
                            name: 'side',
                            type: 'list',
                            choices: [Side.client, Side.server],
                            message: 'Side:'
                        }
                    ])];
                case 7:
                    side = (_d.sent()).side;
                    _b = side;
                    switch (_b) {
                        case Side.client: return [3 /*break*/, 8];
                        case Side.server: return [3 /*break*/, 10];
                    }
                    return [3 /*break*/, 14];
                case 8: return [4 /*yield*/, inquirer_1.prompt([
                        {
                            name: 'mode',
                            type: 'list',
                            choices: [BuildMode.dev, BuildMode.dist, BuildMode.publish],
                            message: 'Mode:'
                        }
                    ])];
                case 9:
                    mode = (_d.sent()).mode;
                    _env = {
                        BUILD_MODE: mode
                    };
                    Object.assign(shelljs_1.env, _env);
                    shelljs_1.cd(path.resolve(__dirname, '..'));
                    command = (mode === BuildMode.dev ? 'webpack-dev-server' : 'webpack') + " --env.TS_NODE_PROJECT=\"tsconfig.json\" --config ./" + namespacePath + "/script/webpack.config.ts";
                    RecentTask.appendLog({
                        command: command,
                        env: _env
                    });
                    shelljs_1.exec(command);
                    return [3 /*break*/, 14];
                case 10: return [4 /*yield*/, inquirer_1.prompt([
                        {
                            name: 'dev',
                            type: 'confirm'
                        }
                    ])];
                case 11:
                    dev = (_d.sent()).dev;
                    _env = {
                        BESPOKE_NAMESPACE: namespace
                    };
                    if (!!dev) return [3 /*break*/, 13];
                    return [4 /*yield*/, inquirer_1.prompt([
                            {
                                name: 'withProxy',
                                type: 'confirm'
                            },
                            {
                                name: 'withLinker',
                                type: 'confirm'
                            }
                        ])];
                case 12:
                    _c = _d.sent(), withProxy = _c.withProxy, withLinker = _c.withLinker;
                    Object.assign(_env, {
                        BESPOKE_WITH_PROXY: withProxy,
                        BESPOKE_WITH_LINKER: withLinker,
                        NODE_ENV: 'production'
                    });
                    _d.label = 13;
                case 13:
                    Object.assign(shelljs_1.env, _env);
                    command = "ts-node ./" + namespacePath + "/src/serve.ts";
                    RecentTask.appendLog({
                        command: command, env: _env
                    });
                    shelljs_1.exec(command);
                    return [3 /*break*/, 14];
                case 14: return [2 /*return*/];
            }
        });
    });
})();
