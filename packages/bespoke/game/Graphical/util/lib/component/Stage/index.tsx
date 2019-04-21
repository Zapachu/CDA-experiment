import * as React from 'react'
import './style.scss'

const CELL_SIZE = 100, STAGE_COL = 10
export const STAGE_SIZE = span(STAGE_COL)

export function span(n: number | string) {
    return CELL_SIZE * +n
}

export function Stage({dev, children}: { dev?: boolean, children? }) {
    return <svg viewBox={`0 0 ${STAGE_SIZE} ${STAGE_SIZE}`}>
        {
            dev ? <g stroke={'#999'} strokeWidth={1}>
                {
                    Array(STAGE_COL).fill(null).map((_, i) => <React.Fragment key={i}>
                        <line {...{
                            x1: 0, y1: span(i),
                            x2: STAGE_SIZE, y2: span(i)
                        }}/>
                        <line {...{
                            x1: span(i), y1: 0,
                            x2: span(i), y2: STAGE_SIZE
                        }}/>
                    </React.Fragment>)
                }
            </g> : null
        }
        {
            children
        }
    </svg>
}

export function spanDom(n: number | string) {
    const {innerHeight, innerWidth} = window
    const viewSize = innerHeight < innerWidth ? .99 * innerHeight : innerWidth
    return viewSize / STAGE_SIZE * span(n)
}
