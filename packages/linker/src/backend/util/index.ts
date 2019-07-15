export const RedisKey = {
    share_GameCode: (gameId: string) => `shareGameCode:${gameId}`,
    share_CodeGame: (code: string) => `shareCodeGame:${code}`
}
