import {
        FrameEmitter,
        INewRobotParams,
        ISocketHandshakeQuery,
        SocketEvent,
        TGameState,
        TPlayerState,
        UnixSocketEvent
} from 'bespoke-core-share'
import {Log, SocketWrapper} from 'bespoke-server'
import {IGameState, IMoveParams, IPlayerState, IPushParams, MoveType, PushType} from './interface'

let i = 0
new SocketWrapper()
    .on(UnixSocketEvent.newRobot, ({id, actor, game}: INewRobotParams) => {
            if (i++ > 0) {
                    return
            }
            const connection = new SocketWrapper()
            connection.emit(SocketEvent.connection, {id, gameId: game.id, token: actor.token} as ISocketHandshakeQuery)
            setTimeout(() => connection.emit(SocketEvent.online), 1e3)
            connection.on(SocketEvent.syncGameState_json, (state: TGameState<IGameState>) => {
                    Log.i(state)
            })
            connection.on(SocketEvent.syncPlayerState_json, (state: TPlayerState<IPlayerState>) => {
                    Log.d(state)
            })
            const frameEmitter = new FrameEmitter<MoveType, PushType, IMoveParams, IPushParams>(connection)
            frameEmitter.emit(MoveType.hello)
            frameEmitter.on(PushType.world, () => console.log('world'))
    })
    .emit(UnixSocketEvent.mainConnection)
