import * as React from 'react'
import throttle = require('lodash/throttle')
import {ImgLoader} from '../ImgLoader'

export function Button({label, onClick}: {
    label: string,
    onClick: () => void
}) {
    return <ImgLoader src={require('./button.svg')} render={({images: [button]}) =>
        <foreignObject x={-button.width >> 1} y={-button.height >> 1}>
            <button style={{
                width: button.width,
                height: button.height,
                background: `url(${button.src}) no-repeat`,
                border: 'none',
                outline: 'none',
                fontSize: button.height / 2
            }} onClick={throttle(onClick, 500)}>{label}</button>
        </foreignObject>
    }/>
}
