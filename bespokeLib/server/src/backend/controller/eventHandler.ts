import {Actor, IConnection, IEventHandler, IMoveCallback, SocketEvent, TOnlineCallback} from '@bespoke/share'
import {BaseLogic} from '../service'

export const EventHandler = {
    [SocketEvent.online]: async (connection: IConnection, onlineCallback: TOnlineCallback = () => null) => {
        const {game, actor} = connection,
            controller = await BaseLogic.getLogic(game.id)
        onlineCallback(actor)
        connection.join(game.id)
        controller.connections.set(actor.token, connection)
        if (actor.type === Actor.owner) {
            const gameState = await controller.stateManager.getGameState()
            gameState.connectionId = connection.id
            await controller.stateManager.syncState(true)
        } else {
            const playerState = await controller.stateManager.getPlayerState(actor)
            playerState.connectionId = connection.id
            await controller.stateManager.syncWholeState2Player(actor)
        }
    },

    [SocketEvent.disconnect]: async ({game, actor}: IConnection) => {
        const {stateManager} = await BaseLogic.getLogic(game.id)
        if (actor.type === Actor.owner) {
            const gameState = await stateManager.getGameState()
            gameState.connectionId = ''
        } else {
            const playerState = await stateManager.getPlayerState(actor)
            playerState.connectionId = ''
        }
        await stateManager.syncState()
    },

    [SocketEvent.move]: async ({actor, game}: IConnection, type: string, params: {}, cb?: IMoveCallback) => {
        const controller = await BaseLogic.getLogic(game.id)
        await controller.moveReducer(actor, type, params, cb || (() => null))
    }
} as { [s: string]: IEventHandler }
