import * as React from 'react';
import * as Extend from '@extend/client';
import {Button, InputNumber, Table} from 'antd';
import * as style from './style.scss';
import {
    ICreateParams,
    IGameRoundState,
    IGameState,
    IMoveParams,
    IPlayerRoundState,
    IPlayerState,
    IPushParams,
    MoveType,
    PlayerRoundStatus,
    PlayerStatus,
    PushType
} from '../config';
import {FrameEmitter, Lang, MaskLoading} from '@elf/component';

function RoundPlay({playerRoundState, gameRoundState, groupParams, frameEmitter, playerIndex}: {
    groupParams: ICreateParams,
    playerRoundState: IPlayerRoundState,
    gameRoundState: IGameRoundState,
    frameEmitter: FrameEmitter<MoveType, PushType, IMoveParams, IPushParams>,
    playerIndex: number
}) {
    const lang = Lang.extractLang({
        timeLeft: ['剩余时间', 'Time Left'],
        yourNo: [],
        tips: ['本回合您从公共鱼塘捕鱼多少？'],
        submit: ['提交'],
        waiting: ['等待其它玩家提交...'],
        playerNo: ['玩家编号'],
        x: ['捕获量'],
        result: ['最终收益'],
        you: ['（你）'],
        toNextRound: ['等待进入下一轮...'],
    });
    const [x, setX] = React.useState(null);
    const {timeLeft, reward, xArr} = gameRoundState;
    switch (playerRoundState.status) {
        case PlayerRoundStatus.play:
            return <section className={style.roundPlay}>
                <label className={style.timeLeft}>{lang.timeLeft}&nbsp;:&nbsp;<em>{timeLeft}</em>s</label>
                <p className={style.playTips}>{lang.tips}</p>
                <InputNumber placeholder={`0≤x≤${groupParams.M}`} value={x} onChange={v => setX(+v)} min={0}
                             max={groupParams.M}/>
                <br/>
                <Button type='primary' onClick={() => frameEmitter.emit(MoveType.submit, {x})}>{lang.submit}</Button>
            </section>;
        case PlayerRoundStatus.wait:
            return <MaskLoading label={lang.waiting}/>;
        case PlayerRoundStatus.result:
            return <section className={style.roundResult}>
                <Table
                    pagination={false}
                    columns={[
                        {
                            title: lang.playerNo,
                            dataIndex: 'index',
                            key: 'index',
                            render: i => <div>{i + 1}{i === playerIndex ? lang.you : null}</div>
                        },
                        {
                            title: lang.x,
                            dataIndex: 'x',
                            key: 'x'
                        },
                        {
                            title: lang.result,
                            dataIndex: 'result',
                            key: 'result'
                        }
                    ]}
                    dataSource={gameRoundState.xArr.map((x, i) => ({
                        index: i,
                        x,
                        result: x + reward
                    }))}/>
                <label className={style.toNextRound}>{lang.toNextRound}</label>
            </section>;
    }
}

class GroupPlay extends Extend.Group.Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    lang = Lang.extractLang({
        round1: ['第', 'Round'],
        round2: ['轮', ''],
        wait4OtherPlayers: ['等待其它玩家加入......'],
        gameOver: ['所有轮次结束，等待老师关闭实验'],
    });

    render(): React.ReactNode {
        const {lang, props: {playerState, groupGameState, groupFrameEmitter, groupParams}} = this;
        if (playerState.status === PlayerStatus.guide) {
            return <section className={style.groupGuide}>
                <p>本实验共R轮。在本次实验中，您将会被随机的分配到某个组中，每组有N名成员。每一轮每组成员共有一个鱼塘资源，每年可产鱼N*M单位，您可以选择现在就从公共鱼塘资源中捕鱼x单位（大于等于0小于等于M）。每轮结束时，鱼塘中剩余的鱼将在来年翻K倍，然后平均分给该组的N人。您的收益将等于您从您所在组的公共鱼塘中获得的回报加上您之前从公共鱼塘中捕捞的鱼产量.</p>
                <Button type='primary' onClick={() => groupFrameEmitter.emit(MoveType.guideDone)}>Start</Button>
            </section>;
        }
        if (playerState.status === PlayerStatus.result) {
            return <section className={style.groupResult}>
                {lang.gameOver}
            </section>;
        }
        const playerRoundState = playerState.rounds[groupGameState.round],
            gameRoundState = groupGameState.rounds[groupGameState.round];
        if (!playerRoundState) {
            return <MaskLoading label={lang.wait4OtherPlayers}/>;
        }
        return <section className={style.groupPlay}>
            <h2 className={style.title}>{lang.round1}{groupGameState.round + 1}{lang.round2}</h2>
            <RoundPlay {...{
                groupParams,
                playerRoundState,
                gameRoundState,
                frameEmitter: groupFrameEmitter,
                playerIndex: playerState.index
            }}/>
        </section>;
    }
}

export class Play extends Extend.Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    GroupPlay = GroupPlay;
}