"use strict";
exports.__esModule = true;
var tracer_1 = require("tracer");
var Log;
(function (Log) {
    var logger = tracer_1.colorConsole();
    Log.l = logger.log;
    Log.i = logger.info;
    Log.d = logger.debug;
    Log.w = logger.warn;
    Log.e = logger.error;
})(Log = exports.Log || (exports.Log = {}));
