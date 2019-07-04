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
var React = require("react");
var style = require("./style.scss");
var dateFormat = require("dateformat");
var share_1 = require("@bespoke/share");
var component_1 = require("@elf/component");
var util_1 = require("../util");
var HistoryGame = /** @class */ (function (_super) {
    __extends(HistoryGame, _super);
    function HistoryGame() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            historyGameThumbs: []
        };
        _this.lang = component_1.Lang.extractLang({
            LoadFromHistory: ['点击加载历史实验配置', 'click to load configuration from history game']
        });
        return _this;
    }
    HistoryGame.prototype.componentDidMount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, code, historyGameThumbs;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, util_1.Api.getHistoryGames()];
                    case 1:
                        _a = _b.sent(), code = _a.code, historyGameThumbs = _a.historyGameThumbs;
                        if (code === share_1.baseEnum.ResponseCode.success) {
                            this.setState({ historyGameThumbs: historyGameThumbs });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    HistoryGame.prototype.chooseHistoryGame = function (gameId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, code, game;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, util_1.Api.getGame(gameId)];
                    case 1:
                        _a = _b.sent(), code = _a.code, game = _a.game;
                        if (code === share_1.baseEnum.ResponseCode.success) {
                            this.props.applyHistoryGame(game);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    HistoryGame.prototype.render = function () {
        var _this = this;
        var _a = this, lang = _a.lang, historyGameThumbs = _a.state.historyGameThumbs;
        return React.createElement("section", { className: style.loadFromHistory },
            React.createElement("span", { className: style.tips }, lang.LoadFromHistory),
            React.createElement("ul", { className: style.historyGameThumbs }, historyGameThumbs.map(function (_a) {
                var id = _a.id, title = _a.title, createAt = _a.createAt;
                return React.createElement("li", { key: id, onClick: function () { return _this.chooseHistoryGame(id); } },
                    React.createElement("span", null, title),
                    React.createElement("span", null, dateFormat(createAt, 'yyyy-mm-dd')));
            })));
    };
    return HistoryGame;
}(React.Component));
exports.HistoryGame = HistoryGame;
//# sourceMappingURL=HistoryGame.js.map