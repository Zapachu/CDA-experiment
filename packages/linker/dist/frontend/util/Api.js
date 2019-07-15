"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var linker_share_1 = require("linker-share");
var component_1 = require("@elf/component");
exports.Api = new /** @class */ (function (_super) {
    __extends(class_1, _super);
    function class_1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    class_1.prototype.buildUrl = function (path, params, query) {
        if (params === void 0) { params = {}; }
        if (query === void 0) { query = {}; }
        return _super.prototype.buildUrl.call(this, "/" + linker_share_1.config.rootName + "/" + linker_share_1.config.apiPrefix + path, params, query);
    };
    class_1.prototype.getUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get('/user')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    class_1.prototype.getBaseGame = function (gameId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get('/game/baseInfo/:gameId', { gameId: gameId })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    class_1.prototype.getGame = function (gameId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get('/game/:gameId', { gameId: gameId })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    class_1.prototype.joinGameWithCode = function (code) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.post('/game/joinWithShareCode', null, null, { code: code })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    class_1.prototype.joinGame = function (gameId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.post('/game/join/:gameId', { gameId: gameId })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    class_1.prototype.getGameList = function (page) {
        if (page === void 0) { page = 0; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get('/game/list', {}, { page: page })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    class_1.prototype.getJsUrl = function (namespace) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get('/game/jsUrl/:namespace', { namespace: namespace })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    class_1.prototype.postNewGame = function (title, desc, namespace, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.post('/game/create', null, null, {
                            title: title, desc: desc, namespace: namespace, params: params
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    class_1.prototype.shareGame = function (gameId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get('/game/share/:gameId', { gameId: gameId })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    class_1.prototype.getActor = function (gameId, token) {
        if (token === void 0) { token = ''; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get('/game/actor/:gameId', { gameId: gameId }, { token: token })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return class_1;
}(component_1.BaseRequest));
//# sourceMappingURL=Api.js.map