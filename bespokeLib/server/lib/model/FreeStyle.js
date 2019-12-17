"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var _a = mongoose_1.Schema.Types, ObjectId = _a.ObjectId, String = _a.String;
var FreeStyleSchema = new mongoose_1.Schema({
    game: { type: ObjectId, index: true },
    key: String,
    data: {},
    createAt: { type: Date, default: Date.now },
});
exports.FreeStyleModel = mongoose_1.model('BespokeFreeStyle', FreeStyleSchema);
