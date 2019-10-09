import * as React from 'react';
import * as Extend from '@extend/client';
import {Button, Radio} from 'antd';
import * as style from './style.scss';
import {
    awardLimit,
    Choice,
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

function RoundPlay({playerRoundState, gameRoundState, groupParams: {awardA, awardB}, frameEmitter, playerIndex}: {
    groupParams: ICreateParams,
    playerRoundState: IPlayerRoundState,
    gameRoundState: IGameRoundState,
    frameEmitter: FrameEmitter<MoveType, PushType, IMoveParams, IPushParams>,
    playerIndex: number
}) {
    const lang = Lang.extractLang({
        timeLeft: ['剩余时间', 'Time Left'],
        yourNo: [],
        tips: ['请您作出下列情况下您的选择 : '],
        submit: ['提交'],
        waiting: ['等待其它玩家提交...'],
        playerNo: ['玩家编号'],
        x: ['捕获量'],
        result: ['最终收益'],
        you: ['（你）'],
        toNextRound: ['等待进入下一轮...'],
    });
    const [preference, setPreference] = React.useState([]);
    const {timeLeft} = gameRoundState;
    switch (playerRoundState.status) {
        case PlayerRoundStatus.play:
            return <section className={style.roundPlay}>
                <label className={style.timeLeft}>{lang.timeLeft}&nbsp;:&nbsp;<em>{timeLeft}</em>s</label>
                <p className={style.playTips}>{lang.tips}</p>
                <br/>
                {
                    Array(playerRoundState.T).fill(null).map((_, i) => {
                            const p1 = (i / playerRoundState.T).toFixed(1), p2 = (1 - +p1).toFixed(1);
                            return <Radio.Group key={i} value={preference[i]} onChange={({target: {value}}) => {
                                const p = preference.slice();
                                p[i] = value;
                                let switchCount = 0;
                                for (let j = 1; j < p.length; j++) {
                                    const cur = p[j], pre = p[j - 1];
                                    if (cur !== undefined && pre !== undefined && cur !== pre) {
                                        switchCount++;
                                    }
                                }
                                if (switchCount <= 1) {
                                    setPreference(p);
                                }
                            }}>
                                <Radio
                                    value={Choice.A}>以<em>{p1}</em>的概率获得<em>{awardA}</em>,<em>{p2}</em>的概率获得<em>{awardLimit - awardA}</em></Radio>
                                <Radio
                                    value={Choice.B}>以<em>{p1}</em>的概率获得<em>{awardB}</em>,<em>{p2}</em>的概率获得<em>{awardLimit - awardB}</em></Radio>
                            </Radio.Group>;
                        }
                    )
                }
                <Button type='primary'
                        onClick={() => frameEmitter.emit(MoveType.submit, {preference})}>{lang.submit}</Button>
            </section>;
        case PlayerRoundStatus.wait:
            return <MaskLoading label={lang.waiting}/>;
        case PlayerRoundStatus.result:
            return <section className={style.roundResult}>
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
                <p>本实验要求您在以下T个成对彩票中选择，即需要做T次选择。彩票A为：以P1的概率获得S1单位实验币，以1-P1的概率获得S2实验币；彩票B为：以P2的概率获得S3单位实验币，以1-P2的概率获得S4实验币。</p>
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
