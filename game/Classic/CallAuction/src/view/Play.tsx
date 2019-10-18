import * as React from 'react';
import * as Extend from '@extend/client';
import {Button, InputNumber} from 'antd';
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
    PushType,
    Role
} from '../config';
import {Lang, MaskLoading, Toast} from '@elf/component';
import {FrameEmitter} from '@bespoke/share';

function RoundPlay({playerRoundState, gameRoundState, frameEmitter, role, privatePrice, playerIndex}: {
    groupParams: ICreateParams,
    playerRoundState: IPlayerRoundState,
    gameRoundState: IGameRoundState,
    frameEmitter: FrameEmitter<MoveType, PushType, IMoveParams, IPushParams>,
    playerIndex: number
    role: Role,
    privatePrice: number
}) {
    const lang = Lang.extractLang({
        timeLeft: ['剩余时间', 'Time Left'],
        shout: ['报价'],
        waiting: ['等待其它玩家提交...'],
        playerNo: ['玩家编号'],
        x: ['捕获量'],
        result: ['最终收益'],
        you: ['（你）'],
        toNextRound: ['等待进入下一轮...'],
        tips1: ['您的身份为'],
        tips2: ['您对本轮商品的心理价值为'],
        role: ['角色'],
        buyer: ['买家'],
        seller: ['卖家'],
        invalidSellPrice: ['卖出价格应不低于心理价格'],
        invalidBuyPrice: ['卖出价格应不高于心理价格'],
        roundOver: ['本轮实验结束'],
        noTrade: ['您的报价未成交'],
        tradeInfo1: ['您的报价为'],
        tradeInfo2: ['心理价格为'],
        tradeInfo3: ['利润为'],
    });
    const [price, setPrice] = React.useState(null);
    const roleLabel = {
        [Role.buyer]: lang.buyer,
        [Role.seller]: lang.seller,
    }[role];
    const {timeLeft} = gameRoundState;
    switch (playerRoundState.status) {
        case PlayerRoundStatus.play:
            return <section className={style.roundPlay}>
                <p className={style.playTips}>{lang.tips1}&nbsp;:&nbsp;{roleLabel}&nbsp;,&nbsp;{lang.tips2}&nbsp;:&nbsp;{privatePrice}</p>
                <label className={style.timeLeft}>{lang.timeLeft}&nbsp;:&nbsp;<em>{timeLeft}</em>s</label>
                <InputNumber value={price} onChange={v => setPrice(+v)} min={0}/>
                <br/>
                <Button type='primary'
                        onClick={() => {
                            if (role === Role.buyer && price > privatePrice) {
                                return Toast.warn(lang.invalidBuyPrice);
                            }
                            if (role === Role.seller && price < privatePrice) {
                                return Toast.warn(lang.invalidSellPrice);
                            }
                            frameEmitter.emit(MoveType.shout, {price: price});
                        }}>{lang.shout}</Button>
            </section>;
        case PlayerRoundStatus.wait:
            return <MaskLoading label={lang.waiting}/>;
        case PlayerRoundStatus.result:
            const traded = gameRoundState.trades.some(({buy, sell}) => buy.player === playerIndex || sell.player === playerIndex);
            return <section className={style.roundResult}>
                <p>{lang.roundOver}{traded ? <>{lang.tradeInfo1}<em>{playerRoundState.price}</em>&nbsp;,&nbsp;{lang.tradeInfo2}<em>{privatePrice}</em>&nbsp;,&nbsp;{lang.tradeInfo3}<em>{Math.abs(privatePrice - playerRoundState.price)}</em></> : lang.noTrade}</p>
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
                <p>本实验是一个关于拍卖的实验，共R轮。在本次实验中，您将会被随机的分配到某个组中，每组有N名成员，您在实验中为买家或者卖家的身份由系统随机确定。在本次实验中，每位买家有M实验币的初始禀赋，商品对于每位买家而言心理价格不同，该价格都是V1到V2之间的随机数；对于每位卖家而言成本也不同，成本是从C1到C2之间的随机数。拍卖开始，每位参与者对拍卖品出一个报价，买家的报价是买家愿意购买该商品的最高出价，卖家的报价是卖家愿意出售该商品的最低售价，系统将自动撮合买方和卖方的报价，产生当期的市场成交价格，该价格使买卖双方的交易需求最大程度地得到满足。买家作为商品的需求方，报价大于等于市场成交价格者成交（报价高者有更大的可能性成交）；卖家作为商品的供给方，报价小于等于市场成交价格者成交（报价低者有更大的可能性成交）</p>
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
                playerIndex: playerState.index,
                role: playerState.role,
                privatePrice: playerState.privatePrices[groupGameState.round]
            }}/>
        </section>;
    }
}

export class Play extends Extend.Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    GroupPlay = GroupPlay;
}
