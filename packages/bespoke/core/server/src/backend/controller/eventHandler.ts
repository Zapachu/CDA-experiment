import {baseEnum, IEventHandler, IConnection, TOnlineCallback, IMoveCallback} from 'bespoke-common'
import {GameLogic} from '../service/GameLogic'

export const EventHandler = {
    [baseEnum.SocketEvent.online]: async (connection: IConnection, onlineCallback: TOnlineCallback = () => null) => {
        const {game, actor} = connection,
            controller = await GameLogic.getGameController(game.id)
        onlineCallback(actor)
        connection.join(game.id)
        controller.connections.set(actor.token, connection)
        if (actor.type === baseEnum.Actor.owner) {
            const gameState = await controller.stateManager.getGameState()
            gameState.connectionId = connection.id
            await controller.stateManager.syncState(true)
        } else {
            const playerState = await controller.stateManager.getPlayerState(actor)
            playerState.connectionId = connection.id
            await controller.stateManager.syncWholeState2Player(actor)
        }
    },

    [baseEnum.SocketEvent.disconnect]: async ({game, actor}: IConnection) => {
        const {stateManager} = await GameLogic.getGameController(game.id)
        if (actor.type === baseEnum.Actor.owner) {
            const gameState = await stateManager.getGameState()
            gameState.connectionId = ''
        } else {
            const playerState = await stateManager.getPlayerState(actor)
            playerState.connectionId = ''
        }
        await stateManager.syncState()
    },

    [baseEnum.SocketEvent.move]: async ({actor, game}: IConnection, type: string, params: {}, cb?: IMoveCallback) => {
        const controller = await GameLogic.getGameController(game.id)
        await controller.moveReducer(actor, type, params, cb || (() => null))
    }
} as { [s: string]: IEventHandler }
