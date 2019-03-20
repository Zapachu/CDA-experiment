import * as React from 'react'
import * as style from './style.scss'
import {Core, MaskLoading, Input, Label, Button, ButtonProps, Toast} from 'bespoke-client-util'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from '../interface'
import {FetchType, MoveType, PushType, NEW_ROUND_TIMER} from '../config'

interface IPlayState {
    price: string
    loading: boolean
    newRoundTimers: Array<number>
}

export class Play extends Core.Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType, IPlayState> {
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
                playerState: {groupIndex, privatePrices}
            }, state
        } = this
        this.setState({price: ''})
        const price = Number(state.price)
        if (Number.isNaN(price) || price > privatePrices[groups[groupIndex].roundIndex]) {
            Toast.warn('输入的值无效')
        } else {
            frameEmitter.emit(MoveType.shout, {price: +price})
        }
    }

    render() {
        const {
            props: {
                game: {params: {groupSize}},
                gameState: {groups},
                playerState: {role, groupIndex, privatePrices}
            }, state: {loading, newRoundTimers, price}
        } = this
        if (loading) {
            return <MaskLoading label='加载中...'/>
        }
        if (groupIndex === undefined) {
            return <MaskLoading label='正在匹配玩家...'/>
        }
        const {rounds, roundIndex} = groups[groupIndex],
            // {playerStatus} = rounds[roundIndex],
            newRoundTimer = newRoundTimers[roundIndex]
        return <section className={style.play}>
            <div>集合竞价市场</div>
            {newRoundTimer ? <div>本轮结束剩余时间: {NEW_ROUND_TIMER - newRoundTimer}</div> : null}
            <div>本游戏共有人数 {groupSize}</div>
            <div>本游戏共有轮数 {rounds.length}</div>
            <div>您现在正在进行第 {roundIndex + 1} 轮</div>
            <div>您的角色是 {['买家', '卖家'][role]}</div>
            <div>物品对于您的心理价值是 {privatePrices[groups[groupIndex].roundIndex]}</div>
            <li>
                <Label label='输入您的价格'/>
                <Input type='number' value={price} onChange={this.setVal.bind(this)}/>
            </li>
            <li>
                <Button width={ButtonProps.Width.large} label='出价' onClick={this.shout.bind(this)}/>
            </li>
        </section>
    }

}
