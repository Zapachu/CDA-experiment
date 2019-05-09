enum Mode {
    single,
    multiple
}

class Introduction extends eui.Component implements eui.UIComponent {
    private mode: Mode = Mode.single
    private btnStart: eui.Button
    private btnSingle: ButtonGameMode
    private btnMultiple: ButtonGameMode

    protected childrenCreated(): void {
        this.setMode(Mode.single)
        this.btnSingle.setLabel('单人玩法', '市场上其它玩家均为机器人')
            .addEventListener(egret.TouchEvent.TOUCH_TAP, () => this.setMode(Mode.single), this.btnSingle)
        this.btnMultiple.setLabel('多人玩法', '市场中存在其它玩家')
            .addEventListener(egret.TouchEvent.TOUCH_TAP, () => this.setMode(Mode.multiple), this.btnMultiple)
        this.btnStart.addEventListener(egret.TouchEvent.TOUCH_TAP, () => console.log(this.mode), this.btnStart)
    }

    setMode(mode: Mode) {
        this.mode = mode
        this.btnSingle.state = "normal"
        this.btnMultiple.state = "normal"
        ;(mode === Mode.single ? this.btnSingle : this.btnMultiple).state = "active"
    }
}