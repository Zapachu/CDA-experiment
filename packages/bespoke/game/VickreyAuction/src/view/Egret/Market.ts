import {Lang} from 'bespoke-client'
import {Players} from './Players'
import {resMeta} from '../util/resMeta'
import {gameData} from './gameData'
import {Host} from './component'
import {PushType} from '../../config'

export class Market extends egret.DisplayObjectContainer {
    label = new egret.TextField()
    background = new egret.Bitmap(RES.getRes(resMeta.preload.background.name))
    image = new egret.Bitmap()
    desk = new egret.Bitmap(RES.getRes(resMeta.preload.desk.name))
    players = new Players()

    lang = Lang.extractLang({
        round: [n => `第${n}轮`, n => `Round ${n}`],
        startingPrice: ['起拍价', 'Starting Price']
    })

    constructor() {
        super()
        this.addEventListener(egret.Event.ADDED_TO_STAGE, () => this.init(), this)
        gameData.frameEmitter.on(PushType.newRound, ({round}) => {
            gameData.round = round
            this.init()
        })
    }

    init() {
        const {lang, background, label, image, desk, players} = this
        background.height = gameData.span(6.8)
        background.width = gameData.stageWidth
        this.addChild(background)

        image.texture = RES.getRes([resMeta.preload.pikachu.name, resMeta.preload.eevee.name][gameData.round % 2])
        const p = image.height / gameData.span(1.2)
        image.x = gameData.span(4.6)
        image.y = gameData.span(1.5)
        image.height /= p
        image.width /= p
        this.addChild(image)

        label.text = `${lang.round(gameData.round + 1)},${lang.startingPrice}:${gameData.game.params.startingPrice}`
        label.textColor = 0x333333
        label.y = gameData.span(3.2)
        label.x = gameData.span(5) - label.width / 2
        this.addChild(label)

        const host = new Host()
        host.x = gameData.span(2.7)
        host.y = gameData.span(2.5)
        this.addChild(host)

        desk.x = gameData.span(2.5)
        desk.y = gameData.span(3.2)
        this.addChild(desk)

        players.x = gameData.span(2)
        players.y = gameData.span(4.75)
        players.width = gameData.span(6)
        players.height = gameData.span(1.5)
        this.addChild(players)
    }
}