import {resMeta} from '../../util/resMeta'
import {gameData} from '../gameData'
import {PushType} from '../../../config'
import {Idea} from './Idea'

export class Player extends egret.DisplayObjectContainer {
    leftHand = new egret.Bitmap(RES.getRes(resMeta.preload.player_hand.name))
    rightHand = new egret.Bitmap(RES.getRes(resMeta.preload.player_hand.name))
    winText = new egret.Bitmap(RES.getRes(resMeta.preload.player_winner.name))

    constructor(private isMe?: boolean) {
        super()
        this.addEventListener(egret.Event.ADDED_TO_STAGE, () => this.init(), this)
    }

    win() {
        this.winText.visible = true
        const {y} = this
        egret.Tween.get(this.leftHand, {loop: true}).to({rotation: 90}, 300).to({rotation: 70}, 200)
        egret.Tween.get(this.rightHand, {loop: true}).to({rotation: -25}, 300).to({rotation: 15}, 200)
        egret.Tween.get(this, {loop: true})
            .to({y: -30}, 300, egret.Ease.sineIn)
            .to({y}, 200, egret.Ease.sineIn)
    }

    reset() {
        egret.Tween.removeTweens(this.leftHand)
        egret.Tween.removeTweens(this.rightHand)
        egret.Tween.removeTweens(this)
        this.removeChildren()
        this.init()
    }

    init() {
        const {leftHand, rightHand, winText} = this
        const body = new egret.Bitmap(RES.getRes(resMeta.preload.player_body.name))
        this.addChild(body)

        leftHand.anchorOffsetX = leftHand.width
        leftHand.x = 18
        leftHand.y = 50
        leftHand.rotation = 0
        this.addChild(leftHand)

        rightHand.anchorOffsetY = rightHand.height
        rightHand.x = body.width - 18
        rightHand.y = 50
        rightHand.rotation = 60
        this.addChild(rightHand)

        if (this.isMe) {
            const idea = new Idea(gameData.privatePrices[gameData.round].toString())
            idea.y = gameData.span(-.7)
            idea.x = gameData.span(.25)
            this.addChild(idea)
        }

        winText.y = -winText.height
        winText.visible = false
        this.addChild(winText)
    }
}

export class Host extends Player {
    leftHand = new egret.Bitmap(RES.getRes(resMeta.preload.player_hand_withHammer.name))

    constructor() {
        super()
        gameData.frameEmitter.on(PushType.win, () => this.deal())
    }

    deal() {
        egret.Tween.get(this.leftHand).to({rotation: -10}, 200).to({rotation: 10}, 200)
    }
}