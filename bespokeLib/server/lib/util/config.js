"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@elf/util");
exports.CONFIG = {
    shareCodeLifeTime: 3 * 24 * 60 * 60,
    memoryCacheLifetime: 3 * 60 * 1000,
    heartBeatSeconds: 3,
    logLevel: util_1.LogLevel.log
};
