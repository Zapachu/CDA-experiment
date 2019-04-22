import {span, Host} from 'bespoke-game-graphical-util'
import {PlayerStatus} from '../../config'
import * as React from "react"

const Referee = ({playerState, fishLeft, playerProfit}: { playerState: number, fishLeft: number, playerProfit: number }) => {
    let msg = ''
    switch (playerState) {
        case PlayerStatus.outside:
            msg = `抓鱼，可抓${fishLeft}条，剩余翻倍均分`
            break
        case PlayerStatus.shouted:
            msg = '已捕鱼，等待剩余鱼翻倍'
            break
        case PlayerStatus.prepared:
            msg = '请选择要捕多少鱼'
            break
        case PlayerStatus.nextRound:
            msg = `捕鱼完成且已翻倍，您获得${playerProfit}`
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
