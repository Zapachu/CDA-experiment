//region protocol
enum MoveType {
    greet = 'greet'
}

enum PushType {
    greet = 'greet'
}

enum FetchType {

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

//endregion

enum SocketEvent {
    online = 'online',
    move = 'move',
    push = 'push',
    syncGameState_json = 'SGJ',
    syncPlayerState_json = 'SPJ',
}

class Main extends eui.UILayer {
    socketClient: typeof io.Socket
    gameState: IGameState
    playerState: IPlayerState

    protected createChildren(): void {
        super.createChildren()
        egret.lifecycle.onPause = () => egret.ticker.pause()
        egret.lifecycle.onResume = () => egret.ticker.resume()
        egret.registerImplementation('eui.IAssetAdapter', new AssetAdapter())
        egret.registerImplementation('eui.IThemeAdapter', new ThemeAdapter())
        this.loadResource().then(() => this.runGame())
    }

    runGame() {
        this.initIO()
        this.createGameScene()
    }

    initIO() {
        const [, namespace, , gameId, , token] = location.search.split(/[=&]/)
        this.socketClient = io.connect('/', {
            path: `/bespoke/${namespace}/socket.io`,
            query: `gameId=${gameId}&token=${token}`
        })
        this.bindEventHandler()
        this.socketClient.emit(SocketEvent.online)
    }

    bindEventHandler() {
        this.socketClient.on(SocketEvent.syncGameState_json, gameState => {
            this.gameState = gameState
            console.log(gameState)
        })
        this.socketClient.on(SocketEvent.syncPlayerState_json, playerState => {
            this.playerState = playerState
            console.log(playerState)
        })
        this.socketClient.on(SocketEvent.push, (type: PushType, data) => {
            switch (type) {
                case PushType.greet: {
                    console.log('push greet', data)
                }
            }
        })
    }

    async loadResource() {
        const loadingView = new LoadingUI()
        this.stage.addChild(loadingView)
        await RES.loadConfig('resource/default.res.json', 'resource/')
        await this.loadTheme()
        await RES.loadGroup('preload', 0, loadingView)
        this.stage.removeChild(loadingView)
    }

    loadTheme() {

        return new Promise((resolve, reject) => new eui.Theme('resource/default.thm.json', this.stage).addEventListener(eui.UIEvent.COMPLETE, resolve, this)
        )
    }

    createGameScene(): void {
        const stageW = this.stage.stageWidth

        let topMask = new egret.Shape()
        topMask.graphics.beginFill(0x000000, 0.5)
        topMask.graphics.drawRect(0, 0, stageW, 172)
        topMask.graphics.endFill()
        topMask.y = 33
        this.addChild(topMask)

        let icon: egret.Bitmap = new egret.Bitmap(RES.getRes('egret_icon_png'))
        this.addChild(icon)
        icon.x = 26
        icon.y = 33

        let line = new egret.Shape()
        line.graphics.lineStyle(2, 0xffffff)
        line.graphics.moveTo(0, 0)
        line.graphics.lineTo(0, 117)
        line.graphics.endFill()
        line.x = 172
        line.y = 61
        this.addChild(line)


        let colorLabel = new egret.TextField()
        colorLabel.textColor = 0xffffff
        colorLabel.width = stageW - 172
        colorLabel.textAlign = 'center'
        colorLabel.text = 'Hello Egret'
        colorLabel.size = 24
        colorLabel.x = 172
        colorLabel.y = 80
        this.addChild(colorLabel)

        let textfield = new egret.TextField()
        this.addChild(textfield)
        textfield.alpha = 0
        textfield.width = stageW - 172
        textfield.textAlign = egret.HorizontalAlign.CENTER
        textfield.size = 24
        textfield.textColor = 0xffffff
        textfield.x = 172
        textfield.y = 135

        let button = new eui.Button()
        button.label = 'Click!'
        button.horizontalCenter = 0
        button.verticalCenter = 0
        this.addChild(button)
        button.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: egret.TouchEvent) => {
            this.socketClient.emit(SocketEvent.move, MoveType.greet, {hello: 'world'})
            let panel = new eui.Panel()
            panel.title = 'Title'
            panel.horizontalCenter = 0
            panel.verticalCenter = 0
            this.addChild(panel)
        }, this)

        this.addChild(new Introduction())
    }
}
