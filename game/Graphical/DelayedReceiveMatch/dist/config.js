"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.namespace = 'DelayedReceiveMatch';
var MoveType;
(function (MoveType) {
    MoveType["enterMarket"] = "enterMarket";
    MoveType["getPosition"] = "getPosition";
    MoveType["submit"] = "submit";
})(MoveType = exports.MoveType || (exports.MoveType = {}));
var PushType;
(function (PushType) {
    PushType[PushType["newRoundTimer"] = 0] = "newRoundTimer";
})(PushType = exports.PushType || (exports.PushType = {}));
var PlayerStatus;
(function (PlayerStatus) {
    PlayerStatus[PlayerStatus["outside"] = 0] = "outside";
    PlayerStatus[PlayerStatus["prepared"] = 1] = "prepared";
    PlayerStatus[PlayerStatus["submitted"] = 2] = "submitted";
    PlayerStatus[PlayerStatus["matched"] = 3] = "matched";
})(PlayerStatus = exports.PlayerStatus || (exports.PlayerStatus = {}));
exports.DEAL_TIMER = 5;
exports.NEW_ROUND_TIMER = 5;
