"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getEnumKeys(e) {
    var keys = [];
    for (var key in e) {
        if (typeof e[key] === 'number') {
            keys.push(key);
        }
    }
    return keys;
}
exports.getEnumKeys = getEnumKeys;
function random(min, max) {
    return min + ~~(Math.random() * (max - min));
}
exports.random = random;
function getBalanceIndex(countArr) {
    var s = countArr.reduce(function (m, n) { return m + n; }, 0) / 2, i = 0;
    while (s > 0) {
        s -= countArr[i++];
    }
    return i - 1;
}
exports.getBalanceIndex = getBalanceIndex;
