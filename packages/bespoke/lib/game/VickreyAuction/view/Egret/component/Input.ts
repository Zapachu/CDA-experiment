import {resMeta} from '../../util/resMeta'
import {gameData} from '../gameData'

export class Input extends egret.DisplayObjectContainer {
    textField: egret.TextField

    constructor(private onChange: Function) {
        super()
        this.touchEnabled = true
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, () => this.textField.setFocus(), this)
        this.addEventListener(egret.Event.ADDED_TO_STAGE, () => this.init(), this)
    }

    init() {
        const container = new egret.Bitmap(RES.getRes(resMeta.preload.input.name))
        this.addChild(container)

        this.textField = new egret.TextField()
        this.textField.textColor = 0x000
        this.textField.type = egret.TextFieldType.INPUT
        this.textField.x = gameData.span(.5)
        this.textField.y = container.height - this.textField.height >> 1
        this.textField.width = gameData.span(2)
        this.textField.addEventListener(egret.Event.CHANGE, ({target: {text}}) => this.onChange(text), this)
        this.addChild(this.textField)
    }
}
