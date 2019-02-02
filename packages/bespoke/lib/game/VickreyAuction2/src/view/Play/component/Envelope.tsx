import * as React from 'react'
import {PlayerStatus} from '../../../config'
import {gameData} from '../gameData'
import {Spring} from 'react-spring'

interface SpringState {
    x: number
    y: number
    scale: number
}

interface IEnvelopeProps {
    playerStatus: PlayerStatus
    beforeShout: SpringState
    afterShout: SpringState
}

export class Envelope extends React.Component<IEnvelopeProps> {
    SpringStates: { [key: string]: SpringState }

    constructor(props: IEnvelopeProps) {
        super(props)
        const {beforeShout, afterShout} = props
        this.SpringStates = {
            [PlayerStatus.outside.toString()]: {...beforeShout, scale: 0},
            [PlayerStatus.prepared.toString()]: beforeShout,
            [PlayerStatus.shouted.toString()]: afterShout,
            [PlayerStatus.won.toString()]: afterShout
        }
    }

    render(): React.ReactNode {
        const {SpringStates, props: {playerStatus}} = this
        const {envelope} = gameData.imageGroup
        return <Spring to={SpringStates[playerStatus.toString()]}>
            {
                ({x, y, scale}: SpringState) => <g transform={`translate(${x},${y})`}>
                    <image {...{
                        href: envelope.src,
                        width: envelope.width * scale,
                        height: envelope.height * scale
                    }}/>
                </g>
            }
        </Spring>
    }
}