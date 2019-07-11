"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.namespace = 'TrustGameGraphical';
var MoveType;
(function (MoveType) {
    MoveType["prepare"] = "prepare";
    MoveType["toNextRound"] = "toNextRound";
    MoveType["shout"] = "shout";
    MoveType["getPosition"] = "getPosition";
})(MoveType = exports.MoveType || (exports.MoveType = {}));
var PushType;
(function (PushType) {
    PushType[PushType["newRoundTimer"] = 0] = "newRoundTimer";
})(PushType = exports.PushType || (exports.PushType = {}));
var PlayerStatus;
(function (PlayerStatus) {
    PlayerStatus[PlayerStatus["outside"] = 0] = "outside";
    PlayerStatus[PlayerStatus["prepared"] = 1] = "prepared";
    PlayerStatus[PlayerStatus["timeToShout"] = 2] = "timeToShout";
    PlayerStatus[PlayerStatus["shouted"] = 3] = "shouted";
    PlayerStatus[PlayerStatus["nextRound"] = 4] = "nextRound";
    PlayerStatus[PlayerStatus["preparedNextRound"] = 5] = "preparedNextRound";
    PlayerStatus[PlayerStatus["gameOver"] = 6] = "gameOver";
    PlayerStatus[PlayerStatus["memberFull"] = 7] = "memberFull";
})(PlayerStatus = exports.PlayerStatus || (exports.PlayerStatus = {}));
exports.NEW_ROUND_TIMER = 3;
