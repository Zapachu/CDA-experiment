import {span, Shadow} from 'bespoke-game-graphical-util'
import * as React from "react";

const PutShadow = ({curPlayer}: { curPlayer: number }) => {
    return <g transform={`translate(${span(2)},${span(7.5)})`}>
        <Shadow active={true}/>
    </g>
}

export default PutShadow
