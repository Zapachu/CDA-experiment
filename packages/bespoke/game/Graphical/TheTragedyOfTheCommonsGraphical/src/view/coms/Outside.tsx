import {span} from 'bespoke-game-graphical-util'
import * as React from "react"
import {PlayerStatus} from '../../config'

const Outside = ({playerState}: { playerState: number }) => {
    const imgSrc = require('../svgs/outsideMan.svg')
    if (playerState === PlayerStatus.outside) {
        return <>
            <g transform={`translate(${span(1)},${span(4)})`}>
                <image {...{href: imgSrc, width: span(1)}}/>
            </g>
            <g transform={`translate(${span(2)},${span(4.5)})`}>
                <image {...{href: imgSrc, width: span(1)}}/>
            </g>
            <g transform={`translate(${span(3)},${span(4)})`}>
                <image {...{href: imgSrc, width: span(1)}}/>
            </g>
            <g transform={`translate(${span(4)},${span(4.5)})`}>
                <image {...{href: imgSrc, width: span(1)}}/>
            </g>
            <g transform={`translate(${span(6)},${span(4)})`}>
                <image {...{href: imgSrc, width: span(1)}}/>
            </g>
            <g transform={`translate(${span(7)},${span(4.5)})`}>
                <image {...{href: imgSrc, width: span(1)}}/>
            </g>
            <g transform={`translate(${span(8)},${span(4)})`}>
                <image {...{href: imgSrc, width: span(1)}}/>
            </g>
            <g transform={`translate(${span(9)},${span(4.5)})`}>
                <image {...{href: imgSrc, width: span(1)}}/>
            </g>
        </>
    }
    return null
}

export default Outside
