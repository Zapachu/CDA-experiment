enum TradeState {
    normal = 'normal',
    input = 'input',
    history = 'history',
    roundOver = 'roundOver'
}

class Trade extends Scene<TradeState> {
    key = GameScene.trade
    btnHistory: eui.Button
    btnShout: eui.Button
    btnClose: eui.Image
    priceInput: eui.TextInput
    countDown: eui.Label
    tip: eui.Label
    totalRound: eui.Label
    curRound: eui.Label
    roundOverTime: eui.Label


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
            4
        }, this)
        IO.onRender(() => {
            const {rounds, roundIndex} = IO.gameState,
                timeLeft = TRADE_TIME - rounds[roundIndex].time
            this.tip.text = `您的角色为 : ${IO.playerState.role === Role.seller ? '卖家' : '买家'}`
            this.totalRound.text = ROUND.toString()
            this.curRound.text = (roundIndex + 1).toString()
            this.countDown.text = timeLeft.toString()
            this.roundOverTime.text = (RESULT_TIME + timeLeft).toString()
            if (timeLeft < 0) {
                this.switchState(TradeState.roundOver)
            } else if (this._state === TradeState.roundOver) {
                this.switchState(TradeState.normal)
            }
        })
    }
}