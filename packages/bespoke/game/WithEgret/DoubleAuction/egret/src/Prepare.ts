enum PrepareState {
    normal = 'normal',
    waiting = 'waiting',
    match = 'match',
}

class Prepare extends Scene<PrepareState> {
    key = GameScene.prepare
    public btnStart: eui.Button
    public countDown: eui.Label

    protected childrenCreated(): void {
        super.childrenCreated()
        this.btnStart.addEventListener(egret.TouchEvent.TOUCH_TAP, () => IO.emit(MoveType.getIndex), this.btnStart)
    }

    render() {
        this.countDown.text = (PREPARE_TIME - IO.gameState.prepareTime).toString()
        if (IO.gameState.prepareTime) {
            this.switchState(PrepareState.match)
        }else if(IO.playerState.index !== undefined){
            this.switchState(PrepareState.waiting)
        }
    }
}