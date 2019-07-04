'use strict';
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var _a = mongoose_1.Schema.Types, ObjectId = _a.ObjectId, MongodDate = _a.Date, MongodString = _a.String, MongodNumber = _a.Number;
var GameUserPermission = new mongoose_1.Schema({
    createAt: { type: MongodDate, "default": Date.now },
    updateAt: { type: MongodDate, "default": Date.now },
    uniKey: { type: MongodString, unique: true },
    userId: { type: ObjectId, ref: 'User' },
    gameTemplateId: { type: ObjectId, ref: 'GameTemplate' },
    name: MongodString,
    tags: [MongodString],
    charge: MongodNumber,
    permitted: MongodNumber
});
exports.GameUserPermission = GameUserPermission;
GameUserPermission.pre('save', function (next) {
    this.updateAt = Date.now();
    next();
});
