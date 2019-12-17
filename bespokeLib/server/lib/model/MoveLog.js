"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var _a = mongoose_1.Schema.Types, String = _a.String, Number = _a.Number;
var MoveLogSchema = new mongoose_1.Schema({
    seq: Number,
    gameId: { type: String, index: true },
    token: String,
    type: String,
    params: {},
    gameState: {},
    gameStateChanges: [{}],
    playerStates: {},
    playerStatesChanges: [{}]
}, { minimize: false });
exports.MoveLogModel = mongoose_1.model('BespokeMoveLog', MoveLogSchema);
