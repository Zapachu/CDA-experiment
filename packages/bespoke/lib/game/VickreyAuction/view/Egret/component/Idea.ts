import {resMeta} from '../../util/resMeta'

export class Idea extends egret.DisplayObjectContainer {
    constructor(private label: string) {
        super()
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.init, this)
    }

    init() {
        const wrapper = new egret.Bitmap(RES.getRes(resMeta.preload.player_idea.name))
        this.addChild(wrapper)
        const label = new egret.TextField()
        label.text = this.label
        label.textColor = 0x333333
        label.x = wrapper.width - label.width>>1
        label.y = wrapper.height - label.height>>2
        this.addChild(label)
    }
}