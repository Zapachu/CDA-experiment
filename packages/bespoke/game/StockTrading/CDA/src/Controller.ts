import {
    BaseController,
    baseEnum,
    FreeStyleModel,
    IActor,
    IMoveCallback,
    TGameState,
    TPlayerState,
    Log
} from 'bespoke-server'
import nodeXlsx from 'node-xlsx'
import {
    DBKey,
    FetchType,
    ISeatNumberRow,
    MarketStage,
    MoveType,
    orderNumberLimit,
    phaseNames, PlayerStatus,
    PushType,
    RobotCalcLog,
    RobotSubmitLog,
    ROLE,
    SheetType,
    ShoutResult,
} from './config'
import {GameState, ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from './interface'
import cloneDeep = require('lodash/cloneDeep')
import {getEnumKeys} from './util'

export default class Controller extends BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> {
    private positionStack: {
        player: Array<number>
        robot: Array<number>
    }

    getGame4Player() {
        const game = cloneDeep(this.game)
        game.params.phases.forEach(({templateName, params}) =>
            templateName === phaseNames.mainGame ? params.unitLists = [] : null
        )
        return game
    }

    async init() {
        await super.init()
        const {roles} = this.game.params.phases[0].params
        const player = [], robot = []
        roles.forEach((_, i) => player.push(i))
        this.positionStack = {player, robot}
        robot.forEach((_, i) => setTimeout(async () =>
            await this.startNewRobotScheduler(`Robot_${i}`, false), Math.random() * 3000))
        return this
    }

    initGameState(): TGameState<IGameState> {
        const gameState = super.initGameState()
        gameState.gamePhaseIndex = 0
        gameState.orders = []
        gameState.phases = this.game.params.phases.map((phase, i) => ({
            marketStage: MarketStage.notOpen,
            orderId: i * orderNumberLimit,
            buyOrderIds: [],
            sellOrderIds: [],
            trades: [],
            positionUnitIndex: this.game.params.phases[0].params.roles.map(() => 0)
        }))
        return gameState
    }

    async initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
        const playerState = await super.initPlayerState(actor)
        playerState.point = 0
        playerState.phases = this.game.params.phases.map(({templateName}) => templateName === phaseNames.mainGame ?
            {periodProfit: 0} : {}
        )
        return playerState
    }

    protected async teacherMoveReducer(actor: IActor, type: string, params: IMoveParams, cb?: IMoveCallback): Promise<void> {
        const gameState = await this.stateManager.getGameState(),
            playerStates = await this.stateManager.getPlayerStates()
        switch (type) {
            case MoveType.assignPosition: {
                Object.values(playerStates).forEach(async playerState => {
                    const positionIndex = (playerState.actor.type === baseEnum.Actor.serverRobot ?
                        this.positionStack.robot : this.positionStack.player).pop()
                    if (positionIndex === undefined) {
                        return Log.d('角色已分配完')
                    }
                    playerState.positionIndex = positionIndex
                    playerState.unitLists = this.game.params.phases.map(({templateName, params}) =>
                        templateName === phaseNames.mainGame ? params.unitLists[positionIndex] : ''
                    )
                    this.push(playerState.actor, PushType.assignedPosition)
                })
                gameState.positionAssigned = true
                break
            }
            case MoveType.openMarket: {
                gameState.gamePhaseIndex = 1
                await this.startPeriod()
                break
            }
        }
    }

    async startPeriod() {
        const gameState = await this.stateManager.getGameState()
        gameState.phases[gameState.gamePhaseIndex].marketStage = MarketStage.readDescription
        let periodCountDown = 0
        this.broadcast(PushType.periodCountDown, {periodCountDown})
        const timer = global.setInterval(async () => {
            if (gameState.status !== baseEnum.GameStatus.started) {
                return
            }
            const {durationOfEachPeriod, time2ReadInfo} = this.game.params.phases[gameState.gamePhaseIndex].params
            if (periodCountDown === Number(time2ReadInfo)) {
                gameState.phases[gameState.gamePhaseIndex].marketStage = MarketStage.trading
                this.broadcast(PushType.periodOpen)
            }
            if (periodCountDown === Number(durationOfEachPeriod) + Number(time2ReadInfo)) {
                gameState.phases[gameState.gamePhaseIndex].marketStage = MarketStage.result
                await this.calcPeriodProfit()
            }
            if (periodCountDown === Number(durationOfEachPeriod) + 2 * Number(time2ReadInfo)) {
                global.clearInterval(timer)
                if (++gameState.gamePhaseIndex < this.game.params.phases.length - 1) {
                    await this.startPeriod()
                }
            }
            await this.stateManager.syncState()
            this.broadcast(PushType.periodCountDown, {
                periodCountDown: periodCountDown++
            })
        }, 1000)
    }

    protected async playerMoveReducer(actor: IActor, type: string, params: IMoveParams, cb: IMoveCallback): Promise<void> {
        const gameState = await this.stateManager.getGameState(),
            playerState = await this.stateManager.getPlayerState(actor),
            playerStates = await this.stateManager.getPlayerStates(),
            {gamePhaseIndex} = gameState,
            {positionIndex} = playerState
        switch (type) {
            case MoveType.enterMarket: {
                const hasBeenOccupied = Object.values(playerStates).some(({seatNumber}) => seatNumber === params.seatNumber)
                if (hasBeenOccupied) {
                    cb(false)
                    break
                }
                playerState.seatNumber = params.seatNumber
                playerState.status = PlayerStatus.wait4MarketOpen
                const data: ISeatNumberRow = {
                    playerSeq: positionIndex + 1,
                    seatNumber: params.seatNumber
                }
                await new FreeStyleModel({
                    game: this.game.id,
                    key: DBKey.seatNumber,
                    data
                }).save()
                break
            }
            case MoveType.submitOrder: {
                const {price, unitIndex} = params
                const orderDict = this.getOrderDict(gameState), {buyOrderIds, sellOrderIds} = gameState.phases[gamePhaseIndex],
                    buyOrders = buyOrderIds.map(id => orderDict[id].price).join(','),
                    sellOrders = sellOrderIds.map(id => orderDict[id].price).join(',')
                let shoutResult: ShoutResult
                if (this.game.params.phases[gamePhaseIndex].templateName !== phaseNames.mainGame) {
                    Log.w('玩家已进入下一环节')
                    break
                }
                if (unitIndex !== gameState.phases[gamePhaseIndex].positionUnitIndex[positionIndex]) {
                    Log.d('物品已成交，无法继续报价')
                    shoutResult = ShoutResult.shoutOnTradedUnit
                } else {
                    const newOrder = {
                        id: ++gameState.phases[gamePhaseIndex].orderId,
                        positionIndex,
                        unitIndex: gameState.phases[gamePhaseIndex].positionUnitIndex[positionIndex],
                        price
                    }
                    shoutResult = await this.shoutNewOrder(gamePhaseIndex, newOrder)
                }
                cb(shoutResult, buyOrders, sellOrders)
                break
            }
            case MoveType.cancelOrder: {
                await this.cancelOrder(gamePhaseIndex, positionIndex, true)
                break
            }
            case MoveType.sendBackPlayer: {
                this.sendBackPlayer(actor.token, {
                    point: playerState.point.toString()
                }, this.game.params.nextPhaseKey)
                break
            }
        }
    }

    getOrderDict(gameState: IGameState): { [id: number]: GameState.IOrder } {
        const orderDict: { [id: number]: GameState.IOrder } = {}
        gameState.orders.forEach(order => {
            orderDict[order.id] = order
        })
        return orderDict
    }

    async calcPeriodProfit() {
        const {game} = this,
            gameState = await this.stateManager.getGameState(),
            playerStates = await this.stateManager.getPlayerStates(),
            {orders, gamePhaseIndex} = gameState,
            {trades} = gameState.phases[gamePhaseIndex]
        for (let userId in playerStates) {
            const {phases, unitLists, positionIndex} = playerStates[userId],
                playerPhaseState = phases[gamePhaseIndex],
                {roles} = game.params.phases[0].params
            if (!unitLists) {
                continue
            }
            let periodProfit = 0, tradedCount = 0
            const orderDict: { [id: number]: GameState.IOrder } = {}
            orders.forEach(order => {
                orderDict[order.id] = order
            })
            trades.forEach(({reqId, resId}) => {
                const reqOrder = orderDict[reqId],
                    resOrder = orderDict[resId]
                let myOrder: GameState.IOrder
                switch (positionIndex) {
                    case reqOrder.positionIndex:
                        myOrder = reqOrder
                        break
                    case resOrder.positionIndex:
                        myOrder = resOrder
                        break
                    default:
                        return
                }
                const privateCost = +unitLists[gamePhaseIndex].split(' ')[myOrder.unitIndex]
                let unitProfit = roles[positionIndex] === ROLE.Buyer ?
                    privateCost - reqOrder.price : reqOrder.price - privateCost
                periodProfit += unitProfit
                tradedCount++
            })
            playerPhaseState.tradedCount = tradedCount
            playerPhaseState.periodProfit = Number(periodProfit.toFixed(2))
            playerStates[userId].point = Number((playerStates[userId].point + periodProfit).toFixed(2))
        }
    }

    async shoutNewOrder(gamePhaseIndex: number, order: GameState.IOrder): Promise<ShoutResult> {
        const role = this.game.params.phases.filter(ph => ph.templateName === phaseNames.assignPosition)[0].params[order.positionIndex]
        const units = this.game.params.phases[gamePhaseIndex].params.unitLists[order.positionIndex].split(' ')
        const {phases, orders} = await this.stateManager.getGameState(),
            {buyOrderIds, sellOrderIds, trades, positionUnitIndex} = phases[gamePhaseIndex]
        const marketRejected = role === ROLE.Seller ?
            sellOrderIds[0] && order.price >= orders.find(({id}) => id === sellOrderIds[0]).price :
            buyOrderIds[0] && order.price <= orders.find(({id}) => id === buyOrderIds[0]).price
        if (marketRejected) {
            return ShoutResult.marketReject
        } else {
            await this.cancelOrder(gamePhaseIndex, order.positionIndex)
            orders.push(order)
        }
        const tradeSuccess = role === ROLE.Seller ?
            buyOrderIds[0] && order.price <= orders.find(({id}) => id === buyOrderIds[0]).price :
            sellOrderIds[0] && order.price >= orders.find(({id}) => id === sellOrderIds[0]).price
        if (tradeSuccess) {
            const pairOrderId = role === ROLE.Seller ? buyOrderIds.shift() : sellOrderIds.shift()
            trades.push({
                reqId: pairOrderId,
                resId: order.id
            })
            positionUnitIndex[orders.find(({id}) => id === pairOrderId).positionIndex] += 1
            positionUnitIndex[order.positionIndex] += 1
            this.broadcast(PushType.newTrade, {resOrderId: order.id})
            return ShoutResult.tradeSuccess
        } else {
            (role === ROLE.Seller ? sellOrderIds : buyOrderIds).unshift(order.id)
            this.broadcast(PushType.newOrder, {newOrderId: order.id})
            return ShoutResult.shoutSuccess
        }
    }

    async cancelOrder(gamePhaseIndex: number, positionIndex: number, active = false) {
        const {phases, orders} = await this.stateManager.getGameState(),
            {buyOrderIds, sellOrderIds} = phases[gamePhaseIndex]
        for (let i = 0; i < buyOrderIds.length; i++) {
            if (orders.find(({id}) => id === buyOrderIds[i]).positionIndex === positionIndex) {
                return buyOrderIds.splice(i, 1)
            }
        }
        for (let i = 0; i < sellOrderIds.length; i++) {
            if (orders.find(({id}) => id === sellOrderIds[i]).positionIndex === positionIndex) {
                return sellOrderIds.splice(i, 1)
            }
        }
    }

    async handleFetch(req, res) {
        const {query: {type, sheetType}} = req
        switch (type) {
            case FetchType.exportXls: {
                if (req.user.id !== this.game.owner) {
                    return res.end('Invalid Request')
                }
                const name = SheetType[sheetType]
                let data = [], option = {}
                switch (sheetType) {
                    case SheetType.robotCalcLog: {
                        data.push(['seq', 'Subject', 'role', 'box', 'R', 'A', 'q', 'tau', 'beta', 'p', 'delta', 'r', 'LagGamma', 'Gamma', 'ValueCost', 'u', 'CalculatedPrice', 'Timestamp'])
                        const robotCalcLogs: Array<{ data: RobotCalcLog }> = await FreeStyleModel.find({
                            game: this.game.id,
                            key: DBKey.robotCalcLog
                        }) as any
                        robotCalcLogs.sort(({data: {seq: m}}, {data: {seq: n}}) => m - n)
                            .forEach(({data: {seq, playerSeq, role, unitIndex, R, A, q, tau, beta, p, delta, r, LagGamma, Gamma, ValueCost, u, CalculatedPrice, timestamp}}) =>
                                data.push([seq, playerSeq, role, unitIndex + 1, R, A, q, tau, beta, p, delta, r, LagGamma, Gamma, ValueCost, u, CalculatedPrice, timestamp]
                                    .map(v => typeof v === 'number' && v % 1 ? v.toFixed(2) : v)
                                ))
                        break
                    }
                    case SheetType.robotSubmitLog: {
                        data.push(['seq', 'Subject', 'role', 'box', 'ValueCost', 'Price', 'BuyOrders', 'SellOrders', `ShoutResult:${getEnumKeys(ShoutResult).join('/')}`, 'MarketBuyOrders', 'MarketSellOrders', 'Timestamp'])
                        const robotSubmitLogs: Array<{ data: RobotSubmitLog }> = await FreeStyleModel.find({
                            game: this.game.id,
                            key: DBKey.robotSubmitLog
                        }) as any
                        robotSubmitLogs.sort(({data: {seq: m}}, {data: {seq: n}}) => m - n)
                            .forEach(({data: {seq, playerSeq, role, unitIndex, ValueCost, price, buyOrders, sellOrders, shoutResult, marketBuyOrders, marketSellOrders, timestamp}}) =>
                                data.push([seq, playerSeq, role, unitIndex + 1, ValueCost, price, buyOrders, sellOrders, `${shoutResult + 1}:${ShoutResult[shoutResult]}`, marketBuyOrders, marketSellOrders, timestamp]
                                    .map(v => typeof v === 'number' && v % 1 ? v.toFixed(2) : v)
                                ))
                        break
                    }
                    case SheetType.seatNumber: {
                        data.push(['Subject', 'seatNumber'])
                        const seatNumberRows: Array<{ data: ISeatNumberRow }> = await FreeStyleModel.find({
                            game: this.game.id,
                            key: DBKey.seatNumber
                        }) as any
                        seatNumberRows.forEach(({data: {seatNumber, playerSeq}}) => data.push([playerSeq, seatNumber]))
                        break
                    }
                }
                let buffer = nodeXlsx.build([{name, data}], option)
                res.setHeader('Content-Type', 'application/vnd.openxmlformats')
                res.setHeader('Content-Disposition', 'attachment; filename=' + `${encodeURI(name)}.xlsx`)
                return res.end(buffer, 'binary')
            }
        }
    }
}
