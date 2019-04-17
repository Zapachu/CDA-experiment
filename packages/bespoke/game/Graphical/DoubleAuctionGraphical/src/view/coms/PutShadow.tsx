import {span, Shadow} from 'bespoke-game-graphical-util'
import * as React from "react"
import {PlayerStatus} from '../../config'

const PutShadow = ({playerState, role}: { playerState: number , role: number}) => {
    if (playerState === PlayerStatus.outside) {
        switch (role) {
            case 0:
                return <g transform={`translate(${span(2.5)},${span(7.1)})`}>
                    <Shadow active={true}/>
                </g>
            case 1:
                return <g transform={`translate(${span(6.5)},${span(6.6)})`}>
                    <Shadow active={true}/>
                </g>
            default: return null
        }
    } else {
        return null
    }
}

export default PutShadow
