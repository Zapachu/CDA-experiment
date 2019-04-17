import {span, Shadow} from 'bespoke-game-graphical-util'
import * as React from "react";

const PutShadow = ({curPlayer}: { curPlayer: number }) => {
    switch (curPlayer) {
        case 0:
            return <g transform={`translate(${span(2.6)},${span(6.7)})`}>
                <Shadow active={true}/>
            </g>
        case 1:
            return <g transform={`translate(${span(6.4)},${span(6.7)})`}>
                <Shadow active={true}/>
            </g>
        default:
            return <></>
    }

}

export default PutShadow
