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

export const MATCH_TIMER = 2;
export const SHOUT_TIMER = 60;
export const minA = 30;
export const maxA = 100;
export const minB = 0.6;
export const maxB = 0.7;
export const startingMultiplier = 5000;
export const minNPCNum = 1000;
export const maxNPCNum = 3000;
