export interface IPlayer {
  sort: number[]
}

export function match(players: IPlayer[]): number[] {
  const groupSize = players.length,
    goodAmount = players[0].sort.length
  const good2Player: number[] = Array(goodAmount).fill(null),
    result: number[] = Array(groupSize).fill(null)
  for (let i = 0; i < goodAmount && good2Player.some(p => p === null) && result.some(g => g === null); i++) {
    players.forEach(({ sort }, playerIndex) => {
      if (result[playerIndex] !== null) {
        return
      }
      const good = sort[i],
        goodOwner = good2Player[good]
      if (goodOwner === null || goodOwner > playerIndex) {
        good2Player[good] = playerIndex
        result[goodOwner] = null
        result[playerIndex] = good
      }
    })
  }
  return result
}
