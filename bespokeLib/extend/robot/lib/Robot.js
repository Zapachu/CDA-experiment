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
Object.defineProperty(exports, "__esModule", { value: true });
var robot_1 = require("@bespoke/robot");
var share_1 = require("@extend/share");
var share_2 = require("@bespoke/share");
var Group;
(function (Group) {
    var Robot = /** @class */ (function () {
        function Robot(host) {
            this.host = host;
            var groupIndex = host.playerState.groupIndex, game = host.game, frameEmitter = host.frameEmitter;
            this.groupParams = game.params.groupsParams[groupIndex];
            this.groupFrameEmitter = share_1.GroupDecorator.groupFrameEmitter(frameEmitter, groupIndex);
        }
        Object.defineProperty(Robot.prototype, "meta", {
            get: function () {
                return this.host.meta;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Robot.prototype, "playerState", {
            get: function () {
                return this.host.playerState;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Robot.prototype, "groupGameState", {
            get: function () {
                var _a = this.host, gameState = _a.gameState, groupIndex = _a.playerState.groupIndex;
                return gameState.groups[groupIndex].state;
            },
            enumerable: true,
            configurable: true
        });
        Robot.prototype.init = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this];
                });
            });
        };
        return Robot;
    }());
    Group.Robot = Robot;
})(Group = exports.Group || (exports.Group = {}));
var Robot = /** @class */ (function (_super) {
    __extends(Robot, _super);
    function Robot() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Robot.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var interval;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype.init.call(this)];
                    case 1:
                        _a.sent();
                        this.frameEmitter.emit(share_1.GroupDecorator.GroupMoveType.getGroup);
                        interval = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!(this.playerState && this.playerState.groupIndex !== undefined)) return [3 /*break*/, 2];
                                        clearInterval(interval);
                                        this.groupRobot = new this.GroupRobot(this);
                                        return [4 /*yield*/, this.groupRobot.init()];
                                    case 1:
                                        _a.sent();
                                        _a.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        }); }, share_2.config.minMoveInterval);
                        return [2 /*return*/, this];
                }
            });
        });
    };
    return Robot;
}(robot_1.BaseRobot));
exports.Robot = Robot;
