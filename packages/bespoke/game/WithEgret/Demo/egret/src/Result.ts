class Result extends Scene {
    key = GameScene.result
    tradeHistory: eui.DataGroup

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