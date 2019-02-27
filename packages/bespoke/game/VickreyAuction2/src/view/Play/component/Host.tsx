import * as React from 'react'
import {Lang} from 'bespoke-client'
import {Keyframes, config} from 'react-spring/renderprops'
import {gameData} from '../gameData'
import {DEAL_TIMER} from '../../../config'

enum HostStatus {
    normal = 'normal',
    dealTimer = 'dealTimer',
    deal = 'deal',
    dealed = 'dealed'
}

export const Host: React.SFC<{ dealTimer: number, newRoundTimer: number }> = ({dealTimer = 0, newRoundTimer}) => {
    const lang = Lang.extractLang({
        dealed: ['成交！', 'Dealed !']
    })
    const {imageGroup: {body, hand, handWithHammer}} = gameData
    const SpringKeyframes = Keyframes.Spring<null, { rotate: number }>({
        [HostStatus.normal]: {rotate: 10},
        [HostStatus.dealTimer]: [
            {rotate: 0, config: {duration: 100}},
            {rotate: 30, config: config.wobbly}
        ],
        [HostStatus.deal]: [
            {rotate: 0, config: {duration: 100}},
            {rotate: 80, config: config.wobbly}
        ],
        [HostStatus.dealed]: {rotate: 80}
    }) as any

    return <SpringKeyframes state={
        newRoundTimer ? HostStatus.dealed :
            dealTimer === DEAL_TIMER ? HostStatus.deal :
                dealTimer ? HostStatus.dealTimer : HostStatus.normal}>
        {
            ({rotate}) => <g>
                <text x={-10}>{dealTimer === DEAL_TIMER ? lang.dealed : ''}</text>
                <image {...{
                    href: body.src
                }}/>
                <g transform={`translate(-21,50)`}>
                    <image {...{
                        transform: `rotate(${rotate}, ${handWithHammer.width}, 0)`,
                        href: handWithHammer.src
                    }}/>
                </g>
                <g transform={`translate(${body.width - 18},30)`}>
                    <image {...{
                        transform: `rotate(70, 0, ${hand.height})`,
                        href: hand.src
                    }}/>
                </g>
            </g>
        }
    </SpringKeyframes>
}