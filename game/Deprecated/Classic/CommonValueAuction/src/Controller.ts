import { BaseController, IActor, IMoveCallback, TGameState, TPlayerState } from '@bespoke/server'
import { ICreateParams, IGameState, IPlayerState, IPushParams, IMoveParams, GameState } from './interface'
import { MoveType, PushType, NEW_ROUND_TIMER, PlayerStatus } from './config'

export default class Controller extends BaseController<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams
> {
  initGameState(): TGameState<IGameState> {
    const gameState = super.initGameState()
    gameState.groups = []
    return gameState
  }

  async initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
    const {
      game: {
        params: { round }
      }
    } = this
    const playerState = await super.initPlayerState(actor)
    playerState.prices = Array(round).fill(null)
    playerState.profits = Array(round).fill(0)
    return playerState
  }

  protected async playerMoveReducer(
    actor: IActor,
    type: string,
    params: IMoveParams,
    cb: IMoveCallback
  ): Promise<void> {
    const {
      game: {
        params: { groupSize, round, positions, mode, winnerNumber }
      }
    } = this
    const playerState = await this.stateManager.getPlayerState(actor),
      gameState = await this.stateManager.getGameState(),
      playerStates = await this.stateManager.getPlayerStates()
    switch (type) {
      case MoveType.getPosition:
        if (playerState.groupIndex !== undefined) {
          break
        }
        let groupIndex = gameState.groups.findIndex(({ playerNum }) => playerNum < groupSize)
        if (groupIndex === -1) {
          const group: GameState.IGroup = {
            roundIndex: 0,
            playerNum: 0,
            rounds: Array(round)
              .fill(null)
              .map<GameState.Group.IRound>((_, i) => ({
                playerStatus: Array(groupSize).fill(i === 0 ? PlayerStatus.outside : PlayerStatus.prepared)
              }))
          }
          groupIndex = gameState.groups.push(group) - 1
        }
        playerState.groupIndex = groupIndex
        playerState.positionIndex = gameState.groups[groupIndex].playerNum++
        playerState.privatePrices = positions[playerState.positionIndex].privatePrice
        break
      case MoveType.shout: {
        const { groupIndex, positionIndex } = playerState,
          groupState = gameState.groups[groupIndex],
          { rounds, roundIndex } = groupState,
          { playerStatus } = rounds[roundIndex],
          groupPlayerStates = Object.values(playerStates).filter(s => s.groupIndex === groupIndex)
        playerStatus[positionIndex] = PlayerStatus.shouted
        playerState.prices[roundIndex] = params.price
        if (playerStatus.every(status => status === PlayerStatus.shouted)) {
          switch (mode) {
            case 0: {
              const highestSorts = groupPlayerStates.sort((a, b) => b.prices[roundIndex] - a.prices[roundIndex])
              highestSorts.map((p, i) => {
                if (i < winnerNumber) {
                  playerStatus[i] = PlayerStatus.won
                  p.profits[roundIndex] = p.privatePrices[roundIndex] - p.prices[roundIndex]
                }
              })
              break
            }
            case 1: {
              let winners = 0
              const prices = groupPlayerStates.map(p => p.prices[roundIndex])
              const median = (prices[(prices.length - 1) >> 1] + prices[prices.length >> 1]) / 2
              groupPlayerStates.map((p, i) => {
                if (p.prices[roundIndex] > median && winners < winnerNumber) {
                  winners++
                  playerStatus[i] = PlayerStatus.won
                  p.profits[roundIndex] = p.privatePrices[roundIndex] - p.prices[roundIndex]
                }
              })
              break
            }
            default:
              break
          }
          await this.stateManager.syncState()
          if (roundIndex == rounds.length - 1) {
            for (const i in playerStatus) playerStatus[i] = PlayerStatus.gameOver
            await this.stateManager.syncState()
            return
          }
          let newRoundTimer = 1
          const newRoundInterval = global.setInterval(async () => {
            groupPlayerStates.forEach(({ actor }) =>
              this.push(actor, PushType.newRoundTimer, {
                roundIndex,
                newRoundTimer
              })
            )
            if (newRoundTimer++ < NEW_ROUND_TIMER) {
              return
            }
            global.clearInterval(newRoundInterval)
            groupState.roundIndex++
            await this.stateManager.syncState()
          }, 1000)
        }
      }
    }
  }
}
