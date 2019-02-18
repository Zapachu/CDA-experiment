import {baseEnum, NFrame} from '@common'
import {IEventHandler, IConnection} from './eventDispatcher'
import {GroupStateService} from '@server-service'
import {Actor} from '../../common/baseEnum'

export const EventHandler = {
    [baseEnum.SocketEvent.upFrame]: async (connection: IConnection, frame: NFrame.UpFrame, data: {}, cb?: () => void) => {
        const {actor, group} = connection,
            groupService = await GroupStateService.getService(group.id)
        switch (frame) {
            case NFrame.UpFrame.joinRoom: {
                connection.join(group.id)
                if(actor.type !== Actor.owner){
                    await groupService.joinGroupRoom(actor.token)
                }
                break
            }
        }
        groupService.broadcastState()
    }
} as { [s: string]: IEventHandler }