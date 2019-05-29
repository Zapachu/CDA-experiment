import provinces from "./provinces";

export const namespace = "ShanghaiNY";

export enum Stage {
  Seat,
  Test,
  Main,
  Survey,
  End
}

export enum GameType {
  T1 = 1,
  T2 = 2
}

export enum Choice {
  Wait = -1,
  One = 1,
  Two = 2
}

export enum Version {
  V1 = 1,
  V2,
  V3
}

export enum MainStageIndex {
  Choose = 0,
  Wait4Result,
  Result
}

export enum TestStageIndex {
  Interface = -1,
  Next = -2,
  Wait4Others = -3
}

export enum MoveType {
  //player
  initPosition = "initPosition",
  inputSeatNumber = "inputSeatNumber",
  answerTest = "answerTest",
  answerMain = "answerMain",
  advanceRoundIndex = "advanceRoundIndex",
  answerSurvey = "answerSurvey",
  toMain = "toMain",
  //owner
  startTest = "startTest",
  // assignPosition = 'assignPosition',
  // openMarket = 'openMarket',
  //elf
  sendBackPlayer = "sendBackPlayer"
}

export enum SheetType {
  result = "result"
}

export enum PushType {}

export enum FetchType {
  exportXls = "exportXls",
  exportXlsPlaying = "exportXlsPlaying",
  getUserMobile = "getUserMobile",
  getOrgCode = "getOrgCode"
}

export const Test1 = [
  {
    desc: [
      { text: "假设其他三个组员选择“2, 2, 2”" },
      { text: "", br: 10 },
      { text: "如果你选择“1”" }
    ],
    questions: [
      {
        title: [{ text: "你在这一轮的收益为:" }],
        options: (displayData, d) => [
          { label: (displayData.p11 - d).toFixed(2), value: "a" },
          { label: (displayData.p21 - d).toFixed(2), value: "b" },
          { label: displayData.p22.toFixed(2), value: "c" }
        ],
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
        options: (displayData, d) => [
          { label: (displayData.p11 - d).toFixed(2), value: "a" },
          { label: (displayData.p21 - d).toFixed(2), value: "b" },
          { label: displayData.p22.toFixed(2), value: "c" }
        ],
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
        options: (displayData, d) => [
          { label: (displayData.p11 - d).toFixed(2), value: "a" },
          { label: (displayData.p21 - d).toFixed(2), value: "b" },
          { label: displayData.p22.toFixed(2), value: "c" }
        ],
        answer: "b"
      }
    ]
  }
];

export const Test2 = [
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
            text:
              "“第一阶段有人选1则在第二阶段选1；第一阶段没有人选1则在第二阶段选1”（无论第一阶段有没有人选1，在第二阶段都选1）",
            color: true
          },
          { text: "", br: 0 },
          { text: "你在这一轮的收益为" }
        ],
        options: (displayData, d) => [
          { label: (displayData.p11 - d).toFixed(2), value: "a" },
          { label: displayData.p21.toFixed(2), value: "b" },
          { label: displayData.p22.toFixed(2), value: "c" }
        ],
        answer: "a"
      },
      {
        title: [
          { text: "如果你选择" },
          {
            text:
              "“第一阶段有人选1则在第二阶段选1；第一阶段没有人选1则在第二阶段选2”",
            color: true
          },
          { text: "", br: 0 },
          { text: "你在这一轮的收益为" }
        ],
        options: (displayData, d) => [
          { label: (displayData.p11 - d).toFixed(2), value: "a" },
          { label: displayData.p21.toFixed(2), value: "b" },
          { label: displayData.p22.toFixed(2), value: "c" }
        ],
        answer: "a"
      },
      {
        title: [
          { text: "如果你选择" },
          {
            text:
              "“第一阶段有人选1则在第二阶段选2；第一阶段没有人选1则在第二阶段选2”（无论第一阶段有没有人选1，在第二阶段都选2）",
            color: true
          },
          { text: "", br: 0 },
          { text: "你在这一轮的收益为" }
        ],
        options: (displayData, d) => [
          { label: displayData.p11.toFixed(2), value: "a" },
          { label: displayData.p21.toFixed(2), value: "b" },
          { label: displayData.p22.toFixed(2), value: "c" }
        ],
        answer: "b"
      }
    ]
  },
  {//3new
    desc: [
      { text: "假设你在考虑以下两个选择方案" },
      { text: "", br: 10 },
      { text: "选择方案(A)" },
      { text: '"在第一阶段选1"', color: true },
      { text: "", br: 0 },
      { text: "选择方案(B)" },
      {
        text:
          '"等待，第一阶段有人选1则在第二阶段选1；第一阶段没有人选1则在第二阶段选1"（无论第一阶段有没有人选1，在第二阶段都选1）',
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
        answer: d => (d > 0 ? "a" : "c")
      },
      {
        title: [
          { text: "如果其他三个组员都选择" },
          {
            text:
              '"等待，第一阶段有人选1则在第二阶段选1；第一阶段无人选1则在第二阶段选2"',
            color: true
          },
          { text: "，以下关于你自己的收益的说法正确的是：" }
        ],
        options: [
          { label: "如果你选方案(A)，你获得收益更大", value: "a" },
          { label: "如果你选方案(B)，你获得收益更大", value: "b" },
          { label: "你选方案(A)还是(B)能获得的收益一样大", value: "c" }
        ],
        answer: d => (d > 0 ? "a" : "c")
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
        answer: d => (d > 0 ? "a" : "c")
      }
    ]
  },
  {//4new
    desc: [
      { text: "假设你在考虑以下两个选择方案" },
      { text: "", br: 10 },
      { text: "选择方案(A)" },
      { text: '"在第一阶段选1"', color: true },
      { text: "", br: 0 },
      { text: "选择方案(B)" },
      {
        text:
          '"等待，第一阶段有人选1则在第二阶段选1；第一阶段没有人选1则在第二阶段选1"（无论第一阶段有没有人选1，在第二阶段都选1）',
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
            text:
              '"等待，第一阶段有人选1则在第二阶段选1；第一阶段无人选1则在第二阶段选2"',
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
        text:
          "“在第一阶段等待；如果第一阶段有人选1则在第二阶段选1；第一阶段没有人选1则在第二阶段选2”",
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
        options: (displayData, d) => [
          { label: (displayData.p11-d).toFixed(2), value: "a" },
          { label: displayData.p21.toFixed(2), value: "b" },
          { label: displayData.p22.toFixed(2), value: "c" }
        ],
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
        text:
          "“在第一阶段等待；如果第一阶段有人选1则在第二阶段选1；第一阶段没有人选1则在第二阶段选2”",
        color: true
      },
      { text: "", br: 10 },
      { text: "如果你选择" },
      {
        text:
          "“在第一阶段等待；如果第一阶段有人选1则在第二阶段选1；第一阶段没有人选1则在第二阶段选2”",
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
        options: (displayData, d) => [
          { label: (displayData.p11-d).toFixed(2), value: "a" },
          { label: displayData.p21.toFixed(2), value: "b" },
          { label: displayData.p22.toFixed(2), value: "c" }
        ],
        answer: "c"
      }
    ]
  }
];

export const Survey = [
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
    options: provinces.map(p => p.pname)
  },
  {
    title: "你的性别",
    options: ["男", "女"]
  }
];
