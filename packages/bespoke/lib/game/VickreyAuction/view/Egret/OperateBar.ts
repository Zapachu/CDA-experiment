import {gameData} from './gameData'
import {MoveType, PushType} from '../../config'
import {Lang, Toast} from 'client-vendor'
import {Button, Input} from './component'

export class OperateBar extends egret.DisplayObjectContainer {
    lang = Lang.extractLang({
        enterMarket: ['进入市场', 'Enter Market'],
        shout: ['报价', 'Shout']
    })

    enterBtn: Button
    priceInput: PriceInput

    constructor() {
        super()
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.init, this)
        gameData.frameEmitter.on(PushType.playerEnter, ({positionIndex}) => this.onPlayerEnter(positionIndex))
        gameData.frameEmitter.on(PushType.someoneShout, ({positionIndex}) => this.onSomeoneShout(positionIndex))
        gameData.frameEmitter.on(PushType.newRound, () => {
            this.priceInput.visible = true
        })
    }

    init() {
        this.y = gameData.span(7)
        this.enterBtn = new Button(this.lang.enterMarket, () => gameData.frameEmitter.emit(MoveType.enterMarket))
        this.enterBtn.x = gameData.span(4)
        this.addChild(this.enterBtn)

        this.priceInput = new PriceInput()
        this.priceInput.x = gameData.span(3)
        this.priceInput.width = gameData.span(4)
        this.priceInput.visible = false
        this.addChild(this.priceInput)

    }

    onSomeoneShout(positionIndex: number) {
        if (positionIndex === gameData.positionIndex) {
            this.priceInput.visible = false
        }
    }

    onPlayerEnter(positionIndex: number) {
        if (positionIndex == gameData.positionIndex) {
            this.enterBtn.visible = false
            this.priceInput.visible = true
        }
    }
}

class PriceInput extends egret.DisplayObjectContainer {
    lang = Lang.extractLang({
        shout: ['报价', 'Shout'],
        invalidPrice: ['价格需在起拍价与心理价值之间', 'Price shout be between starting price and private price']
    })

    price: number

    constructor() {
        super()
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.init, this)
    }

    init() {
        const input = new Input(text => this.price = Number(text))
        input.x = gameData.span(.5)
        this.addChild(input)
        const shoutBtn = new Button(this.lang.shout, () => this.submit())
        shoutBtn.x = gameData.span(1)
        shoutBtn.y = gameData.span(1.2)
        this.addChild(shoutBtn)
    }

    submit() {
        if (this.price < gameData.game.params.startingPrice || this.price > gameData.privatePrices[gameData.round]) {
            return Toast.warn(this.lang.invalidPrice)
        }
        gameData.frameEmitter.emit(MoveType.shout, {price: this.price})
    }
}