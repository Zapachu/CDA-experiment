import * as React from 'react'
import {gameData} from '../gameData'

const padding = .15

export const Input: React.SFC<{
    value: string
    onChange: (value: string) => void
}> = ({value = '', onChange}) => {
    const {imageGroup: {input}} = gameData,
        width = (1 - 2 * padding) * input.width, height = (1 - 2 * padding) * input.height
    return <input {...{
        style: {
            width,
            height,
            padding: `${padding * input.height}px ${padding * input.width}px`,
            position: 'relative',
            left: -input.width >> 1,
            top: -input.height >> 1,
            background: `url(${input.src}) no-repeat`,
            border: 'none',
            outline: 'none',
            fontSize: input.height / 3
        },
        value,
        onChange: ({target: {value}}) => onChange(value)
    }}/>
}