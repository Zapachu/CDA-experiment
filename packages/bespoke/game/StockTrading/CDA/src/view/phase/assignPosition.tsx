import * as React from 'react'
import * as style from './style.scss'
import {Lang, Button, ButtonProps, MaskLoading, BtnGroup, Toast} from 'bespoke-client-util'
import {MoveType, ROLE, PlayerStatus} from '../../config'
import {BasePhase} from './BasePhase'
import {getEnumKeys} from '../../util'

class Create extends BasePhase.Create {
    lang = Lang.extractLang({
        Add: ['添加', 'Add'],
        Remove: ['移除', 'Remove'],
        [ROLE[ROLE.Seller]]: ['卖家', 'Seller'],
        [ROLE[ROLE.Buyer]]: ['买家', 'Buyer']
    })

    render() {
        const {lang, props: {params}} = this
        const roleKeys = getEnumKeys(ROLE)
        return <section className={`${style.assignPosition} ${style.createContent}`}>
            <div className={style.btnGroup}>
                <a className={style.btnAdd} onClick={() => this.addPosition()}>{lang.Add}</a>
                <a onClick={() => this.removePosition()}>{lang.Remove}</a>
            </div>
            <ul className={style.positions}>
                {
                    params.roles.map((role, positionIndex) =>
                        <li className={style.position} key={positionIndex}>
                            <span className={style.positionSeq}>{positionIndex + 1}</span>
                            <BtnGroup value={roleKeys.findIndex(key => role === ROLE[key])}
                                      options={roleKeys.map(key => lang[key])}
                                      onChange={i => this.updatePosition(positionIndex, ROLE[roleKeys[i]])}
                            />
                        </li>)
                }
            </ul>
        </section>
    }

    addPosition() {
        const {params, updateParams} = this.props
        const roles = [...params.roles, params.roles.slice().pop()]
        updateParams({roles})
    }

    removePosition() {
        const {params, updateParams} = this.props
        const roles = params.roles.slice(0, -1)
        updateParams({roles})
    }

    updatePosition(index, role: ROLE) {
        const {params, updateParams} = this.props
        const roles = params.roles.slice()
        roles[index] = role
        updateParams({roles})
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
                <p>{lang.toEnterMarket}<em>{lang[ROLE[game.params.roles[positionIndex]]]}</em>
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
            <Button width={ButtonProps.Width.medium} label={lang.enterMarket} onClick={() => {
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

export default {Create, Play}
