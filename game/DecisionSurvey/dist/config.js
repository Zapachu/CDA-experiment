"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.namespace = "DecisionSurvey";
var MoveType;
(function (MoveType) {
    MoveType["join"] = "join";
    MoveType["shout"] = "shout";
    MoveType["result"] = "result";
    MoveType["back"] = "back";
    MoveType["checkVersion"] = "checkVersion";
    MoveType["info"] = "info";
    MoveType["random"] = "random";
    //teacher
    MoveType["dealCard"] = "dealCard";
})(MoveType = exports.MoveType || (exports.MoveType = {}));
var PushType;
(function (PushType) {
    PushType[PushType["robotShout"] = 0] = "robotShout";
    PushType[PushType["shoutTimer"] = 1] = "shoutTimer";
})(PushType = exports.PushType || (exports.PushType = {}));
var DATE;
(function (DATE) {
    DATE["jul5"] = "7\u670811\u65E5";
    DATE["aug4"] = "8\u670810\u65E5";
    DATE["oct13"] = "10\u670819\u65E5";
    DATE["nov12"] = "11\u670818\u65E5";
})(DATE = exports.DATE || (exports.DATE = {}));
exports.SHOUT_TIMER = 60;
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
var DECISION;
(function (DECISION) {
    DECISION["one"] = "1";
    DECISION["two"] = "2";
    DECISION["three"] = "3";
    DECISION["four"] = "4";
    DECISION["five"] = "5";
    DECISION["six"] = "6";
})(DECISION = exports.DECISION || (exports.DECISION = {}));
var CARD;
(function (CARD) {
    CARD["red"] = "\u7EA2\u8272";
    CARD["black"] = "\u9ED1\u8272";
})(CARD = exports.CARD || (exports.CARD = {}));
var GENDER;
(function (GENDER) {
    GENDER["male"] = "\u7537";
    GENDER["female"] = "\u5973";
})(GENDER = exports.GENDER || (exports.GENDER = {}));
exports.PAGE = (_a = {},
    _a[DECISION.one] = {
        instructions: [
            "考虑如下收益不确定的资产，其收益的产生过程涉及从一堆牌中抽取一张。",
            "资产：给定一堆10张的牌，5张红色5张黑色，你猜测一个颜色，并从牌堆中抽取一张牌。如果猜测准确你的（毛）收益是投资额的2.5倍；如果不准确你失去所有投资。",
            "给定20元的总投资额，你可以选择在该资产上的投资额度。剩下的不投资，即为确定性的收益。",
            {
                text: "例：如果你选择投资14元，并猜测红色，则",
                style: { marginBottom: "0" }
            },
            {
                text: "如果抽出的牌的颜色为红，你最终的收益为20-14+14*2.5=41元。",
                style: { marginBottom: "0" }
            },
            "如果抽出的牌的颜色为黑，你最终的收益为20-14=6元。"
        ],
        questions: [
            {
                title: "请在下面所有的投资组合中选取一项：",
                options: [
                    { label: "投资0，不投资20", value: "0:20" },
                    { label: "投资5，不投资15", value: "5:15" },
                    { label: "投资8，不投资12", value: "8:12" },
                    { label: "投资10，不投资10", value: "10:10" },
                    { label: "投资12，不投资8", value: "12:8" },
                    { label: "投资15，不投资5", value: "15:5" },
                    { label: "投资20，不投资0", value: "20:0" }
                ]
            },
            {
                title: "同时请选择你猜测的颜色（问卷结束时，我们将现场抽牌，根据你猜测的颜色，决定你的最终收益）",
                options: [
                    { label: "黑色", value: CARD.black },
                    { label: "红色", value: CARD.red }
                ]
            }
        ],
        required: ["answer", "card"]
    },
    _a[DECISION.two] = {
        instructions: [
            "考虑如下收益不确定的资产，其收益的产生过程涉及从一堆牌中抽取一张。",
            "资产：给定一堆10张的牌，红色和黑色的$bold$数量未知$bold$，即红色牌数量可能是0到10的任一数字，黑色牌同理。你猜测一个颜色，并从牌堆中抽取一张牌。如果猜测准确获得投资额的2.5倍，如果不准确失去所有投资额。",
            "给定20元的总投资额，你可以选择在该资产上的投资额度。剩下的不投资，即为确定性的收益。",
            {
                text: "例：如果你选择投资14元，并猜测红色，则",
                style: { marginBottom: "0" }
            },
            {
                text: "如果抽出的牌的颜色为红，你最终的收益为20-14+14*2.5=41元。",
                style: { marginBottom: "0" }
            },
            "如果抽出的牌的颜色为黑，你最终的收益为20-14=6元。"
        ],
        questions: [
            {
                title: "请在下面所有的投资组合中选取一项：",
                options: [
                    { label: "投资0，不投资20", value: "0:20" },
                    { label: "投资5，不投资15", value: "5:15" },
                    { label: "投资8，不投资12", value: "8:12" },
                    { label: "投资10，不投资10", value: "10:10" },
                    { label: "投资12，不投资8", value: "12:8" },
                    { label: "投资15，不投资5", value: "15:5" },
                    { label: "投资20，不投资0", value: "20:0" }
                ]
            },
            {
                title: "同时请选择你猜测的颜色（问卷结束时，我们将现场抽牌，根据你猜测的颜色，决定你的最终收益）",
                options: [
                    { label: "黑色", value: CARD.black },
                    { label: "红色", value: CARD.red }
                ]
            }
        ],
        required: ["answer", "card"]
    },
    _a[DECISION.three] = {
        questions: [
            {
                title: "\u8003\u8651\u5982\u4E0B\u4E24\u4E2A\u65F6\u95F4\u70B9\uFF0C\u4ECA\u5929\uFF08" + DATE.jul5 + "\uFF09\u548C\u4E09\u5341\u5929\u4EE5\u540E\uFF08" + DATE.aug4 + "\uFF09\uFF0C\u5728\u4E24\u4E2A\u65F6\u95F4\u70B9\u4E0A\u4F60\u53EF\u4EE5\u5206\u522B\u83B7\u53D6\u4E00\u5B9A\u7684\u6536\u76CA\uFF0C\u8BF7\u5728\u4EE5\u4E0B\u7684\u6536\u76CA\u7EC4\u5408\u4E2D\u9009\u53D6\u4E00\u9879\uFF1A",
                options: [
                    { label: "今天获得22，三十天以后获得2", value: "22:2" },
                    { label: "今天获得18，三十天以后获得6.4", value: "18:6.4" },
                    { label: "今天获得15，三十天以后获得9.7", value: "15:9.7" },
                    { label: "今天获得12，三十天以后获得13", value: "12:13" },
                    { label: "今天获得9，三十天以后获得16.3", value: "9:16.3" },
                    { label: "今天获得6，三十天以后获得19.6", value: "6:19.6" },
                    { label: "今天获得2，三十天以后获得24", value: "2:24" }
                ]
            }
        ],
        required: ["answer"]
    },
    _a[DECISION.four] = {
        questions: [
            {
                title: "\u8003\u8651\u5982\u4E0B\u4E24\u4E2A\u65F6\u95F4\u70B9\uFF0C\u4E00\u767E\u5929\u4EE5\u540E\uFF08" + DATE.oct13 + "\uFF09\u548C\u4E00\u767E\u4E09\u5341\u5929\u4EE5\u540E\uFF08" + DATE.nov12 + "\uFF09\uFF0C\u5728\u4E24\u4E2A\u65F6\u95F4\u70B9\u4E0A\u4F60\u53EF\u4EE5\u5206\u522B\u83B7\u53D6\u4E00\u5B9A\u7684\u6536\u76CA\uFF0C\u8BF7\u5728\u4EE5\u4E0B\u7684\u6536\u76CA\u7EC4\u5408\u4E2D\u9009\u53D6\u4E00\u9879\uFF1A",
                options: [
                    { label: "一百天以后获得22，一百三十天以后获得2", value: "22:2" },
                    { label: "一百天以后获得18，一百三十天以后获得6.4", value: "18:6.4" },
                    { label: "一百天以后获得15，一百三十天以后获得9.7", value: "15:9.7" },
                    { label: "一百天以后获得12，一百三十天以后获得13", value: "12:13" },
                    { label: "一百天以后获得9，一百三十天以后获得16.3", value: "9:16.3" },
                    { label: "一百天以后获得6，一百三十天以后获得19.6", value: "6:19.6" },
                    { label: "一百天以后获得2，一百三十天以后获得24", value: "2:24" }
                ]
            }
        ],
        required: ["answer"]
    },
    _a[DECISION.five] = {
        questions: [
            {
                title: "考虑甲乙双方，甲方是你自己，乙方为随机与你配对的另外一个匿名调查员。请在以下的收益组合中选择一项：",
                options: [
                    { label: "甲方获得13，乙方获得5.5", value: "13:5.5" },
                    { label: "甲方获得12，乙方获得8.5", value: "12:8.5" },
                    { label: "甲方获得11，乙方获得10", value: "11:10" }
                ]
            }
        ],
        required: ["answer"]
    },
    _a[DECISION.six] = {
        questions: [
            {
                title: "考虑甲乙双方，甲方是你自己，乙方为随机与你配对的另外一个匿名调查员。请在以下的收益组合中选择一项：",
                options: [
                    { label: "甲方获得8，乙方获得15", value: "8:15" },
                    { label: "甲方获得9，乙方获得12", value: "9:12" },
                    { label: "甲方获得10，乙方获得10.5", value: "10:10.5" }
                ]
            }
        ],
        required: ["answer"]
    },
    _a);
