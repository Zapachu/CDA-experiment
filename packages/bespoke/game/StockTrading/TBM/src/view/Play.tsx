import * as React from 'react'
import * as style from './style.scss'
import * as dateFormat from 'dateformat'
import Header from '../../../components/Header'
import {Core, MaskLoading, Input, Label, Button, ButtonProps, Toast} from 'bespoke-client-util'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from '../interface'
import {FetchType, MoveType, PushType, NEW_ROUND_TIMER, PlayerStatus} from '../config'

interface IPlayState {
    price: string
    loading: boolean
    newRoundTimers: Array<number>
}

const InfoBar = ({text, styles = {}}: { text: string, styles?: object }) => <div style={styles}
                                                                                 className={style.infoBar}>
    {text}
</div>

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

    prepare = () => {
        this.props.frameEmitter.emit(MoveType.prepare)
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
        if (playerState === PlayerStatus.outside) {
            return <div>
                <li>
                    <Button width={ButtonProps.Width.large} label='准备' onClick={this.prepare.bind(this)}/>
                </li>
            </div>
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

    dynamicTip = () => {
        const {
            props: {
                gameState: {groups},
                playerState: {role, groupIndex, positionIndex}
            }
        } = this
        const {rounds, roundIndex} = groups[groupIndex],
            {playerStatus} = rounds[roundIndex]
        const playerState = playerStatus[positionIndex]
        if (playerState === PlayerStatus.outside) {
            return '准备'
        }
        if (playerState === PlayerStatus.prepared) {
            if (role === 0) {
                return '买入'
            }
            return '卖出'
        }
        if (playerState === PlayerStatus.shouted) {
            return '等待其他玩家'
        }
        return '正在进行'
    }

    render() {
        const {
            props: {
                game: {params: {groupSize}},
                gameState: {groups},
                playerState: {role, groupIndex, privatePrices}
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

            <Header stage='tbm'/>


            <table className={style.infoTable}>
                <thead>
                <tr>
                    <td style={{color: '#58c350'}}>证券代码</td>
                    <td style={{color: '#58c350'}}>证券简称</td>
                    <td style={{color: '#58c350'}}>主承销商</td>
                    <td style={{color: '#58c350'}}>初步询价起始日期</td>
                    <td style={{color: '#58c350'}}>初步询价截止日期</td>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>600050</td>
                    <td>中国联通</td>
                    <td>中国国际金融有限公司</td>
                    <td>{dateFormat(Date.now(), 'yyyy/mm/dd')}</td>
                    <td>{dateFormat(Date.now(), 'yyyy/mm/dd')}</td>
                </tr>
                </tbody>
            </table>

            <div className={style.workBox}>
                <div className={style.tipText}>
                    <span className={style.tipLine}> </span>
                    <span className={style.tipContent}> {` ${this.dynamicTip()} `}</span>
                    <span className={style.tipLine}> </span>
                </div>

                <div className={style.shoutBtn}>
                    {`${this.dynamicTip()}`}
                </div>
            </div>

            <InfoBar text={`个人信息： 账户余额${privatePrices[groups[groupIndex].roundIndex]}万元`}/>
            <InfoBar styles={{marginTop: '1rem'}} text={`拥有股票: 10000股`}/>

            <div className={style.title}>集合竞价市场</div>
            {newRoundTimer ? <div>
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
                <div>您的角色</div>
                <div className={style.highlight}>{['买家', '卖家'][role]}</div>
            </div>
            <div className={style.line}>
                <div>物品对于您的心理价值</div>
                <div className={style.highlight}>{privatePrices[groups[groupIndex].roundIndex]}</div>
            </div>
            {this.dynamicAction()}
        </section>
    }

}
