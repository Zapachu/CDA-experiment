class Result extends Scene {
    key = GameScene.result
    tradeHistory: eui.DataGroup
    btnOnceMore: eui.Button

    protected childrenCreated(): void {
        super.childrenCreated()
        this.btnOnceMore.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>IO.emit(MoveType.onceMore, {}, lobbyUrl => location.href = lobbyUrl), this)
    }

    render() {
        const {gameState: {rounds}, playerState} = IO
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
    }
}