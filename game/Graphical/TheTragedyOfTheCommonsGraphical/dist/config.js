"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.namespace = 'TheTragedyOfTheCommonsGraphical';
var MoveType;
(function (MoveType) {
    MoveType["prepare"] = "prepare";
    MoveType["shout"] = "shout";
    MoveType["getPosition"] = "getPosition";
    MoveType["toNextRound"] = "toNextRound";
})(MoveType = exports.MoveType || (exports.MoveType = {}));
var PushType;
(function (PushType) {
    PushType[PushType["newRoundTimer"] = 0] = "newRoundTimer";
})(PushType = exports.PushType || (exports.PushType = {}));
var PlayerStatus;
(function (PlayerStatus) {
    PlayerStatus[PlayerStatus["outside"] = 0] = "outside";
    PlayerStatus[PlayerStatus["prepared"] = 1] = "prepared";
    PlayerStatus[PlayerStatus["shouted"] = 2] = "shouted";
    PlayerStatus[PlayerStatus["nextRound"] = 3] = "nextRound";
    PlayerStatus[PlayerStatus["preparedNextRound"] = 4] = "preparedNextRound";
    PlayerStatus[PlayerStatus["gameOver"] = 5] = "gameOver";
})(PlayerStatus = exports.PlayerStatus || (exports.PlayerStatus = {}));
exports.NEW_ROUND_TIMER = 3;
