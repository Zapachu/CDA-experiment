"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.namespace = 'DoubleAuctionGraphical';
var MoveType;
(function (MoveType) {
    MoveType["prepare"] = "prepare";
    MoveType["shout"] = "shout";
    MoveType["deal"] = "deal";
    MoveType["getPosition"] = "getPosition";
})(MoveType = exports.MoveType || (exports.MoveType = {}));
var PushType;
(function (PushType) {
    PushType[PushType["countdown"] = 0] = "countdown";
    PushType[PushType["newRoundTimer"] = 1] = "newRoundTimer";
})(PushType = exports.PushType || (exports.PushType = {}));
var PlayerStatus;
(function (PlayerStatus) {
    PlayerStatus[PlayerStatus["outside"] = 0] = "outside";
    PlayerStatus[PlayerStatus["prepared"] = 1] = "prepared";
    PlayerStatus[PlayerStatus["shouted"] = 2] = "shouted";
    PlayerStatus[PlayerStatus["dealed"] = 3] = "dealed";
    PlayerStatus[PlayerStatus["gameOver"] = 4] = "gameOver";
})(PlayerStatus = exports.PlayerStatus || (exports.PlayerStatus = {}));
exports.NEW_ROUND_TIMER = 3;
