import * as React from 'react'
import * as style from './style.scss'
import Stock from './coms/Stock'
import InfoBar from './coms/InfoBar'
import {Button, Input, Line, ListItem, Loading, Modal} from 'bespoke-game-stock-trading-component'
import {Core, Toast} from 'bespoke-client-util'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from '../interface'
import {FetchType, MoveType, PlayerStatus, PushType} from '../config'

interface IPlayState {
    price: string
    count: string
    showRule: boolean,
    showTBMRule: boolean
}

export class Play extends Core.Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType, IPlayState> {
    state = {
        price: '',
        count: '',
        showRule: false,
        showTBMRule: false
    }

    componentDidMount(): void {
        this.props.frameEmitter.emit(MoveType.startMulti)
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
        // this.setState({price: '', count: ''})
        const price = Number(state.price) * Number(state.count)
        if (Number.isNaN(price) || price > InitMoney) {
            Toast.warn('输入的值无效')
        } else {
            frameEmitter.emit(MoveType.shout, {price: +price, num: Number(state.count)})
        }
    }

    prepare = () => {
        this.props.frameEmitter.emit(MoveType.prepare)
    }

    dynamicAction = () => {
        const {
            props: {
                game: {params: {InitMoney}},
                playerState: {playerStatus}
            }, state: {price, count}
        } = this

        switch (playerStatus) {
            case PlayerStatus.shouted:
                return <Loading label='您已出价，请等待其他玩家...'/>
            case PlayerStatus.prepared:
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
                        <a className={style.countLimit}>可买 <span className={style.priceHighlight}>
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
                </div>
            default:
                return null
        }
    }

    dynamicTip = () => {
        const {
            props: {playerState: {role, playerStatus}}
        } = this
        switch (playerStatus) {
            case PlayerStatus.prepared:
                switch (role) {
                    case 0:
                        return '买入'
                    case 1:
                        return '卖出'
                }
                break
            case PlayerStatus.shouted:
                return '等待其他玩家'
            default:
                return 'Playing'
        }
    }

    dynamicBtnAction = () => {
        const {props: {playerState: {playerStatus}}} = this
        switch (playerStatus) {
            case PlayerStatus.prepared:
                return this.shout()
            case PlayerStatus.shouted:
                return
        }
    }

    dynamicBtnView = () => {
        const {props: {playerState: {playerStatus}}} = this
        switch (playerStatus) {
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
            playerState: {profit}
        } = this.props
        const {price, count} = this.state
        const listData = [
            {label: '股票的成交价格', value: Number(price) * Number(count)},
            {label: '你的购买数量', value: Number(count) || 0},
            {label: '你的总收益为', value: profit - InitMoney || 0},
            {label: '你的初始账户资金', value: InitMoney},
            {label: '你的现有账户资金', value: profit, red: true}
        ]
        return (
            <>
                <Line
                    text={'交易结果展示'}
                    style={{margin: 'auto', maxWidth: '400px', marginTop: '70px', marginBottom: '20px'}}
                />
                <ul>
                    {listData.map(({label, value, red}) => {
                        return (
                            <li key={label} style={{marginBottom: '10px'}}>
                                <ListItem>
                                    <p className={style.item}>
                                        <span style={{color: '#fff'}}>{label}:&nbsp;</span>
                                        <span style={{color: red ? '#F0676D' : 'orange'}}>
                      {value}
                    </span>
                                    </p>
                                </ListItem>
                            </li>
                        )
                    })}
                </ul>
                <Line
                    color={Line.Color.White}
                    style={{
                        margin: 'auto',
                        maxWidth: '400px',
                        marginTop: '20px',
                        marginBottom: '20px'
                    }}
                />
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <Button
                        label={'再玩一局'}
                        color={Button.Color.Blue}
                        style={{marginRight: '20px'}}
                        onClick={() => {
                            frameEmitter.emit(MoveType.nextStage, {onceMore: true}, lobbyUrl => location.href = lobbyUrl)
                        }}
                    />
                    <Button
                        label={'下一阶段'}
                        onClick={() => {
                            frameEmitter.emit(MoveType.nextStage, {onceMore: false}, lobbyUrl => location.href = lobbyUrl)
                        }}
                    />
                </div>
            </>
        )
    }

    renderPlay = () => {
        const {
            props: {
                game: {params: {InitMoney}},
                playerState: {}
            }
        } = this
        return <>
            <Stock/>
            {/* <Button
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
            /> */}
            <div className={style.workBox}>
                <div className={style.tipText}>
                    <Line text={` ${this.dynamicTip()} `}/>
                </div>
                {this.dynamicAction()}
                {this.dynamicBtnView()}
            </div>

            <InfoBar text={`个人信息： 账户余额${InitMoney / 10000}万元`}/>

            <InfoBar styles={{marginTop: '1rem'}} text={`拥有股票: 10000股`}/>
        </>
    }

    renderStage = () => {
        const {
            props: {
                playerState: {playerStatus}
            }
        } = this
        switch (playerStatus) {
            case PlayerStatus.prepared:
            case PlayerStatus.shouted:
                return this.renderPlay()
            case PlayerStatus.result:
                return this.renderResult()
            default:
                return <>
                    <Line
                        text={'集合竞价'}
                        style={{margin: '10vh auto 20px'}}
                    />
                    <Loading label=' '/>
                </>

        }
    }

    render() {
        const {state: {showRule, showTBMRule}} = this
        return <section className={style.play}>

            {this.renderStage()}

            <div className={style.tradeBtn}>
                <Button
                    onClick={this.showRule}
                    color={Button.Color.Blue}
                    label={`交易规则回顾`}
                />
            </div>
            <div className={style.tbmBtn}>
                <Button
                    onClick={this.showTBMRule}
                    color={Button.Color.Blue}
                    label={`集合竞价知识扩展`}
                />
            </div>

            <Modal
                visible={showRule}
                children={
                    <div className={style.modalContent}>
                        <p>交易规则回顾</p>
                        <p>...</p>
                        <Button
                            style={{marginTop: '30px'}}
                            label={'关闭'}
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
                            style={{marginTop: '30px'}}
                            label={'关闭'}
                            color={Button.Color.Blue}
                            onClick={this.showTBMRule}
                        />
                    </div>
                }
            />
        </section>
    }

}
