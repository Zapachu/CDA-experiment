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

    export function emit(type: MoveType, params?: Partial<IMoveParams>, cb?: (...args)=>void) {
        socketClient.emit(SocketEvent.move, type, params, cb)
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

class LoadingUI extends egret.Sprite implements RES.PromiseTaskReporter {
    private readonly textField: egret.TextField

    public constructor() {
        super()
        const textField = new egret.TextField()
        textField.y = 300
        textField.width = 480
        textField.height = 100
        textField.textAlign = 'center'
        this.textField = textField
        this.addChild(this.textField)
    }

    public onProgress(current: number, total: number): void {
        this.textField.text = `Loading...${current}/${total}`
    }
}

abstract class Scene<State extends string = string> extends eui.Component implements eui.UIComponent {
    _state: State
    abstract key: GameScene

    static switchScene: (key: GameScene) => void

    switchState(state: State) {
        if (this._state === state) {
            return
        }
        this._state = state
        this.invalidateState()
    }

    getCurrentState() {
        return this._state
    }

    protected childrenCreated(): void {
        IO.onRender(() => this.render())
    }

    render() {

    }
}

abstract class BaseMain extends eui.UILayer {
    private scene: Scene
    private scenes: Array<Scene>
    abstract sceneClasses: Array<new() => Scene>

    protected createChildren(): void {
        super.createChildren()
        this.scenes = this.sceneClasses.map(clazz => new clazz())
        egret.lifecycle.onPause = () => egret.ticker.pause()
        egret.lifecycle.onResume = () => egret.ticker.resume()
        egret.registerImplementation('eui.IAssetAdapter', new AssetAdapter())
        egret.registerImplementation('eui.IThemeAdapter', new ThemeAdapter())
        this.loadResource().then(() => {
            Scene.switchScene = (sceneKey: GameScene) => {
                if (this.scene) {
                    if (this.scene.key === sceneKey) {
                        return
                    }
                    this.removeChild(this.scene)
                }
                const {stageWidth, stageHeight} = this.stage
                const scene = this.scenes.find(({key}) => key === sceneKey)
                scene.width = stageWidth
                scene.height = stageHeight
                this.addChild(scene)
                this.scene = scene
            }
            IO.onRender(() => Scene.switchScene(IO.gameState.scene))
        })
    }

    async loadResource() {
        const loadingView = new LoadingUI()
        this.stage.addChild(loadingView)
        await RES.loadConfig('resource/default.res.json', 'resource/')
        await new Promise(resolve => new eui.Theme('resource/default.thm.json', this.stage).addEventListener(eui.UIEvent.COMPLETE, resolve, this))
        await RES.loadGroup('preload', 0, loadingView)
        this.stage.removeChild(loadingView)
    }
}