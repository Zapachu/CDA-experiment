import * as React from 'react'
import * as style from './style.scss'
import {Core, MaskLoading, Input, Label, Button, ButtonProps, Toast} from 'elf-component'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from '../interface'
import {MoveType, PushType, NEW_ROUND_TIMER, PlayerStatus} from '../config'

interface IPlayState {
    price: string
    loading: boolean
    newRoundTimers: Array<number>
}

export class Play extends Core.Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, IPlayState> {
    state = {
        price: '',
        loading: true,
        newRoundTimers: []
    }

    async componentDidMount() {
        const {props: {frameEmitter}} = this
        frameEmitter.on(PushType.newRoundTimer, ({roundIndex, newRoundTimer}) => {
            this.setState(state => {
                const newRoundTimers = state.newRoundTimers.slice()
                newRoundTimers[roundIndex] = newRoundTimer
                return {newRoundTimers}
            })
        })
        frameEmitter.emit(MoveType.getPosition)
        this.setState({loading: false})
    }

    setVal = (e) => this.setState({price: e.target.value})

    shout = () => {
        const {
            props: {
                frameEmitter,
                gameState: {groups},
                game: {params: {startingPrice}},
                playerState: {groupIndex, privatePrices}
            }, state
        } = this
        this.setState({price: ''})
        const price = Number(state.price)
        if (Number.isNaN(price) || price > privatePrices[groups[groupIndex].roundIndex] || price < startingPrice) {
            Toast.warn('输入的值无效')
        } else {
            frameEmitter.emit(MoveType.shout, {price: +price})
        }
    }

    dynamicAction = () => {
        const {
            props: {
                gameState: {groups},
                playerState: {groupIndex, positionIndex}
            }, state: {price}
        } = this
        const {rounds, roundIndex} = groups[groupIndex],
            {playerStatus} = rounds[roundIndex]
        const playerState = playerStatus[positionIndex]
        if (playerState === PlayerStatus.shouted) {
            return <MaskLoading label='您已出价，请等待其他玩家...'/>
        }
        if (playerState === PlayerStatus.gameOver) {
            return <MaskLoading label='所有轮次结束，等待老师结束实验...'/>
        }
        return <div>
            <li>
                <Label label='输入您的价格'/>
                <Input type='number' value={price} onChange={this.setVal.bind(this)}/>
            </li>
            <li>
                <Button width={ButtonProps.Width.large} label='出价' onClick={this.shout.bind(this)}/>
            </li>
        </div>
    }

    dynamicResult = () => {
        const {props: {playerState: {profits, prices}}} = this
        return <table className={style.profits}>
            <thead>
            <tr>
                <td>轮次</td>
                <td>出价</td>
                <td>收益</td>
            </tr>
            </thead>
            {
                prices.filter((p) => p !== 0).map((v, i) =>
                    <tbody key={`tb${i}`}>
                    <tr>
                        <td>{i + 1}</td>
                        <td>{v}</td>
                        <td>{profits[i]}</td>
                    </tr>
                    </tbody>
                )
            }
        </table>
    }

    render() {
        const {
            props: {
                game: {params: {groupSize, startingPrice}},
                gameState: {groups},
                playerState: {groupIndex, privatePrices}
            }, state: {loading, newRoundTimers}
        } = this
        if (loading) {
            return <MaskLoading label='加载中...'/>
        }
        if (groupIndex === undefined) {
            return <MaskLoading label='正在匹配玩家...'/>
        }
        const {rounds, roundIndex} = groups[groupIndex],
            newRoundTimer = newRoundTimers[roundIndex]
        return <section className={style.play}>
            <div className={style.title}>第一密封价格拍卖</div>
            {newRoundTimer ? <div className={style.line}>
                <div>本轮结束剩余时间</div>
                <div className={style.highlight}>{NEW_ROUND_TIMER - newRoundTimer}</div>
            </div> : null}
            <div className={style.line}>
                <div>游戏总人数</div>
                <div className={style.highlight}>{groupSize}</div>
            </div>
            <div className={style.line}>
                <div>游戏总轮数</div>
                <div className={style.highlight}>{rounds.length}</div>
            </div>
            <div className={style.line}>
                <div>正在进行轮次</div>
                <div className={style.highlight}>{roundIndex + 1} </div>
            </div>
            <div className={style.line}>
                <div>起拍价</div>
                <div className={style.highlight}>{startingPrice} </div>
            </div>
            <div className={style.line}>
                <div>您的心理价值</div>
                <div className={style.highlight}>{privatePrices[groups[groupIndex].roundIndex]}</div>
            </div>
            {this.dynamicAction()}
            {this.dynamicResult()}
        </section>
    }

}
