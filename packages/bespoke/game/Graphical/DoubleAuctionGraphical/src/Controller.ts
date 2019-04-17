import {BaseController, IActor, IMoveCallback, TGameState, TPlayerState} from "bespoke-server"
import {ICreateParams, IGameState, IPlayerState, IPushParams, IMoveParams} from "./interface"
import {MoveType, PushType, FetchType, PlayerStatus} from './config'
import {GameState} from "./interface"

export default class Controller extends BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> {
    initGameState(): TGameState<IGameState> {
        const gameState = super.initGameState()
        gameState.groups = []
        return gameState
    }

    async initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
        const {game: {params: {round}}} = this
        const playerState = await super.initPlayerState(actor)
        playerState.prices = Array(round).fill(null)
        playerState.profits = Array(round).fill(0)
        return playerState
    }

    protected async playerMoveReducer(actor: IActor, type: string, params: IMoveParams, cb: IMoveCallback): Promise<void> {
        const {game: {params: {groupSize, round, positions}}} = this
        const playerState = await this.stateManager.getPlayerState(actor),
            gameState = await this.stateManager.getGameState(),
            playerStates = await this.stateManager.getPlayerStates()
        switch (type) {
            case MoveType.getPosition:
                if (playerState.groupIndex !== undefined) {
                    break
                }
                let groupIndex = gameState.groups.findIndex(({playerNum}) => playerNum < groupSize)
                if (groupIndex === -1) {
                    const group: GameState.IGroup = {
                        roundIndex: 0,
                        playerNum: 0,
                        rounds: Array(round).fill(null).map<GameState.Group.IRound>(() => ({
                            playerStatus: Array(groupSize).fill(PlayerStatus.outside)
                        }))
                    }
                    groupIndex = gameState.groups.push(group) - 1
                }
                playerState.groupIndex = groupIndex
                playerState.positionIndex = gameState.groups[groupIndex].playerNum++
                playerState.role = positions[playerState.positionIndex].role
                playerState.privatePrices = positions[playerState.positionIndex].privatePrice
                break
            case MoveType.prepare: {
                const {groupIndex, positionIndex} = playerState
                const {rounds, roundIndex} = gameState.groups[groupIndex]
                rounds[roundIndex].playerStatus[positionIndex] = PlayerStatus.prepared
                break
            }
            case MoveType.shout: {
                console.log(playerStates)
                // TODO Timer to Next Round
                break
            }
            case MoveType.deal: {
                // TODO Status to dealed
                break
            }
        }
    }
}
