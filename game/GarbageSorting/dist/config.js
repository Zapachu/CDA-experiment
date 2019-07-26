"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.namespace = "GarbageSorting";
var MoveType;
(function (MoveType) {
    MoveType["prepare"] = "prepare";
    MoveType["check"] = "check";
    MoveType["shout"] = "shout";
    MoveType["back"] = "back";
})(MoveType = exports.MoveType || (exports.MoveType = {}));
var PushType;
(function (PushType) {
    PushType[PushType["robotShout"] = 0] = "robotShout";
    PushType[PushType["shoutTimer"] = 1] = "shoutTimer";
})(PushType = exports.PushType || (exports.PushType = {}));
var GARBAGE;
(function (GARBAGE) {
    GARBAGE[GARBAGE["pass"] = 1] = "pass";
    GARBAGE[GARBAGE["recyclable"] = 2] = "recyclable";
    GARBAGE[GARBAGE["dry"] = 3] = "dry";
    GARBAGE[GARBAGE["wet"] = 4] = "wet";
    GARBAGE[GARBAGE["hazardous"] = 5] = "hazardous";
})(GARBAGE = exports.GARBAGE || (exports.GARBAGE = {}));
var ITEM_NAME;
(function (ITEM_NAME) {
    ITEM_NAME["umbrella"] = "umbrella";
})(ITEM_NAME = exports.ITEM_NAME || (exports.ITEM_NAME = {}));
exports.GARBAGE_LABEL = (_a = {},
    _a[GARBAGE.pass] = "懒得分类",
    _a[GARBAGE.recyclable] = "可回收垃圾",
    _a[GARBAGE.dry] = "干垃圾",
    _a[GARBAGE.wet] = "湿垃圾",
    _a[GARBAGE.hazardous] = "有害垃圾",
    _a);
exports.ITEMS = [
    { img: ITEM_NAME.umbrella },
    { img: ITEM_NAME.umbrella },
    { img: ITEM_NAME.umbrella },
    { img: ITEM_NAME.umbrella },
    { img: ITEM_NAME.umbrella },
    { img: ITEM_NAME.umbrella },
    { img: ITEM_NAME.umbrella },
    { img: ITEM_NAME.umbrella },
    { img: ITEM_NAME.umbrella },
    { img: ITEM_NAME.umbrella }
];
exports.SHOUT_TIMER = 10;
exports.ITEM_COST = 10;
exports.TOTAL_SCORE = 20 * 10 * 10;
