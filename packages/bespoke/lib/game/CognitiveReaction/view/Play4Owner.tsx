import * as React from 'react'
import * as style from './style.scss'
import {Button, Core, Lang, MaskLoading, baseEnum} from 'client-vendor'
import {QUESTIONS, FetchType, GameStage, MoveType, PushType} from '../config'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from '../interface'

export class Play4Owner extends Core.Play4Owner<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> {
    lang = Lang.extractLang({
        gameHasNotStarted: ['实验尚未开始', 'Experiment has not started'],
        unknown: ['???', '???'],
        startAnwserStage: ['开始答题', 'Start Anwser Stage'],
        seatNumber: ['座位号', 'SeatNumber'],
        progress: ['进度', 'Progress'],
        countDown:['倒计时','CountDown']
    })

    render(): React.ReactNode {
        const {lang, props: {frameEmitter, game, gameState, playerStates}} = this
        if (gameState.status === baseEnum.GameStatus.notStarted) {
            return <MaskLoading label={lang.gameHasNotStarted}/>
        }
        const timeLeft = game.params.timeLimit*60 - gameState.time
        const timeLeftMin = timeLeft<0 ? 0 : Math.floor(timeLeft/60)
        const timeLeftSec = timeLeft<0 ? 0 : timeLeft%60
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
                    playerStatesArr.map(({seatNumber, answers=[]}, i) =>
                        <tr key={i}>
                            <td>{seatNumber || lang.unknown}</td>
                            <td>{answers.length}/{QUESTIONS.length}</td>
                        </tr>
                    )
                }
                </tbody>
            </table>
            {
                gameState.gameStage === GameStage.seatNumber ?
                    <Button label={lang.startAnwserStage}
                            onClick={() => frameEmitter.emit(MoveType.startMainTest)}/> : null
            }
        </section>
    }
}
