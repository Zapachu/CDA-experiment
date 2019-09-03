import * as React from 'react'
import * as style from './style.scss'
import InfoBar from './coms/InfoBar'
import {
    Button,
    Input,
    ITestPageQuestion,
    Line,
    ListItem,
    Loading,
    Modal,
    STOCKS,
    TestPage
} from '@micro-experiment/component'
import {Core} from '@bespoke/client'
import Joyride, {Step} from 'react-joyride'
import {Lang, Toast} from '@elf/component'
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
    Role,
    SHOUT_TIMER
} from '../config'

interface IPlayState {
    price: string;
    count: string;
    showRule: boolean;
    showTBMRule: boolean;
    shoutTime: number;
}

export class Play extends Core.Play<ICreateParams,
    IGameState,
    IPlayerState,
    MoveType,
    PushType,
    IMoveParams,
    IPushParams,
    IPlayState> {
    state = {
        price: '',
        count: '',
        showRule: false,
        showTBMRule: false,
        shoutTime: 0
    }

    componentDidMount(): void {
        const {frameEmitter} = this.props
        frameEmitter.on(PushType.shoutTimer, ({shoutTime}) => {
            this.setState({shoutTime})
        })
    }

    setPriceVal = value => this.setState({price: value})

    setCountVal = value => this.setState({count: value})

    onPricePlus = value => this.setState({price: (++value).toString()})

    onPriceMinus = value => this.setState({price: (--value).toString()})

    onCountPlus = value => this.setState({count: (++value).toString()})

    onCountMinus = value => this.setState({count: (--value).toString()})

    allIn = () => {
        const {startingPrice} = this.props.playerState
        const {price} = this.state
        if (!+price) {
            return
        }
        const count = Math.floor(startingPrice / +price)
        this.setState({count: '' + count})
    }

    halfIn = () => {
        const {startingPrice} = this.props.playerState
        const {price} = this.state
        if (!+price) {
            return
        }
        const money = 0.5 * startingPrice
        const count = Math.floor(money / +price)
        this.setState({count: '' + count})
    }

    showRule = () => this.setState({showRule: !this.state.showRule})

    showTBMRule = () => this.setState({showTBMRule: !this.state.showTBMRule})

    shout = () => {
        const {
            frameEmitter,
            playerState: {role, startingPrice, startingQuota}
        } = this.props
        const {price, count} = this.state
        if (
            !price ||
            !count ||
            Number.isNaN(+price) ||
            Number.isNaN(+count) ||
            (role === Role.Buyer && +price * +count > startingPrice) ||
            (role === Role.Seller && +count > startingQuota)
        ) {
            Toast.warn('输入的值无效')
        } else {
            frameEmitter.emit(MoveType.shout, {
                price: +price,
                num: +count
            })
        }
    }

    dynamicAction = () => {
        const {
            playerState: {price: shoutedPrice, startingPrice, role}
        } = this.props
        const {price, count} = this.state
        if (shoutedPrice !== undefined) {
            return <Loading label="等待中"/>
        }
        return (
            <div className={style.shoutStage}>
                <li>
                    <Input
                        value={price}
                        onChange={this.setPriceVal}
                        onMinus={this.onPriceMinus}
                        onPlus={this.onPricePlus}
                        placeholder={`价格`}
                    />
                </li>
                {role === Role.Buyer ? (
                    <li style={{marginTop: 12}}>
                        <a className={style.countLimit}>
                            可买{' '}
                            <span className={style.priceHighlight}>
                {!isNaN(parseInt(price)) && parseInt(price) !== 0
                    ? Math.floor(startingPrice / Number(price))
                    : ''}
              </span>{' '}
                            股
                        </a>
                    </li>
                ) : (
                    <li style={{marginTop: 42}}/>
                )}
                <li style={{marginTop: 12}}>
                    <Input
                        value={count}
                        onChange={this.setCountVal}
                        onMinus={this.onCountMinus}
                        onPlus={this.onCountPlus}
                        placeholder={`数量`}
                    />
                </li>
                {role === Role.Buyer ? (
                    <li style={{marginTop: 12}}>
                        <div className={style.feeInfo}>
                            <a className={style.feeNumber}>
                                总花费
                                <span className={style.priceHighlight}>
                  {count !== '' && price !== ''
                      ? Number(count) * Number(price)
                      : ''}
                </span>
                            </a>
                            <a className={style.halfIn} onClick={this.halfIn}>
                                半仓
                            </a>
                            <a className={style.allIn} onClick={this.allIn}>
                                全仓
                            </a>
                        </div>
                    </li>
                ) : (
                    <li style={{marginTop: 12}}/>
                )}
            </div>
        )
    }

    dynamicTip = () => {
        const {
            playerState: {role, price}
        } = this.props
        if (price === undefined) {
            return role === Role.Buyer ? '买入' : '卖出'
        }
        return '等待其他玩家'
    }

    dynamicBtnView = () => {
        const {
            playerState: {price: shoutedPrice}
        } = this.props
        if (shoutedPrice !== undefined) {
            return null
        }
        return (
            <Button
                label={this.dynamicTip()}
                onClick={this.shout}
                style={{marginTop: 36}}
            />
        )
    }

    dynamicInfo = () => {
        const {
            playerState: {role, startingPrice, startingQuota}
        } = this.props
        return <div className={style.dynamicInfo}>
            {
                role === Role.Buyer ? <>
                    <InfoBar text="您是买家"/>
                    <InfoBar text={`账户余额${startingPrice}元`}/>
                </> : <>
                    <InfoBar text="您是卖家"/>
                    <InfoBar text={`拥有股票${startingQuota}股`}/>
                </>
            }
        </div>
    }

    renderResult = () => {
        const {
            frameEmitter,
            playerState: {role, profit, startingPrice, startingQuota, actualNum},
            gameState: {strikePrice}
        } = this.props
        const listData = [
            {label: '股票的成交价格', value: strikePrice.toFixed(2)},
            {
                label: role === Role.Buyer ? '你购买的股票数量' : '你出售的股票数量',
                value: actualNum
            },
            {label: '你的总收益', value: profit.toFixed(2)},
            {
                label: '现有总资产',
                value:
                    role === Role.Buyer
                        ? `资金${(startingPrice - strikePrice * actualNum).toFixed(
                        2
                        )}元; 股票${actualNum}股`
                        : `资金${(strikePrice * actualNum).toFixed(
                        2
                        )}元; 股票${startingQuota - actualNum}股`
            }
        ]
        return (
            <>
                <Line
                    text={'交易结果展示'}
                    style={{
                        margin: 'auto',
                        maxWidth: '400px',
                        marginTop: '70px',
                        marginBottom: '20px'
                    }}
                />
                <div className={style.tradeBtn}>
                    <Button
                        onClick={this.showTBMRule}
                        color={Button.Color.Blue}
                        label={`集合竞价知识扩展`}
                    />
                </div>
                <ul>
                    {listData.map(({label, value}) => {
                        return (
                            <li key={label} style={{marginBottom: '10px'}}>
                                <ListItem>
                                    <p className={style.item}>
                                        <span style={{color: '#fff'}}>{label}:&nbsp;</span>
                                        <span style={{color: 'orange'}}>{value}</span>
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
                        label={'再学一次'}
                        color={Button.Color.Blue}
                        style={{marginRight: '20px'}}
                        onClick={() => {
                            frameEmitter.emit(
                                MoveType.nextStage,
                                {onceMore: true},
                                lobbyUrl => (location.href = lobbyUrl)
                            )
                        }}
                    />
                    <Button
                        label={'返回交易大厅'}
                        onClick={() => {
                            frameEmitter.emit(
                                MoveType.nextStage,
                                {onceMore: false},
                                lobbyUrl => (location.href = lobbyUrl)
                            )
                        }}
                    />
                </div>
            </>
        )
    }

    renderPlay = () => {
        const {
            playerState: {privateValue, status},
            gameState: {stockIndex},
            frameEmitter
        } = this.props
        const {shoutTime} = this.state
        const stock = STOCKS[stockIndex]
        return (
            <section className={style.playContent}>
                {
                    status === PlayerStatus.guide ? <Guide done={() => frameEmitter.emit(MoveType.guideDone)}/> : null
                }
                <table className={style.stockInfo}>
                    <tbody>
                    <tr>
                        <td>证券代码</td>
                        <td>证券简称</td>
                        <td>主承销商</td>
                        <td><span className={style.startDate}>初步询价</span>起始日期</td>
                        <td>初步询价截止日期</td>
                    </tr>
                    <tr>
                        <td>{stock.code}</td>
                        <td>{stock.name}</td>
                        <td>{stock.contractor}</td>
                        <td>{stock.startDate}</td>
                        <td>{stock.endDate}</td>
                    </tr>
                    </tbody>
                </table>
                <p style={{margin: '10px 0 30px 0'}}>
                    *私人信息: 你们公司对该股票的估值是
                    <span style={{color: 'orange'}}>{privateValue}</span>
                </p>
                <div className={style.workBox}>
                    <div className={style.tipText}>
                        <Line text={` ${this.dynamicTip()} `}/>
                    </div>
                    {this.dynamicAction()}
                    {this.dynamicBtnView()}
                </div>
                <p className={style.countDown}>
                    {SHOUT_TIMER - shoutTime} S
                </p>
                {this.dynamicInfo()}
                <div className={style.tradeBtn}>
                    <Button
                        onClick={this.showRule}
                        color={Button.Color.Blue}
                        label={`交易规则回顾`}
                    />
                </div>
            </section>
        )
    }

    render() {
        const {
            state: {showRule, showTBMRule},
            props: {frameEmitter, gameState: {strikePrice}, playerState: {status}}
        } = this
        const questions: Array<ITestPageQuestion> = [
            {
                Content: ({inputProps}) =>
                    <div>
                        <p>初步询价只能有一次，而且不能修改</p>
                        <Radio.Group {...inputProps({margin: '.5rem'})}>
                            <Radio value={1}>A. 对</Radio>
                            <Radio value={2}>B. 错</Radio>
                        </Radio.Group>
                    </div>,
                Answer: () => <text>正确答案：B , 初步询价原则上只能有一次报价，因特殊原因需要调整的，应在申购平台上填写具体原因修改。</text>,
                answer: [2]
            },
            {
                Content: ({inputProps}) =>
                    <p>假设有3个买家：A, B, C和3个卖家：D, E, F。将3个买家的买入价格按照从高到低排序，卖家的出售价格按照从低到高排序
                        <br/>买家：
                        <br/>B的每份配额买入价格是62元，购买配额数量是8股；
                        <br/>C的每份配额买入价格是58元，购买配额数量是5股；
                        <br/>A的每份配额买入价格是55元，购买配额数量是4股；
                        <br/>卖家：
                        <br/>E的每份配额出售价格是52元，出售配额数量是4股；
                        <br/>D的每份配额出售价格是56元，出售配额数量是6股；
                        <br/>F的每份配额出售价格是63元，出售配额数量是5股；
                        <br/>1） 最高买入价格的B的买入价格高于最低卖出价格E的卖出价格，E的四股股票全部成交，B可购入4股E的股票，B还有四股股票未购入；
                        <br/>2） 最高买入价格的B的买入价格高于第二低卖出价格D的卖出价格，B还未成交的四股股票成交，此时D还剩2股；
                        <br/>3） 第二高买入价格的C的买入价格高于第二低卖出价格D的卖出价格，D剩下的2股股票成交，C还有3股未成交；
                        <br/>4） 第三高买入价格的A的买入价格低于D的卖出价格，无法成交；
                        <br/>故成交价格为（58+56）/2=<AntInput {...inputProps()}/>，成交10股
                    </p>,
                Answer: () => <text>正确答案：57</text>,
                answer: [57]
            },
            {
                Content: ({inputProps}) =>
                    <p>假设有还有另外2个卖家：B, C和3个卖家：D, E, F。将3个买家的买入价格按照从高到低排序，卖家的出售价格按照从低到高排序
                        <br/>买家：
                        <br/>B的每份配额买入价格是48元，购买配额数量是7股；
                        <br/>C的每份配额买入价格是44元，购买配额数量是4股；
                        <br/>您的每份配额买入价格是39元，购买配额数量是5股；
                        <br/>卖家：
                        <br/>E的每份配额出售价格是40元，出售配额数量是4股；
                        <br/>D的每份配额出售价格是42元，出售配额数量是6股；
                        <br/>F的每份配额出售价格是46元，出售配额数量是5股；
                        <br/>故成交价格为（44+42）/2=<AntInput {...inputProps()}/>，B买入<AntInput {...inputProps()}/>股，C买入<AntInput {...inputProps()}/>股，您买入<AntInput {...inputProps()}/>股，E卖出<AntInput {...inputProps()}/>股，D卖出<AntInput {...inputProps()}/>股，F卖出<AntInput {...inputProps()}/>股。
                    </p>,
                Answer: () => <text><br/>1）最高买入价格的B的买入价格高于最低卖出价格E的卖出价格，E的四股股票全部成交，B可购入4股E的股票，B还有3股股票未购入；
                    <br/>2）最高买入价格的B的买入价格高于第二低卖出价格D的卖出价格，B还未成交的3股股票成交，此时D还剩3股；
                    <br/>3）第二高买入价格的C的买入价格高于第二低卖出价格D的卖出价格，D剩下的3股股票成交，C还有1股未成交；
                    <br/>4）第三高买入价格您的买入价格低于D的卖出价格，无法成交；
                    <br/>成交价格为（44+42）/2= 43 ，B买入 7 股，C买入 3 股，您买入 0 股，E卖出 4 股，D卖出 6 股，F卖出 0 股</text>,
                answer: [43, 7, 3, 0, 4, 6, 0]
            },
            {
                Content: ({inputProps}) =>
                    <p>假设有还有另外2个卖家：B, C和3个卖家：和4个卖家：D, E, F,G。将3个买家的买入价格按照从高到低排序，卖家的出售价格按照从低到高排序
                        <br/>买家：
                        <br/>B的每份配额买入价格是48元，购买配额数量是7股；
                        <br/>C的每份配额买入价格是45元，购买配额数量是4股；
                        <br/>您的每份配额买入价格是39元，购买配额数量是5股；
                        <br/>卖家：
                        <br/>G的每份配额出售价格是40元，出售配额数量是4股；
                        <br/>D的每份配额出售价格是42元，出售配额数量是4股；
                        <br/>F的每份配额出售价格是43元，出售配额数量是5股；
                        <br/>E的每份配额出售价格是46元，出售配额数量是5股；
                        <br/>成交价格为（45+43）/2=<AntInput {...inputProps()}/>，B买入<AntInput {...inputProps()}/>股，C买入<AntInput {...inputProps()}/>股，您买入<AntInput {...inputProps()}/>股，G卖出<AntInput {...inputProps()}/>股，D卖出<AntInput {...inputProps()}/>股，F卖出<AntInput {...inputProps()}/>股，E卖出0股
                    </p>,
                Answer: () => <text><br/>1）最高买入价格的B的买入价格高于最低卖出价格G的卖出价格，G的四股股票全部成交，B可购入4股E的股票，B还有3股股票未购入；
                    <br/>2）最高买入价格的B的买入价格高于第二低卖出价格D的卖出价格，B还未成交的3股股票成交，此时D还剩1股；
                    <br/>3）第二高买入价格的C的买入价格高于第二低卖出价格D的卖出价格，D剩下的1股股票成交，C还有3股未成交；
                    <br/>4）第二高买入价格的C的买入价格高于第三低卖出价格F的卖出价格，C剩下的3股股票全部成交，F还剩2股没有成交。
                    <br/>4）第三高买入价格您的买入价格低于F的卖出价格，无法成交；
                    <br/>故成交价格为（45+43）/2=44，B买入7股，C买入4股，您买入0股，G卖出4股，D卖出4股，F卖出3股，E卖出0股。</text>,
                answer: [44, 7, 4, 0, 4, 4, 3]
            }
        ]
        return (
            <section className={style.play}>
                {status === PlayerStatus.test ? <div style={{maxWidth: '64rem'}}>
                        <TestPage questions={questions} done={() => frameEmitter.emit(MoveType.join)}/>
                    </div> :
                    strikePrice === undefined ? this.renderPlay() : this.renderResult()}
                <Modal
                    visible={showRule}
                    children={
                        <div className={style.modalContent}>
                            <p>交易规则回顾</p>
                            <p>
                                您在一个基金机构工作，您所在的基金机构经过对市场信息的精密分析，现对市场上的股票有一个估值，要您在市场上进行股票交易活动。在这个市场中，您会被系统随机分配为买家或卖家。买家有初始的购买资金M，卖家有初始的股票数量S。买家和卖家对股票的估值不同，并根据自己的估值一次性进行买卖申请。系统将在有效价格范围内选取成交量最大的价位，对接受到的买卖申报一次性集中撮合，产生股票的成交价格。报价大于等于市场成交价格的买家成交；价小于等于市场成交成交价格的卖家成交。买家收益=（成交价-估值）*成交数量；卖家收益=（估值-成交价）*成交数量
                            </p>
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
                            <p>
                                在这个模拟市场中，您将会被随机的分配为买家或者卖家，您的的身份由系统随机确定。
                            </p>
                            <p>
                                在本次实验中，每位买家有M实验币的初始禀赋，股票对于每位买家而言心理价值不同，该价格都是V1到V2之间的随机数；
                                对于每位卖家而言成本也不同，成本是从C1到C2之间的随机数。
                            </p>
                            <p>
                                股票交易开始，每位参与者对拍卖品出一个报价，买家的报价是买家愿意购买该商品的最高出价，
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
        )
    }
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
                        width: '48rem',
                        maxWidth: '95vw',
                        ...tooltipStyle
                    }
                },
                disableBeacon: true,
                hideCloseButton: true
            }
        ),
        steps: Array<Step> = [
            {
                target: `.${style.startDate}`,
                content: <section className={style.guideContent}>
                    <p>初步询价是指发行人及其保荐机构向询价对象进行询价，并根据询价对象的报价结果确定发行价格区间及相应的市盈率区间。通俗点讲，企业和主承销商向询价对象（一般是指在中国证监会备案的基金管理公司、投资机构、证券公司等）推介和发出询价函，以反馈回来的有效报价上下限确定的区间为初步询价区间。这一步做完后，就应该在证监会指定的网站上披露初步询价结果（即初步询价公告）。因特殊原因需要调整初步询价的，应在申购平台上填写具体原因修改。
                    </p>
                </section>,
                ...stepProps()
            },
            {
                target: `.${style.workBox}`,
                content: <section className={style.guideContent}>
                    <p>集合竞价时，系统将撮合所有委托单，筛选出满足最大量的可成交价格，确定为正式的开盘价。
                    </p>
                </section>,
                ...stepProps()
            },
            {
                target: `.${style.tradeBtn}`,
                content: <section className={style.guideContent}>
                    <p>您可以在这里回顾交易规则</p>
                </section>,
                ...stepProps()
            },
            {
                target: `.${style.countDown}`,
                content: <section className={style.guideContent}>
                    <p>您需在规定的时间内完成交易，您可以在这里查看剩余的交易时间</p>
                </section>,
                ...stepProps()
            },
            {
                target: `.${style.dynamicInfo}`,
                content: <section className={style.guideContent}>
                    <p>您可以在这里了解您的角色，是买家还是卖家</p>
                </section>,
                styles: {
                    tooltip: {
                        width: '50vw',
                        height: '50vh'
                    }
                },
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