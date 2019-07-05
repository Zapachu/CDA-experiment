import {IRobotHandshake, SocketEvent} from '@bespoke/share'
import {IpcConnection, IpcEvent} from '@elf/util'
import {AnyRobot} from './BaseRobot'

export class RobotServer {
    static start(namespace: string, Robot: new(...args) => AnyRobot) {
        IpcConnection.connect(namespace).then(client =>
            client.on(IpcEvent.startRobot, async (robotHandshake: IRobotHandshake, meta) => {
                const connection = await IpcConnection.connect(namespace)
                connection.emit(SocketEvent.connection, robotHandshake, () =>
                    connection.emit(SocketEvent.online, async () =>
                        await new Robot(robotHandshake.game, robotHandshake.actor, connection, meta).init()
                    )
                )
            })
                .emit(IpcEvent.asDaemon))
    }
}
