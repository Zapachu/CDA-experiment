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
    SocketEvent["joinRoom"] = "joinRoom";
    SocketEvent["syncGameState"] = "syncGameState";
})(SocketEvent = exports.SocketEvent || (exports.SocketEvent = {}));
//# sourceMappingURL=baseEnum.js.map