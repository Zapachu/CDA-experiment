import {span, ImgLoader, Shadow} from '@bespoke-game/graphical-util'
import * as React from "react"
import {PlayerStatus} from '../../config'

const Players = ({playerStatus, lastProfit, curQuantity}) => {
    if(playerStatus === PlayerStatus.outside) {
        return <>
            <g transform={`translate(${span(3.5)},${span(4)})`}>
                <Player direction={Direction.B} num={lastProfit} />
            </g>
            <g transform={`translate(${span(6.5)},${span(4)})`}>
                <Player direction={Direction.B}/>
            </g>
        </>
    }
    return <>
        <g transform={`translate(${span(2)},${span(4)})`}>
            <Player direction={Direction.L} num={curQuantity} />
        </g>
        <g transform={`translate(${span(8)},${span(4)})`}>
            <Player direction={Direction.R}/>
        </g>
    </>
}

const Player = ({direction, num}: {direction: Direction, num?: number}) => {
    return <ImgLoader src={[
        require('./img/playerL.svg'),
        require('./img/playerR.svg'),
        require('./img/playerB.svg'),
    ]} render={({images: [playerL, playerR, playerB]}) => {
        const player = direction === Direction.L ? playerL : direction === Direction.R ? playerR : playerB
        return <g opacity={num !== undefined? 1 : .7}>
            <g transform={`translate(${player.width >> 1},${player.height * .9})`}>
                <Shadow active={num !== undefined}/>
            </g>
            <image {...{
                href: player.src
            }}/>
            {
                num !== undefined
                    ? direction === Direction.B
                        ? <g fontSize={'20px'} transform={`translate(${player.width*-.2},${player.height*1.2})`}>
                            <text>
                                上轮成绩为
                                <tspan fill={'#ffd466'}>{num}</tspan>
                            </text>
                        </g>
                        : <g fontSize={'20px'} transform={`translate(${player.width*-.1},${player.height*1.1})`}>
                            <Bucket num={num} />
                        </g>
                    : null
            }
        </g>
    }
    }/>
}

const Bucket = ({num}) => {
    const bucketSrc = require('./img/bucket.svg')
    return <>
        <image {...{href: bucketSrc, width: span(1)}}/>
        <text transform={`translate(${span(.12)},${span(.65)})`}>
            鱼量:
            <tspan fill={'#ffd466'}>{num}</tspan>
        </text>
    </>
}

enum Direction {
    L, R, B
}

export default Players
