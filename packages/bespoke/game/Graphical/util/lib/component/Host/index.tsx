import {useSpring, animated} from 'react-spring'
import * as React from 'react'
import {span} from '../Stage'

export function Host({msg = ''}: { msg?: string }) {
    const {opacity} = useSpring(({opacity: msg ? .95 : 0, from: {opacity: 0}}))
    return <g>
        <animated.g {...{
            transform: `translate(${span(1.7)},${span(-.7)})`,
            opacity
        }}>
            <image href={require('./dialog.svg')} width={span(3.2)}/>
            <foreignObject transform={`translate(${span(.15)},${span(.15)})`}>
                <animated.p style={{width: `${span(3)}px`, fontSize: '1.8rem'}}>{msg}</animated.p>
            </foreignObject>
        </animated.g>
        <image href={require('./host.svg')}/>
    </g>
}
