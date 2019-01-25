import * as React from 'react'
import {baseEnum, Core, loadThirdPartyLib, MaskLoading} from 'client-vendor'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from '../../interface'
import {FetchType, MoveType, PushType} from '../../config'
import {gameData} from './gameData'

interface IPlayState {
    loading: boolean
}

export class Play extends Core.Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType, IPlayState> {
    state: IPlayState = {
        loading: true
    }

    componentDidMount(): void {
        const {props: {game, frameEmitter, playerState}} = this
        frameEmitter.emit(MoveType.getPosition, null, (positionIndex, privatePrices) => {
            gameData.init(game, frameEmitter, playerState.actor.token, positionIndex, privatePrices)
            loadThirdPartyLib(baseEnum.ThirdPartyLib.egret, () => {
                this.startMain(egret)
            })
        })
    }

    applyHistoryFrames() {
        const {props: {frameEmitter, gameState, playerState: {groupIndex, pushFrames}}} = this
        const historyFrames = [...gameState.broadcastFrames.filter(frame => frame.groupIndex === groupIndex), ...pushFrames]
            .sort((m, n) => m.seq - n.seq)
        let cursor = 0
        const timer = window.setInterval(() => {
            if (cursor === historyFrames.length) {
                this.setState({
                    loading: false
                })
                return window.clearInterval(timer)
            }
            const {type, params} = historyFrames[cursor++]
            frameEmitter.trigger(type, params)
        }, 100)
    }

    startMain(egret) {
        const applyHistoryFrames = () => this.applyHistoryFrames()
        window[gameData.dataEntryClassName] = class extends egret.DisplayObjectContainer {
            constructor() {
                super()
                const {Main} = require('./Main')
                this.addChild(new Main())
                setTimeout(applyHistoryFrames, 300)
            }
        }

        egret.runEgret()
    }

    render(): React.ReactNode {
        const {state: {loading}} = this
        return <div className={gameData.egretContainerClassname}
                    style={{
                        width: '100%',
                        height: '100%'
                    }}
                    data-entry-class={gameData.dataEntryClassName}
                    data-orientation="auto"
                    data-scale-mode="showAll"
                    data-frame-rate="30"
                    data-content-width={gameData.stageWidth}
                    data-content-height={gameData.stageHeight}
                    data-multi-fingered="2"
                    data-show-fps="false" data-show-log="false"
                    data-show-fps-style="x:0,y:0,size:12,textColor:0xffffff,bgAlpha:0.9">
            {
                loading ? <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    background: 'rgba(255,255,255,.9)',
                    zIndex: 1
                }}><MaskLoading/></div> : null
            }
        </div>
    }
}