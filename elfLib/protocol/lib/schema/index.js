"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
exports.__esModule = true;
__export(require("./GameTemplate"));
__export(require("./GameUserPermission"));
var ElfGame_1 = require("./ElfGame");
var ElfPlayer_1 = require("./ElfPlayer");
var User_1 = require("./User");
var GameUserPermission_1 = require("./GameUserPermission");
var GameTemplate_1 = require("./GameTemplate");
var schemas = {
    ElfGame: ElfGame_1.ElfGame,
    ElfPlayer: ElfPlayer_1.ElfPlayer,
    User: User_1.User,
    GameUserPermission: GameUserPermission_1.GameUserPermission,
    GameTemplate: GameTemplate_1.GameTemplate
};
function getModels(model) {
    var models = {};
    for (var schemaName in schemas) {
        models[schemaName] = model(schemaName, schemas[schemaName]);
    }
    return models;
}
exports.getModels = getModels;
