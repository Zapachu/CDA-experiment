"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var protocol_1 = require("@elf/protocol");
var models = protocol_1.getModels(mongoose_1.model);
exports.UserModel = models.User;
__export(require("./Game"));
__export(require("./MoveLog"));
__export(require("./FreeStyle"));
