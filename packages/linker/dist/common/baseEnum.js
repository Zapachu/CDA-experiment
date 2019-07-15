"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Role;
(function (Role) {
    Role[Role["owner"] = 0] = "owner";
    Role[Role["player"] = 1] = "player";
})(Role = exports.Role || (exports.Role = {}));
var RequestMethod;
(function (RequestMethod) {
    RequestMethod["get"] = "get";
    RequestMethod["post"] = "post";
})(RequestMethod = exports.RequestMethod || (exports.RequestMethod = {}));
var SocketEvent;
(function (SocketEvent) {
    SocketEvent["connection"] = "connection";
    SocketEvent["disconnect"] = "disconnect";
    SocketEvent["upFrame"] = "upFrame";
    SocketEvent["downFrame"] = "downFrame";
})(SocketEvent = exports.SocketEvent || (exports.SocketEvent = {}));
var PhaseStatus;
(function (PhaseStatus) {
    PhaseStatus[PhaseStatus["playing"] = 0] = "playing";
    PhaseStatus[PhaseStatus["paused"] = 1] = "paused";
    PhaseStatus[PhaseStatus["closed"] = 2] = "closed";
})(PhaseStatus = exports.PhaseStatus || (exports.PhaseStatus = {}));
var PlayerStatus;
(function (PlayerStatus) {
    PlayerStatus[PlayerStatus["playing"] = 0] = "playing";
    PlayerStatus[PlayerStatus["left"] = 1] = "left";
})(PlayerStatus = exports.PlayerStatus || (exports.PlayerStatus = {}));
//# sourceMappingURL=baseEnum.js.map