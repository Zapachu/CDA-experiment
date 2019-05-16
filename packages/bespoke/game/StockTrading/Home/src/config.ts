export const namespace = "IPO-Home";

export enum MoveType {
  switchStage = "switchStage"
}

export enum PushType {}

export enum FetchType {}

export enum Stage {
  Home = 0,
  IPO_Median,
  IPO_Top,
  TBM,
  CBM
}

export const phaseLocaleNames = [
  ["IPO中位数定价", "IPO Median"],
  ["IPO最高价前K个", "IPO Top"],
  ["集合竞价", "TBM"],
  ["连续竞价", "CBM"]
];
