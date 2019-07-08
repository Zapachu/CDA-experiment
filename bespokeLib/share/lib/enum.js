"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SocketEvent;
(function (SocketEvent) {
    //region baseEvent
    SocketEvent["connection"] = "connection";
    SocketEvent["disconnect"] = "disconnect";
    SocketEvent["online"] = "online";
    SocketEvent["move"] = "move";
    SocketEvent["push"] = "push";
    //endregion
    //region stateEvent
    SocketEvent["syncGameState_json"] = "SGJ";
    SocketEvent["syncPlayerState_json"] = "SPJ";
    SocketEvent["changeGameState_diff"] = "CGD";
    SocketEvent["changePlayerState_diff"] = "CPD";
    //endregion
})(SocketEvent = exports.SocketEvent || (exports.SocketEvent = {}));
var CoreMove;
(function (CoreMove) {
    CoreMove["switchGameStatus"] = "switchGameStatus";
})(CoreMove = exports.CoreMove || (exports.CoreMove = {}));
var GameStatus;
(function (GameStatus) {
    GameStatus[GameStatus["started"] = 0] = "started";
    GameStatus[GameStatus["paused"] = 1] = "paused";
    GameStatus[GameStatus["over"] = 2] = "over";
})(GameStatus = exports.GameStatus || (exports.GameStatus = {}));
var SyncStrategy;
(function (SyncStrategy) {
    SyncStrategy[SyncStrategy["default"] = 0] = "default";
    SyncStrategy[SyncStrategy["diff"] = 1] = "diff";
})(SyncStrategy = exports.SyncStrategy || (exports.SyncStrategy = {}));
