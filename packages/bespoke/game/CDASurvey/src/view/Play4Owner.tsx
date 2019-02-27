import * as React from 'react'
import * as style from './style.scss'
import {Button, Core, Lang, MaskLoading, baseEnum} from 'bespoke-client'
import {FetchType, MoveType, PushType, SURVEY_STAGE, GameStage} from '../config'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from '../interface'

export class Play4Owner extends Core.Play4Owner<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> {
    lang = Lang.extractLang({
        gameHasNotStarted: ['游戏尚未开始', 'Game has not Started'],
        unknown: ['???', '???'],
        startAnwserStage: ['开始答题', 'Start Anwser Stage'],
        seatNumber: ['座位号', 'Seat Number'],
        surveyStage: ['问卷进度', 'Survey Stage'],
        countDown: ['倒计时', 'Countdown']
    })

    render(): React.ReactNode {
        const {lang, props: {frameEmitter, gameState, playerStates}} = this
        if (gameState.status === baseEnum.GameStatus.notStarted) {
            return <MaskLoading label={lang.gameHasNotStarted}/>
        }
        const playerStatesArr = Object.values(playerStates)
        return <section className={style.play4Owner}>
            <table className={style.playerStates}>
                <tbody>
                <tr>
                    <td>{lang.seatNumber}({
                        playerStatesArr
                            .map<number>(({seatNumber})=>seatNumber?1:0)
                            .reduce((m,n)=>m+n,0)}/{
                        playerStatesArr.length
                    })</td>
                    <td>{lang.surveyStage}</td>
                </tr>
                {
                    playerStatesArr.map(({seatNumber, surveyStage = SURVEY_STAGE.basic}, i) =>
                        <tr key={i}>
                            <td>{seatNumber || lang.unknown}</td>
                            <td>{surveyStage + 1}</td>
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