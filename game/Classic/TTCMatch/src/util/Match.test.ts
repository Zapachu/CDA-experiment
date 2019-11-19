import { IPlayer, match } from './Match'
import shuffle = require('lodash/shuffle')

test('Match', () => {
  for (let groupSize = 20; groupSize < 50; groupSize++) {
    let players: IPlayer[]
    players = shuffle(
      Array(groupSize)
        .fill(null)
        .map((_, good) => {
          return {
            good,
            sort:
              Math.random() > 0.5
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
