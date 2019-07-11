"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.namespace = 'PublicGoods';
var MoveType;
(function (MoveType) {
    MoveType["getPosition"] = "getPosition";
    MoveType["submit"] = "submit";
})(MoveType = exports.MoveType || (exports.MoveType = {}));
var PushType;
(function (PushType) {
    PushType[PushType["newRoundTimer"] = 0] = "newRoundTimer";
})(PushType = exports.PushType || (exports.PushType = {}));
var PlayerStatus;
(function (PlayerStatus) {
    PlayerStatus[PlayerStatus["prepared"] = 0] = "prepared";
    PlayerStatus[PlayerStatus["submitted"] = 1] = "submitted";
    PlayerStatus[PlayerStatus["result"] = 2] = "result";
})(PlayerStatus = exports.PlayerStatus || (exports.PlayerStatus = {}));
exports.NEW_ROUND_TIMER = 5;
