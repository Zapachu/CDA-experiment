import * as React from 'react'
import {Keyframes, SpringProps} from 'react-spring/renderprops'
import {gameData} from '../gameData'
import {PlayerStatus} from '../../../config'

interface KeyFrameState extends SpringProps {
    opacity: number
    x: number
    y: number
    rotateL: number
    rotateR: number
}

export class Player extends React.Component<{
    privatePrice?: number
    position: { x: number, y: number }
    playerStatus: PlayerStatus
}> {
    SpringKeyframes

    constructor(props) {
        super(props)
        const normalState: KeyFrameState = {
            ...props.position,
            opacity: 1,
            rotateL: 0,
            rotateR: 0,
            config: {duration: 200}
        }
        this.SpringKeyframes = Keyframes.Spring<null, KeyFrameState>({
            [PlayerStatus.outside.toString()]: {...normalState, opacity: 0, x: 0},
            [PlayerStatus.prepared.toString()]: normalState,
            [PlayerStatus.shouted.toString()]: [
                {...normalState, rotateL: 30},
                normalState
            ],
            [PlayerStatus.won.toString()]: async next => {
                // noinspection InfiniteLoopJS
                while (true) {
                    await next({...normalState, rotateL: 85, rotateR: 85, y: -20, config: {duration: 300}})
                    await next({...normalState, rotateL: 60, rotateR: 60})
                }
            }
        })
    }

    render(): React.ReactNode {
        const {SpringKeyframes, props: {playerStatus, privatePrice}} = this
        const {imageGroup: {body, hand, idea, winner, cursor}} = gameData
        return <SpringKeyframes state={playerStatus.toString()}>
            {
                ({opacity, x, y, rotateL, rotateR}: KeyFrameState) => <g
                    opacity={opacity}
                    transform={`translate(${x},${y})`}>
                    <image {...{
                        href: body.src
                    }}/>
                    <g transform={`translate(-10,50)`}>
                        <image {...{
                            transform: `rotate(${rotateL}, ${hand.width}, 0)`,
                            href: hand.src
                        }}/>
                    </g>
                    <g transform={`translate(${body.width - 18},30)`}>
                        <image {...{
                            transform: `rotate(${70 - rotateR}, 0, ${hand.height})`,
                            href: hand.src
                        }}/>
                    </g>
                    {
                        privatePrice && playerStatus == PlayerStatus.prepared ?
                            <g transform={`translate(${idea.width >> 1},${-idea.height})`}>
                                <image href={idea.src}/>
                                <text {...{
                                    fontSize: idea.height / 3,
                                    y: idea.height >> 1,
                                    x: idea.width >> 2
                                }}>{privatePrice}</text>
                            </g> : null
                    }
                    {
                        playerStatus == PlayerStatus.won ?
                            <image transform={`translate(0,${-winner.height})`}
                                   href={winner.src}/> : null
                    }
                    {
                        privatePrice ?
                            <image transform={`translate(${body.width - cursor.width >> 1},${body.height * 1.1})`}
                                   href={cursor.src}/> : null
                    }
                </g>
            }
        </SpringKeyframes>
    }
}