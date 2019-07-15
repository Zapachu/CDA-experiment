import {IRobotHandshake, SocketEvent} from '@bespoke/share'
import {IpcConnection, IpcEvent} from '@elf/util'
import {AnyRobot} from './BaseRobot'

export class RobotServer {
    static start(namespace: string, Robot: new(...args) => AnyRobot) {
        IpcConnection.connect(namespace).then(client =>
            client.on(IpcEvent.startRobot, async (robotHandshake: IRobotHandshake, meta) => {
                const connection = await IpcConnection.connect(namespace)
                const robot: AnyRobot = await new Robot(robotHandshake.game, robotHandshake.actor, connection, meta)
                connection.emit(SocketEvent.connection, robotHandshake, async () => {
                        connection.emit(SocketEvent.online)
                        await robot.init()
                    }
                )
            })
                .emit(IpcEvent.asDaemon))
    }
}
