import {resMeta} from '../util/resMeta'
import {config} from 'bespoke-client'
import {namespace} from '../../config'
import {OperateBar} from './OperateBar'
import {Market} from './Market'
import {gameData} from './gameData'

export class Main extends egret.DisplayObjectContainer {
    constructor() {
        super()
        this.addEventListener(egret.Event.ADDED_TO_STAGE, async () => {
            await RES.loadConfig(resMeta.name, `${location.origin}/${config.rootName}/${namespace}/static`)
            await RES.loadGroup(resMeta.preload.name)
            this.addChild(new Market())
            this.addChild(new OperateBar())
            //region debug
            const shape = new egret.Shape()
            shape.graphics.lineStyle(.5, 0, .25, true, null, null, null, null, [10, 1])
            new Array(gameData.col).fill(null).forEach((x, i) => {
                shape.graphics.moveTo(gameData.span(i), 0)
                shape.graphics.lineTo(gameData.span(i), gameData.stageHeight)
            })
            new Array(gameData.row).fill(null).forEach((x, i) => {
                shape.graphics.moveTo(0, gameData.span(i))
                shape.graphics.lineTo(gameData.stageWidth, gameData.span(i))
            })
            this.addChild(shape)
            //endregion
        }, this)
    }
}