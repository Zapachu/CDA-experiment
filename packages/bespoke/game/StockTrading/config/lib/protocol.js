"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Phase;
(function (Phase) {
    Phase[Phase["IPO_Median"] = 0] = "IPO_Median";
    Phase[Phase["IPO_TopK"] = 1] = "IPO_TopK";
    Phase[Phase["TBM"] = 2] = "TBM";
    Phase[Phase["CBM"] = 3] = "CBM";
    Phase[Phase["CBM_Leverage"] = 4] = "CBM_Leverage";
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
