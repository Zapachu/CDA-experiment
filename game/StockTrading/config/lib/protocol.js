"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Phase;
(function (Phase) {
    Phase[Phase["IPO_Median"] = 0] = "IPO_Median";
    Phase[Phase["IPO_TopK"] = 1] = "IPO_TopK";
    Phase[Phase["IPO_FPSBA"] = 2] = "IPO_FPSBA";
    Phase[Phase["OpenAuction"] = 3] = "OpenAuction";
    Phase[Phase["TBM"] = 4] = "TBM";
    Phase[Phase["CBM"] = 5] = "CBM";
    Phase[Phase["CBM_Leverage"] = 6] = "CBM_Leverage";
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
