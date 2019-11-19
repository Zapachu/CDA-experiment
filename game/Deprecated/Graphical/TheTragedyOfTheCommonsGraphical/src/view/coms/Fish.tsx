import { span } from '@bespoke-game/graphical-util'
import * as React from 'react'
import { PlayerStatus } from '../../config'

const Fish = ({ playerState }: { playerState: number }) => {
  const fishSrc = require('../svgs/fish.svg')
  if (playerState === PlayerStatus.outside) {
    return null
  }
  if (playerState === PlayerStatus.prepared) {
    return (
      <>
        <g transform={`translate(${span(3.6)},${span(6.1)})`}>
          <image {...{ href: fishSrc, width: span(1) }} />
        </g>
        <g transform={`translate(${span(3.9)},${span(6.5)})`}>
          <image {...{ href: fishSrc, width: span(1) }} />
        </g>
        <g transform={`translate(${span(5)},${span(6.2)})`}>
          <image {...{ href: fishSrc, width: span(1) }} />
        </g>
        <g transform={`translate(${span(5.3)},${span(6.5)})`}>
          <image {...{ href: fishSrc, width: span(1) }} />
        </g>
      </>
    )
  }
  if (playerState === PlayerStatus.shouted) {
    return (
      <>
        <g transform={`translate(${span(3.6)},${span(6.1)})`}>
          <image {...{ href: fishSrc, width: span(1) }} />
        </g>
        <g transform={`translate(${span(5)},${span(6.2)})`}>
          <image {...{ href: fishSrc, width: span(1) }} />
        </g>
      </>
    )
  }
  return null
}

export default Fish
