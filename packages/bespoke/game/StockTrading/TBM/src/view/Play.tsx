import * as React from 'react'
import * as style from './style.scss'
import Header from '../../../components/Header'
import Line from '../../../components/Line'
import Input from '../../../components/Input'
import Button from '../../../components/Button'
import Loading from '../../../components/Loading'
import Modal from '../../../components/Modal'
import Stock from './coms/Stock'
import InfoBar from './coms/InfoBar'
import {Core, Toast} from 'bespoke-client-util'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from '../interface'
import {FetchType, MoveType, PushType, NEW_ROUND_TIMER, PlayerStatus} from '../config'
import {ListItem} from "../../../components";

interface IPlayState {
    price: string
    count: string
    loading: boolean
    newRoundTimers: Array<number>,
    showRule: boolean,
    showTBMRule: boolean
}

export class Play extends Core.Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType, IPlayState> {
    state = {
        price: '',
        count: '',
        loading: true,
        newRoundTimers: [],
        showRule: false,
        showTBMRule: false
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

    setPriceVal = (value) => this.setState({price: value})

    setCountVal = (value) => this.setState({count: value})

    onPricePlus = (value) => this.setState({price: (++value).toString()})

    onPriceMinus = (value) => this.setState({price: (--value).toString()})

    onCountPlus = (value) => this.setState({count: (++value).toString()})

    onCountMinus = (value) => this.setState({count: (--value).toString()})

    allIn = () => this.setState({price: '100', count: '1000'})

    halfIn = () => this.setState({price: '100', count: '500'})

    showRule = () => this.setState({showRule: !this.state.showRule})

    showTBMRule = () => this.setState({showTBMRule: !this.state.showTBMRule})

    shout = () => {
        const {
            props: {
                game: {params: {InitMoney}},
                frameEmitter
            }, state
        } = this
        this.setState({price: '', count: ''})
        const price = Number(state.price) * Number(state.count)
        if (Number.isNaN(price) || price > InitMoney) {
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
                game: {params: {InitMoney}},
                gameState: {groups},
                playerState: {groupIndex, positionIndex}
            }, state: {price, count}
        } = this
        const {rounds, roundIndex} = groups[groupIndex],
            {playerStatus} = rounds[roundIndex]
        const playerState = playerStatus[positionIndex]

        switch (playerState) {
            case PlayerStatus.prepared:
                return <Loading label='正在匹配玩家...'/>
            case PlayerStatus.shouted:
                return <Loading label='您已出价，请等待其他玩家...'/>
            case PlayerStatus.startBid:
                return <div className={style.shoutStage}>
                    <li>
                        <Input
                            value={price}
                            onChange={this.setPriceVal}
                            onMinus={this.onPriceMinus}
                            onPlus={this.onPricePlus}
                            placeholder={`价格`}
                        />
                    </li>
                    <li style={{marginTop: 12}}>
                        <a>可买 <span className={style.priceHighlight}>
                            {!isNaN(parseInt(price)) && parseInt(price) !== 0 ? Math.round(InitMoney / Number(price)) : 0}
                        </span> 股</a>
                    </li>
                    <li style={{marginTop: 12}}>
                        <Input
                            value={count}
                            onChange={this.setCountVal}
                            onMinus={this.onCountMinus}
                            onPlus={this.onCountPlus}
                            placeholder={`数量`}
                        />
                    </li>
                    <li style={{marginTop: 12}}>
                        <div className={style.feeInfo}>
                            <a className={style.feeNumber}>总花费<span className={style.priceHighlight}>
                            {count !== '' && price !== '' ? Number(count) * Number(price) : 0}
                        </span>
                            </a>
                            <a className={style.halfIn} onClick={this.halfIn}>半仓</a>
                            <a className={style.allIn} onClick={this.allIn}>全仓</a>
                        </div>
                    </li>
                    <li style={{marginTop: 52}}>
                        <Button label='出价' onClick={this.shout} color={Button.Color.Green}/>
                    </li>
                </div>
            default:
                return null
        }
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

    dynamicBtnAction = () => {
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
                return <Button label={this.dynamicTip()} onClick={this.dynamicBtnAction} style={{marginTop: 36}}/>
            default:
                return null
        }
    }

    renderResult = () => {
        const {
            frameEmitter,
            game: {params: {InitMoney}},
            gameState: {groups},
            playerState: {profits, groupIndex}
        } = this.props
        const {roundIndex} = groups[groupIndex]
        const {price, count} = this.state
        const listData = [
            {label: "股票的成交价格", value: Number(price) * Number(count)},
            {label: "你的购买数量", value: Number(count) || 0},
            {label: "你的总收益为", value: profits[roundIndex] - InitMoney || 0},
            {label: "你的初始账户资金", value: InitMoney},
            {label: "你的现有账户资金", value: profits[roundIndex], red: true}
        ];
        return (
            <>
                <Line
                    text={"交易结果展示"}
                    style={{margin: "auto", width: "400px", marginTop: "30px", marginBottom: "20px"}}
                />
                <ul>
                    {listData.map(({label, value, red}) => {
                        return (
                            <li key={label} style={{marginBottom: "10px"}}>
                                <ListItem>
                                    <p className={style.item}>
                                        <span style={{color: '#fff'}}>{label}:&nbsp;</span>
                                        <span style={{color: red ? "#F0676D" : "orange"}}>
                      {value}
                    </span>
                                    </p>
                                </ListItem>
                            </li>
                        );
                    })}
                </ul>
                <Line
                    color={Line.Color.White}
                    style={{
                        margin: "auto",
                        width: "400px",
                        marginTop: "20px",
                        marginBottom: "20px"
                    }}
                />
                <div style={{display: "flex", justifyContent: "center"}}>
                    <Button
                        label={"下一阶段"}
                        onClick={() => {
                            frameEmitter.emit(MoveType.nextStage);
                        }}
                    />
                </div>
            </>
        );
    }

    renderPlay = () => {
        return <div className={style.workBox}>
            <div className={style.tipText}>
                <Line text={` ${this.dynamicTip()} `}/>
            </div>
            {this.dynamicAction()}
            {this.dynamicBtnView()}
        </div>
    }

    renderStage = () => {
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
            case PlayerStatus.startBid:
            case PlayerStatus.shouted:
                return this.renderPlay()
            case PlayerStatus.gameOver:
                return this.renderResult()

        }
    }

    render() {
        const {
            props: {
                game: {params: {InitMoney}},
                gameState: {groups},
                playerState: {groupIndex}
            }, state: {loading, newRoundTimers, showRule, showTBMRule}
        } = this
        if (loading) {
            return <Loading label='加载中...'/>
        }
        if (groupIndex === undefined) {
            return <Loading label='正在匹配玩家...'/>
        }
        const {roundIndex} = groups[groupIndex],
            newRoundTimer = newRoundTimers[roundIndex],
            timeLeft = NEW_ROUND_TIMER - newRoundTimer
        return <section className={style.play}>

            <Header stage='tbm'/>

            <Stock/>

            {this.renderStage()}

            <InfoBar text={`个人信息： 账户余额${InitMoney / 10000}万元`}/>

            <InfoBar styles={{marginTop: '1rem'}} text={`拥有股票: 10000股`}/>

            {newRoundTimer ? <InfoBar styles={{marginTop: '1rem'}} text={`结束剩余时间 ${timeLeft}`}/> : null}

            <Button
                style={{position: 'absolute', top: '30%', right: '10%'}}
                onClick={this.showRule}
                color={Button.Color.Blue}
                label={`交易规则回顾`}
            />
            <Button
                style={{position: 'absolute', top: '35%', right: '10%'}}
                onClick={this.showTBMRule}
                color={Button.Color.Blue}
                label={`集合竞价知识扩展`}
            />

            <Modal
                visible={showRule}
                children={
                    <div className={style.modalContent}>
                        <p>交易规则回复</p>
                        <p>...</p>
                        <Button
                            style={{marginTop: "30px"}}
                            label={"关闭"}
                            color={Button.Color.Blue}
                            onClick={this.showRule}
                        />
                    </div>
                }
            />
            <Modal
                visible={showTBMRule}
                children={
                    <div className={style.modalContent}>
                        <p>集合竞价知识扩展</p>
                        <p>在这个模拟市场中，您将会被随机的分配为买家或者卖家，您的的身份由系统随机确定。</p>
                        <p>在本次实验中，每位买家有M实验币的初始禀赋，股票对于每位买家而言心理价值不同，该价格都是V1到V2之间的随机数；
                            对于每位卖家而言成本也不同，成本是从C1到C2之间的随机数。
                        </p>
                        <p>股票交易开始，每位参与者对拍卖品出一个报价，买家的报价是买家愿意购买该商品的最高出价，
                            卖家的报价是卖家愿意出售该商品的最低售价，系统将自动撮合买方和卖方的报价，产生当期的市场成交价格，
                            该价格使买卖双方的交易需求最大程度地得到满足。
                            买家作为商品的需求方，报价大于等于市场成交价格者成交（报价高者有更大的可能性成交）；
                            卖家作为商品的供给方，报价小于等于市场成交价格者成交（报价低者有更大的可能性成交）
                        </p>
                        <Button
                            style={{marginTop: "30px"}}
                            label={"关闭"}
                            color={Button.Color.Blue}
                            onClick={this.showTBMRule}
                        />
                    </div>
                }
            />
        </section>
    }

}
