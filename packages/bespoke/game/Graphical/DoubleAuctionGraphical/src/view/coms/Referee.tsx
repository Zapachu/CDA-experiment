import {span, Host} from 'bespoke-game-graphical-util'
import {PlayerStatus} from '../../config'
import * as React from "react"

const Referee = ({playerState}: { playerState: number }) => {
    let msg = ''
    switch (playerState) {
        case PlayerStatus.outside:
            msg = '买方与卖方的物品交易'
            break
        case PlayerStatus.dealed:
            msg = `交易成功~`
            break
        case PlayerStatus.shouted:
            msg = '已出价，根据您的心里价值来交易吧~'
            break
        case PlayerStatus.prepared:
            msg = '请根据您的心里价值来交易'
            break
        case PlayerStatus.gameOver:
            msg = '所有实验结束，等待老师结束实验'

    }
    return <>
        <g transform={`translate(${span(2)},${span(1)})`}>
            <Host msg={msg}/>
        </g>
    </>
}

export default Referee
