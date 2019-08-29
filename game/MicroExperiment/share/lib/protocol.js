"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Phase;
(function (Phase) {
    Phase[Phase["IPO"] = 0] = "IPO";
    Phase[Phase["OpenAuction"] = 1] = "OpenAuction";
    Phase[Phase["TBM"] = 2] = "TBM";
    Phase[Phase["CBM"] = 3] = "CBM";
})(Phase = exports.Phase || (exports.Phase = {}));
var NAMESPACE_PREFIX = 'stockTrade:';
function phaseToNamespace(phase) {
    return "" + NAMESPACE_PREFIX + phase;
}
exports.phaseToNamespace = phaseToNamespace;
function namespaceToPhase(namespace) {
    return +namespace.replace(NAMESPACE_PREFIX, '');
}
exports.namespaceToPhase = namespaceToPhase;
var NCreateParams;
(function (NCreateParams) {
    var IPOType;
    (function (IPOType) {
        IPOType[IPOType["Median"] = 0] = "Median";
        IPOType[IPOType["TopK"] = 1] = "TopK";
        IPOType[IPOType["FPSBA"] = 2] = "FPSBA";
    })(IPOType = NCreateParams.IPOType || (NCreateParams.IPOType = {}));
    var CBMRobotType;
    (function (CBMRobotType) {
        CBMRobotType[CBMRobotType["random"] = 0] = "random";
        CBMRobotType[CBMRobotType["zip"] = 1] = "zip";
    })(CBMRobotType = NCreateParams.CBMRobotType || (NCreateParams.CBMRobotType = {}));
})(NCreateParams = exports.NCreateParams || (exports.NCreateParams = {}));
var UserGameStatus;
(function (UserGameStatus) {
    UserGameStatus[UserGameStatus["matching"] = 0] = "matching";
    UserGameStatus[UserGameStatus["started"] = 1] = "started";
    UserGameStatus[UserGameStatus["notStarted"] = 2] = "notStarted";
})(UserGameStatus = exports.UserGameStatus || (exports.UserGameStatus = {}));
var ResCode;
(function (ResCode) {
    ResCode[ResCode["success"] = 0] = "success";
    ResCode[ResCode["unexpectError"] = -1] = "unexpectError";
})(ResCode = exports.ResCode || (exports.ResCode = {}));
var SocketEvent;
(function (SocketEvent) {
    SocketEvent["reqStartGame"] = "reqStartGame";
    SocketEvent["leaveMatchRoom"] = "leaveMatchRoom";
    SocketEvent["startMatch"] = "startMatch";
    SocketEvent["startGame"] = "startGame";
    SocketEvent["continueGame"] = "continueGame";
    SocketEvent["handleError"] = "handleError";
})(SocketEvent = exports.SocketEvent || (exports.SocketEvent = {}));
