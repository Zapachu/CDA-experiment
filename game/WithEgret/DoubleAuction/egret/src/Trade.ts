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
    sellPrices: eui.DataGroup
    buyPrices: eui.DataGroup
    conditionTip: eui.Label
    privatePrice: eui.Label
    tradeHistory: eui.DataGroup


    protected childrenCreated(): void {
        super.childrenCreated()
        this.priceInput.touchEnabled = true
        this.btnHistory.addEventListener(egret.TouchEvent.TOUCH_TAP, () => this.switchState(TradeState.history), this)
        this.btnShout.addEventListener(egret.TouchEvent.TOUCH_TAP, () => this.switchState(TradeState.input), this)
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, () => this.switchState(TradeState.normal), this)
        this.priceInput.addEventListener(egret.Event.FOCUS_OUT, ({target: {text}}: egret.Event) => {
            const price = Number(text)
            const {playerState: {role, privatePrices}, gameState: {roundIndex}} = IO,
                privatePrice = privatePrices[roundIndex],
                priceInvalid = isNaN(price) || (role === Role.seller && price < privatePrice) || (role === Role.buyer && price > privatePrice)
            if (priceInvalid) {
                console.warn('输入有误 ： ', text)
                return
            }
            IO.emit(MoveType.shout, {price})
            this.switchState(TradeState.normal)
        }, this)
    }

    render() {
        const {gameState: {rounds, roundIndex}, playerState} = IO,
            {time, shouts} = rounds[roundIndex],
            timeLeft = Config.TRADE_TIME - time,
            myShout = shouts[playerState.index]
        this.privatePrice.text = playerState.privatePrices[roundIndex].toString()
        this.tip.text = `您的角色为 : ${playerState.role === Role.seller ? '卖家' : '买家'}${myShout && myShout.traded ? ',交易成功' : ''}`
        this.btnShout.enabled = !(myShout && myShout.traded)
        this.conditionTip.text = playerState.role === Role.seller ? '高于' : '低于'
        this.totalRound.text = Config.ROUND.toString()
        this.curRound.text = (roundIndex + 1).toString()
        this.countDown.text = timeLeft.toString()
        this.roundOverTime.text = (Config.RESULT_TIME + timeLeft).toString()
        this.buyPrices.itemRenderer = ShoutItem
        this.sellPrices.itemRenderer = ShoutItem
        const shoutsWithState = shouts.map((shout, i) => ({
            ...shout,
            state: i === playerState.index ?
                playerState.role === Role.seller ?
                    ShoutItemState.sell :
                    ShoutItemState.buy :
                ShoutItemState.normal
        })).filter(({traded}) => !traded)
        this.buyPrices.dataProvider = new eui.ArrayCollection(shoutsWithState.filter(({role}) => role === Role.buyer))
        this.sellPrices.dataProvider = new eui.ArrayCollection(shoutsWithState.filter(({role}) => role === Role.seller))
        this.tradeHistory.dataProvider = new eui.ArrayCollection(rounds.map(({shouts, trades}, i) => {
            const myTrade = trades.find(({reqIndex, resIndex}) => reqIndex === playerState.index || resIndex === playerState.index)
            if (!myTrade) {
                return {round: i + 1}
            }
            const {price} = shouts[myTrade.reqIndex],
                privatePrice = playerState.privatePrices[i]
            return {
                round: i + 1,
                price,
                profit: (playerState.role === Role.seller ? 1 : -1) * (price - privatePrice)
            }
        }))
        if (timeLeft < 0) {
            this.switchState(TradeState.roundOver)
        } else if (this._state === TradeState.roundOver) {
            this.switchState(TradeState.normal)
        }
    }
}


enum ShoutItemState {
    normal = 'normal',
    buy = 'buy',
    sell = 'sell'
}

class ShoutItem extends eui.ItemRenderer {
    innerContent: eui.ItemRenderer

    dataChanged() {
        this.innerContent.data = this.data
        this.innerContent.currentState = this.data.state
    }
}