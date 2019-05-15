export const namespace = "IPO";

export enum MoveType {
  shout = "shout",
  startMulti = "startMulti",
  nextGame = "nextGame",
  replay = "replay",
  startSingle = "startSingle",
  joinRobot = "joinRobot"
}

export enum PushType {
  matchTimer,
  matchMsg,
  robotShout,
  shoutTimer
}

export enum FetchType {}

export enum PlayerStatus {
  intro,
  matching,
  prepared,
  shouted,
  result
}

export enum IPOType {
  Median = 1,
  TopK
}

export const MATCH_TIMER = 30;
export const SHOUT_TIMER = 90;
export const minA = 30;
export const maxA = 100;
export const minB = 0.6;
export const maxB = 0.7;
export const startingMultiplier = 5000;
export const minNPCNum = 1000;
export const maxNPCNum = 3000;
export const STOCKS = [
  {
    code: "600050",
    name: "沈阳石方",
    contractor: "石方有限公司",
    startDate: "2019/05/05",
    endDate: "2019/05/05"
  },
  {
    code: "600041",
    name: "天津德祥",
    contractor: "德祥建筑工程有限公司",
    startDate: "2019/05/05",
    endDate: "2019/05/05"
  },
  {
    code: "600032",
    name: "北京贵昌",
    contractor: "贵昌股份有限公司",
    startDate: "2019/05/05",
    endDate: "2019/05/05"
  },
  {
    code: "600024",
    name: "南京久多",
    contractor: "久多集团有限公司",
    startDate: "2019/05/05",
    endDate: "2019/05/05"
  },
  {
    code: "600016",
    name: "厦门凯源",
    contractor: "凯源物业管理有限公司",
    startDate: "2019/05/05",
    endDate: "2019/05/05"
  },
  {
    code: "600007",
    name: "广州百亚",
    contractor: "百亚科技有限公司",
    startDate: "2019/05/05",
    endDate: "2019/05/05"
  },
  {
    code: "600069",
    name: "济南广安",
    contractor: "广安咨询管理有限公司",
    startDate: "2019/05/05",
    endDate: "2019/05/05"
  },
  {
    code: "600072",
    name: "厦门泰贵",
    contractor: "泰贵集团股份有限公司",
    startDate: "2019/05/05",
    endDate: "2019/05/05"
  },
  {
    code: "600081",
    name: "广州东恒",
    contractor: "东恒地产开发有限公司",
    startDate: "2019/05/05",
    endDate: "2019/05/05"
  },
  {
    code: "600098",
    name: "上海乾安",
    contractor: "乾安房产经纪有限公司",
    startDate: "2019/05/05",
    endDate: "2019/05/05"
  }
];
