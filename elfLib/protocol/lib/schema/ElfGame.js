"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
exports.ElfGame = new mongoose_1.Schema({
    owner: String,
    orgCode: String,
    title: String,
    desc: String,
    namespace: String,
    param: Object,
    createAt: { type: Date, "default": Date.now }
}, { minimize: false });
