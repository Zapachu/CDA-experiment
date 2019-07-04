"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tracer_1 = require("tracer");
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["log"] = 0] = "log";
    LogLevel[LogLevel["trace"] = 1] = "trace";
    LogLevel[LogLevel["debug"] = 2] = "debug";
    LogLevel[LogLevel["info"] = 3] = "info";
    LogLevel[LogLevel["warn"] = 4] = "warn";
    LogLevel[LogLevel["error"] = 5] = "error";
    LogLevel[LogLevel["fatal"] = 6] = "fatal";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
var Log = /** @class */ (function () {
    function Log() {
    }
    Object.defineProperty(Log, "l", {
        get: function () {
            return this.logger.log;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Log, "i", {
        get: function () {
            return this.logger.info;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Log, "d", {
        get: function () {
            return this.logger.debug;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Log, "w", {
        get: function () {
            return this.logger.warn;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Log, "e", {
        get: function () {
            return this.logger.error;
        },
        enumerable: true,
        configurable: true
    });
    Log.setLogPath = function (logPath, level) {
        this.logger = tracer_1.dailyfile({
            level: level.toString(),
            root: logPath
        });
        console.log("\u5F53\u524D\u4E3A\u751F\u6210\u73AF\u5883,\u65E5\u5FD7\u8BB0\u5F55\u4E8E:" + logPath);
    };
    Log.logger = tracer_1.colorConsole();
    return Log;
}());
exports.Log = Log;
