import * as React from 'react'
import * as style from './style.scss'
import {Core, Lang} from 'bespoke-client-util'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from '../interface'
import {FetchType, MoveType, PushType, Stage, SheetType} from '../config'

interface IPlay4OwnerState {
  timer?: number
}

export class Play4Owner extends Core.Play4Owner<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType, IPlay4OwnerState> {
    lang = Lang.extractLang({
        group: ['组', 'Group'],
        seatNumber: ['座位号', 'Seat Number'],
        stage: ['阶段', 'Stage'],
        round: ['轮次', 'Round'],
        [Stage[Stage.Seat]]: ['输入座位号', 'Input Seat Number'],
        [Stage[Stage.Test]]: ['理解测试', 'Comprehension Test'],
        [Stage[Stage.Main]]: ['主实验', 'Main Game'],
        [Stage[Stage.Survey]]: ['问卷', 'Survey'],
        [Stage[Stage.End]]: ['结束', 'End'],
        [SheetType[SheetType.result]]: ['导出结果', 'Export Result']
    })

    state: IPlay4OwnerState = {}

    render(): React.ReactNode {
        const {lang, props: {playerStates, fetcher}} = this
        return <section className={style.play4Owner}>
            <a className={style.exportBtn} href={fetcher.buildGetUrl(FetchType.exportXlsPlaying, {sheetType: SheetType.result})}>{lang[SheetType[SheetType.result]]}</a>
            <table className={style.resultTable}>
                <tbody>
                <tr>
                    <td>{lang.group}</td>
                    <td>{lang.seatNumber}</td>
                    <td>{lang.stage}</td>
                    <td>{lang.round}</td>
                </tr>
                {
                    Object.values(playerStates).map((ps, i) => <tr key={i}>
                        <td>{ps.groupIndex!==undefined ? ps.groupIndex+1 : '-'}</td>
                        <td>{ps.seatNumber!==undefined ? ps.seatNumber : '-'}</td>
                        <td>{lang[Stage[ps.stage]] || '-'}</td>
                        <td>{ps.stage===Stage.Main ? ps.roundIndex+1 : '-'}</td>
                    </tr>)
                }
                </tbody>
            </table>
        </section>
    }
}
