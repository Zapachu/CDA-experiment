"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.namespace = "TBM";
var Role;
(function (Role) {
    Role[Role["Buyer"] = 1] = "Buyer";
    Role[Role["Seller"] = 2] = "Seller";
})(Role = exports.Role || (exports.Role = {}));
var MoveType;
(function (MoveType) {
    MoveType["join"] = "join";
    MoveType["shout"] = "shout";
    MoveType["nextStage"] = "nextStage";
})(MoveType = exports.MoveType || (exports.MoveType = {}));
var PushType;
(function (PushType) {
    PushType[PushType["robotShout"] = 0] = "robotShout";
    PushType[PushType["shoutTimer"] = 1] = "shoutTimer";
})(PushType = exports.PushType || (exports.PushType = {}));
exports.SHOUT_TIMER = 60;
exports.NPC_PRICE_MIN = 50;
exports.NPC_PRICE_MAX = 60;
