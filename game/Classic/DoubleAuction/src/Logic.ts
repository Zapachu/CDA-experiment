import { Group } from '@extend/server'
import { IActor, IMoveCallback, IUserWithId } from '@bespoke/share'
import { GroupDecorator } from '@extend/share'
import { Model } from '@bespoke/server'
import {
  ICreateParams,
  IGameRoundState,
  IGameState,
  IMoveParams,
  IPlayerRoundState,
  IPlayerState,
  IPushParams,
  MoveType,
  PlayerRoundStatus,
  PlayerStatus,
  PushType,
  Role
} from './config'

class GroupLogic extends Group.Group.Logic<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams
> {
  private static privatePrice([min, max]: [number, number]) {
    return ~~(min + Math.random() * (max - min))
  }

  initGameState(): IGameState {
    const gameState = super.initGameState()
    gameState.rounds = []
    return gameState
  }

  async initPlayerState(user: IUserWithId, index: number): Promise<GroupDecorator.TPlayerState<IPlayerState>> {
    const playerState = await super.initPlayerState(user, index)
    playerState.status = PlayerStatus.guide
    playerState.rounds = []
    return playerState
  }

  async startRound(r: number) {
    const { round, buyPriceRange, sellPriceRange } = this.params
    if (r >= round) {
      return
    }
    const gameState = await this.stateManager.getGameState(),
      playerStates = await this.stateManager.getPlayerStates()
    gameState.round = r
    const gameRoundState: IGameRoundState = {
      timeLeft: this.params.t,
      shouts: Array(this.groupSize).fill(null),
      trades: []
    }
    gameState.rounds[r] = gameRoundState
    Object.values(playerStates).forEach(
      ({ role, rounds }) =>
        (rounds[r] = {
          status: PlayerRoundStatus.play,
          profit: 0,
          privatePrice: GroupLogic.privatePrice(role === Role.buyer ? buyPriceRange : sellPriceRange)
        })
    )
    await this.stateManager.syncState()
    const timer = global.setInterval(async () => {
      if (gameState.round > r) {
        global.clearInterval(timer)
      }
      if (gameRoundState.timeLeft <= 1) {
        this.roundOver()
        global.clearInterval(timer)
      }
      gameRoundState.timeLeft--
      await this.stateManager.syncState()
    }, 1e3)
  }

  async getState(): Promise<{
    gameState: IGameState
    gameRoundState: IGameRoundState
    playerStatesArr: GroupDecorator.TPlayerState<IPlayerState>[]
    playerRoundStates: IPlayerRoundState[]
  }> {
    const gameState = await this.stateManager.getGameState(),
      { round } = gameState,
      gameRoundState = gameState.rounds[round],
      playerStates = await this.stateManager.getPlayerStates(),
      playerStatesArr = Object.values<GroupDecorator.TPlayerState<IPlayerState>>(playerStates).sort(
        (p1, p2) => p1.index - p2.index
      ),
      playerRoundStates = playerStatesArr.map(({ rounds }) => rounds[round])
    return {
      gameState,
      gameRoundState,
      playerStatesArr,
      playerRoundStates
    }
  }

  async roundOver() {
    const { gameState, playerStatesArr, playerRoundStates, gameRoundState } = await this.getState()
    playerRoundStates.forEach(p => (p.status = PlayerRoundStatus.result))
    await this.stateManager.syncState()
    global.setTimeout(async () => {
      gameState.round < this.params.round - 1
        ? this.startRound(gameState.round + 1)
        : playerStatesArr.forEach(p => (p.status = PlayerStatus.result))
      await this.stateManager.syncState()
    }, 5e3)
    await Model.FreeStyleModel.create({
      game: this.gameId,
      key: `${this.groupIndex}_${gameState.round}`,
      data: gameRoundState.shouts
    })
  }

  async playerMoveReducer(actor: IActor, type: MoveType, params: IMoveParams, cb: IMoveCallback): Promise<void> {
    const { groupSize } = this
    const playerState = await this.stateManager.getPlayerState(actor),
      { gameState, playerStatesArr, playerRoundStates } = await this.getState(),
      { round } = gameState,
      gameRoundState = gameState.rounds[round],
      playerRoundState = playerState.rounds[round]
    switch (type) {
      case MoveType.guideDone: {
        playerState.status = PlayerStatus.round
        playerState.role = playerState.index % 2 ? Role.buyer : Role.seller
        if (playerStatesArr.length === groupSize && playerStatesArr.every(p => p.status === PlayerStatus.round)) {
          this.startRound(0)
        }
        break
      }
      case MoveType.shout: {
        const { index: myIndex, role: myRole } = playerState
        const { shouts, trades } = gameRoundState
        let myShout = shouts[myIndex]
        if (myShout) {
          break
        } else {
          playerRoundState.status = PlayerRoundStatus.wait
        }
        myShout = {
          price: params.price,
          role: myRole,
          tradePair: null
        }
        shouts[myIndex] = myShout
        const pairShoutIndex = shouts.findIndex(shout => {
          if (!shout || shout.role === myShout.role || shout.tradePair !== null) {
            return false
          }
          return myShout.role === Role.seller ? shout.price >= myShout.price : shout.price <= myShout.price
        })
        if (pairShoutIndex === -1) {
          break
        }
        myShout.tradePair = pairShoutIndex
        shouts[pairShoutIndex].tradePair = myIndex
        const newTrade = {
          reqIndex: pairShoutIndex,
          resIndex: playerState.index,
          price: shouts[pairShoutIndex].price
        }
        trades.push(newTrade)
        const pairRoundState = playerRoundStates[pairShoutIndex]
        playerRoundState.profit = Math.abs(playerRoundState.privatePrice - newTrade.price)
        pairRoundState.profit = Math.abs(pairRoundState.privatePrice - newTrade.price)
        if (gameRoundState.shouts.every(s => s)) {
          this.roundOver()
        }
        break
      }
    }
  }
}

export class Logic extends Group.Logic<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams
> {
  GroupLogic = GroupLogic
}
