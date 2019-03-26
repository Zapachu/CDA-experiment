import * as React from 'react'
import * as style from './style.scss'
import {Core, Lang, Tabs, RangeInput} from 'bespoke-client-util'
import {ICreateParams, IGameState, IMoveParams, IPlayerState} from '../interface'
import {FetchType, MoveType, SheetType} from '../config'
import {Play4Owner} from './Play4Owner'

declare interface IResult4OwnerState {
    activeTabIndex: number
    activeMoveSeq: number
}

export class Result4Owner extends Core.Result4Owner<ICreateParams, IGameState, IPlayerState, MoveType, IMoveParams, FetchType, IResult4OwnerState> {
    state: IResult4OwnerState = {
        activeTabIndex: 0,
        activeMoveSeq: 0
    }

    lang = Lang.extractLang({
        result: ['游戏结果', 'Game Result'],
        seatNumber: ['玩家座位号', 'Player Seat Number'],
        point: ['最终收益(￥)', 'Profit(￥)'],
        award: ['奖励', 'Award'],
        timeLine: ['时间线', 'TimeLine'],
        timeTravel: ['过程回溯', 'Time Travel'],
        export: ['导出', 'Export'],
        unknown: ['???', '???'],
        [SheetType[SheetType.result]]: ['结果', 'Result'],
    })

    render(): React.ReactNode {
        const {lang, props: {game, travelStates, fetcher}, state: {activeMoveSeq, activeTabIndex}} = this
        const travelState = travelStates[activeMoveSeq]
        return <section className={style.result4Owner}>
            <Tabs {...{
                activeTabIndex,
                labels: [lang.result, lang.timeTravel],
                switchTab: activeTabIndex => this.setState({activeTabIndex})
            }}>
                <div className={style.resultWrapper}>
                    <table className={style.resultTable}>
                        <tbody>
                        <tr>
                            <td>{lang.seatNumber}</td>
                            <td>{lang.point}</td>
                        </tr>
                        {
                            Object.values(travelStates[travelStates.length - 1].playerStates).map(({seatNumber, finalProfit}, i) =>
                                <tr key={i}>
                                    <td>{seatNumber === undefined ? lang.unknown : seatNumber}</td>
                                    <td>{finalProfit}</td>
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
                                       href={fetcher.buildGetUrl(FetchType.exportXls, {sheetType})}>{lang[SheetType[sheetType]]}</a>)
                            }
                        </div>
                    </div>
                </div>
                <div className={style.timeTravelWrapper}>
                    <div className={style.timeLine}>
                        <label>{lang.timeLine}</label>
                        <RangeInput {...{
                            min: 1,
                            max: travelStates.length - 1,
                            value: activeMoveSeq,
                            onChange: ({target: {value: activeMoveSeq}}) => this.setState({activeMoveSeq})
                        }}/>
                    </div>
                    <div>
                        {
                            travelState.gameState ?
                                <Play4Owner {...{game, fetcher, ...travelState}}/> : null
                        }
                    </div>
                </div>
            </Tabs>
        </section>
    }
}