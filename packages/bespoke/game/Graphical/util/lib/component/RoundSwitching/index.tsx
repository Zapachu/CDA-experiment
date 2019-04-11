import * as React from 'react'
import {ImgLoader} from '../ImgLoader'
import {span} from '../Stage'

export function RoundSwitching({msg}: { msg: string }) {
    return <ImgLoader src={require('./roundSwitching.gif')} render={({images: [roundSwitching]}) =>
        <>
            <image {...{
                href: roundSwitching.src,
                x: span(5) - (roundSwitching.width >> 1),
                y: span(1.5)
            }}/>
            <text {...{
                fontSize: span(.3),
                x: span(5),
                y: span(7),
                textAnchor: 'middle'
            }}>{msg}</text>
        </>
    }/>
}
