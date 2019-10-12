import * as React from 'react';
import * as Extend from '@extend/client';
import {Table, Tabs} from 'antd';
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams, MoveType, PushType} from '../config';
import {Lang} from '@elf/component';

class GroupPlay4Owner extends Extend.Group.Play4Owner<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    lang = Lang.extractLang({
        roundIndex: [i => `第${i + 1}轮`, i => `Round ${i + 1}`],
        playerNo: ['玩家编号'],
        x: ['投入'],
        d: ['奖惩成本'],
        extra: ['奖/惩'],
        result: ['最终收益'],
    });

    render(): React.ReactNode {
        const {lang, props: {groupGameState}} = this;
        return <Tabs tabPosition={'left'}>
            {
                groupGameState.rounds.map((gameRoundState, i) =>
                    gameRoundState.reward ?
                        <Tabs.TabPane tab={lang.roundIndex(i)} key={i.toString()}>
                            <Table
                                pagination={false}
                                columns={[
                                    {
                                        title: lang.playerNo,
                                        dataIndex: 'index',
                                        key: 'index',
                                        render: i => <div>{i + 1}</div>
                                    },
                                    {
                                        title: lang.x,
                                        dataIndex: 'x',
                                        key: 'x'
                                    },
                                    {
                                        title: lang.d,
                                        dataIndex: 'd',
                                        key: 'd'
                                    },
                                    {
                                        title: lang.extra,
                                        dataIndex: 'extra',
                                        key: 'extra'
                                    },
                                    {
                                        title: lang.result,
                                        dataIndex: 'result',
                                        key: 'result'
                                    }
                                ]}
                                dataSource={gameRoundState.players.map(({x, d, extra}, i) => ({
                                    index: i,
                                    x,
                                    d,
                                    extra,
                                    result: x + gameRoundState.reward - d + extra
                                }))}/>
                        </Tabs.TabPane> : null
                )
            }
        </Tabs>;
    }
}

export class Play4Owner extends Extend.Play4Owner<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    GroupPlay4Owner = GroupPlay4Owner;
}