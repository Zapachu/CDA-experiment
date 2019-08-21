import {Phase} from '@bespoke-game/stock-trading-config'

export {Phase as GameTypes}

export interface UserDoc {
  updateAt: number;
  createAt: number;
  unionId: string,
  unblockGamePhase?: Phase
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
