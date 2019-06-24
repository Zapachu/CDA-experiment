import * as React from 'react'
import * as style from './style.scss'
import {Core, MaskLoading, Button, ButtonProps} from 'elf-component'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from '../interface'
import {MoveType, PushType, NEW_ROUND_TIMER, PlayerStatus, Balls} from '../config'

interface IPlayState {
    loading: boolean
    newRoundTimers: Array<number>
}

export class Play extends Core.Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, IPlayState> {
    state = {
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


    shout = (cup) => {
        const {props: {frameEmitter}} = this
        frameEmitter.emit(MoveType.shout, {price: cup})
    }

    dynamicAction = () => {
        const {
            props: {
                gameState: {groups},
                playerState: {groupIndex, positionIndex}
            }
        } = this
        const {rounds, roundIndex} = groups[groupIndex]
        const {playerStatus} = rounds[roundIndex]
        const playerState = playerStatus[positionIndex]
        if (playerState === PlayerStatus.prepared) {
            return <MaskLoading label='请等待其它玩家...'/>
        }
        if (playerState === PlayerStatus.shouted) {
            return <MaskLoading label='您已出价，请等待其他玩家...'/>
        }
        if (playerState === PlayerStatus.gameOver) {
            return <MaskLoading label='所有轮次结束，等待老师结束实验...'/>
        }
        if (playerState === PlayerStatus.timeToShout) {
            return <div>
                <div>
                    <p>系统随机从某个杯子中抽中 {rounds[roundIndex].ball === Balls.red ? '红' : '蓝'} 球</p>

                    <p>请您猜测该杯子来源于哪个杯子?</p>

                    <p>在您猜测前，在您之前有以下这些人已给出他们的猜测，仅供您参考</p>
                </div>

                <div>
                    {
                        rounds[roundIndex].cups.map((cup, idx) => <div>
                                玩家 {idx + 1}, 猜测为 球来自于 {['A', 'B'][cup]} 杯子
                            </div>
                        )
                    }

                </div>

                <li>
                    <Button width={ButtonProps.Width.large} label='来自 A 杯子' onClick={this.shout.bind(this, 0)}/>
                    <Button width={ButtonProps.Width.large} label='来自 B 杯子' onClick={this.shout.bind(this, 1)}/>
                </li>
            </div>
        }
        return <MaskLoading label='准备进行下一轮...'/>
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
                prices.filter((p) => p !== null).map((v, i) =>
                    <tbody key={`tb${i}`}>
                    <tr>
                        <td>{i + 1}</td>
                        <td>{['A', 'B'][v]} 杯子</td>
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
                game: {params: {groupSize}},
                gameState: {groups},
                playerState: {groupIndex}
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
            <div className={style.title}>信息层叠和信息困境</div>
            <p>
                已知条件：有A和B两个杯子，每个杯子中有3个球，A杯中有2个红球，1个蓝球；B杯中有1个红球，2个蓝球
            </p>
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
            {this.dynamicAction()}
            {this.dynamicResult()}
        </section>
    }

}
