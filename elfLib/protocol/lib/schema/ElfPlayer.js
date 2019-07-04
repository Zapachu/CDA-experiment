"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var _a = mongoose_1.Schema.Types, ObjectId = _a.ObjectId, Number = _a.Number;
exports.ElfPlayer = new mongoose_1.Schema({
    userId: { type: ObjectId, ref: 'User' },
    gameId: { type: ObjectId, ref: 'ElfGame' },
    reward: { type: Number, "default": 0 },
    createAt: { type: Date, "default": Date.now }
});
