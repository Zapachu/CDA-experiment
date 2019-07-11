"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var provinces_1 = require("./provinces");
exports.namespace = "ShanghaiNY";
var Stage;
(function (Stage) {
    Stage[Stage["Seat"] = 0] = "Seat";
    Stage[Stage["Test"] = 1] = "Test";
    Stage[Stage["Main"] = 2] = "Main";
    Stage[Stage["Survey"] = 3] = "Survey";
    Stage[Stage["End"] = 4] = "End";
})(Stage = exports.Stage || (exports.Stage = {}));
var GameType;
(function (GameType) {
    GameType[GameType["T1"] = 1] = "T1";
    GameType[GameType["T2"] = 2] = "T2";
})(GameType = exports.GameType || (exports.GameType = {}));
var Choice;
(function (Choice) {
    Choice[Choice["Wait"] = -1] = "Wait";
    Choice[Choice["One"] = 1] = "One";
    Choice[Choice["Two"] = 2] = "Two";
})(Choice = exports.Choice || (exports.Choice = {}));
var Version;
(function (Version) {
    Version[Version["V1"] = 1] = "V1";
    Version[Version["V2"] = 2] = "V2";
    Version[Version["V3"] = 3] = "V3";
})(Version = exports.Version || (exports.Version = {}));
var MainStageIndex;
(function (MainStageIndex) {
    MainStageIndex[MainStageIndex["Choose"] = 0] = "Choose";
    MainStageIndex[MainStageIndex["Wait4Result"] = 1] = "Wait4Result";
    MainStageIndex[MainStageIndex["Result"] = 2] = "Result";
})(MainStageIndex = exports.MainStageIndex || (exports.MainStageIndex = {}));
var TestStageIndex;
(function (TestStageIndex) {
    TestStageIndex[TestStageIndex["Interface"] = -1] = "Interface";
    TestStageIndex[TestStageIndex["Next"] = -2] = "Next";
    TestStageIndex[TestStageIndex["Wait4Others"] = -3] = "Wait4Others";
})(TestStageIndex = exports.TestStageIndex || (exports.TestStageIndex = {}));
var MoveType;
(function (MoveType) {
    //player
    MoveType["initPosition"] = "initPosition";
    MoveType["inputSeatNumber"] = "inputSeatNumber";
    MoveType["answerTest"] = "answerTest";
    MoveType["answerMain"] = "answerMain";
    MoveType["advanceRoundIndex"] = "advanceRoundIndex";
    MoveType["answerSurvey"] = "answerSurvey";
    MoveType["toMain"] = "toMain";
    //owner
    MoveType["startTest"] = "startTest";
    // assignPosition = 'assignPosition',
    // openMarket = 'openMarket',
    //elf
    MoveType["sendBackPlayer"] = "sendBackPlayer";
})(MoveType = exports.MoveType || (exports.MoveType = {}));
var SheetType;
(function (SheetType) {
    SheetType["result"] = "result";
})(SheetType = exports.SheetType || (exports.SheetType = {}));
var PushType;
(function (PushType) {
})(PushType = exports.PushType || (exports.PushType = {}));
var FetchRoute;
(function (FetchRoute) {
    FetchRoute["exportXls"] = "/exportXls/:gameId:";
    FetchRoute["exportXlsPlaying"] = "/exportXlsPlaying/:gameId";
    FetchRoute["getUserMobile"] = "/getUserMobile/:gameId";
})(FetchRoute = exports.FetchRoute || (exports.FetchRoute = {}));
exports.Test1 = [
    {
        desc: [
            { text: "假设其他三个组员选择“2, 2, 2”" },
            { text: "", br: 10 },
            { text: "如果你选择“1”" }
        ],
        questions: [
            {
                title: [{ text: "你在这一轮的收益为:" }],
                options: function (displayData, d) { return [
                    { label: (displayData.p11 - d).toFixed(2), value: "a" },
                    { label: (displayData.p21 - d).toFixed(2), value: "b" },
                    { label: displayData.p22.toFixed(2), value: "c" }
                ]; },
                answer: "a"
            }
        ]
    },
    {
        desc: [
            { text: "假设其他三个组员选择“2, 2, 2”" },
            { text: "", br: 10 },
            { text: "如果你选择“2”" }
        ],
        questions: [
            {
                title: [{ text: "你在这一轮的收益为:" }],
                options: function (displayData, d) { return [
                    { label: (displayData.p11 - d).toFixed(2), value: "a" },
                    { label: (displayData.p21 - d).toFixed(2), value: "b" },
                    { label: displayData.p22.toFixed(2), value: "c" }
                ]; },
                answer: "c"
            }
        ]
    },
    {
        desc: [
            { text: "假设其他三个组员选择“1, 1, 2”" },
            { text: "", br: 10 },
            { text: "如果你选择“2”" }
        ],
        questions: [
            {
                title: [{ text: "你在这一轮的收益为:" }],
                options: function (displayData, d) { return [
                    { label: (displayData.p11 - d).toFixed(2), value: "a" },
                    { label: (displayData.p21 - d).toFixed(2), value: "b" },
                    { label: displayData.p22.toFixed(2), value: "c" }
                ]; },
                answer: "b"
            }
        ]
    }
];
exports.Test2 = [
    {
        //2
        desc: [
            { text: "如果你在第一阶段选择等待。" },
            { text: "", br: 10 },
            { text: "并且第一阶段的结果为：有人选1。", color: true }
        ],
        questions: [
            {
                title: [
                    { text: "如果你选择" },
                    {
                        text: "“第一阶段有人选1则在第二阶段选1；第一阶段没有人选1则在第二阶段选1”（无论第一阶段有没有人选1，在第二阶段都选1）",
                        color: true
                    },
                    { text: "", br: 0 },
                    { text: "你在这一轮的收益为" }
                ],
                options: function (displayData, d) { return [
                    { label: (displayData.p11 - d).toFixed(2), value: "a" },
                    { label: displayData.p21.toFixed(2), value: "b" },
                    { label: displayData.p22.toFixed(2), value: "c" }
                ]; },
                answer: "a"
            },
            {
                title: [
                    { text: "如果你选择" },
                    {
                        text: "“第一阶段有人选1则在第二阶段选1；第一阶段没有人选1则在第二阶段选2”",
                        color: true
                    },
                    { text: "", br: 0 },
                    { text: "你在这一轮的收益为" }
                ],
                options: function (displayData, d) { return [
                    { label: (displayData.p11 - d).toFixed(2), value: "a" },
                    { label: displayData.p21.toFixed(2), value: "b" },
                    { label: displayData.p22.toFixed(2), value: "c" }
                ]; },
                answer: "a"
            },
            {
                title: [
                    { text: "如果你选择" },
                    {
                        text: "“第一阶段有人选1则在第二阶段选2；第一阶段没有人选1则在第二阶段选2”（无论第一阶段有没有人选1，在第二阶段都选2）",
                        color: true
                    },
                    { text: "", br: 0 },
                    { text: "你在这一轮的收益为" }
                ],
                options: function (displayData, d) { return [
                    { label: displayData.p11.toFixed(2), value: "a" },
                    { label: displayData.p21.toFixed(2), value: "b" },
                    { label: displayData.p22.toFixed(2), value: "c" }
                ]; },
                answer: "b"
            }
        ]
    },
    {
        desc: [
            { text: "假设你在考虑以下两个选择方案" },
            { text: "", br: 10 },
            { text: "选择方案(A)" },
            { text: '"在第一阶段选1"', color: true },
            { text: "", br: 0 },
            { text: "选择方案(B)" },
            {
                text: '"等待，第一阶段有人选1则在第二阶段选1；第一阶段没有人选1则在第二阶段选1"（无论第一阶段有没有人选1，在第二阶段都选1）',
                color: true
            }
        ],
        questions: [
            {
                title: [
                    { text: "如果其他三个组员都选择" },
                    { text: '"在第一阶段选1"', color: true },
                    { text: "，以下关于你自己的收益的说法正确的是：" }
                ],
                options: [
                    { label: "如果你选方案(A)，你获得收益更大", value: "a" },
                    { label: "如果你选方案(B)，你获得收益更大", value: "b" },
                    { label: "你选方案(A)还是(B)能获得的收益一样大", value: "c" }
                ],
                answer: function (d) { return (d > 0 ? "a" : "c"); }
            },
            {
                title: [
                    { text: "如果其他三个组员都选择" },
                    {
                        text: '"等待，第一阶段有人选1则在第二阶段选1；第一阶段无人选1则在第二阶段选2"',
                        color: true
                    },
                    { text: "，以下关于你自己的收益的说法正确的是：" }
                ],
                options: [
                    { label: "如果你选方案(A)，你获得收益更大", value: "a" },
                    { label: "如果你选方案(B)，你获得收益更大", value: "b" },
                    { label: "你选方案(A)还是(B)能获得的收益一样大", value: "c" }
                ],
                answer: function (d) { return (d > 0 ? "a" : "c"); }
            },
            {
                title: [
                    { text: "如果你" },
                    { text: "不确定其他组员会怎么选", color: true },
                    { text: "，以下关于你自己的收益的说法正确的是：" }
                ],
                options: [
                    { label: "如果你选方案(A)，你获得收益总是更大", value: "a" },
                    { label: "如果你选方案(B)，你获得收益总是更大", value: "b" },
                    { label: "不管其他组员怎么选，你选方案(A)还是(B)能获得的收益总是一样大", value: "c" },
                    { label: "方案(A)和方案(B)的收益哪个大，取决于其他组员怎么选", value: "d" }
                ],
                answer: function (d) { return (d > 0 ? "a" : "c"); }
            }
        ]
    },
    {
        desc: [
            { text: "假设你在考虑以下两个选择方案" },
            { text: "", br: 10 },
            { text: "选择方案(A)" },
            { text: '"在第一阶段选1"', color: true },
            { text: "", br: 0 },
            { text: "选择方案(B)" },
            {
                text: '"等待，第一阶段有人选1则在第二阶段选1；第一阶段没有人选1则在第二阶段选1"（无论第一阶段有没有人选1，在第二阶段都选1）',
                color: true
            }
        ],
        questions: [
            {
                title: [
                    { text: "如果其他三个组员都选择" },
                    { text: '"在第一阶段选1"', color: true },
                    { text: "，以下关于其他组员收益的说法正确的是：" }
                ],
                options: [
                    { label: "如果你选方案(A)，其他组员获得收益更小", value: "a" },
                    { label: "如果你选方案(B)，其他组员获得收益更小", value: "b" },
                    { label: "不管你选方案(A)还是(B)，其他组员获得的收益一样大", value: "c" }
                ],
                answer: 'c'
            },
            {
                title: [
                    { text: "如果其他三个组员都选择" },
                    {
                        text: '"等待，第一阶段有人选1则在第二阶段选1；第一阶段无人选1则在第二阶段选2"',
                        color: true
                    },
                    { text: "，以下关于其他组员收益的说法正确的是：" }
                ],
                options: [
                    { label: "如果你选方案(A)，其他组员获得收益更小", value: "a" },
                    { label: "如果你选方案(B)，其他组员获得收益更小", value: "b" },
                    { label: "不管你选方案(A)还是(B)，其他组员获得的收益一样大", value: "c" }
                ],
                answer: 'b'
            },
        ]
    },
    // {
    //   //3
    //   desc: [
    //     { text: "假设其他三个组员都选择" },
    //     { text: "“在第一阶段选1”", color: true },
    //     { text: "", br: 10 },
    //     { text: "如果你选择" },
    //     { text: "“在第一阶段选1”", color: true }
    //   ],
    //   questions: [
    //     {
    //       title: [{ text: "第一阶段的结果是：" }],
    //       options: ["第一阶段有人选1", "第一阶段没有人选1"],
    //       answer: "第一阶段有人选1"
    //     },
    //     {
    //       title: [{ text: "四个组员的最终选择为：" }],
    //       options: ["1,1,1,1", "1,2,2,2", "2,2,2,2"],
    //       answer: "1,1,1,1"
    //     },
    //     {
    //       title: [{ text: "你在这一轮的收益为:" }],
    //       options: null,
    //       answer: "a"
    //     }
    //   ]
    // },
    {
        //5new
        desc: [
            { text: "假设其他三个组员都选择" },
            { text: "“在第一阶段选1”", color: true },
            { text: "", br: 10 },
            { text: "如果你选择" },
            {
                text: "“在第一阶段等待；如果第一阶段有人选1则在第二阶段选1；第一阶段没有人选1则在第二阶段选2”",
                color: true
            }
        ],
        questions: [
            {
                title: [{ text: "第一阶段的结果是：" }],
                options: ["第一阶段有人选1", "第一阶段没有人选1"],
                answer: "第一阶段有人选1"
            },
            {
                title: [{ text: "四个组员的最终选择为：" }],
                options: ["1,1,1,1", "1,2,2,2", "2,2,2,2"],
                answer: "1,1,1,1"
            },
            {
                title: [{ text: "你在这一轮的收益为:" }],
                options: function (displayData, d) { return [
                    { label: (displayData.p11 - d).toFixed(2), value: "a" },
                    { label: displayData.p21.toFixed(2), value: "b" },
                    { label: displayData.p22.toFixed(2), value: "c" }
                ]; },
                answer: "a"
            }
        ]
    },
    // {
    //   //5
    //   desc: [
    //     { text: "假设其他三个组员都选择" },
    //     {
    //       text: "“在第一阶段等待；无论第一阶段有没有人选1，在第二阶段都选1”",
    //       color: true
    //     },
    //     { text: "", br: 10 },
    //     { text: "如果你选择" },
    //     {
    //       text:
    //         "“在第一阶段等待；如果第一阶段有人选1则在第二阶段选1；第一阶段没有人选1则在第二阶段选2”",
    //       color: true
    //     }
    //   ],
    //   questions: [
    //     {
    //       title: [{ text: "第一阶段的结果是：" }],
    //       options: ["第一阶段有人选1", "第一阶段没有人选1"],
    //       answer: "第一阶段没有人选1"
    //     },
    //     {
    //       title: [{ text: "四个组员的最终选择为：" }],
    //       options: ["1,1,1,1", "1,1,1,2", "2,2,2,2"],
    //       answer: "1,1,1,2"
    //     },
    //     {
    //       title: [{ text: "你在这一轮的收益为:" }],
    //       options: null,
    //       answer: "b"
    //     }
    //   ]
    // },
    // {
    //   //6
    //   desc: [
    //     { text: "假设其他三个组员都选择" },
    //     {
    //       text:
    //         "“在第一阶段等待；如果第一阶段有人选1则在第二阶段选1；第一阶段没有人选1则在第二阶段选2”",
    //       color: true
    //     },
    //     { text: "", br: 10 },
    //     { text: "如果你选择" },
    //     { text: "“在第一阶段选1”", color: true }
    //   ],
    //   questions: [
    //     {
    //       title: [{ text: "第一阶段的结果是：" }],
    //       options: ["第一阶段有人选1", "第一阶段没有人选1"],
    //       answer: "第一阶段有人选1"
    //     },
    //     {
    //       title: [{ text: "四个组员的最终选择为：" }],
    //       options: ["1,1,1,1", "1,1,1,2", "2,2,2,2"],
    //       answer: "1,1,1,1"
    //     },
    //     {
    //       title: [{ text: "你在这一轮的收益为:" }],
    //       options: null,
    //       answer: "a"
    //     }
    //   ]
    // },
    {
        //6new
        desc: [
            { text: "假设其他三个组员都选择" },
            {
                text: "“在第一阶段等待；如果第一阶段有人选1则在第二阶段选1；第一阶段没有人选1则在第二阶段选2”",
                color: true
            },
            { text: "", br: 10 },
            { text: "如果你选择" },
            {
                text: "“在第一阶段等待；如果第一阶段有人选1则在第二阶段选1；第一阶段没有人选1则在第二阶段选2”",
                color: true
            }
        ],
        questions: [
            {
                title: [{ text: "第一阶段的结果是：" }],
                options: ["第一阶段有人选1", "第一阶段没有人选1"],
                answer: "第一阶段没有人选1"
            },
            {
                title: [{ text: "四个组员的最终选择为：" }],
                options: ["1,1,1,1", "1,2,2,2", "2,2,2,2"],
                answer: "2,2,2,2"
            },
            {
                title: [{ text: "你在这一轮的收益为:" }],
                options: function (displayData, d) { return [
                    { label: (displayData.p11 - d).toFixed(2), value: "a" },
                    { label: displayData.p21.toFixed(2), value: "b" },
                    { label: displayData.p22.toFixed(2), value: "c" }
                ]; },
                answer: "c"
            }
        ]
    }
];
exports.Survey = [
    {
        title: "你的专业",
        options: [
            "人文社科(经济类除外)",
            "理工科",
            "经济/商科",
            "医学",
            "艺术",
            "其他"
        ]
    },
    {
        title: "你的年龄"
    },
    {
        title: "你的年级",
        options: ["大一", "大二", "大三", "大四", "硕士研究生", "博士研究生"]
    },
    {
        title: "你现在的家庭住址所在省份",
        options: provinces_1.default.map(function (p) { return p.pname; })
    },
    {
        title: "你的性别",
        options: ["男", "女"]
    }
];
