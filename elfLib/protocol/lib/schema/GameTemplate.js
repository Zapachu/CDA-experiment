'use strict';
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var _a = mongoose_1.Schema.Types, MongodDate = _a.Date, MongodNumber = _a.Number, MongodString = _a.String;
var GameTemplate = new mongoose_1.Schema({
    createAt: { type: MongodDate, "default": Date.now },
    updateAt: { type: MongodDate, "default": Date.now },
    id: MongodNumber,
    code: MongodString,
    name: MongodString,
    tags: [MongodString],
    namespace: MongodString,
    charge: { type: MongodNumber, "default": 0 },
    permitted: { type: MongodNumber, "default": 0 },
    chargeFree: { type: MongodNumber, "default": 0 },
    permittedFree: { type: MongodNumber, "default": 0 },
    chargePro: { type: MongodNumber, "default": 0 },
    permittedPro: { type: MongodNumber, "default": 0 },
    status: { type: MongodNumber, "default": 1 }
});
exports.GameTemplate = GameTemplate;
GameTemplate.pre('save', function (next) {
    this.updateAt = Date.now();
    next();
});
