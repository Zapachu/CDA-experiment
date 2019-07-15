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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var style = require("./style.scss");
var component_1 = require("@elf/component");
var util_1 = require("../util");
var dateFormat = require("dateformat");
var SubmitBarHeight = '5rem';
function Create(_a) {
    var user = _a.user, history = _a.history, GameCreate = _a.gameTemplate.Create;
    var lang = component_1.Lang.extractLang({
        title: ['实验标题', 'Game Title'],
        loadFromHistory: ['点击从历史实验加载实验配置', 'Click to load configuration from history game'],
        loadSuccess: ['加载成功', 'Load success'],
        Submit: ['提交', 'Submit'],
        CreateSuccess: ['实验创建成功', 'Create success'],
        CreateFailed: ['实验创建失败', 'Create Failed']
    });
    var _b = __read(React.useState(''), 2), title = _b[0], setTitle = _b[1], _c = __read(React.useState({}), 2), params = _c[0], setParams = _c[1], _d = __read(React.useState(true), 2), submitable = _d[0], setSubmitable = _d[1];
    React.useEffect(function () {
        if (user && user.role === component_1.AcademusRole.teacher) {
            return;
        }
        history.push('/join');
    }, []);
    function submit() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, code, gameId;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, util_1.Api.newGame({ title: title || '---', params: params })];
                    case 1:
                        _a = _b.sent(), code = _a.code, gameId = _a.gameId;
                        if (code === component_1.ResponseCode.success) {
                            component_1.Toast.success(lang.CreateSuccess);
                            setTimeout(function () { return history.push("/play/" + gameId); }, 1000);
                        }
                        else {
                            component_1.Toast.error(lang.CreateFailed);
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    return React.createElement("section", { className: style.create, style: { marginBottom: SubmitBarHeight } },
        React.createElement("div", { className: style.titleWrapper },
            React.createElement(util_1.Input, { size: 'large', value: title, placeholder: lang.title, onChange: function (_a) {
                    var title = _a.target.value;
                    return setTitle(title);
                } })),
        React.createElement("div", { className: style.historyGameBtnWrapper },
            React.createElement(util_1.Button, { size: 'small', icon: "folder-open", onClick: function () {
                    var modal = util_1.Modal.info({
                        title: lang.loadFromHistory,
                        content: React.createElement("div", { style: { marginTop: '1rem' } },
                            React.createElement(HistoryGame, __assign({}, {
                                applyHistoryGame: function (_a) {
                                    var title = _a.title, params = _a.params;
                                    setTitle(title);
                                    setParams(params);
                                    modal.destroy();
                                    util_1.message.success(lang.loadSuccess);
                                }
                            })))
                    });
                } })),
        React.createElement("div", { className: style.bespokeWrapper },
            React.createElement(GameCreate, __assign({}, {
                params: params,
                setParams: function (newParams) { return setParams(__assign({}, params, newParams)); },
                submitable: submitable,
                setSubmitable: function (submitable) { return setSubmitable(submitable); }
            }))),
        React.createElement("div", { className: style.submitBtnWrapper, style: { height: SubmitBarHeight } },
            React.createElement(util_1.Button, { type: 'primary', disabled: !submitable, onClick: function () { return submit(); } }, lang.Submit)));
}
exports.Create = Create;
function HistoryGame(_a) {
    var _this = this;
    var applyHistoryGame = _a.applyHistoryGame;
    var _b = __read(React.useState([]), 2), historyGameThumbs = _b[0], setHistoryGameThumbs = _b[1];
    React.useEffect(function () {
        util_1.Api.getHistoryGames().then(function (_a) {
            var historyGameThumbs = _a.historyGameThumbs;
            return setHistoryGameThumbs(historyGameThumbs);
        });
    }, []);
    return React.createElement(util_1.List, { dataSource: historyGameThumbs, grid: {
            gutter: 16,
            md: 2
        }, renderItem: function (_a) {
            var id = _a.id, title = _a.title, createAt = _a.createAt;
            return React.createElement(util_1.List.Item, null,
                React.createElement("div", { style: { cursor: 'pointer' }, onClick: function () { return __awaiter(_this, void 0, void 0, function () {
                        var _a, code, game;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, util_1.Api.getGame(id)];
                                case 1:
                                    _a = _b.sent(), code = _a.code, game = _a.game;
                                    if (code === component_1.ResponseCode.success) {
                                        applyHistoryGame(game);
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); } },
                    React.createElement(util_1.List.Item.Meta, { title: title, description: dateFormat(createAt, 'yyyy-mm-dd') })));
        } });
}
//# sourceMappingURL=index.js.map