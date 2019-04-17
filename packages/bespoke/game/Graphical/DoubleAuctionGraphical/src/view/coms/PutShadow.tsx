import {span, Shadow} from 'bespoke-game-graphical-util'
import * as React from "react";

const PutShadow = ({playerState, playing, role}: { playerState: number , playing: boolean, role: number}) => {
    if (!playing) {
        switch (role) {
            case 0:
                return <g transform={`translate(${span(2.5)},${span(6.5)})`}>
                    <Shadow active={true}/>
                </g>
            case 1:
                return <g transform={`translate(${span(6.5)},${span(6.5)})`}>
                    <Shadow active={true}/>
                </g>
            default: return null
        }
    } else {
        return null
    }
}

export default PutShadow
