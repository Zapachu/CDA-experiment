class Prepare extends Scene {
    key = SceneKey.prepare
    public btnStart: eui.Button

    protected childrenCreated(): void {
        this.btnStart.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            Scene.switchScene(SceneKey.trade)
        }, this.btnStart)
    }

}