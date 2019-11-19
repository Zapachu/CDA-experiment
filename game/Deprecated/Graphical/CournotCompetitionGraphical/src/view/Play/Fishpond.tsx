import { span } from '@bespoke-game/graphical-util'
import * as React from 'react'
import { animated, useSpring } from 'react-spring'
import { PlayerStatus } from '../../config'

const FishPool = ({ playerStatus }) => {
  const fishPoolSrc = require('./img/fishpond.svg')
  if (playerStatus === PlayerStatus.outside) {
    return null
  }
  return (
    <>
      <g transform={`translate(${span(3.9)},${span(6)})`}>
        <image {...{ href: fishPoolSrc, width: span(3) }} />
        <Fish active={true} playerStatus={playerStatus} origin={[0.3, 0.8]} />
        <Fish playerStatus={playerStatus} origin={[1.1, 1.1]} />
        <Fish active={true} playerStatus={playerStatus} origin={[1.9, 0.8]} />
      </g>
    </>
  )
}

function Fish({ active = false, origin, playerStatus }) {
  const fishSrc = require('./img/fish.svg')
  if (!active || playerStatus === PlayerStatus.prepared) {
    return (
      <image
        {...{
          href: fishSrc,
          width: span(0.7),
          x: span(origin[0]),
          y: span(origin[1])
        }}
      />
    )
  }
  const { x, y, width } = useSpring({
    x: -1.6,
    y: 2,
    width: 0,
    from: { x: origin[0], y: origin[1], width: 0.7 },
    config: {
      duration: 800
    }
  })
  return (
    <animated.image
      {...{
        href: fishSrc,
        width: width.interpolate(span),
        x: x.interpolate(span),
        y: y.interpolate(span)
      }}
    />
  )
}

export default FishPool
