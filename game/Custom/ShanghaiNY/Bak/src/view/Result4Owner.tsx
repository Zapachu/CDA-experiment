import * as React from 'react';
import * as style from './style.scss';
import {Core, Request} from '@bespoke/client';
import {Lang, RangeInput, Tabs} from '@elf/component';
import {ICreateParams, IGameState, IMoveParams, IPlayerState} from '../interface';
import {FetchRoute, MoveType, namespace, SheetType} from '../config';
import {Play4Owner} from './Play4Owner';

declare interface IResult4OwnerState {
    activeTabIndex: number
    activeMoveSeq: number
    userId: string
    money: number
}

export class Result4Owner extends Core.Result4Owner<ICreateParams, IGameState, IPlayerState, MoveType, IMoveParams, IResult4OwnerState> {
    state: IResult4OwnerState = {
        activeTabIndex: 0,
        activeMoveSeq: 0,
        userId: '',
        money: 0
    };

    lang = Lang.extractLang({
        confirm: ['确定', 'Confirm'],
        result: ['游戏结果', 'Game Result'],
        seatNumber: ['玩家座位号', 'Player Seat Number'],
        point: ['最终收益', 'Profit'],
        award: ['奖励', 'Award'],
        timeLine: ['时间线', 'TimeLine'],
        timeTravel: ['过程回溯', 'Time Travel'],
        export: ['导出', 'Export'],
        unknown: ['???', '???'],
        [SheetType[SheetType.result]]: ['结果', 'Result'],
    });

    postReward = async (userId: string, money: number) => {
        const url = '/v5/apiv5/org/researcher/trans/reward';
        const data = {
            money,
            payeeId: userId,
            // task: this.props.game.id,
        };
        const option = {
            credentials: 'include',
            method: 'post',
            headers: {'Content-Type': 'application/json; charset=utf-8'},
            cache: 'default',
            body: JSON.stringify({...data, _csrf: getCookie('_csrf')})
        } as RequestInit;
        const res = await fetch(url, option);
        if (res.ok) {
            return res.json();
        }

        function getCookie(key: string) {
            return decodeURIComponent(document.cookie)
                .split('; ')
                .find(str => str.startsWith(`${key}=`))
                .substring(key.length + 1);
        }
    };

    render(): React.ReactNode {
        const {lang, props: {game, travelStates}, state: {activeMoveSeq, activeTabIndex}} = this;
        const travelState = travelStates[activeMoveSeq];
        const {s, participationFee} = game.params;
        return <section className={style.result4Owner}>
            <Tabs {...{
                activeTabIndex,
                labels: [lang.result, lang.timeTravel, lang.award],
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
                            Object.values(travelStates[travelStates.length - 1].playerStates).sort((a, b) => Number(a.seatNumber) - Number(b.seatNumber)).map(({seatNumber, finalProfit}, i) =>
                                <tr key={i}>
                                    <td>{seatNumber === undefined ? lang.unknown : seatNumber}</td>
                                    <td>{isNaN(finalProfit * s + participationFee) ? '-' : (finalProfit * s + participationFee).toFixed(2)}</td>
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
                                       href={Request.instance(namespace).buildUrl(FetchRoute.exportXls, {gameId: game.id}, {sheetType})}
                                    >{lang[SheetType[sheetType]]}</a>)
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
                                <Play4Owner {...{game, ...travelState, frameEmitter: null}}/> : null
                        }
                    </div>
                </div>
                {/* <div>
                    <div>
                        <label>发送奖励给</label>
                        <Select style={{width:'200px',marginBottom:'30px'}}
                                value={userId} 
                                placeholder={'请选择座位号'} 
                                options={players} 
                                onChange={val => this.setState({userId: val as string})} 
                        />
                        <label>奖励金额</label>
                        <Input {...{
                            type: 'number',
                            value: money,
                            onChange: ({target: {value}}) => this.setState({money: Number(value)})
                        }}/>
                        <Button width={ButtonProps.Width.small}
                                label={lang.confirm}
                                onClick={() => {
                                    if(!userId || !money) return;
                                    const res = this.postReward(userId, money);
                                }}
                        />
                    </div>
                    <div>

                    </div>
                </div> */}
            </Tabs>
        </section>;
    }
}