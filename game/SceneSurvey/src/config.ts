export const namespace = "SceneSurvey";

export enum MoveType {
  prepare = "prepare",
  shout = "shout",
  info = "info"
}

export enum PushType {}

export interface ICreateParams {}

export interface IMoveParams {
  answer: string;
  index: number;
  key: string;
  name: string;
}

export interface IPushParams {}

export interface IGameState {}

export interface IPlayerState {
  status: STATUS;
  key: string;
  answers: Array<string>;
  name: string;
}

export enum STATUS {
  instruction,
  playing,
  info,
  end
}

export enum FetchRoute {
  exportXls = "/exportXls/:gameId:",
  exportXlsPlaying = "/exportXlsPlaying/:gameId",
  getUserMobile = "/getUserMobile/:gameId"
}

export enum SheetType {
  result = "result"
}

export const PAGES = [
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
