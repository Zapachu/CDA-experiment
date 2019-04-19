import {span} from 'bespoke-game-graphical-util'
import * as React from "react"
import {PlayerStatus} from '../../config'

const Role = ({playerState, role}: { playerState: number, role: number }) => {
    const dealedSrc = require('../svgs/dealed.gif')
    if (playerState === PlayerStatus.dealed) {
        switch (role) {
            case 0:
                return <>
                    <g transform={`translate(${span(1)},${span(4)})`}>
                        <image {...{href: dealedSrc, width: span(1)}}/>
                    </g>
                </>
            case 1:
                return <>
                    <g transform={`translate(${span(8)},${span(4)})`}>
                        <image {...{href: dealedSrc, width: span(1)}}/>
                    </g>
                </>
            default:
                return null
        }
    }
    return null
}

export default Role
