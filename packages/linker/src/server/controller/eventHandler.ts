import {baseEnum, NFrame} from '@common'
import {IEventHandler, IConnection} from './eventDispatcher'
import {StateManager} from '@server-service'
import {Actor} from '../../common/baseEnum'

export const EventHandler = {
    [baseEnum.SocketEvent.upFrame]: async (connection: IConnection, frame: NFrame.UpFrame, data: {}, cb?: () => void) => {
        const {actor, group} = connection,
            stateManager = await StateManager.getManager(group.id)
        switch (frame) {
            case NFrame.UpFrame.joinRoom: {
                connection.join(group.id)
                if(actor.type !== Actor.owner){
                    await stateManager.joinGroupRoom(actor)
                }
                break
            }
        }
        stateManager.broadcastState()
    }
} as { [s: string]: IEventHandler }
