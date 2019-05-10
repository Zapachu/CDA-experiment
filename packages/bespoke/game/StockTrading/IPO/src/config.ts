export const namespace = "IPO";

export enum MoveType {
  startSinglePlayer = "startSinglePlayer",
  shout = "shout",
  startMultiPlayer = "startMultiPlayer",
  nextGame = "nextGame",
  replay = "replay"
}

export enum PushType {
  matchTimer,
  matchMsg,
  robotShout
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
    name: "中国联通",
    contractor: "中国国际金融有限公司",
    startDate: "2019/05/05",
    endDate: "2019/05/05"
  },
  {
    code: "600050",
    name: "中国联通",
    contractor: "中国国际金融有限公司",
    startDate: "2019/05/05",
    endDate: "2019/05/05"
  },
  {
    code: "600050",
    name: "中国联通",
    contractor: "中国国际金融有限公司",
    startDate: "2019/05/05",
    endDate: "2019/05/05"
  },
  {
    code: "600050",
    name: "中国联通",
    contractor: "中国国际金融有限公司",
    startDate: "2019/05/05",
    endDate: "2019/05/05"
  },
  {
    code: "600050",
    name: "中国联通",
    contractor: "中国国际金融有限公司",
    startDate: "2019/05/05",
    endDate: "2019/05/05"
  },
  {
    code: "600050",
    name: "中国联通",
    contractor: "中国国际金融有限公司",
    startDate: "2019/05/05",
    endDate: "2019/05/05"
  },
  {
    code: "600050",
    name: "中国联通",
    contractor: "中国国际金融有限公司",
    startDate: "2019/05/05",
    endDate: "2019/05/05"
  },
  {
    code: "600050",
    name: "中国联通",
    contractor: "中国国际金融有限公司",
    startDate: "2019/05/05",
    endDate: "2019/05/05"
  },
  {
    code: "600050",
    name: "中国联通",
    contractor: "中国国际金融有限公司",
    startDate: "2019/05/05",
    endDate: "2019/05/05"
  },
  {
    code: "600050",
    name: "中国联通",
    contractor: "中国国际金融有限公司",
    startDate: "2019/05/05",
    endDate: "2019/05/05"
  }
];
