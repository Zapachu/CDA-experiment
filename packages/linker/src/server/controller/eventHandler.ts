import {baseEnum, NFrame} from '@common'
import {IEventHandler, IConnection} from './eventDispatcher'
import {StateManager} from '@server-service'
import {Actor} from '../../common/baseEnum'

export const EventHandler = {
    [baseEnum.SocketEvent.upFrame]: async (connection: IConnection, frame: NFrame.UpFrame, data: {}, cb?: () => void) => {
        const {actor, game} = connection,
            stateManager = await StateManager.getManager(game.id)
        switch (frame) {
            case NFrame.UpFrame.joinRoom: {
                connection.join(game.id)
                if(actor.type !== Actor.owner){
                    await stateManager.joinRoom(actor)
                }
                break
            }
        }
        stateManager.broadcastState()
    }
} as { [s: string]: IEventHandler }
