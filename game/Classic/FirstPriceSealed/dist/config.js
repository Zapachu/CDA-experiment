"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.namespace = 'FirstPriceSealed';
var MoveType;
(function (MoveType) {
    MoveType["shout"] = "shout";
    MoveType["getPosition"] = "getPosition";
})(MoveType = exports.MoveType || (exports.MoveType = {}));
var PushType;
(function (PushType) {
    PushType[PushType["newRoundTimer"] = 0] = "newRoundTimer";
})(PushType = exports.PushType || (exports.PushType = {}));
var PlayerStatus;
(function (PlayerStatus) {
    PlayerStatus[PlayerStatus["prepared"] = 0] = "prepared";
    PlayerStatus[PlayerStatus["shouted"] = 1] = "shouted";
    PlayerStatus[PlayerStatus["gameOver"] = 2] = "gameOver";
})(PlayerStatus = exports.PlayerStatus || (exports.PlayerStatus = {}));
exports.NEW_ROUND_TIMER = 3;
