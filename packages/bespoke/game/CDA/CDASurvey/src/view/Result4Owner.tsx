import * as React from 'react'
import * as style from './style.scss'
import {Core, Lang, Request} from 'elf-component'
import {ICreateParams, IGameState, IMoveParams, IPlayerState} from '../interface'
import {MoveType, SheetType, SURVEY_STAGE, namespace, FetchRoute} from '../config'

export class Result4Owner extends Core.Result4Owner<ICreateParams, IGameState, IPlayerState, MoveType, IMoveParams> {
    lang = Lang.extractLang({
        result: ['游戏结果', 'Game Result'],
        seatNumber: ['座位号', 'Seat Number'],
        point: ['得分', 'Point'],
        correctNumber: ['正确题数', 'Correct Number'],
        export: ['导出', 'Export'],
        unknown: ['???', '???'],
        [SheetType[SheetType.result]]: ['结果', 'Result'],
    })

    render(): React.ReactNode {
        const {lang, props: {travelStates, game}} = this
        return <section className={style.result4Owner}>
            <table className={style.resultTable}>
                <tbody>
                <tr>
                    <td>{lang.seatNumber}</td>
                    <td>{lang.correctNumber}</td>
                </tr>
                {
                    Object.values(travelStates[travelStates.length - 1].playerStates).map(({seatNumber, surveyStage = SURVEY_STAGE.basic}, i) =>
                        <tr key={i}>
                            <td>{seatNumber || lang.unknown}</td>
                            <td>{surveyStage}</td>
                        </tr>
                    )
                }
                </tbody>
            </table>
            <div className={style.exportWrapper}>
                <label>{lang.export}</label>
                <div>
                    {
                        Object.values(SheetType).map(sheetType =>
                            <a key={sheetType}
                               href={Request.buildUrl(namespace, FetchRoute.exportXls, {gameId:game.id}, {sheetType})}>
                                {lang[SheetType[sheetType]]}</a>)
                    }
                </div>
            </div>
        </section>
    }
}