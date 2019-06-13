enum TradeState {
    normal = 'normal',
    input = 'input',
    history = 'history',
    roundOver = 'roundOver'
}

class Trade extends Scene<TradeState> {
    key = SceneKey.trade
    btnHistory: eui.Button
    btnShout: eui.Button
    btnClose: eui.Image
    priceInput: eui.TextInput

    protected childrenCreated(): void {
        this.priceInput.touchEnabled = true
        this.btnHistory.addEventListener(egret.TouchEvent.TOUCH_TAP, () => this.switchState(TradeState.history), this)
        this.btnShout.addEventListener(egret.TouchEvent.TOUCH_TAP, () => this.switchState(TradeState.input), this)
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, () => this.switchState(TradeState.normal), this)
        this.priceInput.addEventListener(egret.Event.FOCUS_OUT, ({target: {text}}: egret.Event) => {
            const price = Number(text)
            if (isNaN(price)) {
                console.warn('输入有误 ： ', text)
                return
            }
            console.log('报价', price)
            this.switchState(TradeState.normal)
        }, this)
    }
}