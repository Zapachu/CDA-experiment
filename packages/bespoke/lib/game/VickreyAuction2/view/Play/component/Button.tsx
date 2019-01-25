import * as React from 'react'
import {gameData} from '../gameData'
import throttle = require('lodash/throttle')

export const Button: React.SFC<{
    label: string,
    onClick: () => void
}> = ({label, onClick}) => {
    const {imageGroup: {button}} = gameData
    return <button style={{
        width: button.width,
        height: button.height,
        background: `url(${button.src}) no-repeat`,
        border: 'none',
        outline: 'none',
        fontSize: button.height / 3
    }} onClick={throttle(onClick, 500)}>{label}</button>
}