export enum GameTypes {
  IPO_Median,
  IPO_TopK,
  IPO_FPSBA,
  OpenAuction,
  TBM,
  CBM,
  CBM_Leverage
}

export interface UserDoc {
  updateAt: number;
  createAt: number;
  unionId: string,
  phaseScore: Array<number>
}

export enum UserGameStatus {
  beforeStart,
  waittingMatch,
  started,
  end
}

export enum ResCode {
  success = 0,
  unexpectError = -1
}

export enum serverSocketListenEvents {
  reqStartGame = 'reqStartGame',
  leaveMatchRoom = 'leaveMatchRoom'
}

export enum clientSocketListenEvnets {
  startMatch = 'startMatch',
  startGame = 'startGame',
  continueGame = 'continueGame',
  handleError = 'handleError'
}
