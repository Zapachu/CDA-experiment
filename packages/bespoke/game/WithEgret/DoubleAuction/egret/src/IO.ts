enum SocketEvent {
    online = 'online',
    move = 'move',
    push = 'push',
    syncGameState_json = 'SGJ',
    syncPlayerState_json = 'SPJ',
}

namespace IO {
    const socketClient = io.connect('/', {
        path: location.pathname.replace('egret', 'socket.io'),
        query: location.search.replace('?', '')
    })
    export let gameState: IGameState
    export let playerState: IPlayerState

    export function emit(type: MoveType, params?: Partial<IMoveParams>) {
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

    export let showTween = false
    const renderCallbacks = []

    export function onRender(render: () => void) {
        renderCallbacks.push(render)
    }

    setInterval(() => {
        if (showTween || !playerState || !gameState) {
            return
        }
        renderCallbacks.forEach(render => render())
    }, 200)
}