import * as React from 'react'
import * as style from './style.scss'
import {Lang, TGameState, Toast, TPlayerState} from '@elf/component'
import {Core} from '@bespoke/client'
import {Button, Input, ITestPageQuestion, Line, Loading, TestPage} from '@micro-experiment/component'
import Joyride, {Step} from 'react-joyride'
import {Input as AntInput, Radio} from 'antd'
import {
    ICreateParams,
    IGameState,
    IMoveParams,
    IPlayerState,
    IPushParams,
    MoveType,
    PlayerStatus,
    PushType,
    ROUNDS
} from '../config'

type TPlayProps = Core.IPlayProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>

function _Play({gameState, playerState, frameEmitter}: Core.IPlayProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>) {
    const lang = Lang.extractLang({
        shout: ['买入', 'Shout']
    })
    const [price, setPrice] = React.useState('' as React.ReactText)
    const gameRoundState = gameState.rounds[gameState.round],
        playerRoundState = playerState.rounds[gameState.round]
    let maxShout = 0
    gameRoundState.shouts.forEach(s => s > maxShout ? maxShout = s : null)
    if (gameRoundState.traded) {
        return <Result gameState={gameState}
                       playerState={playerState}
                       exit={onceMore => frameEmitter.emit(MoveType.exit, {onceMore}, lobbyUrl => (location.href = lobbyUrl))}/>
    }
    return <section className={style.playContent}>
        <div className={style.market}>
            <Line text={`已提交的报价 (第${gameState.round + 1}轮) `}/>
            <ul className={style.shouts}>
                {
                    gameRoundState.shouts.filter(s => s).sort((m, n) => n - m)
                        .map((price, i) => <li key={i}>
                            {price}
                        </li>)
                }
            </ul>
        </div>
        <div className={style.tips}>
            <label>最高拟购买价格</label><em>{maxShout}</em>元,若在<em
            className={style.countDown}>{gameRoundState.timer}</em>秒内没有更高报价，则此资产以现在的最高拟购买价格成交
            <p className={style.auction}>
                <label>市场信息</label>该资产的<span
                className={style.startPrice}>起拍价格为<em>{gameRoundState.startPrice}</em>元</span>
            </p>
            <label>私人信息</label>您的公司对该资产的估价值为<em>{playerRoundState.privatePrice}</em>元
        </div>
        <div className={style.inputWrapper}>
            <Input value={price} onChange={val => setPrice(val)}
                   onMinus={() => setPrice(+(price || 0) - 1)}
                   onPlus={() => setPrice(+(price || 0) + 1)}/>
        </div>
        <Button label={lang.shout} onClick={() => {
            if (price < gameRoundState.startPrice) {
                return Toast.warn('报价需高于市场起拍价')
            }
            if (maxShout && price < maxShout) {
                return Toast.warn('报价需高于当前市场最高报价')
            }
            frameEmitter.emit(MoveType.shout, {price: +price})
        }}/>
    </section>
}

export function Play(props: TPlayProps) {
    const {gameState, playerState, frameEmitter} = props,
        {status} = playerState.rounds[gameState.round]
    const questions: Array<ITestPageQuestion> = [
        {
            Content: ({inputProps}) =>
                <div>
                    假设某资产现在进行拍卖，现最高的竞购价格为100元，经拍卖人三次提示而无人加价时，拍卖人击槌表示该资产以<AntInput {...inputProps()}/>元成交
                </div>,
            Answer: () => <text>正确答案：100</text>,
            answer: [100]
        },
        {
            Content: ({inputProps}) =>
                <div>
                    <p>以公开竞价的方法，组织有意受让的人到场竞价报价，最后以“价高者得“的原则确定土地使用权受让人的一种土地出让方式为</p>
                    <Radio.Group {...inputProps({margin: '.5rem'})}>
                        <Radio value={1}>A. 转让</Radio>
                        <Radio value={2}>B. 划拨</Radio>
                        <Radio value={3}>C. 协议</Radio>
                        <Radio value={4}>D. 拍卖</Radio>
                    </Radio.Group>
                </div>,
            Answer: () => <text>正确答案：D</text>,
            answer: [4]
        }
    ]
    return <section className={style.play}>
        {
            status === PlayerStatus.test ?
                <TestPage questions={questions} done={() => frameEmitter.emit(MoveType.testDone)}/> :
                <_Play {...props}/>
        }
        {
            status === PlayerStatus.guide ? <Guide done={() => frameEmitter.emit(MoveType.guideDone)}/> : null
        }
    </section>
}

function Guide({done}: { done: () => void }) {
    const lang = Lang.extractLang({
        gotIt: ['我知道了', 'I got it']
    })
    const stepProps: (tooltipStyle?: React.CSSProperties) => Partial<Step> = (tooltipStyle: React.CSSProperties) => ({
                styles: {
                    spotlight: {
                        border: '2px dashed #71ff7b',
                        borderRadius: '1.5rem'
                    },
                    tooltip: {
                        fontSize: '1rem',
                        ...tooltipStyle
                    }
                },
                disableBeacon: true
            }
        ),
        steps: Array<Step> = [
            {
                target: `.${style.market}`,
                content: <section className={style.guideContent}>
                    您可以在这里查看到市场上已提交的竞购价格。
                    <br/>公开竞价狭义指期权交易的基本方式。广义指各行各业以各种形式对商品进行的公开、公平、公正、择优透明的拍卖竞售过程。证券交易所即采用公开竞价的方式决定交易价格。期权交易的公开竞价是拍卖式的交易方法。交易员在被称为“交易池”的交易大厅中进行面对面的交易，他们通过高声叫喊买人和卖出指令来口头表达其交易意愿。希望买入的交易员先喊出在某个价格上所需要的数目，希望卖出的交易员再根据合约数目宣布所需要的价格。如果交易池内交易活跃、交易员数量很多，那么并不是每个人都能听清其他人发出的指令，因此在公开竞价中，交易员常常需要附以手势来表达自己的意思。此外，在双方确定交易意向后，交易员还需要完成交易单，以此来确认交易的达成。交易单是证明交易主体、交易对象和交易数量的基本单据。
                </section>,
                ...stepProps({width: '48rem'})
            },
            {
                target: `.${style.auction}`,
                content: <section className={style.guideContent}>
                    由拍卖人宣布预定的最低价，然后竟买者相继出价竞购。拍卖行可规定每次加价的金额限度。至某一价格，经拍卖人三次提示而无人加价时，则为最高价，由拍卖人击槌表示成交。按拍卖章程规定，在拍卖人落样前，叫价人可以撤销出价；如果货主与拍卖人事先商定了最低限价，而竟买人的叫价低于该价，拍卖人可终止拍卖。
                </section>,
                ...stepProps()
            },
            {
                target: `.${style.startPrice}`,
                content: <section className={style.guideContent}>
                    起拍价，是指专业拍卖机构拍卖师报出的第—口价。第一个竞购价必须大于起拍价，您可以在这里查看此资产的起拍价。
                </section>,
                ...stepProps()
            },
            {
                target: `.${style.countDown}`,
                content: <section className={style.guideContent}>
                    当一个新的竞购价提交后，如果在30秒内没有新的竞购价，则此资产会以当前最高竞购价成交。您可以在这里查看剩余的时间。
                </section>,
                ...stepProps()
            },
            {
                target: `.${style.inputWrapper}`,
                content: <section className={style.guideContent}>
                    您可以在这里不断输入您的竞购价，但是您的竞购价必须大于市场上已有的最高竞购价。
                </section>,
                ...stepProps()
            }
        ]
    return <Joyride
        callback={({action}) => {
            if (action == 'reset') {
                done()
            }
        }}
        continuous
        showProgress
        hideBackButton
        disableOverlayClose
        steps={steps}
        locale={{
            next: lang.gotIt,
            last: lang.gotIt
        }}
        styles={{
            options: {
                arrowColor: 'rgba(30,39,82,.8)',
                backgroundColor: 'rgba(30,39,82,.8)',
                overlayColor: 'rgba(30,39,82,.5)',
                primaryColor: '#13553e',
                textColor: '#fff'
            }
        }}
    />
}

function Result({gameState, playerState, exit}: { gameState: TGameState<IGameState>, playerState: TPlayerState<IPlayerState>, exit: (onceMore?: boolean) => void }) {
    const {round, rounds} = gameState,
        {shouts} = rounds[round]
    let tradeShoutIndex = 0
    shouts.forEach((s, i) => s > shouts[tradeShoutIndex] ? tradeShoutIndex = i : null)
    const tradePrice = shouts[tradeShoutIndex],
        profit = playerState.index === tradeShoutIndex ? (playerState.rounds[round].privatePrice - tradePrice).toFixed(2) : 0
    return <section className={style.result}>
        <p className={style.resultInfo}>
            该资产以<em>{tradePrice}</em>元成交，由{playerState.index === tradeShoutIndex ? '您' : '其它卖家'}竞购得到，您的收益为<em>{profit}</em>元
        </p>
        {
            round === ROUNDS - 1 ? <>
                <Line
                    text={'交易结果展示'}
                    style={{
                        margin: 'auto',
                        maxWidth: '400px',
                        marginTop: '10vh',
                        marginBottom: '20px'
                    }}
                />
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <Button
                        label={'再学一次'}
                        color={Button.Color.Blue}
                        style={{marginRight: '20px'}}
                        onClick={() => exit(true)}
                    />
                    <Button
                        label={'返回交易大厅'}
                        onClick={() => exit()}
                    />
                </div>
            </> : <Loading label={'即将进入下一轮'}/>
        }
    </section>
}