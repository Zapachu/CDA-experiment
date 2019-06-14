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
}

class Main extends eui.UILayer {
    private scene: Scene
    private scenes: Array<Scene> = [new Prepare(), new Trade(), new Result()]

    protected createChildren(): void {
        super.createChildren()
        egret.lifecycle.onPause = () => egret.ticker.pause()
        egret.lifecycle.onResume = () => egret.ticker.resume()
        egret.registerImplementation('eui.IAssetAdapter', new AssetAdapter())
        egret.registerImplementation('eui.IThemeAdapter', new ThemeAdapter())
        this.loadResource().then(() => {
            Scene.switchScene = (sceneKey: GameScene) => {
                if (this.scene) {
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
