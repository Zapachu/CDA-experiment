import { span } from '@bespoke-game/graphical-util'
import * as React from 'react'
import { PlayerStatus } from '../../config'

const Role = ({ playerState, role }: { playerState: number; role: number }) => {
  const dealedSrc = require('../svgs/dealed.gif')
  if (playerState === PlayerStatus.dealed) {
    switch (role) {
      case 0:
        return (
          <>
            <g transform={`translate(${span(3)},${span(6)})`}>
              <image {...{ href: dealedSrc, width: span(1.5) }} />
            </g>
          </>
        )
      case 1:
        return (
          <>
            <g transform={`translate(${span(6)},${span(6)})`}>
              <image {...{ href: dealedSrc, width: span(1.5) }} />
            </g>
          </>
        )
      default:
        return null
    }
  }
  return null
}

export default Role
