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
var React = require("react");
var share_1 = require("@bespoke/share");
var component_1 = require("@elf/component");
var util_1 = require("../../util");
var deep_diff_1 = require("deep-diff");
var cloneDeep = require("lodash/cloneDeep");
var GameResult = /** @class */ (function (_super) {
    __extends(GameResult, _super);
    function GameResult() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            loading: true,
            travelStates: []
        };
        return _this;
    }
    GameResult.prototype.componentDidMount = function () {
        var _this = this;
        util_1.Api.getMoveLogs(this.props.game.id).then(function (_a) {
            var code = _a.code, moveLogs = _a.moveLogs;
            return __awaiter(_this, void 0, void 0, function () {
                var travelStates;
                return __generator(this, function (_b) {
                    if (code !== share_1.baseEnum.ResponseCode.success) {
                        return [2 /*return*/];
                    }
                    travelStates = [];
                    moveLogs.forEach(function (_a, i) {
                        var token = _a.token, type = _a.type, params = _a.params, gameState = _a.gameState, playerStates = _a.playerStates, gameStateChanges = _a.gameStateChanges, playerStatesChanges = _a.playerStatesChanges;
                        if (i === 0) {
                            travelStates[i] = { token: token, type: type, params: params, gameState: gameState, playerStates: playerStates };
                            return;
                        }
                        var state = cloneDeep(travelStates[i - 1]);
                        gameStateChanges.forEach(function (change) { return deep_diff_1.applyChange(state.gameState, null, change); });
                        playerStatesChanges.forEach(function (change) { return deep_diff_1.applyChange(state.playerStates, null, change); });
                        travelStates[i] = {
                            token: token, type: type, params: params, gameState: state.gameState, playerStates: state.playerStates
                        };
                    });
                    this.setState({
                        loading: false,
                        travelStates: travelStates
                    });
                    return [2 /*return*/];
                });
            });
        });
    };
    GameResult.prototype.render = function () {
        var _a = this, _b = _a.props, game = _b.game, Result4Owner = _b.Result4Owner, _c = _a.state, loading = _c.loading, travelStates = _c.travelStates;
        if (loading) {
            return React.createElement(component_1.MaskLoading, null);
        }
        return React.createElement(Result4Owner, __assign({}, { game: game, travelStates: travelStates }));
    };
    return GameResult;
}(React.Component));
exports.GameResult = GameResult;
//# sourceMappingURL=GameResult.js.map