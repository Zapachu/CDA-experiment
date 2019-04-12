import {span} from "../../../../util/lib/component/Stage"
import * as React from "react"

const Background = () => {
    const imgSrc = require('../svgs/player.svg')
    return <g transform={`translate(${span(2)},${span(3.5)})`}>
        <image {...{href: imgSrc, width: span(6)}}/>
    </g>
}

export default Background
