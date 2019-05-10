import * as React from 'react'
import * as style from './style.scss'
import * as dateFormat from 'dateformat'
import Header from '../../../components/Header'
import Line from '../../../components/Line'
import Input from '../../../components/Input'
import Button from '../../../components/Button'
import StockInfo from '../../../components/StockInfo'
import ListItem from '../../../components/ListItem'
import Loading from '../../../components/Loading'
import {Core, Toast} from 'bespoke-client-util'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from '../interface'
import {FetchType, MoveType, PushType, NEW_ROUND_TIMER, PlayerStatus} from '../config'

interface IPlayState {
    price: string
    loading: boolean
    newRoundTimers: Array<number>
}

const InfoBar = ({text, styles = {}}: { text: string, styles?: object }) =>
    <div style={styles}
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

    onPlus = (value) => this.setState({price: (++value).toString()})

    onMinus = (value) => this.setState({price: (--value).toString()})

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
            return <Loading label='您已出价，请等待其他玩家...'/>
        }
        if (playerState === PlayerStatus.gameOver) {
            return <Loading label='所有轮次结束，等待结束...'/>
        }
        if (playerState === PlayerStatus.outside) {
            return <div>

            </div>
        }
        return <div>
            <li>
                <Input
                    value={price}
                    onChange={this.setVal}
                    onMinus={this.onMinus}
                    onPlus={this.onPlus}
                    placeholder={`报价`}
                />
                {/*<Label label='输入您的价格'/>*/}
                {/*<Input type='number' value={price} onChange={this.setVal.bind(this)}/>*/}
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

    dynamicBtn = () => {
        const {
            props: {
                gameState: {groups},
                playerState: {groupIndex, positionIndex}
            }
        } = this
        const {rounds, roundIndex} = groups[groupIndex],
            {playerStatus} = rounds[roundIndex]
        const playerState = playerStatus[positionIndex]
        if (playerState === PlayerStatus.prepared) {
            return this.shout()
        }
        if (playerState === PlayerStatus.shouted) {
            return
        }
        if (playerState === PlayerStatus.outside) {
            return this.prepare()
        }
        return
    }

    dynamicBtnView = () => {
        const {
            props: {
                gameState: {groups},
                playerState: {groupIndex, positionIndex}
            }
        } = this
        const {rounds, roundIndex} = groups[groupIndex],
            {playerStatus} = rounds[roundIndex]
        const playerState = playerStatus[positionIndex]
        switch (playerState) {
            case PlayerStatus.outside:
            case PlayerStatus.prepared:
                return <div className={style.shoutBtn} onClick={this.dynamicBtn.bind(this)}>
                    {`${this.dynamicTip()}`}
                </div>
            default:
                return null
        }
    }

    render() {
        const {
            props: {
                game: {params: {}},
                gameState: {groups},
                playerState: {groupIndex, privatePrices}
            }, state: {loading, newRoundTimers}
        } = this
        if (loading) {
            return <Loading label='加载中...'/>
        }
        if (groupIndex === undefined) {
            return <Loading label='正在匹配玩家...'/>
        }
        const {roundIndex} = groups[groupIndex],
            newRoundTimer = newRoundTimers[roundIndex]
        return <section className={style.play}>

            <Header stage='tbm'/>

            {/*<StockInfo*/}
            {/*    code={`600050`}*/}
            {/*    name={`中国联通`}*/}
            {/*    contractor={`中国国际金融有限公司`}*/}
            {/*    startDate={dateFormat(Date.now(), 'yyyy/mm/dd')}*/}
            {/*    endDate={dateFormat(Date.now(), 'yyyy/mm/dd')}*/}
            {/*/>*/}

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

                {this.dynamicAction()}
                {this.dynamicBtnView()}
            </div>


            {/*<Line text={`个人信息： 账户余额${privatePrices[groups[groupIndex].roundIndex]}万元`}/>*/}
            {/*<Line text={`拥有股票: 10000股`}/>*/}

            {/*<ListItem children={`个人信息： 账户余额${privatePrices[groups[groupIndex].roundIndex]}万元`}/>*/}
            {/*<ListItem children={`拥有股票: 10000股`}/>*/}

            <InfoBar text={`个人信息： 账户余额${privatePrices[groups[groupIndex].roundIndex]}万元`}/>
            <InfoBar styles={{marginTop: '1rem'}} text={`拥有股票: 10000股`}/>

            {newRoundTimer ? <div>
                <div>本轮结束剩余时间</div>
                <div className={style.highlight}>{NEW_ROUND_TIMER - newRoundTimer}</div>
            </div> : null}
        </section>
    }

}
