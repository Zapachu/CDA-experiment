import * as React from 'react'
import {Core} from '@bespoke/register'
import {
    CONFIG,
    ICreateParams,
    IGameState,
    IMoveParams,
    IPlayerState,
    IPushParams,
    MoveType,
    PeriodStage,
    PushType
} from '../config'
import {Lang} from '@elf/component'
import * as style from './style.scss'

const {prepareTime, tradeTime} = CONFIG

export function Play4Owner({frameEmitter, gameState}: Core.IPlay4OwnerProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>) {
    const lang = Lang.extractLang({
        roundOver: ['本轮结束', 'Round Over'],
        trading: ['交易中', 'Trading'],
        timeLeft: [(n, s) => `第${n}期，剩余${s}秒`, (n, s) => `Period : ${n}, time left : ${s}s`],
        marketWillOpen1: ['市场将在', 'Market will open in '],
        marketWillOpen2: [() => '秒后开放', n => `second${n > 1 ? 's' : ''}`]
    })
    const [countDown, setCountDown] = React.useState(0)
    React.useEffect(() => {
        frameEmitter.on(PushType.countDown, ({countDown}) => setCountDown(countDown))
    }, [])
    const gamePeriodState = gameState.periods[gameState.periodIndex]
    const timeLeft = tradeTime + prepareTime - countDown
    let mainFragment = null
    switch (gamePeriodState.stage) {
        case PeriodStage.result:
            mainFragment = <span className={style.label}>{lang.roundOver}</span>
            break
        case PeriodStage.reading:
            mainFragment = prepareTime > countDown ?
                <span className={style.label}>{lang.marketWillOpen1}
                    <em>{prepareTime - countDown}</em> {(lang.marketWillOpen2 as Function)(prepareTime - countDown)}
                </span> : null
            break
        case PeriodStage.trading:
            mainFragment = <span
                className={style.label}>{`${lang.trading}  ${lang.timeLeft(gameState.periodIndex + 1, countDown < prepareTime ? '' : timeLeft > 0 ? timeLeft : 0)}`}</span>
    }
    return <section className={style.play4owner}>
        {
            mainFragment
        }
    </section>
}