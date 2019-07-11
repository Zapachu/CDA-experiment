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
Object.defineProperty(exports, "__esModule", { value: true });
var _server_model_1 = require("@server-model");
var GameService = /** @class */ (function () {
    function GameService() {
    }
    GameService.getGameList = function (owner, page, pageSize) {
        return __awaiter(this, void 0, void 0, function () {
            var count, _gameList, gameList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _server_model_1.GameModel.countDocuments({ owner: owner })];
                    case 1:
                        count = _a.sent();
                        return [4 /*yield*/, _server_model_1.GameModel.find({ owner: owner }).sort('-createAt').skip(page * pageSize).limit(pageSize)];
                    case 2:
                        _gameList = _a.sent(), gameList = _gameList.map(function (_a) {
                            var id = _a.id, title = _a.title, desc = _a.desc, namespace = _a.namespace, param = _a.param;
                            return ({
                                id: id,
                                title: title,
                                desc: desc,
                                namespace: namespace,
                                param: param
                            });
                        });
                        return [2 /*return*/, { count: count, gameList: gameList }];
                }
            });
        });
    };
    GameService.saveGame = function (game) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new _server_model_1.GameModel(game).save()];
                    case 1:
                        id = (_a.sent()).id;
                        return [2 /*return*/, id];
                }
            });
        });
    };
    GameService.getGame = function (gameId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, id, title, desc, owner, namespace, param;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, _server_model_1.GameModel.findById(gameId)];
                    case 1:
                        _a = _b.sent(), id = _a.id, title = _a.title, desc = _a.desc, owner = _a.owner, namespace = _a.namespace, param = _a.param;
                        return [2 /*return*/, { id: id, title: title, desc: desc, namespace: namespace, param: param, owner: owner }];
                }
            });
        });
    };
    return GameService;
}());
exports.GameService = GameService;
//# sourceMappingURL=GameService.js.map