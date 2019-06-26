import {
    INewRobotParams,
    ISocketHandshakeQuery,
    SocketEvent,
    UnixSocketEvent
} from 'bespoke-core-share'
import {SocketEmitter} from 'bespoke-server-util'
import {BaseRobot} from './BaseRobot'

export {BaseRobot}

export class RobotServer {
    static start(namespace: string, Robot:new(...args) => BaseRobot<any, any, any, any, any, any, any>) {
        new SocketEmitter(namespace)
            .on(UnixSocketEvent.newRobot, async ({id, actor, game}: INewRobotParams) => {
                const connection = new SocketEmitter(namespace)
                connection.emit(SocketEvent.connection, {
                    id,
                    gameId: game.id,
                    token: actor.token
                } as ISocketHandshakeQuery)
                //TODO connection ack 后 init()
                setTimeout(async () => await new Robot(game, actor, connection).init(), 1e3)
            })
            .emit(UnixSocketEvent.mainConnection)
    }
}
