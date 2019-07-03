import * as React from 'react'
import * as style from './style.scss'
import {Button, Lang} from 'elf-component'
import {Core} from '@bespoke/client-sdk'
import {GameStage, MoveType, PushType, SURVEY_STAGE} from '../config'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from '../interface'

export class Play4Owner extends Core.Play4Owner<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    lang = Lang.extractLang({
        unknown: ['???', '???'],
        startAnswerStage: ['开始答题', 'Start Answer Stage'],
        seatNumber: ['座位号', 'Seat Number'],
        surveyStage: ['问卷进度', 'Survey Stage'],
        countDown: ['倒计时', 'Countdown']
    })

    render(): React.ReactNode {
        const {lang, props: {frameEmitter, gameState, playerStates}} = this
        const playerStatesArr = Object.values(playerStates)
        return <section className={style.play4Owner}>
            <table className={style.playerStates}>
                <tbody>
                <tr>
                    <td>{lang.seatNumber}({
                        playerStatesArr
                            .map<number>(({seatNumber}) => seatNumber ? 1 : 0)
                            .reduce((m, n) => m + n, 0)}/{
                        playerStatesArr.length
                    })
                    </td>
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
                    <Button label={lang.startAnswerStage}
                            onClick={() => frameEmitter.emit(MoveType.startMainTest)}/> : null
            }
        </section>
    }
}