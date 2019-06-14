enum PrepareState {
    normal = 'normal',
    match = 'match',
}

class Prepare extends Scene<PrepareState> {
    key = GameScene.prepare
    public btnStart: eui.Button
    public countDown: eui.Label

    protected childrenCreated(): void {
        this.btnStart.addEventListener(egret.TouchEvent.TOUCH_TAP, () => IO.emit(MoveType.getIndex), this.btnStart)
        IO.onRender(() => {
            this.countDown.text = (PREPARE_TIME - IO.gameState.prepareTime).toString()
            if (IO.gameState.prepareTime) {
                this.switchState(PrepareState.match)
            }
        })
    }
}