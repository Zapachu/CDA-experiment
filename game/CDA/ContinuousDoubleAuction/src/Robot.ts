import {Log, Model, redisClient} from '@bespoke/server';
import {BaseRobot} from '@bespoke/robot';
import {
    AdjustDirection,
    DBKey,
    IDENTITY,
    MarketStage,
    MoveType, orderNumberLimit,
    phaseNames,
    PushType,
    ReactionType,
    RedisKey,
    RobotCalcLog,
    RobotSubmitLog,
    ROLE,
    ShoutResult
} from './config';
import {pointPair2Curve} from './util';
import {CreateParams, GameState, ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from './interface';
import dateFormat = require('dateformat');

export default class Robot extends BaseRobot<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    async init(): Promise<this> {
        await super.init();
        this.frameEmitter.on(PushType.assignedPosition, () => {
            setTimeout(() => this.frameEmitter.emit(MoveType.enterMarket, {seatNumber: ~~(Math.random() * 10000)}), Math.random() * 3000);
        });
        this.frameEmitter.on(PushType.periodOpen, () => {
            const {positions} = this.game.params.phases[0].params,
                {positionIndex} = this.playerState,
                position = {...positions[positionIndex]};
            switch (position.identity) {
                case IDENTITY.ZipRobot:
                    new ZipRobot(this).init();
                    break;
                case IDENTITY.GDRobot:
                    new GDRobot(this).init();
                    break;
            }
        });
        return this;
    }
}

class CDARobot {
    constructor(private host: Robot) {
    }

    get game() {
        return this.host.game;
    }

    get gameState() {
        return this.host.gameState;
    }

    get playerState() {
        return this.host.playerState;
    }

    get frameEmitter() {
        return this.host.frameEmitter;
    }

    get gamePhaseState(): GameState.IGamePhaseState {
        return this.gameState.phases[this.gameState.gamePhaseIndex];
    }

    get orderDict(): { [id: number]: GameState.IOrder } {
        const orderDict: { [id: number]: GameState.IOrder } = {};
        this.gameState.orders.forEach(order => {
            orderDict[order.id] = order;
        });
        return orderDict;
    }

    get unitIndex(): number {
        return this.gamePhaseState.positionUnitIndex[this.playerState.positionIndex];
    }

    get unitPrice(): number {
        return this.unitPrices[this.unitIndex] || 0;
    }

    get unitPrices(): Array<number> {
        const {gameState: {gamePhaseIndex}, playerState: {unitLists}} = this;
        return unitLists[gamePhaseIndex].split(' ').map(p => +p);
    }

    get position(): CreateParams.Phase.Params.IPosition {
        const {positions} = this.game.params.phases[0].params,
            {positionIndex} = this.playerState,
            position = {...positions[positionIndex]};
        position.interval = 1000 * position.interval;
        return position;
    }

    getPosition(index: number): CreateParams.Phase.Params.IPosition {
        const {positions} = this.game.params.phases[0].params;
        return positions[index];

    }

    formatPrice(price: number) {
        return Math.round(price);
    }

    async init(): Promise<CDARobot> {
        return this;
    }

    buildRobotSubmitLog(seq: number, price: number): Partial<RobotSubmitLog> {
        const {unitIndex, unitPrice, gamePhaseState: {buyOrderIds, sellOrderIds}, orderDict} = this;
        return {
            seq,
            playerSeq: this.playerState.positionIndex + 1,
            unitIndex,
            role: ROLE[this.position.role],
            ValueCost: unitPrice,
            price,
            buyOrders: buyOrderIds.map(id => orderDict[id].price).join(','),
            sellOrders: sellOrderIds.map(id => orderDict[id].price).join(','),
            timestamp: dateFormat(Date.now(), 'HH:MM:ss:l')
        };
    }

    wouldBeRejected(price: number): [boolean, number] {
        const {gamePhaseState: {buyOrderIds, sellOrderIds}, orderDict} = this;
        const [wouldBeRejected = false, rejectPrice] = {
            [ROLE.Seller]: sellOrderIds[0] ? [price >= orderDict[sellOrderIds[0]].price, orderDict[sellOrderIds[0]].price] : [],
            [ROLE.Buyer]: buyOrderIds[0] ? [price <= orderDict[buyOrderIds[0]].price, orderDict[buyOrderIds[0]].price] : []
        }[this.position.role];
        return [wouldBeRejected, rejectPrice];
    }
}

interface IZipFreeField {
    beta: number
    r: number
    Gamma: number
    u: number
    calcPrice?: number
}

class ZipRobot extends CDARobot {
    zipActive: boolean;
    zipFreeField: IZipFreeField;

    get sleepTime(): number {
        return this.position.interval * (0.75 + 0.5 * Math.random());
    }

    async init(): Promise<this> {
        await super.init();
        this.frameEmitter.on(PushType.newOrder, ({newOrderId}) => {
            if (!this.zipActive) {
                return;
            }
            if (this.position.reactionType === ReactionType.TradeAndOrder || this.playerState.positionIndex === this.orderDict[newOrderId].positionIndex) {
                this.respondNewOrder(newOrderId);
            }
        });
        this.frameEmitter.on(PushType.newTrade, ({resOrderId}) => {
            if (!this.zipActive) {
                return;
            }
            this.respondNewTrade(resOrderId);
        });
        this.zipActive = false;
        setTimeout(() => {
            const u = (this.position.role === ROLE.Seller ? 1 : -1) * (.05 + .3 * Math.random()),
                calcPrice = this.formatPrice(this.unitPrice * (1 + u));
            this.zipActive = true;
            this.zipFreeField = {
                beta: 0.1 + 0.4 * Math.random(),
                r: 0.1 * Math.random(),
                Gamma: 0,
                u,
                calcPrice
            };
            setTimeout(() => this.wakeUp(), this.sleepTime);
        }, this.game.params.phases[this.gameState.gamePhaseIndex].params.startTime[this.playerState.positionIndex]);
        return this;
    }

    wakeUp(): void {
        if (this.game.params.phases[this.gameState.gamePhaseIndex].templateName === phaseNames.mainGame &&
            this.gamePhaseState.marketStage === MarketStage.trading && this.unitPrice) {
            redisClient.incr(RedisKey.robotActionSeq(this.game.id)).then(seq => this.submitOrder(seq));
            setTimeout(() => this.wakeUp(), this.sleepTime);
        }
    }

    respondNewOrder(newOrderId: number) {
        const {orderDict, game, position: {role}, zipFreeField: {calcPrice}} = this,
            newOrder = orderDict[newOrderId],
            {positions} = game.params.phases[0].params;
        const {role: newOrderRole} = positions[newOrder.positionIndex];
        if (newOrderRole === role &&
            ((role === ROLE.Buyer && calcPrice <= newOrder.price) ||
                (role === ROLE.Seller && calcPrice >= newOrder.price)
            )) {
            this.adjustProfitRate(AdjustDirection.lower, newOrder.price);
        }
    }

    respondNewTrade(resOrderId: number) {
        const {orderDict, game, position: {role}} = this,
            resOrder = orderDict[resOrderId],
            {positions} = game.params.phases[0].params;
        const {reqId} = this.gamePhaseState.trades.find(({resId}) => resId === resOrderId),
            {price: tradePrice} = orderDict[reqId];
        const resRole = positions[resOrder.positionIndex].role;
        if ((role === ROLE.Buyer && this.zipFreeField.calcPrice >= tradePrice) ||
            (role === ROLE.Seller && this.zipFreeField.calcPrice <= tradePrice)) {
            this.adjustProfitRate(AdjustDirection.raise, tradePrice);
        } else if (resRole !== role) {
            this.adjustProfitRate(AdjustDirection.lower, tradePrice);
        }
    }

    adjustProfitRate(adjustDirection: AdjustDirection, q: number): void {
        const {position: {role}, unitPrice, unitIndex} = this;
        let prePrice = this.zipFreeField.calcPrice || unitPrice * (1 + this.zipFreeField.u);
        const {beta, r, Gamma} = this.zipFreeField;
        const tmp = (adjustDirection === AdjustDirection.raise ? 0.05 : -0.05) * (role === ROLE.Seller ? 1 : -1),
            R = (1 + Math.random() * tmp), A = Math.random() * tmp;
        const tau = R * q + A,
            delta = beta * (tau - prePrice);
        this.zipFreeField.Gamma = Gamma * r + (1 - r) * delta;
        let newPrice = this.formatPrice(prePrice + this.zipFreeField.Gamma);
        const priceOverflow = {
            [ROLE.Seller]: newPrice < unitPrice,
            [ROLE.Buyer]: newPrice > unitPrice
        }[role];
        if (priceOverflow) {
            newPrice = unitPrice;
        }
        if (newPrice !== prePrice) {
            this.zipFreeField.calcPrice = newPrice;
            redisClient.incr(RedisKey.robotActionSeq(this.game.id)).then(async seq => {
                const data: RobotCalcLog = {
                    seq,
                    playerSeq: this.playerState.positionIndex + 1,
                    unitIndex,
                    role: ROLE[this.position.role],
                    R,
                    A,
                    q,
                    tau,
                    beta,
                    p: prePrice,
                    delta,
                    r,
                    LagGamma: Gamma,
                    Gamma: this.zipFreeField.Gamma,
                    ValueCost: unitPrice,
                    u: newPrice / unitPrice - 1,
                    CalculatedPrice: newPrice,
                    timestamp: dateFormat(Date.now(), 'HH:MM:ss:l')
                };
                await new Model.FreeStyleModel({
                    game: this.game.id,
                    key: DBKey.robotCalcLog,
                    data
                }).save();
            });
        }
    }

    submitOrder(seq: number): void {
        const {
            zipFreeField: {calcPrice},
            gameState: {gamePhaseIndex},
            unitIndex
        } = this;
        const [wouldBeRejected, rejectPrice] = this.wouldBeRejected(calcPrice);
        if (wouldBeRejected) {
            this.zipFreeField.calcPrice = calcPrice;
            this.adjustProfitRate(AdjustDirection.lower, rejectPrice);
            return;
        }
        this.zipFreeField.u = calcPrice / this.unitPrice - 1;
        const data = this.buildRobotSubmitLog(seq, calcPrice);
        this.frameEmitter.emit(MoveType.submitOrder, {
            price: calcPrice,
            unitIndex,
            gamePhaseIndex
        }, async (shoutResult: ShoutResult, marketBuyOrders, marketSellOrders) => {
            await new Model.FreeStyleModel({
                game: this.game.id,
                key: DBKey.robotSubmitLog,
                data: {...data, shoutResult, marketBuyOrders, marketSellOrders}
            }).save();
        });
    }
}

class GDRobot extends CDARobot {
    alpha = .95;
    beta = 400;
    calcPrice = 0;

    async init(): Promise<this> {
        await super.init();
        global.setTimeout(()=>this.sleepLoop(), Math.random() * 5e3)
        return this;
    }

    sleepLoop() {
        const playing = this.game.params.phases[this.gameState.gamePhaseIndex].templateName === phaseNames.mainGame &&
            this.gamePhaseState.marketStage === MarketStage.trading && this.unitPrice;
        if (!playing) {
            return;
        }
        this.calc();
        const {alpha, beta, calcPrice} = this,
            sleepTime = beta * (1 - alpha) * calcPrice;
        setTimeout(() => {
            redisClient.incr(RedisKey.robotActionSeq(this.game.id)).then(seq => this.submitOrder(seq));
            this.sleepLoop();
        }, sleepTime);
    }

    getM() {
        let M = 0;
        for (let price of this.unitPrices) {
            price > M ? M = price : null;
        }
        return Math.pow(2, 2 + ~~Math.log2(M));
    }

    getExpectationCurve(): Array<{ from: number, to: number, curve: (price: number) => number }> {
        const {gameState: {orders, gamePhaseIndex}, gamePhaseState: {trades}} = this,
            recentTrades = trades.slice(-5),
            recentReqOrders = recentTrades.map(({reqId}) => reqId),
            recentResOrders = recentTrades.map(({resId}) => resId),
            M = this.getM();
        let anchorPoints: Array<{
            price: number
            p: number
        }> = this.position.role === ROLE.Seller ?
            [{price: 0, p: 1}, {price: M, p: 0}] :
            [{price: 0, p: 0}, {price: M, p: 1}];
        const markedOrderId = recentResOrders[0] || orderNumberLimit * gamePhaseIndex,
            historyOrder = orders.filter(({id}) => (id > markedOrderId) && !recentResOrders.includes(id));
        historyOrder.map(({price}) => {
            if(anchorPoints.some(p=>p.price === price)){
                return
            }
            let TA = 0, B = 0, RA = 0, TB = 0, A = 0, RB = 0;
            for (let order of historyOrder) {
                const isSeller = this.getPosition(order.positionIndex);
                if (order.price >= price) {
                    isSeller ? recentReqOrders.includes(order.id) ? TA++ : RA++ : B++;
                }
                if (order.price <= price) {
                    isSeller ? A++ : recentReqOrders.includes(order.id) ? TB++ : RB++;
                }
            }
            const p = this.position.role === ROLE.Seller ? (TA + B) / (TA + B + RA) : (TB + A) / (TB + A + RB);
            anchorPoints.push({price, p});
        });
        anchorPoints = anchorPoints.sort((p1, p2) => p1.price - p2.price);
        Log.d(this.position.role === ROLE.Seller, this.unitPrice, anchorPoints)
        return anchorPoints.slice(1).map((p2, i) => {
            const p1 = anchorPoints[i];
            return {
                from: p1.price,
                to: p2.price,
                curve: pointPair2Curve(p1, p2)
            };
        });
    }

    getCurvesTopPoint(curves: Array<{ from: number, to: number, curve: (price: number) => number }>, f: number, t: number, coefficient: (price: number) => number): {
        price: number,
        curveIndex: number
    } {
        let curveIndex = 0, maxE = 0, maxEPrice = f;
        for (let price = f+1; price < t; price++) {
            const {to, curve} = curves[curveIndex];
            const e = coefficient(price) * curve(price);
            if (e > maxE) {
                maxE = e;
                maxEPrice = price;
            }
            if (price === to) {
                curveIndex++;
            }
        }
        return {price: maxEPrice, curveIndex};
    }

    calc() {
        const {gamePhaseState: {sellOrderIds, buyOrderIds}, orderDict} = this;
        const curves = this.getExpectationCurve();
        let f: number = null, t: number = null, profitSign = 1;
        if (this.position.role === ROLE.Seller) {
            f = this.unitPrice;
            t = sellOrderIds[0] ? orderDict[sellOrderIds[0]].price : curves[curves.length - 1].to;
        } else {
            profitSign = -1;
            f = buyOrderIds[0] ? orderDict[buyOrderIds[0]].price : curves[0].from;
            t = this.unitPrice;
        }
        this.calcPrice = this.getCurvesTopPoint(curves, f, t, price => (price - this.unitPrice) * profitSign).price;
    }


    submitOrder(seq: number): void {
        const {gameState: {gamePhaseIndex}, calcPrice, unitIndex} = this;
        const [wouldBeRejected = false, rejectPrice] = this.wouldBeRejected(this.calcPrice);
        if (wouldBeRejected) {
            Log.i('Reject', rejectPrice);
            return;
        }
        const data = this.buildRobotSubmitLog(seq, this.calcPrice);
        this.frameEmitter.emit(MoveType.submitOrder, {
            price: calcPrice,
            unitIndex,
            gamePhaseIndex
        }, async (shoutResult: ShoutResult, marketBuyOrders, marketSellOrders) => {
            await new Model.FreeStyleModel({
                game: this.game.id,
                key: DBKey.robotSubmitLog,
                data: {...data, shoutResult, marketBuyOrders, marketSellOrders}
            }).save();
        });
    }
}
