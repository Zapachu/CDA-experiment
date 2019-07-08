import {
    BaseController,
    baseEnum,
    IActor,
    IMoveCallback,
    TGameState,
    TPlayerState,
    Log,
    Model, GameStatus, Actor
} from '@bespoke/server'
import {
    DBKey,
    EVENT_TYPE,
    EventParams,
    IDENTITY, ISeatNumberRow,
    MarketStage,
    MoveType,
    orderNumberLimit,
    phaseNames, PlayerStatus,
    PushType,
    ROLE,
    SheetType,
    ShoutResult,
    TRADE,
    TRADE_TYPE
} from './config'
import {GameState, ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from './interface'
import * as dateFormat from 'dateformat'
import cloneDeep = require('lodash/cloneDeep')

export default class Controller extends BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    private positionStack: {
        player: Array<number>
        robot: Array<number>
    }

    //region meta

    getGame4Player() {
        const game = cloneDeep(this.game)
        game.params.phases.forEach(({templateName, params}) =>
            templateName === phaseNames.mainGame ? params.unitLists = [] : null
        )
        return game
    }

    //endregion

    //region init
    async init() {
        await super.init()
        const {positions} = this.game.params.phases[0].params
        const player = [], robot = []
        positions.forEach(({identity}, i) => (identity === IDENTITY.Player ? player : robot).push(i))
        this.positionStack = {player, robot}
        robot.forEach((_, i) => setTimeout(async () =>
            await this.startRobot(`Robot_${i}`), Math.random() * 3000))
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
            positionUnitIndex: this.game.params.phases[0].params.positions.map(() => 0)
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

    //endregion

    //region play

    protected async teacherMoveReducer(actor: IActor, type: string, params: IMoveParams, cb?: IMoveCallback): Promise<void> {
        const gameState = await this.stateManager.getGameState(),
            playerStates = await this.stateManager.getPlayerStates()
        switch (type) {
            case MoveType.assignPosition: {
                Object.values(playerStates).forEach(async playerState => {
                    const positionIndex = (playerState.actor.type === Actor.serverRobot ?
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
            if (gameState.status !== GameStatus.started) {
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
                await new Model.FreeStyleModel({
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
            case MoveType.rejectOrder: {
                const {price} = params
                const {positions} = this.game.params.phases.filter(ph => ph.templateName === phaseNames.assignPosition)[0].params,
                    {role, identity} = positions[positionIndex]
                const unitIndex = gameState.phases[gamePhaseIndex].positionUnitIndex[positionIndex]
                const units = this.game.params.phases[gamePhaseIndex].params.unitLists[positionIndex].split(' ')
                this.insertMoveEvent({
                    period: gamePhaseIndex,
                    subject: positionIndex,
                    box: unitIndex,
                    role: role,
                    traderType: identity,
                    valueCost: units[unitIndex],
                    eventType: EVENT_TYPE.rejected,
                    eventTime: dateFormat(Date.now(), 'HH:MM:ss:l'),
                    maxBid: await this.getMaxOrMinShout(gamePhaseIndex, true),
                    minAsk: await this.getMaxOrMinShout(gamePhaseIndex, false),
                    bidAsk: price
                })
                break
            }
            case MoveType.cancelOrder: {
                await this.cancelOrder(gamePhaseIndex, positionIndex, true)
                break
            }
            case MoveType.sendBackPlayer: {
                this.sendBackPlayer(actor.token, {
                    point: playerState.point
                }, this.game.params.nextPhaseKey)
                break
            }
        }
    }

    //region market
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
            {trades} = gameState.phases[gamePhaseIndex],
            {practicePhase} = game.params.phases[gamePhaseIndex].params
        for (let userId in playerStates) {
            const {phases, unitLists, positionIndex} = playerStates[userId],
                playerPhaseState = phases[gamePhaseIndex],
                {positions} = game.params.phases[0].params
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
                let unitProfit = positions[positionIndex].role === ROLE.Buyer ?
                    privateCost - reqOrder.price : reqOrder.price - privateCost
                periodProfit += unitProfit
                tradedCount++
            })
            if (practicePhase) {
                periodProfit = 0
            }
            playerPhaseState.tradedCount = tradedCount
            playerPhaseState.periodProfit = Number(periodProfit.toFixed(2))
            playerStates[userId].point = Number((playerStates[userId].point + periodProfit / Number(positions[positionIndex].exchangeRate || 1)).toFixed(2))
        }
    }

    async shoutNewOrder(gamePhaseIndex: number, order: GameState.IOrder): Promise<ShoutResult> {
        const {positions} = this.game.params.phases.filter(ph => ph.templateName === phaseNames.assignPosition)[0].params,
            {role, identity} = positions[order.positionIndex]
        const units = this.game.params.phases[gamePhaseIndex].params.unitLists[order.positionIndex].split(' ')
        const {phases, orders} = await this.stateManager.getGameState(),
            {buyOrderIds, sellOrderIds, trades, positionUnitIndex} = phases[gamePhaseIndex]
        const marketRejected = role === ROLE.Seller ?
            sellOrderIds[0] && order.price >= orders.find(({id}) => id === sellOrderIds[0]).price :
            buyOrderIds[0] && order.price <= orders.find(({id}) => id === buyOrderIds[0]).price
        if (marketRejected) {
            this.insertMoveEvent({
                orderId: order.id,
                period: gamePhaseIndex,
                subject: order.positionIndex,
                box: order.unitIndex,
                role: role,
                traderType: identity,
                valueCost: units[order.unitIndex],
                eventType: EVENT_TYPE.rejected,
                eventTime: dateFormat(Date.now(), 'HH:MM:ss:l'),
                maxBid: await this.getMaxOrMinShout(gamePhaseIndex, true),
                minAsk: await this.getMaxOrMinShout(gamePhaseIndex, false),
                bidAsk: order.price
            })
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
            const pairOrder = orders.find(o => o.id === pairOrderId)
            const pairUnits = this.game.params.phases[gamePhaseIndex].params.unitLists[pairOrder.positionIndex].split(' ')
            this.insertMoveEvent({
                orderId: order.id,
                period: gamePhaseIndex,
                subject: order.positionIndex,
                box: order.unitIndex,
                role: role,
                traderType: identity,
                valueCost: units[order.unitIndex],
                eventType: EVENT_TYPE.traded,
                eventTime: dateFormat(Date.now(), 'HH:MM:ss:l'),
                maxBid: await this.getMaxOrMinShout(gamePhaseIndex, true),
                minAsk: await this.getMaxOrMinShout(gamePhaseIndex, false),
                bidAsk: order.price,
                trade: TRADE.success,
                tradeOrder: trades.length,
                tradeTime: dateFormat(Date.now(), 'HH:MM:ss:l'),
                tradeType: role === ROLE.Seller ? TRADE_TYPE.buyerFirst : TRADE_TYPE.sellerFirst,
                price: pairOrder.price,
                profit: Math.abs(pairOrder.price - Number(units[order.unitIndex])),
                partnerSubject: pairOrder.positionIndex,
                partnerBox: pairOrder.unitIndex,
                partnerShout: pairOrder.price,
                partnerProfit: Math.abs(pairOrder.price - Number(pairUnits[pairOrder.unitIndex])),
                partnerId: pairOrderId
            })
            this.broadcast(PushType.newTrade, {resOrderId: order.id})
            return ShoutResult.tradeSuccess
        } else {
            (role === ROLE.Seller ? sellOrderIds : buyOrderIds).unshift(order.id)
            this.insertMoveEvent({
                orderId: order.id,
                period: gamePhaseIndex,
                subject: order.positionIndex,
                box: order.unitIndex,
                role: role,
                traderType: identity,
                valueCost: units[order.unitIndex],
                eventType: EVENT_TYPE.entered,
                eventTime: dateFormat(Date.now(), 'HH:MM:ss:l'),
                maxBid: await this.getMaxOrMinShout(gamePhaseIndex, true),
                minAsk: await this.getMaxOrMinShout(gamePhaseIndex, false),
                bidAsk: order.price
            })
            this.broadcast(PushType.newOrder, {newOrderId: order.id})
            return ShoutResult.shoutSuccess
        }
    }

    async cancelOrder(gamePhaseIndex: number, positionIndex: number, active = false) {
        const {phases, orders} = await this.stateManager.getGameState(),
            {buyOrderIds, sellOrderIds} = phases[gamePhaseIndex]
        const {positions} = this.game.params.phases.filter(ph => ph.templateName === phaseNames.assignPosition)[0].params
        for (let i = 0; i < buyOrderIds.length; i++) {
            if (orders.find(({id}) => id === buyOrderIds[i]).positionIndex === positionIndex) {
                if (active) {
                    const order = orders.find(({id}) => id === buyOrderIds[i])
                    const units = this.game.params.phases[gamePhaseIndex].params.unitLists[order.positionIndex].split(' ')
                    this.insertMoveEvent({
                        orderId: order.id,
                        period: gamePhaseIndex,
                        subject: order.positionIndex,
                        box: order.unitIndex,
                        role: positions[order.positionIndex].role,
                        traderType: positions[order.positionIndex].identity,
                        valueCost: units[order.unitIndex],
                        eventType: EVENT_TYPE.cancelled,
                        eventTime: dateFormat(Date.now(), 'HH:MM:ss:l'),
                        maxBid: await this.getMaxOrMinShout(gamePhaseIndex, true),
                        minAsk: await this.getMaxOrMinShout(gamePhaseIndex, false),
                        bidAsk: order.price
                    })
                }
                return buyOrderIds.splice(i, 1)
            }
        }
        for (let i = 0; i < sellOrderIds.length; i++) {
            if (orders.find(({id}) => id === sellOrderIds[i]).positionIndex === positionIndex) {
                if (active) {
                    const order = orders.find(({id}) => id === sellOrderIds[i])
                    const units = this.game.params.phases[gamePhaseIndex].params.unitLists[order.positionIndex].split(' ')
                    this.insertMoveEvent({
                        orderId: order.id,
                        period: gamePhaseIndex,
                        subject: order.positionIndex,
                        box: order.unitIndex,
                        role: positions[order.positionIndex].role,
                        traderType: positions[order.positionIndex].identity,
                        valueCost: units[order.unitIndex],
                        eventType: EVENT_TYPE.cancelled,
                        eventTime: dateFormat(Date.now(), 'HH:MM:ss:l'),
                        maxBid: await this.getMaxOrMinShout(gamePhaseIndex, true),
                        minAsk: await this.getMaxOrMinShout(gamePhaseIndex, false),
                        bidAsk: order.price
                    })
                }
                return sellOrderIds.splice(i, 1)
            }
        }
    }

    async getMaxOrMinShout(gamePhaseIndex: number, max: boolean): Promise<number | string> {
        const {phases, orders} = await this.stateManager.getGameState()
        const {buyOrderIds, sellOrderIds} = phases[gamePhaseIndex]
        if (max) {
            const buyOrderShouts = buyOrderIds.map(id => orders.find(order => order.id === id).price)
            buyOrderShouts.sort((a, b) => b - a)
            return buyOrderShouts[0] || ''
        } else {
            const sellOrderShouts = sellOrderIds.map(id => orders.find(order => order.id === id).price)
            sellOrderShouts.sort((a, b) => a - b)
            return sellOrderShouts[0] || ''
        }
    }

    //endregion
    //endregion

    //region result

    async onGameOver() {
        const gameState = await this.stateManager.getGameState()
        const playerStates = await this.stateManager.getPlayerStates(),
            playerStatesArray = Object.values(playerStates)

        const {positions} = this.game.params.phases.filter(ph => ph.templateName === phaseNames.assignPosition)[0].params
        const players = {}
        playerStatesArray.forEach(state => {
            const {positionIndex} = state
            if (positionIndex === undefined) {
                return
            }
            const periods = {}
            state.unitLists.forEach((unitStr, p) => {
                if (p === 0) return
                const units = {}
                unitStr.split(' ').forEach((unit, u) => {
                    units[u] = {
                        period: p,
                        subject: positionIndex,
                        box: u,
                        role: positions[positionIndex].role,
                        traderType: positions[positionIndex].identity,
                        valueCost: unit
                    }
                })
                periods[p] = units
            })
            players[positionIndex] = periods
        })

        const logs: Array<EventParams> = []

        const playerProfits: Array<number> = new Array(playerStatesArray.length).fill(0)

        const events = await this.getMoveEvent(
            {},
            {sort: {createAt: 1}}
        )
        events.map(e => e.data).forEach((data, i) => {
            const {period, subject, box, role, valueCost, traderType, trade, partnerSubject, partnerBox, partnerShout, partnerProfit, tradeOrder, tradeTime, tradeType, price, bidAsk, profit, eventType, orderId, eventTime, maxBid, minAsk, partnerId} = data
            //result
            if (trade) {
                players[subject][period][box] = {...data}
                let pair = players[partnerSubject][period][partnerBox]
                pair = Object.assign(pair, {
                    trade: TRADE.success,
                    tradeOrder,
                    tradeTime,
                    tradeType,
                    price,
                    profit: Math.abs(price - pair.valueCost),
                    partnerSubject: subject,
                    partnerBox: box,
                    partnerShout: bidAsk,
                    partnerProfit: profit
                })
            } else {
                players[subject][period][box] = {...data}
            }
            //log
            switch (eventType) {
                case EVENT_TYPE.rejected:
                case EVENT_TYPE.entered:
                    logs.push({
                        orderId,
                        period,
                        subject,
                        box,
                        role,
                        traderType,
                        valueCost,
                        eventType,
                        eventNum: i,
                        eventTime,
                        maxBid,
                        minAsk,
                        bidAsk
                    })
                    break
                case EVENT_TYPE.traded:
                    logs.push({
                        orderId,
                        period,
                        subject,
                        box,
                        role,
                        traderType,
                        valueCost,
                        eventType,
                        eventNum: i,
                        eventTime,
                        maxBid,
                        minAsk,
                        bidAsk,
                        trade,
                        tradeOrder,
                        tradeTime,
                        tradeType,
                        price,
                        profit,
                        partnerSubject,
                        partnerBox,
                        partnerShout,
                        partnerProfit
                    })
                    const pair = logs.find(l => l.orderId === partnerId)
                    Object.assign(pair, {
                        ...pair,
                        eventEndTime: eventTime,
                        matchEventNum: i,
                        trade: TRADE.success,
                        tradeOrder,
                        tradeTime,
                        tradeType,
                        price,
                        profit: Math.abs(price - pair.valueCost),
                        partnerSubject: subject,
                        partnerBox: box,
                        partnerShout: bidAsk,
                        partnerProfit: profit
                    })
                    break
                case EVENT_TYPE.cancelled:
                    logs.push({
                        orderId,
                        period,
                        subject,
                        box,
                        role,
                        traderType,
                        valueCost,
                        eventType,
                        eventNum: i,
                        eventTime,
                        maxBid,
                        minAsk,
                        bidAsk
                    })
                    const origin = logs.find(l => l.orderId === orderId)
                    Object.assign(origin, {
                        ...origin,
                        eventEndTime: eventTime,
                        matchEventNum: i
                    })
                    break
            }
            //profit
            if (profit) {
                playerProfits[subject] = playerProfits[subject] + profit
            }
            if (partnerProfit) {
                playerProfits[partnerSubject] = playerProfits[partnerSubject] + partnerProfit
            }
        })

        const resultData: Array<Array<any>> = [['Period', 'Subject', 'Box', 'Role: 0-seller,1-buyer', 'TraderType: 0-human,1-zip,2-gd', 'ValueCost', 'BidAsk', 'Trade', 'TradeOrder', 'TradeTime', 'TradeType: 1-buyer_first,2-seller_first', 'Price', 'Profit', 'PartnerSubject', 'PartnerBox', 'PartnerShout', 'PartnerProfit']]
        Object.values(players).forEach(period => {
            Object.values(period).forEach(box => {
                Object.values(box).forEach(params => {
                    const {period, subject, box, role, traderType, valueCost, trade, partnerSubject, partnerBox, partnerShout, partnerProfit, tradeOrder, tradeTime, tradeType, price, bidAsk, profit} = params as EventParams
                    resultData.push([
                        period,
                        Number(subject) + 1,
                        Number(box) + 1,
                        role,
                        traderType,
                        valueCost,
                        bidAsk || '',
                        trade || '',
                        tradeOrder || '',
                        tradeTime || '',
                        tradeType || '',
                        price || '',
                        profit || 0,
                        partnerSubject === undefined ? '' : Number(partnerSubject) + 1,
                        partnerBox === undefined ? '' : Number(partnerBox) + 1,
                        partnerShout === undefined ? '' : partnerShout,
                        partnerProfit === undefined ? '' : partnerProfit
                    ])
                })
            })
        })

        const logData: Array<Array<any>> = [['Period', 'Subject', 'Box', 'Role: 0-seller,1-buyer', 'TraderType: 0-human,1-zip,2-gd', 'ValueCost', 'EventType: 1-rejected,2-entered,3-traded,4-cancelled', 'EventNum', 'EventTime', 'EventEndTime', 'MaxBid', 'MinAsk', 'MatchEventNum', 'BidAsk', 'Trade', 'TradeOrder', 'TradeTime', 'TradeType: 1-buyer_first,2-seller_first', 'Price', 'Profit', 'PartnerSubject', 'PartnerBox', 'PartnerShout', 'PartnerProfit']]
        logs.forEach(log => {
            const {period, subject, box, role, traderType, valueCost, eventType, eventNum, eventTime, eventEndTime, maxBid, minAsk, matchEventNum, trade, partnerSubject, partnerBox, partnerShout, partnerProfit, tradeOrder, tradeTime, tradeType, price, bidAsk, profit} = log
            logData.push([
                period,
                Number(subject) + 1,
                Number(box) + 1,
                role,
                traderType,
                valueCost,
                eventType,
                Number(eventNum) + 1,
                eventTime,
                eventEndTime || '',
                maxBid,
                minAsk,
                matchEventNum === undefined ? '' : Number(matchEventNum) + 1,
                bidAsk || '',
                trade || '',
                tradeOrder || '',
                tradeTime || '',
                tradeType || '',
                price || '',
                profit || 0,
                partnerSubject === undefined ? '' : Number(partnerSubject) + 1,
                partnerBox === undefined ? '' : Number(partnerBox) + 1,
                partnerShout === undefined ? '' : partnerShout,
                partnerProfit === undefined ? '' : partnerProfit
            ])
        })

        const profitData: Array<Array<any>> = [['Period', 'Subject', 'PeriodProfit', 'MarketProfit', 'ShowUpFee', 'ExchangeRate', 'Money']]
        Object.values(players).forEach(period => {
            Object.values(period).forEach(box => {
                Object.values(box).forEach(params => {
                    const {period, subject, profit} = params as EventParams
                    profitData.push([
                        period,
                        Number(subject) + 1,
                        profit || 0,
                        playerProfits[subject],
                        '',
                        positions[subject].exchangeRate,
                        (playerProfits[subject] / Number(positions[subject].exchangeRate)).toFixed(2)
                    ])
                })
            })
        })

        Object.assign(gameState, {
            sheets: {
                [SheetType.result]: {
                    data: resultData
                },
                [SheetType.log]: {
                    data: logData
                },
                [SheetType.profit]: {
                    data: profitData
                }
            }
        })
    }

    //endregion

    //region util
    insertMoveEvent(data: Object): void {
        new Model.FreeStyleModel({data, game: this.game.id, key: DBKey.moveEvent}).save(err => {
            if (err) console.log(err)
        })
    }

    async getMoveEvent(query = {}, options = {sort: null}): Promise<Array<{ data: EventParams }>> {
        const queryObj = {...query, game: this.game.id, key: DBKey.moveEvent}
        if (options.sort) {
            return Model.FreeStyleModel.find(queryObj).lean().sort(options.sort).exec()
        }
        return Model.FreeStyleModel.find(queryObj).lean().exec()
    }

    //endregion
}
