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

enum SceneName {
    prepare,
    trade
}

class Main extends eui.UILayer {
    private curSceneName: SceneName
    private sceneMap = {
        [SceneName.prepare]: new Trade(),
        [SceneName.trade]: new Trade()
    }

    protected createChildren(): void {
        super.createChildren()
        egret.lifecycle.onPause = () => egret.ticker.pause()
        egret.lifecycle.onResume = () => egret.ticker.resume()
        egret.registerImplementation('eui.IAssetAdapter', new AssetAdapter())
        egret.registerImplementation('eui.IThemeAdapter', new ThemeAdapter())
        this.loadResource().then(() => this.switchScene(SceneName.prepare))
    }

    switchScene(scene: SceneName) {
        const curScene = this.sceneMap[this.curSceneName]
        if (curScene) {
            this.removeChild(curScene)
        }
        const {stageWidth, stageHeight} = this.stage
        const newScene = this.sceneMap[scene]
        newScene.width = stageWidth
        newScene.height = stageHeight
        this.addChild(newScene)
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
