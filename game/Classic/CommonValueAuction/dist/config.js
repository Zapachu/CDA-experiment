"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.namespace = 'CommonValueAuction';
var MoveType;
(function (MoveType) {
    MoveType["shout"] = "shout";
    MoveType["getPosition"] = "getPosition";
})(MoveType = exports.MoveType || (exports.MoveType = {}));
var PushType;
(function (PushType) {
    PushType[PushType["dealTimer"] = 0] = "dealTimer";
    PushType[PushType["newRoundTimer"] = 1] = "newRoundTimer";
})(PushType = exports.PushType || (exports.PushType = {}));
var PlayerStatus;
(function (PlayerStatus) {
    PlayerStatus[PlayerStatus["outside"] = 0] = "outside";
    PlayerStatus[PlayerStatus["prepared"] = 1] = "prepared";
    PlayerStatus[PlayerStatus["shouted"] = 2] = "shouted";
    PlayerStatus[PlayerStatus["won"] = 3] = "won";
    PlayerStatus[PlayerStatus["gameOver"] = 4] = "gameOver";
})(PlayerStatus = exports.PlayerStatus || (exports.PlayerStatus = {}));
exports.NEW_ROUND_TIMER = 3;
