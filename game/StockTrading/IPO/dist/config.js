"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.namespace = "IPO";
var MoveType;
(function (MoveType) {
    MoveType["shout"] = "shout";
    MoveType["startMulti"] = "startMulti";
    MoveType["nextGame"] = "nextGame";
    MoveType["replay"] = "replay";
    MoveType["startSingle"] = "startSingle";
    MoveType["joinRobot"] = "joinRobot";
})(MoveType = exports.MoveType || (exports.MoveType = {}));
var PushType;
(function (PushType) {
    PushType[PushType["matchTimer"] = 0] = "matchTimer";
    PushType[PushType["matchMsg"] = 1] = "matchMsg";
    PushType[PushType["robotShout"] = 2] = "robotShout";
    PushType[PushType["shoutTimer"] = 3] = "shoutTimer";
})(PushType = exports.PushType || (exports.PushType = {}));
var PlayerStatus;
(function (PlayerStatus) {
    PlayerStatus[PlayerStatus["intro"] = 0] = "intro";
    PlayerStatus[PlayerStatus["matching"] = 1] = "matching";
    PlayerStatus[PlayerStatus["prepared"] = 2] = "prepared";
    PlayerStatus[PlayerStatus["shouted"] = 3] = "shouted";
    PlayerStatus[PlayerStatus["result"] = 4] = "result";
})(PlayerStatus = exports.PlayerStatus || (exports.PlayerStatus = {}));
var IPOType;
(function (IPOType) {
    IPOType[IPOType["Median"] = 1] = "Median";
    IPOType[IPOType["TopK"] = 2] = "TopK";
})(IPOType = exports.IPOType || (exports.IPOType = {}));
exports.MATCH_TIMER = 2;
exports.SHOUT_TIMER = 60;
exports.minA = 30;
exports.maxA = 100;
exports.minB = 0.6;
exports.maxB = 0.7;
exports.startingMultiplier = 5000;
exports.minNPCNum = 1000;
exports.maxNPCNum = 3000;
