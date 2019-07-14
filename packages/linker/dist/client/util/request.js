"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
var _common_1 = require("@common");
var queryString = require("query-string");
var share_1 = require("@elf/share");
function getCookie(key) {
    return decodeURIComponent(document.cookie).split('; ')
        .find(function (str) { return str.startsWith(key + "="); }).substring(key.length + 1);
}
var baseFetchOption = {
    credentials: 'include',
    method: _common_1.RequestMethod.get,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    cache: 'default'
};
function request(url, method, data) {
    if (method === void 0) { method = _common_1.RequestMethod.get; }
    if (data === void 0) { data = null; }
    return __awaiter(this, void 0, void 0, function () {
        var option, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    option = __assign({}, baseFetchOption, { method: method }, (data ? { body: JSON.stringify(data) } : {}));
                    return [4 /*yield*/, fetch(url.match(/^\/v5|admindev/) ? url : "/" + _common_1.config.rootName + url, option)];
                case 1:
                    res = _a.sent();
                    if (res.ok) {
                        return [2 /*return*/, res.json()];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function buildPath(pathFragment, params) {
    var path = "/" + _common_1.config.apiPrefix + pathFragment;
    if (!params) {
        return path;
    }
    return path.replace(/:([\w\d]+)/, function (matchedParam, paramName) {
        if (params[paramName] === undefined) {
            throw new Error("could not build path (\"" + path + "\") - param \"" + paramName + "\" does not exist");
        }
        return params[paramName];
    });
}
function GET(url, params, query) {
    if (params === void 0) { params = {}; }
    if (query === void 0) { query = {}; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, request(buildPath(url, params) + "?" + queryString.stringify(query))];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.GET = GET;
function POST(url, params, query, data) {
    if (params === void 0) { params = {}; }
    if (query === void 0) { query = {}; }
    if (data === void 0) { data = {}; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, request(buildPath(url, params) + "?" + queryString.stringify(query), _common_1.RequestMethod.post, __assign({}, data, { _csrf: getCookie(share_1.csrfCookieKey) }))];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.POST = POST;
var Api = /** @class */ (function () {
    function Api() {
    }
    Api.getUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, GET('/user')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Api.getBaseGame = function (gameId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, GET('/game/baseInfo/:gameId', { gameId: gameId })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Api.getGame = function (gameId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, GET('/game/:gameId', { gameId: gameId })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Api.joinGameWithCode = function (code) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, POST('/game/joinWithShareCode', null, null, { code: code })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Api.joinGame = function (gameId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, POST('/game/join/:gameId', { gameId: gameId })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Api.getGameList = function (page) {
        if (page === void 0) { page = 0; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, GET('/game/list', {}, { page: page })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Api.getPhaseTemplates = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, GET('/game/phaseTemplates')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Api.postNewGame = function (title, desc, namespace, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, POST('/game/create', null, null, {
                            title: title, desc: desc, namespace: namespace, params: params
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Api.shareGame = function (gameId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, GET('/game/share/:gameId', { gameId: gameId })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Api.getActor = function (gameId, token) {
        if (token === void 0) { token = ''; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, GET('/game/actor/:gameId', { gameId: gameId }, { token: token })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return Api;
}());
exports.Api = Api;
//# sourceMappingURL=request.js.map