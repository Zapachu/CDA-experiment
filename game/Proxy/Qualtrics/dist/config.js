"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.namespace = 'Qualtrics';
var MoveType;
(function (MoveType) {
    MoveType["getIndex"] = "getIndex";
})(MoveType = exports.MoveType || (exports.MoveType = {}));
var PushType;
(function (PushType) {
})(PushType = exports.PushType || (exports.PushType = {}));
function getAncademyId(token, index) {
    return token + "_" + index;
}
exports.getAncademyId = getAncademyId;
