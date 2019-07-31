"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.namespace = "TogetherBidMarket";
var MoveType;
(function (MoveType) {
    MoveType["shout"] = "shout";
    MoveType["getPosition"] = "getPosition";
    MoveType["nextRound"] = "nextRound";
})(MoveType = exports.MoveType || (exports.MoveType = {}));
var PushType;
(function (PushType) {
    PushType[PushType["dealTimer"] = 0] = "dealTimer";
    PushType[PushType["newRoundTimer"] = 1] = "newRoundTimer";
})(PushType = exports.PushType || (exports.PushType = {}));
var PlayerStatus;
(function (PlayerStatus) {
    PlayerStatus[PlayerStatus["prepared"] = 0] = "prepared";
    PlayerStatus[PlayerStatus["shouted"] = 1] = "shouted";
    PlayerStatus[PlayerStatus["result"] = 2] = "result";
})(PlayerStatus = exports.PlayerStatus || (exports.PlayerStatus = {}));
exports.NEW_ROUND_TIMER = 3;
