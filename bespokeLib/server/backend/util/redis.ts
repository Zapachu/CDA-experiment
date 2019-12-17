import { NationCode } from '@bespoke/share'

export const RedisKey = {
  verifyCodeSendTimes: (nationCode: NationCode, phoneNumber: string) =>
    `verifyCodeSendTimes:${nationCode}:${phoneNumber}`,
  verifyCode: (nationCode: NationCode, phoneNumber: string) => `verifyCode:${nationCode}:${phoneNumber}`,
  share_GameCode: (gameId: string) => `shareCode:${gameId}`,
  share_CodeGame: (code: string) => `shareCodeMapping:${code}`,
  gameState: (gameId: string) => `gameState:${gameId}`,
  playerState: (gameId: string, token: string) => `playerState:${gameId}:${token}`,
  playerStates: (gameId: string) => `playerState:${gameId}:*`,
  gameServer: (namespace: string) => `bespokeGameServer:${namespace}`
}
