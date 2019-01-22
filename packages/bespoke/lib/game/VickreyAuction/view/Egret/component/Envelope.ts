import {resMeta} from '../../util/resMeta'

export class Envelope extends egret.Bitmap {

    constructor(private defaultPosition: { x: number, y: number }, private sentPosition: { x: number, y: number }) {
        super()
    }

    init(){
        this.texture = RES.getRes(resMeta.preload.envelope.name)
        this.x = this.defaultPosition.x
        this.y = this.defaultPosition.y
        this.scaleX = .2
        this.scaleY = .2
        this.visible = false
    }

    send() {
        this.visible = true
        egret.Tween.get(this).to({
            x: this.sentPosition.x,
            y: this.sentPosition.y,
            scaleX: .4,
            scaleY: .4
        }, 300)
    }

    reset() {
        this.init()
    }
}