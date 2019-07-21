import * as React from 'react'
import * as style from './style.scss'
import {Core, Request} from '@bespoke/client'
import {Button, Lang} from '@elf/component'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from '../interface'
import {FetchRoute, MoveType, PushType, SheetType, Stage, namespace} from '../config'

interface IPlay4OwnerState {
  timer?: number
}

export class Play4Owner extends Core.Play4Owner<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, IPlay4OwnerState> {
    lang = Lang.extractLang({
        group: ['组', 'Group'],
        seatNumber: ['座位号', 'Seat Number'],
        stage: ['阶段', 'Stage'],
        round: ['轮次', 'Round'],
        startTest:['开始理解力测试','Start Comprehension Test'],
        [Stage[Stage.Seat]]: ['输入座位号', 'Input Seat Number'],
        [Stage[Stage.Test]]: ['理解测试', 'Comprehension Test'],
        [Stage[Stage.Main]]: ['主实验', 'Main Game'],
        [Stage[Stage.Survey]]: ['问卷', 'Survey'],
        [Stage[Stage.End]]: ['结束', 'End'],
        [SheetType[SheetType.result]]: ['导出结果', 'Export Result']
    })

    state: IPlay4OwnerState = {}

    render(): React.ReactNode {
        const {lang, props: {game, playerStates, frameEmitter}} = this
        return <section className={style.play4Owner}>
            <a className={style.exportBtn} href={Request.instance(namespace).buildUrl(FetchRoute.exportXlsPlaying, {gameId:game.id},{sheetType: SheetType.result} )}>{lang[SheetType[SheetType.result]]}</a>
            <table className={style.resultTable}>
                <tbody>
                <tr>
                    <td>{lang.group}</td>
                    <td>{lang.seatNumber}</td>
                    <td>{lang.stage}</td>
                    <td>{lang.round}</td>
                </tr>
                {
                    Object.values(playerStates)
                        .sort(({seatNumber:s1=0},{seatNumber:s2=0})=>(+s1)-(+s2))
                        .map((ps, i) => <tr key={i}>
                        <td>{ps.groupIndex!==undefined ? ps.groupIndex+1 : '-'}</td>
                        <td>{ps.seatNumber!==undefined ? ps.seatNumber : '-'}</td>
                        <td>{lang[Stage[ps.stage]] || '-'}</td>
                        <td>{ps.stage===Stage.Main ? ps.roundIndex+1 : '-'}</td>
                    </tr>)
                }
                </tbody>
            </table>
            <Button label={lang.startTest} onClick={()=>frameEmitter.emit(MoveType.startTest)}/>
        </section>
    }
}
