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
var share_1 = require("@bespoke/share");
var component_1 = require("@elf/component");
var util_1 = require("../util");
var QrCode = require("qrcode.react");
var style = require("./style.scss");
var Share = /** @class */ (function (_super) {
    __extends(Share, _super);
    function Share() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            title: '',
            shareCode: ''
        };
        _this.lang = component_1.Lang.extractLang({
            shareCode: ['快速加入码', 'QuickAccessCode'],
            failed2GeneShareCode: ['生成快速加入码失败', 'Failed to Generate Quick Access Code']
        });
        return _this;
    }
    Share.prototype.componentDidMount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, code, shareCode, title;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, util_1.Api.shareGame(this.props.match.params.gameId)];
                    case 1:
                        _a = _b.sent(), code = _a.code, shareCode = _a.shareCode, title = _a.title;
                        if (code === share_1.baseEnum.ResponseCode.success) {
                            this.setState({ shareCode: shareCode, title: title });
                        }
                        else {
                            component_1.Toast.warn(this.lang.failed2GeneShareCode);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Share.prototype.render = function () {
        var _a = this, lang = _a.lang, _b = _a.props, history = _b.history, gameId = _b.match.params.gameId, state = _a.state;
        return React.createElement("section", { className: style.Share },
            React.createElement("img", { src: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTM4MjEzOTM2NDk2IiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjMzNTgiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTM5NS4yMTUxOCA1MTMuNjA0NTQ0bDMyMy4xMzU1MzgtMzEyLjM3MzQyN2MxOS4wNTI5MzgtMTguNDE2NDQyIDE5LjA1MjkzOC00OC4yNzM0NDcgMC02Ni42NjAyMTItMTkuMDUzOTYxLTE4LjQxNjQ0Mi00OS45MTA3MzctMTguNDE2NDQyLTY4Ljk2NDY5OCAwTDI5MS43NTE3NiA0ODAuMjkwODExYy0xOS4wNTI5MzggMTguNDE2NDQyLTE5LjA1MjkzOCA0OC4yNzM0NDcgMCA2Ni42NjAyMTJsMzU3LjYzMzIzNyAzNDUuNjg4MTgzYzkuNTI1OTU3IDkuMjA3NzA5IDIyLjAxMjM0IDEzLjc5NjIxNCAzNC40OTc2OTkgMTMuNzk2MjE0IDEyLjQ4NTM1OSAwIDI0Ljk3MTc0MS00LjU4ODUwNSAzNC40NjY5OTktMTMuODI4OTYgMTkuMDUyOTM4LTE4LjQxNjQ0MiAxOS4wNTI5MzgtNDguMjQyNzQ3IDAtNjYuNjYwMjEyTDM5NS4yMTUxOCA1MTMuNjA0NTQ0eiIgcC1pZD0iMzM1OSI+PC9wYXRoPjwvc3ZnPg==', className: style.goBack, onClick: function () { return history.goBack(); } }),
            React.createElement("h2", null, state.title),
            React.createElement("div", { className: style.qrCodeWrapper, onClick: function () { return history.push("/info/" + gameId); } },
                React.createElement(QrCode, { size: 256, value: "/" + share_1.config.rootName + "/info/" + gameId })),
            React.createElement("div", { className: style.shareCode },
                React.createElement("label", null, lang.shareCode),
                React.createElement("span", null, state.shareCode)));
    };
    return Share;
}(React.Component));
exports.Share = Share;
//# sourceMappingURL=index.js.map