import { IPlayer, match } from './Match'
import shuffle = require('lodash/shuffle')

test('Match', () => {
  for (let i = 20; i < 50; i++) {
    const groupSize = i
    let players: IPlayer[]
    players = shuffle(
      Array(groupSize)
        .fill(null)
        .map((_, i) => {
          const old = Math.random() > 0.5,
            leave = old && Math.random() > 0.5
          return {
            good: old ? i : null,
            sort: leave
              ? []
              : shuffle(
                  Array(groupSize)
                    .fill(null)
                    .map((_, i) => i)
                )
          }
        })
    )
    const result = match(players)
    expect(result.sort((m, n) => m - n).toString()).toBe(
      Array(groupSize)
        .fill(null)
        .map((_, i) => i)
        .toString()
    )
  }
})
