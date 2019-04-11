import {resMeta} from '../../util/resMeta'

export class Button extends egret.DisplayObjectContainer {
    constructor(private label: string, private onClick: Function) {
        super()
        this.touchEnabled = true
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.init, this)
    }

    init() {
        const btn = new egret.Bitmap(RES.getRes(resMeta.preload.button.name))
        this.addChild(btn)

        const text = new egret.TextField()
        text.text = this.label
        text.textColor = 0x000
        text.x = this.width - text.width >> 1
        text.y = this.height - text.height >> 1
        this.addChild(text)
    }
}