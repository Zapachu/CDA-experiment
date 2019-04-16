import {BaseController, IActor, IMoveCallback, TGameState, IGameWithId} from 'bespoke-server'
import {ICreateParams, IGameState, IPlayerState, IPushParams, IMoveParams, GameState} from './interface'
import {MoveType, PushType, FetchType} from './config'
import cloneDeep = require('lodash/cloneDeep')

export default class Controller extends BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> {

    initGameState(): TGameState<IGameState> {
        const gameState = super.initGameState()
        gameState.groups = []
        return gameState
    }

    getGame4Player(): IGameWithId<ICreateParams> {
        const game = cloneDeep(this.game)
        game.params.groupPPs = []
        return game
    }

    protected async playerMoveReducer(actor: IActor, type: string, params: IMoveParams, cb: IMoveCallback): Promise<void> {
        const {game: {params: {group, groupSize, groupPPs}}} = this
        const playerState = await this.stateManager.getPlayerState(actor),
            gameState = await this.stateManager.getGameState()
        switch (type) {
            case MoveType.getPosition: {
                if (playerState.groupIndex !== undefined) {
                    break
                }
                let groupIndex = gameState.groups.findIndex(({playerNum}) => playerNum < groupSize)
                if (groupIndex === -1) {
                    const newGroup: GameState.IGroup = {
                        roundIndex: 0,
                        playerNum: 0
                    }
                    if (gameState.groups.length >= group) {
                        break
                    }
                    groupIndex = gameState.groups.push(newGroup) - 1
                }
                playerState.groupIndex = groupIndex
                playerState.positionIndex = gameState.groups[groupIndex].playerNum++
                playerState.rounds = groupPPs[groupIndex].roundPPs.map(
                    ({playerPPs}) => {
                        const {privatePrices} = playerPPs[playerState.positionIndex]
                        return {privatePrices}
                    }
                )
                break
            }
        }
    }
}
