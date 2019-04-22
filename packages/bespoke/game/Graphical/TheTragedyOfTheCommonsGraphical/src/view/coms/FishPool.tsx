import {span} from 'bespoke-game-graphical-util'
import * as React from "react"

const FishPool = () => {
    const fishPoolSrc = require('../svgs/fishPool.svg')
    return <>
        <g transform={`translate(${span(3.5)},${span(5.5)})`}>
            <image {...{href: fishPoolSrc, width: span(3)}}/>
        </g>
    </>
}

export default FishPool
