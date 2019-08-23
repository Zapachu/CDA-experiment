import {PlayerStatus} from "../../config"
import {span} from '@bespoke-game/graphical-util'
import * as React from "react"
import CashText from './CashText'

const Cash = ({playerState, position, balance}: { playerState: number, position: number, balance: number }) => {
    const val = `持有钱币: ${balance}`
    const imgSrc = require('../svgs/cash.svg')

    switch (playerState) {
        case PlayerStatus.prepared:
            return <></>
        case PlayerStatus.timeToShout:
            switch (position) {
                case 0:
                    return <>
                        <g transform={`translate(${span(2)},${span(7.5)})`}>
                            <image {...{href: imgSrc, width: span(1)}}/>
                        </g>
                        <g transform={`translate(${span(3)},${span(7.5)})`}>
                            <image {...{href: imgSrc, width: span(1)}}/>
                        </g>
                        <CashText val={val} transform={`translate(${span(2.22)},${span(8)})`}/>
                    </>
                case 1:
                    return <>
                        <g transform={`translate(${span(2.5)},${span(7.5)})`}>
                            <image {...{href: imgSrc, width: span(1)}}/>
                        </g>
                        <g transform={`translate(${span(7.3)},${span(7.5)})`}>
                            <image {...{href: imgSrc, width: span(1)}}/>
                        </g>
                        <g transform={`translate(${span(7.5)},${span(7.7)})`}>
                            <image {...{href: imgSrc, width: span(1)}}/>
                        </g>
                        <g transform={`translate(${span(7.1)},${span(7.9)})`}>
                            <image {...{href: imgSrc, width: span(1)}}/>
                        </g>
                        <CashText val={val} transform={`translate(${span(7)},${span(8.5)})`}/>
                    </>
            }
            break
        case PlayerStatus.shouted:
            switch (position) {
                case 0:
                    return <>
                        <g transform={`translate(${span(2)},${span(7.5)})`}>
                            <image {...{href: imgSrc, width: span(1)}}/>
                        </g>
                        <g transform={`translate(${span(7)},${span(7.5)})`}>
                            <image {...{href: imgSrc, width: span(1)}}/>
                        </g>
                        <g transform={`translate(${span(8)},${span(7.5)})`}>
                            <image {...{href: imgSrc, width: span(1)}}/>
                        </g>
                        <CashText val={val} transform={`translate(${span(2)},${span(8)})`}/>
                    </>
                case 1:
                    return <>
                        <g transform={`translate(${span(2)},${span(8.5)})`}>
                            <image {...{href: imgSrc, width: span(1)}}/>
                        </g>
                        <g transform={`translate(${span(7)},${span(8.5)})`}>
                            <image {...{href: imgSrc, width: span(1)}}/>
                        </g>
                        <g transform={`translate(${span(8)},${span(8.5)})`}>
                            <image {...{href: imgSrc, width: span(1)}}/>
                        </g>
                        <CashText val={val} transform={`translate(${span(2)},${span(9)})`}/>
                    </>
            }
            break
        default:
            return <></>
    }
}

export default Cash
