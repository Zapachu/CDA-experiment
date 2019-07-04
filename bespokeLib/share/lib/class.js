"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
var enum_1 = require("./enum");
var throttle = require("lodash/throttle");
var FrameEmitter = /** @class */ (function () {
    function FrameEmitter(emitter) {
        var _this = this;
        this.emitter = emitter;
        this.listeners = new Map();
        this._emit = throttle(function (type, params, cb) {
            return _this.emitter.emit(enum_1.SocketEvent.move, type, params, cb);
        }, config_1.config.minMoveInterval, { trailing: false });
        this.emitter.on(enum_1.SocketEvent.push, function (pushType, params) { return _this.trigger(pushType, params); });
    }
    FrameEmitter.prototype.getListeners = function (pushType) {
        return this.listeners.get(pushType) || [];
    };
    FrameEmitter.prototype.on = function (pushType, fn) {
        this.listeners.set(pushType, this.getListeners(pushType).concat([fn]));
    };
    FrameEmitter.prototype.trigger = function (pushType, params) {
        this.getListeners(pushType).forEach(function (fn) { return fn(params); });
    };
    FrameEmitter.prototype.emit = function (moveType, params, cb) {
        this._emit(moveType, params, cb);
    };
    return FrameEmitter;
}());
exports.FrameEmitter = FrameEmitter;
