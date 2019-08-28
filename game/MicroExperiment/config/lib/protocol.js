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
var NspCreateParams;
(function (NspCreateParams) {
    var IPOType;
    (function (IPOType) {
        IPOType[IPOType["Median"] = 0] = "Median";
        IPOType[IPOType["TopK"] = 1] = "TopK";
        IPOType[IPOType["FPSBA"] = 2] = "FPSBA";
    })(IPOType = NspCreateParams.IPOType || (NspCreateParams.IPOType = {}));
    var CBMRobotType;
    (function (CBMRobotType) {
        CBMRobotType[CBMRobotType["random"] = 0] = "random";
        CBMRobotType[CBMRobotType["zip"] = 1] = "zip";
    })(CBMRobotType = NspCreateParams.CBMRobotType || (NspCreateParams.CBMRobotType = {}));
})(NspCreateParams = exports.NspCreateParams || (exports.NspCreateParams = {}));
