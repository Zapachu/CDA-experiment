import { span } from '@bespoke-game/graphical-util'
import * as React from 'react'

const Players = () => {
  const leftSrc = require('../svgs/left.svg')
  const rightSrc = require('../svgs/right.svg')
  return (
    <>
      <g transform={`translate(${span(1)},${span(3)})`}>
        <image {...{ href: leftSrc, width: span(1) }} />
      </g>
      <g transform={`translate(${span(2)},${span(4)})`}>
        <image {...{ href: leftSrc, width: span(1) }} />
      </g>
      <g transform={`translate(${span(7)},${span(3)})`}>
        <image {...{ href: rightSrc, width: span(1) }} />
      </g>
      <g transform={`translate(${span(8)},${span(4)})`}>
        <image {...{ href: rightSrc, width: span(1) }} />
      </g>
    </>
  )
}

export default Players
