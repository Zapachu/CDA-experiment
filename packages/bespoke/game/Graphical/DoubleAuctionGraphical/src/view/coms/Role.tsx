import {span, Idea} from 'bespoke-game-graphical-util'
import * as React from "react"
import {PlayerStatus} from '../../config'

const Role = ({playerState, role, privatePrice}: { playerState: number, role: number, privatePrice: number }) => {
    const buyerImg = require('../svgs/buyer.svg')
    const sellerImg = require('../svgs/seller.svg')
    if (playerState === PlayerStatus.prepared || playerState === PlayerStatus.shouted || playerState === PlayerStatus.dealed) {
        switch (role) {
            case 0:
                return <>
                    <g transform={`translate(${span(1)},${span(4)})`}>
                        <image {...{href: sellerImg, width: span(1)}}/>
                    </g>
                    <g transform={`translate(${span(2)},${span(5)})`}>
                        <Idea msg={privatePrice}/>
                    </g>
                </>
            case 1:
                return <>
                    <g transform={`translate(${span(8)},${span(4)})`}>
                        <image {...{href: buyerImg, width: span(1)}}/>
                    </g>
                    <g transform={`translate(${span(6)},${span(5)})`}>
                        <Idea msg={privatePrice}/>
                    </g>
                </>
            default:
                return null
        }
    }
    return null
}

export default Role
