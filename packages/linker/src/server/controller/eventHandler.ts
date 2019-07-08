import {NFrame, SocketEvent} from '@common'
import {IConnection, IEventHandler} from './eventDispatcher'
import {StateManager} from '@server-service'
import {Actor} from '@elf/share'

export const EventHandler = {
    [SocketEvent.upFrame]: async (connection: IConnection, frame: NFrame.UpFrame, data: {}, cb?: () => void) => {
        const {actor, game} = connection,
            stateManager = await StateManager.getManager(game.id)
        switch (frame) {
            case NFrame.UpFrame.joinRoom: {
                connection.join(game.id)
                if (actor.type !== Actor.owner) {
                    await stateManager.joinRoom(actor)
                }
                break
            }
        }
        stateManager.broadcastState()
    }
} as { [s: string]: IEventHandler }
