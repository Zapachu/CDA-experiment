"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.namespace = 'VickreyAuction';
var MoveType;
(function (MoveType) {
    MoveType["enterMarket"] = "enterMarket";
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
    PlayerStatus[PlayerStatus["shouted"] = 2] = "shouted";
    PlayerStatus[PlayerStatus["won"] = 3] = "won";
})(PlayerStatus = exports.PlayerStatus || (exports.PlayerStatus = {}));
exports.DEAL_TIMER = 5;
exports.NEW_ROUND_TIMER = 5;
