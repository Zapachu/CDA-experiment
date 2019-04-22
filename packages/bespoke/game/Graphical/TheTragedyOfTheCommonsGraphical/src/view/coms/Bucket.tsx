import {span} from 'bespoke-game-graphical-util'
import * as React from "react"
import {PlayerStatus} from '../../config'

const Players = ({playerState, playerProfit}: { playerState: number, playerProfit }) => {
    const bucketSrc = require('../svgs/bucket.svg')
    switch (playerState) {
        case PlayerStatus.prepared:
            return <>
                <g transform={`translate(${span(2.7)},${span(8)})`}>
                    <image {...{href: bucketSrc, width: span(1)}}/>
                </g>
                <foreignObject {...{
                    x: span(2.9),
                    y: span(8.4)
                }}>
                    <p style={{width: 200, fontSize: '1.3rem', color: '#FF9800'}}>鱼量: 0</p>
                </foreignObject>
            </>
        case PlayerStatus.shouted:
        case PlayerStatus.nextRound:
            return <>
                <g transform={`translate(${span(2.7)},${span(8)})`}>
                    <image {...{href: bucketSrc, width: span(1)}}/>
                </g>
                <foreignObject {...{
                    x: span(2.9),
                    y: span(8.4)
                }}>
                    <p style={{width: 200, fontSize: '1.3rem', color: '#FF9800'}}>鱼量: {playerProfit}</p>
                </foreignObject>
            </>
        default:
            return null
    }
}

export default Players
