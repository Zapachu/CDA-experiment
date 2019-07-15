"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.namespace = 'InformationDilemma';
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
    PlayerStatus[PlayerStatus["timeToShout"] = 1] = "timeToShout";
    PlayerStatus[PlayerStatus["shouted"] = 2] = "shouted";
    PlayerStatus[PlayerStatus["gameOver"] = 3] = "gameOver";
})(PlayerStatus = exports.PlayerStatus || (exports.PlayerStatus = {}));
var Balls;
(function (Balls) {
    Balls[Balls["red"] = 0] = "red";
    Balls[Balls["blue"] = 1] = "blue";
})(Balls = exports.Balls || (exports.Balls = {}));
exports.NEW_ROUND_TIMER = 3;
