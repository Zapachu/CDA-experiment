import {span} from 'bespoke-game-graphical-util'
import {PlayerStatus} from '../../config'
import * as React from "react"

const Outside = ({playerState}: { playerState: number }) => {

    return <>
        <g transform={`translate(${span(2)},${span(1)})`}>

        </g>
    </>
}

export default Outside
