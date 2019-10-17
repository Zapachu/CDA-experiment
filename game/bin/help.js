"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
var fs_extra_1 = require("fs-extra");
var path_1 = require("path");
var inquirer_1 = require("inquirer");
var shelljs_1 = require("shelljs");
inquirer_1.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));
var SpecialProject;
(function (SpecialProject) {
    SpecialProject["RecentTask"] = "RecentTask";
    SpecialProject["DistAllGame"] = "DistAllGame";
    SpecialProject["CleanAllGame"] = "CleanAllGame";
})(SpecialProject || (SpecialProject = {}));
var TaskHelper;
(function (TaskHelper) {
    var logPath = path_1.resolve(__dirname, './help.log');
    function getLogs() {
        try {
            return fs_extra_1.readFileSync(logPath).toString().split('\n').map(function (row) { return JSON.parse(row); });
        }
        catch (e) {
            return [];
        }
    }
    TaskHelper.getLogs = getLogs;
    function appendLog(_a) {
        var command = _a.command, env = _a.env;
        var logs = getLogs().map(function (log) { return JSON.stringify(log); });
        var newLog = JSON.stringify({ command: command, env: env });
        if (logs[0] === newLog) {
            return;
        }
        logs.unshift(newLog);
        fs_extra_1.writeFileSync(logPath, logs.slice(0, 5).join('\n'));
    }
    function execTask(task) {
        appendLog(task);
        Object.assign(shelljs_1.env, task.env);
        shelljs_1.exec(task.command);
    }
    TaskHelper.execTask = execTask;
    function distServer(project) {
        execTask({
            env: { PROJECT: project },
            command: "webpack --env.TS_NODE_PROJECT=\"tsconfig.json\" --config ./bin/webpack.server.ts"
        });
    }
    TaskHelper.distServer = distServer;
    function distClient(project) {
        execTask({
            env: { BUILD_MODE: Task.dist },
            command: "webpack --env.TS_NODE_PROJECT=\"tsconfig.json\" --config ./" + project + "/script/webpack.config.ts"
        });
    }
    TaskHelper.distClient = distClient;
    function publishClient(project) {
        execTask({
            env: { BUILD_MODE: Task.publish },
            command: "webpack --env.TS_NODE_PROJECT=\"tsconfig.json\" --config ./" + project + "/script/webpack.config.ts"
        });
    }
    TaskHelper.publishClient = publishClient;
})(TaskHelper || (TaskHelper = {}));
var Side;
(function (Side) {
    Side["client"] = "client";
    Side["server"] = "server";
    Side["both"] = "both";
})(Side || (Side = {}));
var Task;
(function (Task) {
    Task["dev"] = "dev";
    Task["dist"] = "dist";
    Task["publish"] = "publish";
    Task["serve"] = "serve";
})(Task || (Task = {}));
function getProjects(parentProject, projectSet) {
    if (parentProject === void 0) { parentProject = '.'; }
    if (projectSet === void 0) { projectSet = new Set(); }
    fs_extra_1.readdirSync(path_1.resolve(__dirname, "../" + parentProject + "/")).forEach(function (p) {
        if (p[0] >= 'a') {
            return;
        }
        if (!fs_extra_1.statSync(path_1.resolve(__dirname, "../" + parentProject + "/" + p)).isDirectory()) {
            return;
        }
        var childProject = parentProject + "/" + p;
        projectSet["delete"](parentProject);
        projectSet.add(childProject);
        getProjects(childProject, projectSet);
    });
    return Array.from(projectSet, function (p) { return p.slice(2); });
}
(function () {
    return __awaiter(this, void 0, void 0, function () {
        var projects, project, taskLog, side, _a, mode, HMR, task, _b, HMR, _c, withProxy, withLinker, mode;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    projects = getProjects();
                    return [4 /*yield*/, inquirer_1.prompt([
                            {
                                name: 'project',
                                type: 'autocomplete',
                                message: "Project(" + projects.length + "):",
                                source: function (_, input) {
                                    if (input === void 0) { input = ''; }
                                    return Promise.resolve(input == ' ' ?
                                        Object.values(SpecialProject) :
                                        projects.filter(function (p) { return input.toLowerCase().split(' ').every(function (s) { return p.toLowerCase().includes(s); }); }));
                                }
                            }
                        ])];
                case 1:
                    project = (_d.sent()).project;
                    if (!(project === SpecialProject.RecentTask)) return [3 /*break*/, 3];
                    return [4 /*yield*/, inquirer_1.prompt([
                            {
                                name: 'taskLog',
                                type: 'list',
                                choices: TaskHelper.getLogs().map(function (log) { return JSON.stringify(log); }),
                                message: 'TaskLog:'
                            }
                        ])];
                case 2:
                    taskLog = (_d.sent()).taskLog;
                    TaskHelper.execTask(JSON.parse(taskLog));
                    return [2 /*return*/];
                case 3:
                    if (project === SpecialProject.DistAllGame) {
                        projects.forEach(function (project) {
                            if (Object.values(SpecialProject).includes(project)) {
                                return;
                            }
                            TaskHelper.distClient(project);
                            TaskHelper.distServer(project);
                        });
                        return [2 /*return*/];
                    }
                    if (project === SpecialProject.CleanAllGame) {
                        projects.forEach(function (project) {
                            if (Object.values(SpecialProject).includes(project)) {
                                return;
                            }
                            fs_extra_1.removeSync(path_1.resolve(__dirname, "../" + project + "/dist"));
                            fs_extra_1.removeSync(path_1.resolve(__dirname, "../" + project + "/build"));
                        });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, inquirer_1.prompt([
                            {
                                name: 'side',
                                type: 'list',
                                choices: [Side.client, Side.server, Side.both],
                                message: 'Side:'
                            }
                        ])];
                case 4:
                    side = (_d.sent()).side;
                    _a = side;
                    switch (_a) {
                        case Side.client: return [3 /*break*/, 5];
                        case Side.server: return [3 /*break*/, 9];
                        case Side.both: return [3 /*break*/, 17];
                    }
                    return [3 /*break*/, 19];
                case 5: return [4 /*yield*/, inquirer_1.prompt([
                        {
                            name: 'mode',
                            type: 'list',
                            choices: [Task.dev, Task.dist, Task.publish],
                            message: 'Mode:'
                        }
                    ])];
                case 6:
                    mode = (_d.sent()).mode;
                    if (!(mode === Task.dev)) return [3 /*break*/, 8];
                    return [4 /*yield*/, inquirer_1.prompt([
                            {
                                name: 'HMR',
                                type: 'confirm'
                            }
                        ])];
                case 7:
                    HMR = (_d.sent()).HMR;
                    if (HMR) {
                        TaskHelper.execTask({
                            env: {
                                BUILD_MODE: mode,
                                HMR: HMR.toString()
                            },
                            command: "webpack-dev-server --hot --progress --env.TS_NODE_PROJECT=\"tsconfig.json\" --config ./" + project + "/script/webpack.config.ts"
                        });
                        return [3 /*break*/, 19];
                    }
                    _d.label = 8;
                case 8:
                    TaskHelper.execTask({
                        env: { BUILD_MODE: mode },
                        command: "webpack --env.TS_NODE_PROJECT=\"tsconfig.json\" --config ./" + project + "/script/webpack.config.ts"
                    });
                    return [3 /*break*/, 19];
                case 9: return [4 /*yield*/, inquirer_1.prompt([
                        {
                            name: 'task',
                            type: 'list',
                            choices: [Task.dev, Task.dist, Task.serve],
                            message: 'Task:'
                        }
                    ])];
                case 10:
                    task = (_d.sent()).task;
                    _b = task;
                    switch (_b) {
                        case Task.dist: return [3 /*break*/, 11];
                        case Task.dev: return [3 /*break*/, 12];
                        case Task.serve: return [3 /*break*/, 14];
                    }
                    return [3 /*break*/, 16];
                case 11:
                    {
                        TaskHelper.distServer(project);
                        return [3 /*break*/, 16];
                    }
                    _d.label = 12;
                case 12: return [4 /*yield*/, inquirer_1.prompt([
                        {
                            name: 'HMR',
                            type: 'confirm'
                        }
                    ])];
                case 13:
                    HMR = (_d.sent()).HMR;
                    TaskHelper.execTask({
                        env: {
                            BESPOKE_HMR: HMR.toString()
                        },
                        command: "ts-node ./" + project + "/src/serve.ts"
                    });
                    return [3 /*break*/, 16];
                case 14: return [4 /*yield*/, inquirer_1.prompt([
                        {
                            name: 'withProxy',
                            type: 'confirm'
                        },
                        {
                            name: 'withLinker',
                            type: 'confirm'
                        }
                    ])];
                case 15:
                    _c = _d.sent(), withProxy = _c.withProxy, withLinker = _c.withLinker;
                    TaskHelper.execTask({
                        env: {
                            BESPOKE_WITH_PROXY: withProxy,
                            BESPOKE_WITH_LINKER: withLinker,
                            NODE_ENV: 'production'
                        },
                        command: "node ./" + project + "/build/serve.js"
                    });
                    return [3 /*break*/, 16];
                case 16: return [3 /*break*/, 19];
                case 17: return [4 /*yield*/, inquirer_1.prompt([
                        {
                            name: 'mode',
                            type: 'list',
                            choices: [Task.dist, Task.publish],
                            message: 'Mode:'
                        }
                    ])];
                case 18:
                    mode = (_d.sent()).mode;
                    switch (mode) {
                        case Task.dist:
                            TaskHelper.distClient(project);
                            TaskHelper.distServer(project);
                            break;
                        case Task.publish:
                            TaskHelper.publishClient(project);
                            TaskHelper.distServer(project);
                            break;
                    }
                    return [3 /*break*/, 19];
                case 19: return [2 /*return*/];
            }
        });
    });
})();
