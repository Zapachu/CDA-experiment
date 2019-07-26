import {span, ImgLoader, Shadow, Win, Idea} from '@bespoke-game/graphical-util'
import * as React from "react"
import {PlayerStatus} from '../../config'

const Players = ({playerStatus, lastProfit, curPrice, playerPrice, position, dealerIndex}) => {
    const coords = getCoords(position, playerPrice.length)
    return <>
        {playerPrice.map((price, i) => {
            const {x, y} = coords[i]
            return <g transform={`translate(${span(x)},${span(y)})`}>
                <Player myself={position === i} 
                    dealerIndex={dealerIndex}
                    playerStatus={playerStatus}
                    lastProfit={lastProfit} 
                    curPrice={curPrice}
                    positionIndex={i} 
                    price={price} />
            </g>
        })}
    </>
}

const Player = ({playerStatus, myself, lastProfit, curPrice, positionIndex, price, dealerIndex}) => {
    return <ImgLoader src={[
        require('./img/playerB.svg'),
    ]} render={({images: [player]}) => {
        return <>
            <g transform={`translate(${player.width >> 1},${player.height * .9})`}>
                <Shadow active={myself}/>
            </g>
            <image {...{
                href: player.src
            }}/>
            {
                dealerIndex == positionIndex ?
                    <g transform={`translate(${span(-.2)},${span(-.6)})`}>
                        <Win/>
                    </g> : null
            }
            {
                playerStatus == PlayerStatus.shouted ||  playerStatus == PlayerStatus.next
                    ? myself
                        ? <Idea msg={curPrice}/> 
                        : dealerIndex !== null
                            ? <Idea msg={price}/>
                            : null
                    : null
            }
            {
                playerStatus === PlayerStatus.outside
                    ? myself
                        ? <g fontSize={'20px'} transform={`translate(${player.width*-.2},${player.height*1.2})`}>
                            <text>
                                上轮成绩为
                                <tspan fill={'#ffd466'}>{lastProfit}</tspan>
                            </text>
                        </g>
                        : null
                    : <g fontSize={'16px'} transform={`translate(${player.width*.4},${player.height*1.1})`}>
                        <text>{positionIndex+1}号</text>
                    </g>
            }
        </>
    }
    }/>
}

export default Players

function getCoords(position, length) {
    const coords = [
        {x: 6, y: 4},
        {x: 4, y: 4},
        {x: 8, y: 4},
        {x: 2, y: 4},
        {x: 5, y: 5},
        {x: 3, y: 5},
        {x: 7, y: 5},
        {x: 1, y: 5},
    ].splice(0, length)
    const activeIndex = length > 4 ? 4 : 0
    if(position !== activeIndex) {
        const temp = coords[activeIndex];
        coords[activeIndex] = coords[position];
        coords[position] = temp;
    }
    return coords
} 
