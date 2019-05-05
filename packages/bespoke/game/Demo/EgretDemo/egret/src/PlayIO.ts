enum SocketEvent {
    online = 'online',
    move = 'move',
    push = 'push',
    syncGameState_json = 'SGJ',
    syncPlayerState_json = 'SPJ',
}

class PlayIO {
    private static instance: PlayIO
    private socketClient: typeof io.Socket
    private gameState
    private playerState

    static initInstance() {
        if (this.instance) {
            return this.instance
        }
        this.instance = new PlayIO().init()
    }

    private init(): PlayIO {
        const [, namespace, , gameId, , token] = location.search.split(/[=&]/)
        this.socketClient = io.connect('/', {
            path: `/bespoke/${namespace}/socket.io`,
            query: `gameId=${gameId}&token=${token}`
        })
        this.socketClient.on(SocketEvent.syncGameState_json, gameState => {
            this.gameState = gameState
            console.log(gameState)
        })
        this.socketClient.on(SocketEvent.syncPlayerState_json, playerState => {
            this.playerState = playerState
            console.log(playerState)
        })
        this.socketClient.emit(SocketEvent.online)
        return this
    }
}
