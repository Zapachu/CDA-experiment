"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var _a = mongoose_1.Schema.Types, ObjectId = _a.ObjectId, String = _a.String;
var GameSchema = new mongoose_1.Schema({
    elfGameId: String,
    title: String,
    namespace: String,
    params: { type: Object, default: ({}) },
    owner: { type: ObjectId, ref: 'User' },
    createAt: { type: Date, default: Date.now }
}, { minimize: false });
exports.GameModel = mongoose_1.model('BespokeGame', GameSchema);
var SimulatePlayer = new mongoose_1.Schema({
    gameId: String,
    token: String,
    name: String
});
exports.SimulatePlayerModel = mongoose_1.model('BespokeSimulatePlayer', SimulatePlayer);
//endregion
//# sourceMappingURL=Game.js.map