import * as React from 'react'
import {ImgLoader} from '../ImgLoader'

const PADDING = .15

export function Input({value = '', onChange}: {
    value: string
    onChange: (value: string) => void
}) {
    return <ImgLoader src={require('./input.svg')} render={({images: [input]}) =>
        <input {...{
            style: {
                width: (1 - 2 * PADDING) * input.width,
                height: (1 - 2 * PADDING) * input.height,
                padding: `${PADDING * input.height}px ${PADDING * input.width}px`,
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
    }/>
}
