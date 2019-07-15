"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.namespace = "SceneSurvey";
var MoveType;
(function (MoveType) {
    MoveType["prepare"] = "prepare";
    MoveType["shout"] = "shout";
    MoveType["info"] = "info";
})(MoveType = exports.MoveType || (exports.MoveType = {}));
var PushType;
(function (PushType) {
})(PushType = exports.PushType || (exports.PushType = {}));
var STATUS;
(function (STATUS) {
    STATUS[STATUS["instruction"] = 0] = "instruction";
    STATUS[STATUS["playing"] = 1] = "playing";
    STATUS[STATUS["info"] = 2] = "info";
    STATUS[STATUS["end"] = 3] = "end";
})(STATUS = exports.STATUS || (exports.STATUS = {}));
var FetchRoute;
(function (FetchRoute) {
    FetchRoute["exportXls"] = "/exportXls/:gameId:";
    FetchRoute["exportXlsPlaying"] = "/exportXlsPlaying/:gameId";
    FetchRoute["getUserMobile"] = "/getUserMobile/:gameId";
})(FetchRoute = exports.FetchRoute || (exports.FetchRoute = {}));
var SheetType;
(function (SheetType) {
    SheetType["result"] = "result";
})(SheetType = exports.SheetType || (exports.SheetType = {}));
exports.PAGES = [
    {
        instructions: [
            "情景1：你需要为你和你的组员选择一个共同的补贴方案：A？B？",
            "如果该情景被抽中，且你选择了A，那么你和你的组员在指定日期的补贴方案都是A；如果你选择了B，你们的补贴方案都是B。"
        ]
    },
    {
        instructions: [
            "情景2：你组员的补贴方案已经被确定为A，请为你自己选择一个补贴方案：A？B？",
            "如果该情景被抽中，在某一指定日期，你组员的补贴方案为A，你的选择只会影响你自己的补贴方案。"
        ]
    },
    {
        instructions: [
            "情景3：你组员的补贴方案已经被确定为B，请为你自己选择一个补贴方案：A？B？",
            "如果该情景被抽中，在某一指定日期，你组员的补贴方案为B，你的选择只会影响你自己的补贴方案。"
        ]
    },
    {
        instructions: [
            "情景4：你的补贴已经被确定为A，请为你的组员选择一个补贴方案：A？B？",
            "如果该情景被抽中，在某一指定日期，你自己的补贴方案为A，你的选择只会影响你组员的补贴方案。"
        ]
    },
    {
        instructions: [
            "情景5：你的补贴已经被确定为B，请为你的组员选择一个补贴方案：A？B？",
            "如果该情景被抽中，在某一指定日期，你自己的补贴方案为B，你的选择只会影响你组员的补贴方案。"
        ]
    }
];
