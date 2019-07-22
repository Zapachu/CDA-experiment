export const namespace = "GarbageSorting";

export enum MoveType {
  prepare = "prepare",
  check = "check",
  shout = "shout",
  back = "back"
}

export enum PushType {
  robotShout,
  shoutTimer
}

export interface ICreateParams {
  groupSize: number;
}

export interface IMoveParams {
  answer: GARBAGE;
  index: number;
  onceMore: boolean;
}

export interface IPushParams {
  shoutTimer: number;
}

export interface IGameState {
  sortedPlayers: Array<{
    score: number;
    img?: string;
  }>;
  averageScore: number;
}

export interface IPlayerState {
  score: number;
  answers: Array<GARBAGE>;
}

export const SHOUT_TIMER = 10;

export enum GARBAGE {
  pass = 1,
  recyclable,
  dry,
  wet,
  hazardous
}

export const GARBAGE_LABEL = {
  [GARBAGE.pass]: "懒得分类",
  [GARBAGE.recyclable]: "可回收垃圾",
  [GARBAGE.dry]: "干垃圾",
  [GARBAGE.wet]: "湿垃圾",
  [GARBAGE.hazardous]: "有害垃圾"
};

export const ITEMS = [
  { img: "umbrella" },
  { img: "umbrella" },
  { img: "umbrella" },
  { img: "umbrella" },
  { img: "umbrella" },
  { img: "umbrella" },
  { img: "umbrella" },
  { img: "umbrella" },
  { img: "umbrella" },
  { img: "umbrella" }
];

export const TOTAL_SCORE = 200;
