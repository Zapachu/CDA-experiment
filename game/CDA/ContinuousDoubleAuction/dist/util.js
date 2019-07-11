"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getEnumKeys(e) {
    var keys = [];
    for (var key in e) {
        if (typeof e[key] === "number") {
            keys.push(key);
        }
    }
    return keys;
}
exports.getEnumKeys = getEnumKeys;
