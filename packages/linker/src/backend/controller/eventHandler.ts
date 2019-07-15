import {SocketEvent} from 'linker-share'
import {IConnection, IEventHandler} from './eventDispatcher'
import {StateManager} from '../service'
import {Actor} from '@elf/share'

export const EventHandler = {
    [SocketEvent.joinRoom]: async (connection: IConnection) => {
        const {actor, game} = connection,
            stateManager = await StateManager.getManager(game.id)
        connection.join(game.id)
        if (actor.type !== Actor.owner) {
            await stateManager.joinRoom(actor)
        }
        stateManager.broadcastState()
    }
} as { [s: string]: IEventHandler }
