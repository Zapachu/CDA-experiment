import {span, Idea} from 'bespoke-game-graphical-util'
import {PlayerStatus} from '../../config'
import * as React from "react"

const Referee = ({playerState, position, balance}: { playerState: number, position: number, balance: number}) => {
    const imgSrc = require('../svgs/referee.svg')
    let msg = ''
    switch (playerState) {
        case PlayerStatus.outside:
            msg = '您有一定的初始金币，请选择您要赠送给对方的金币数，然后接受对方的回赠，最后查看收益结果'
            break
        case PlayerStatus.timeToShout:
            if (position === 0) msg = `您有 ${balance} 金币， 请输入一定的金币数目来赠予对方玩家`
            if (position === 1) msg = `对方赠予了您金币，该金币经过翻倍变为 ${balance}`
            break
        case PlayerStatus.shouted:
            if (position === 0) msg = '您已赠送给对方，等待对方回赠您一定数量的金币'
            if (position === 1) msg = '您已回赠给对方，请等待结果'
            break
        case PlayerStatus.nextRound:
            msg = '本轮结果，请准备下一轮'
            break
        case PlayerStatus.prepared:
            msg = '请等待您的回合'
            break
        case PlayerStatus.gameOver:
            msg = '所有实验结束，等待老师结束实验'

    }
    return <>
        <g transform={`translate(${span(2)},${span(3.5)})`}>
            <image {...{href: imgSrc, width: span(3)}}/>
        </g>
        <Idea msg={msg}/>
    </>
}

export default Referee
