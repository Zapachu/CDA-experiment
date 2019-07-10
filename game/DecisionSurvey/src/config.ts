export const namespace = "DecisionSurvey";

export enum MoveType {
  join = "join",
  shout = "shout",
  result = "result",
  back = "back",
  checkVersion = "checkVersion",
  info = "info",
  random = "random",
  //teacher
  dealCard = "dealCard"
}

export enum PushType {
  robotShout,
  shoutTimer
}

export interface ICreateParams {}

export interface IMoveParams {
  card1: CARD;
  card2: CARD;
  answer: Array<string>;
  decision: DECISION;
  gender: GENDER;
  age: string;
  institute: string; //专业
  name: string;
  grade: string;
  randomKey: string;
}

export interface IPushParams {
  shoutTime: number;
}

export interface IGameState {
  card1: CARD;
  card2: CARD;
}

export enum DATE {
  jul5 = "7月11日",
  aug4 = "8月10日",
  oct13 = "10月19日",
  nov12 = "11月18日"
}

export interface IPlayerState {
  mobile: string;
  answer: {
    [decision: string]: Array<string>;
  };
  pair: string;
  extraPair: string;
  info: {
    gender: GENDER;
    age: string;
    institute: string;
    grade: string;
    name: string;
  };
  profit: {
    [DATE.jul5]: number;
    [DATE.aug4]: number;
    [DATE.oct13]: number;
    [DATE.nov12]: number;
  };
  profit14: {
    [DATE.jul5]: number;
    [DATE.aug4]: number;
    [DATE.oct13]: number;
    [DATE.nov12]: number;
  };
  profit56: {
    [DATE.jul5]: number;
    [DATE.aug4]: number;
    [DATE.oct13]: number;
    [DATE.nov12]: number;
  };
  profitDecision14: DECISION;
  profitDecision56: DECISION; //计算收益使用的决策
  won56: boolean; //56题是否抽中了自己
  random56: DECISION;
  random100: number;
}

export const SHOUT_TIMER = 60;

export enum FetchRoute {
  exportXls = "/exportXls/:gameId:",
  exportXlsPlaying = "/exportXlsPlaying/:gameId",
  getUserMobile = "/getUserMobile/:gameId"
}

export enum SheetType {
  result = "result"
}

export enum DECISION {
  one = "1",
  two = "2",
  three = "3",
  four = "4",
  five = "5",
  six = "6"
}

export enum CARD {
  red = "红色",
  black = "黑色"
}

export enum GENDER {
  male = "男",
  female = "女"
}

export const PAGE = {
  [DECISION.one]: {
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
        title:
          "同时请选择你猜测的颜色（问卷结束时，我们将现场抽牌，根据你猜测的颜色，决定你的最终收益）",
        options: [
          { label: "黑色", value: CARD.black },
          { label: "红色", value: CARD.red }
        ]
      }
    ],
    required: ["answer", "card"]
  },
  [DECISION.two]: {
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
        title:
          "同时请选择你猜测的颜色（问卷结束时，我们将现场抽牌，根据你猜测的颜色，决定你的最终收益）",
        options: [
          { label: "黑色", value: CARD.black },
          { label: "红色", value: CARD.red }
        ]
      }
    ],
    required: ["answer", "card"]
  },
  [DECISION.three]: {
    questions: [
      {
        title: `考虑如下两个时间点，今天（${DATE.jul5}）和三十天以后（${
          DATE.aug4
        }），在两个时间点上你可以分别获取一定的收益，请在以下的收益组合中选取一项：`,
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
  [DECISION.four]: {
    questions: [
      {
        title: `考虑如下两个时间点，一百天以后（${
          DATE.oct13
        }）和一百三十天以后（${
          DATE.nov12
        }），在两个时间点上你可以分别获取一定的收益，请在以下的收益组合中选取一项：`,
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
  [DECISION.five]: {
    questions: [
      {
        title:
          "考虑甲乙双方，甲方是你自己，乙方为随机与你配对的另外一个匿名调查员。请在以下的收益组合中选择一项：",
        options: [
          { label: "甲方获得13，乙方获得5.5", value: "13:5.5" },
          { label: "甲方获得12，乙方获得8.5", value: "12:8.5" },
          { label: "甲方获得11，乙方获得10", value: "11:10" }
        ]
      }
    ],
    required: ["answer"]
  },
  [DECISION.six]: {
    questions: [
      {
        title:
          "考虑甲乙双方，甲方是你自己，乙方为随机与你配对的另外一个匿名调查员。请在以下的收益组合中选择一项：",
        options: [
          { label: "甲方获得8，乙方获得15", value: "8:15" },
          { label: "甲方获得9，乙方获得12", value: "9:12" },
          { label: "甲方获得10，乙方获得10.5", value: "10:10.5" }
        ]
      }
    ],
    required: ["answer"]
  }
};
