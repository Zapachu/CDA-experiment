"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var protocol_1 = require("@elf/protocol");
var String = mongoose_1.Schema.Types.String;
var models = protocol_1.getModels(mongoose_1.model);
exports.GameModel = models.ElfGame;
exports.PlayerModel = models.ElfPlayer;
exports.UserModel = models.User;
exports.GameStateModel = mongoose_1.model('LinkerGameState', new mongoose_1.Schema({
    gameId: String,
    data: Object,
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now }
}, { minimize: false }));
//# sourceMappingURL=model.js.map