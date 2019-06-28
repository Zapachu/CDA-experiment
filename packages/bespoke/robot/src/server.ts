import {IRobotHandshake, SocketEvent, UnixSocketEvent} from 'bespoke-core-share'
import {IpcConnection} from 'bespoke-server-util'
import {BaseRobot} from './BaseRobot'

export class RobotServer {
    static start(namespace: string, Robot: new(...args) => BaseRobot<any, any, any, any, any, any, any>) {
        IpcConnection.connect(namespace).then(client =>
            client.on(UnixSocketEvent.startRobot, async (robotHandshake: IRobotHandshake, meta) => {
                const connection = await IpcConnection.connect(namespace)
                connection.emit(SocketEvent.connection, robotHandshake, () =>
                    connection.emit(SocketEvent.online, async () =>
                        await new Robot(robotHandshake.game, robotHandshake.actor, connection, meta).init()
                    )
                )
            })
                .emit(UnixSocketEvent.asDaemon))
    }
}
