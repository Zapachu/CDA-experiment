import * as React from 'react'
import * as style from './style.scss'
import {Button, Core, Lang, MaskLoading, baseEnum} from 'bespoke-client-util'
import {EYES, GameStage, MoveType, PushType} from '../config'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from '../interface'

export class Play4Owner extends Core.Play4Owner<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    lang = Lang.extractLang({
        unknown: ['???', '???'],
        startAnswerStage: ['开始答题', 'Start Answer Stage'],
        seatNumber: ['座位号', 'SeatNumber'],
        progress: ['进度', 'Progress'],
        countDown:['倒计时','CountDown']
    })

    render(): React.ReactNode {
        const {lang, props: {frameEmitter, game, gameState, playerStates}} = this
        const timeLeft = game.params.timeLimit*60 - gameState.time
        const timeLeftMin = Math.floor(timeLeft/60)
        const timeLeftSec = timeLeft%60
        const playerStatesArr = Object.values(playerStates)
        return <section className={style.play4Owner}>
            <label className={style.countDown}>{lang.countDown}<em>{timeLeftMin}:{timeLeftSec}</em></label>
            <table className={style.playerStates}>
                <tbody>
                <tr>
                    <td>{lang.seatNumber}({
                        playerStatesArr
                            .map<number>(({seatNumber})=>seatNumber?1:0)
                            .reduce((m,n)=>m+n,0)}/{
                        playerStatesArr.length
                    })</td>
                    <td>{lang.progress}</td>
                </tr>
                {
                    playerStatesArr.map(({seatNumber, anwsers = []}, i) =>
                        <tr key={i}>
                            <td>{seatNumber || lang.unknown}</td>
                            <td>{anwsers.length}/{EYES.length}</td>
                        </tr>
                    )
                }
                </tbody>
            </table>
            {
                gameState.gameStage === GameStage.seatNumber ?
                    <Button label={lang.startAnswerStage}
                            onClick={() => frameEmitter.emit(MoveType.startMainTest)}/> : null
            }
        </section>
    }
}
