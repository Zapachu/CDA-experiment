import {span} from 'bespoke-game-graphical-util'
import * as React from "react"

const Outside = ({playing}: { playing: boolean }) => {
    const imgSrc = '../svgs/outsideMan'
    if (playing) {
        return <div>
            <g transform={`translate(${span(2)},${span(6)})`}>
                <image {...{href: imgSrc, width: span(2)}}/>
            </g>
            <g transform={`translate(${span(2.5)},${span(6.5)})`}>
                <image {...{href: imgSrc, width: span(2)}}/>
            </g>
            <g transform={`translate(${span(3)},${span(6)})`}>
                <image {...{href: imgSrc, width: span(2)}}/>
            </g>
            <g transform={`translate(${span(3.5)},${span(6.5)})`}>
                <image {...{href: imgSrc, width: span(2)}}/>
            </g>
            <foreignObject {...{
                x: span(3),
                y: span(7)
            }}>
                <div>
                    <h2>卖方</h2>
                </div>
            </foreignObject>
            <g transform={`translate(${span(6)},${span(6)})`}>
                <image {...{href: imgSrc, width: span(2)}}/>
            </g>
            <g transform={`translate(${span(6.5)},${span(6.5)})`}>
                <image {...{href: imgSrc, width: span(2)}}/>
            </g>
            <g transform={`translate(${span(7)},${span(6)})`}>
                <image {...{href: imgSrc, width: span(2)}}/>
            </g>
            <g transform={`translate(${span(7.5)},${span(6.5)})`}>
                <image {...{href: imgSrc, width: span(2)}}/>
            </g>
            <foreignObject {...{
                x: span(7),
                y: span(7)
            }}>
                <div>
                    <h2>买方</h2>
                </div>
            </foreignObject>
        </div>
    }
    return null
}

export default Outside
