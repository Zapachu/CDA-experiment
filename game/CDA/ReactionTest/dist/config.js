"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.namespace = 'ReactionTest';
var MoveType;
(function (MoveType) {
    //player
    MoveType["submitSeatNumber"] = "submitSeatNumber";
    MoveType["countReaction"] = "countReaction";
    MoveType["sendBackPlayer"] = "sendBackPlayer";
    //owner
    MoveType["startMainTest"] = "startMainTest";
})(MoveType = exports.MoveType || (exports.MoveType = {}));
var PushType;
(function (PushType) {
})(PushType = exports.PushType || (exports.PushType = {}));
var GameStage;
(function (GameStage) {
    GameStage[GameStage["seatNumber"] = 0] = "seatNumber";
    GameStage[GameStage["mainTest"] = 1] = "mainTest";
    GameStage[GameStage["result"] = 2] = "result";
})(GameStage = exports.GameStage || (exports.GameStage = {}));
var FetchRoute;
(function (FetchRoute) {
    FetchRoute["exportXls"] = "/exportXls/:gameId";
})(FetchRoute = exports.FetchRoute || (exports.FetchRoute = {}));
var SheetType;
(function (SheetType) {
    SheetType["result"] = "result";
})(SheetType = exports.SheetType || (exports.SheetType = {}));
