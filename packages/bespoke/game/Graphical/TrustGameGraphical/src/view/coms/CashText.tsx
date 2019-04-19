import * as React from "react"
import {span} from 'bespoke-game-graphical-util'

const CashText = ({val, transform}: { val: string, transform: string }) => {
    return <g transform={transform}>
        <foreignObject {...{
            x: span(0),
            y: span(0)
        }}>
            <p style={{fontSize: '1.8rem',width: 300, color: '#ffc30f'}}>{val}</p>
        </foreignObject>
    </g>
}

export default CashText
