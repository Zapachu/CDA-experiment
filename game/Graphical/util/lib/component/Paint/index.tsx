import * as React from 'react'
import {span} from '../Stage'

export function Paint({index}: { index: number }) {
    const paints = [
            require('./paint1.svg'),
            require('./paint2.svg'),
            require('./paint3.svg'),
            require('./paint4.svg'),
            require('./paint5.svg')
        ],
        paint = paints[index % paints.length]
    return <image {...{
        href: paint,
        width: span(3)
    }}/>
}
