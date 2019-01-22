import * as React from 'react'
import * as style from './style.scss'
import {Lang, Label, Input, Button, MaskLoading, BtnGroup, Toast} from 'client-vendor'
import {IDENTITY, MoveType, ROLE, RobotStartMode, PlayerStatus} from '../../config'
import {BasePhase} from './BasePhase'
import {getEnumKeys} from '../../util'

class Create extends BasePhase.Create {
    lang = Lang.extractLang({
        participationFee: ['出场费(￥)', 'Participation fee'],
        Role: ['角色', 'Role'],
        Identity: ['身份', 'Identity'],
        Other: ['其它', 'Other'],
        Add: ['添加', 'Add'],
        [ROLE[ROLE.Seller]]: ['卖家', 'Seller'],
        [ROLE[ROLE.Buyer]]: ['买家', 'Buyer'],
        robotStartMode: ['机器人启动模式', 'Robot start mode'],
        exchangeRate: ['兑换比率(实验币/￥)', 'ExchangeRate(point/￥)'],
        interval: ['睡眠时间(秒)', 'SleepTime(s)'],
        [RobotStartMode[RobotStartMode.A]]: ['模式A', 'Mode A'],
        [RobotStartMode[RobotStartMode.B]]: ['模式B', 'Mode B'],
        [RobotStartMode[RobotStartMode.C]]: ['模式B', 'Mode C']
    })

    render() {
        const {lang, props: {params, updateParams}} = this
        const roleKeys = getEnumKeys(ROLE),
            identityKeys = getEnumKeys(IDENTITY)
        return <section className={`${style.assignPosition} ${style.createContent}`}>
            <ul className={style.baseFields}>
                <li>
                    <Label label={lang.participationFee}/>
                    <Input {...{
                        min: 0,
                        value: params.participationFee,
                        onChange: ({target: {value: participationFee}}) => updateParams({participationFee} as any)
                    }}/>
                </li>
            </ul>
            <table className={style.positions}>
                <tbody>
                <tr>
                    <th>&nbsp;</th>
                    <th>{lang.Role}</th>
                    <th>{lang.Identity}</th>
                    <th>{lang.Other}</th>
                    <th onClick={() => this.addPosition()}><span>{lang.Add}</span></th>
                </tr>
                {
                    params.positions.map(({role, identity, ...extraConfig}, positionIndex) =>
                        <tr key={positionIndex}>
                            <th>{positionIndex + 1}</th>
                            <td>
                                <div className={style.centerWrapper}>
                                    <BtnGroup value={roleKeys.findIndex(key => role === ROLE[key])}
                                              options={roleKeys.map(key => lang[key])}
                                              onChange={i => this.updatePosition(positionIndex, position => ({
                                                  ...position,
                                                  role: ROLE[roleKeys[i]]
                                              }))}
                                    />
                                </div>
                            </td>
                            <td>
                                <div className={style.centerWrapper}>
                                    <BtnGroup value={identityKeys.findIndex(key => identity === IDENTITY[key])}
                                              options={identityKeys}
                                              onChange={i => this.updatePosition(positionIndex, position => ({
                                                  ...position,
                                                  identity: IDENTITY[identityKeys[i]]
                                              }))}
                                    />
                                </div>
                            </td>
                            <td className={style.extraConfigWrapper}>
                                {
                                    (() => {
                                        switch (identity) {
                                            case IDENTITY.Player:
                                                return <div>
                                                    <label>{lang.exchangeRate} : </label>
                                                    <input {...{
                                                        type: 'number',
                                                        value: extraConfig.exchangeRate,
                                                        onChange: ({target: {value: exchangeRate}}) => this.updatePosition(positionIndex,
                                                            position => ({...position, exchangeRate}))
                                                    }}/>
                                                </div>
                                            case IDENTITY.GDRobot:
                                                return <div>
                                                    <label>K : </label>
                                                    <input {...{
                                                        type: 'number',
                                                        value: extraConfig.k,
                                                        onChange: ({target: {value: k}}) => this.updatePosition(positionIndex,
                                                            position => ({...position, k}))
                                                    }}/>
                                                </div>
                                            case IDENTITY.ZipRobot:
                                                return <div>
                                                    <label>{lang.interval} : </label>
                                                    <input {...{
                                                        type: 'number',
                                                        value: extraConfig.interval,
                                                        onChange: ({target: {value: interval}}) => this.updatePosition(positionIndex,
                                                            position => ({...position, interval}))
                                                    }}/>
                                                    <label>s</label>
                                                </div>
                                        }
                                    })()
                                }
                            </td>
                            <td onClick={() => this.removePosition(positionIndex)}><span>❌</span></td>
                        </tr>)
                }
                </tbody>
            </table>
        </section>
    }

    addPosition() {
        const {params, updateParams} = this.props
        const positions = [...params.positions,
            {...params.positions.slice().pop()}]
        updateParams({positions})
    }

    removePosition(index) {
        const {params, updateParams} = this.props
        const positions = params.positions.slice()
        positions.splice(index, 1)
        updateParams({positions})
    }

    updatePosition(index, fnUpdate) {
        const {params, updateParams} = this.props
        const positions = params.positions.slice()
        positions[index] = fnUpdate(positions[index])
        updateParams({positions})
    }
}

class Info extends Create {
    render() {
        const {lang, props: {params}} = this
        return <section className={`${style.assignPosition} ${style.infoContent}`}>
            <ul className={style.baseFields}>
                <li>
                    <Label label={lang.participationFee}/>
                    <a>{params.participationFee}</a>
                </li>
            </ul>
            <table className={style.positions}>
                <tbody>
                <tr>
                    <th>&nbsp;</th>
                    <th>{lang.Role}</th>
                    <th>{lang.Identity}</th>
                    <th>{lang.Other}</th>
                </tr>
                {
                    params.positions.map(({role, identity, ...extraConfig}, positionIndex) =>
                        <tr key={positionIndex}>
                            <th>{positionIndex + 1}</th>
                            <td>
                                <div className={style.roleSwitcher}>
                                    {
                                        getEnumKeys(ROLE).map(key =>
                                            <a key={key}
                                               className={ROLE[key] === role ? style.active : ''}>{lang[key]}</a>
                                        )
                                    }
                                </div>
                            </td>
                            <td>
                                <ul className={style.identitySelector}>
                                    {
                                        getEnumKeys(IDENTITY).map(key =>
                                            <li key={key}
                                                className={IDENTITY[key] === identity ? style.active : ''}>{key}</li>
                                        )
                                    }
                                </ul>
                            </td>
                            <td className={style.extraConfigWrapper}>
                                {
                                    (() => {
                                        switch (identity) {
                                            case IDENTITY.Player:
                                                return <div>
                                                    <label>ExchangeRate : </label>
                                                    <span>{extraConfig.exchangeRate}</span>
                                                </div>
                                            case IDENTITY.GDRobot:
                                                return <div>
                                                    <label>K : </label>
                                                    <span>{extraConfig.k}</span>
                                                </div>
                                            case IDENTITY.ZipRobot:
                                                return <div>
                                                    <label>Interval : </label>
                                                    <span>{extraConfig.interval}</span>
                                                    <label>s</label>
                                                </div>
                                            default:
                                                return null
                                        }
                                    })()
                                }
                            </td>
                        </tr>)
                }
                </tbody>
            </table>
        </section>
    }
}

interface IPlayState {
    seatNumber?: number
}

class Play extends BasePhase.Play<IPlayState> {
    lang = Lang.extractLang({
        wait4position: ['等待系统分配角色', 'Waiting for the system to assign your role'],
        inputSeatNumberPls: ['请输入座位号', 'Input your seat number please'],
        invalidSeatNumber: ['座位号有误或已被占用', 'Your seat number is invalid or has been occupied'],
        enterMarket: ['进入市场', 'Enter Market'],
        toEnterMarket: ['您将进入某一市场，您的角色为：', 'You will enter a market, and your role is : '],
        wait4MarketOpen: ['等待市场开放', 'Waiting for market opening'],
        [ROLE[ROLE.Buyer]]: ['买家', 'Buyer'],
        [ROLE[ROLE.Seller]]: ['卖家', 'Seller']
    })

    state: IPlayState = {}

    render() {
        const {lang, props: {game, playerState: {positionIndex, status}}} = this
        return positionIndex === undefined ?
            <MaskLoading label={lang.wait4position}/> :
            <section className={`${style.assignPosition} ${style.playContent}`}>
                <p>{lang.toEnterMarket}<em>{lang[ROLE[game.params.phases[0].params.positions[positionIndex].role]]}</em>
                </p>
                {
                    status === PlayerStatus.wait4MarketOpen ?
                        <MaskLoading label={lang.wait4MarketOpen}/> :
                        this.renderSeatNumber()
                }
            </section>
    }

    renderSeatNumber() {
        const {lang, props: {frameEmitter}, state: {seatNumber}} = this
        return <section className={style.seatNumberStage}>
            <label>{lang.inputSeatNumberPls}</label>
            <input type='number'
                   value={seatNumber || ''}
                   onChange={({target: {value: seatNumber}}) => this.setState({seatNumber: seatNumber.substr(0, 4)} as any)}/>
            <Button width={Button.Width.medium} label={lang.enterMarket} onClick={() => {
                if (isNaN(Number(seatNumber))) {
                    return Toast.warn(lang.invalidSeatNumber)
                }
                frameEmitter.emit(MoveType.enterMarket, {seatNumber}, success => {
                    if (!success) {
                        Toast.warn(lang.invalidSeatNumber)
                    }
                })
            }}/>
        </section>
    }
}

export default {Create, Play, Info}