enum SocketEvent {
    online = 'online',
    move = 'move',
    push = 'push',
    syncGameState_json = 'SGJ',
    syncPlayerState_json = 'SPJ',
}

enum MoveType {
    greet = 'greet'
}

enum PushType {
    greet = 'greet'
}

interface ICreateParams {
}

interface IMoveParams {
}

interface IPushParams {
}

interface IGameState {
}

interface IPlayerState {
}

namespace IO {
    const socketClient = io.connect('/', {
        path: location.pathname.replace('egret', 'socket.io'),
        query: location.search.replace('?', '')
    })
    export let gameState: IGameState
    export let playerState: IPlayerState

    export function emit(type: MoveType, params: Partial<IMoveParams>) {
        socketClient.emit(SocketEvent.move, type, params)
    }

    socketClient.on(SocketEvent.syncGameState_json, newGameState => gameState = newGameState)
        .on(SocketEvent.syncPlayerState_json, newPlayerState => playerState = newPlayerState)
        .on(SocketEvent.push, (type: PushType, params: Partial<IPushParams>) => trigger(type, params))
        .emit(SocketEvent.online)

    const listeners = new Map<PushType, Array<Function>>()

    function getListeners(pushType: PushType) {
        return listeners.get(pushType) || []
    }

    function on(pushType: PushType, fn: (params: Partial<IPushParams>) => void) {
        listeners.set(pushType, [...getListeners(pushType), fn])
    }

    function trigger(pushType: PushType, params: Partial<IPushParams>) {
        getListeners(pushType).forEach(fn => fn(params))
    }
}