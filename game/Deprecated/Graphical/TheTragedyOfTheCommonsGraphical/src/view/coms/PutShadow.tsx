import { span, Shadow } from '@bespoke-game/graphical-util'
import * as React from 'react'

const PutShadow = () => {
  return (
    <g transform={`translate(${span(2.5)},${span(8.2)})`}>
      <Shadow active={true} />
    </g>
  )
}

export default PutShadow
