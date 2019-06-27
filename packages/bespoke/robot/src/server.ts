import {IRobotHandshake, SocketEvent, UnixSocketEvent} from 'bespoke-core-share'
import {SocketEmitter} from 'bespoke-server-util'
import {BaseRobot} from './BaseRobot'

export class RobotServer {
    static start(namespace: string, Robot: new(...args) => BaseRobot<any, any, any, any, any, any, any>) {
        new SocketEmitter(namespace)
            .on(UnixSocketEvent.newRobot, async (robotHandshake: IRobotHandshake) => {
                const connection = new SocketEmitter(namespace)
                connection.emit(SocketEvent.connection, robotHandshake, () =>
                    connection.emit(SocketEvent.online, async () =>
                        await new Robot(robotHandshake.game, robotHandshake.actor, connection).init()
                    )
                )
            })
            .emit(UnixSocketEvent.daemonConnection)
    }
}
