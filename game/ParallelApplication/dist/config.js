"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.namespace = "ParallelApplication";
var MoveType;
(function (MoveType) {
    MoveType["join"] = "join";
    MoveType["shout"] = "shout";
    MoveType["result"] = "result";
    MoveType["back"] = "back";
    MoveType["checkVersion"] = "checkVersion";
})(MoveType = exports.MoveType || (exports.MoveType = {}));
var PushType;
(function (PushType) {
    PushType[PushType["robotShout"] = 0] = "robotShout";
    PushType[PushType["shoutTimer"] = 1] = "shoutTimer";
})(PushType = exports.PushType || (exports.PushType = {}));
exports.SHOUT_TIMER = 60;
exports.APPLICATION_NUM = 3;
var SCHOOL;
(function (SCHOOL) {
    SCHOOL[SCHOOL["none"] = 0] = "none";
    SCHOOL[SCHOOL["beijingUni"] = 1] = "beijingUni";
    SCHOOL[SCHOOL["qinghuaUni"] = 2] = "qinghuaUni";
    SCHOOL[SCHOOL["renminUni"] = 3] = "renminUni";
    SCHOOL[SCHOOL["fudanUni"] = 4] = "fudanUni";
    SCHOOL[SCHOOL["shangjiaoUni"] = 5] = "shangjiaoUni";
    SCHOOL[SCHOOL["zhejiangUni"] = 6] = "zhejiangUni";
    SCHOOL[SCHOOL["nanjingUni"] = 7] = "nanjingUni";
    SCHOOL[SCHOOL["wuhanUni"] = 8] = "wuhanUni";
    SCHOOL[SCHOOL["huakeUni"] = 9] = "huakeUni";
    SCHOOL[SCHOOL["nankaiUni"] = 10] = "nankaiUni";
    SCHOOL[SCHOOL["xiamenUni"] = 11] = "xiamenUni";
    SCHOOL[SCHOOL["zhongshanUni"] = 12] = "zhongshanUni";
})(SCHOOL = exports.SCHOOL || (exports.SCHOOL = {}));
exports.SCHOOL_NAME = (_a = {},
    _a[SCHOOL.beijingUni] = "北京大学",
    _a[SCHOOL.qinghuaUni] = "清华大学",
    _a[SCHOOL.renminUni] = "中国人民大学",
    _a[SCHOOL.fudanUni] = "复旦大学",
    _a[SCHOOL.shangjiaoUni] = "上海交通大学",
    _a[SCHOOL.zhejiangUni] = "浙江大学",
    _a[SCHOOL.nanjingUni] = "南京大学",
    _a[SCHOOL.wuhanUni] = "武汉大学",
    _a[SCHOOL.huakeUni] = "华中科技大学",
    _a[SCHOOL.nankaiUni] = "南开大学",
    _a[SCHOOL.xiamenUni] = "厦门大学",
    _a[SCHOOL.zhongshanUni] = "中山大学",
    _a);
exports.QUOTA = (_b = {},
    _b[SCHOOL.beijingUni] = 1,
    _b[SCHOOL.qinghuaUni] = 1,
    _b[SCHOOL.renminUni] = 2,
    _b[SCHOOL.fudanUni] = 2,
    _b[SCHOOL.shangjiaoUni] = 2,
    _b[SCHOOL.zhejiangUni] = 2,
    _b[SCHOOL.nanjingUni] = 2,
    _b[SCHOOL.wuhanUni] = 2,
    _b[SCHOOL.huakeUni] = 2,
    _b[SCHOOL.nankaiUni] = 2,
    _b[SCHOOL.xiamenUni] = 3,
    _b[SCHOOL.zhongshanUni] = 3,
    _b);
