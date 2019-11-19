import * as React from 'react'
import { span } from '@bespoke-game/graphical-util'
import { PlayerStatus } from '../../config'

interface ITip {
  role: number
  countdown: number
  playerState: number
  roundTime: number
}

const Tip = ({ playerState, role, countdown, roundTime }: ITip) => {
  if (
    playerState === PlayerStatus.prepared ||
    playerState === PlayerStatus.shouted ||
    playerState === PlayerStatus.dealed
  ) {
    const who = role === 1 ? '卖方' : '买方'
    const timeLeft = countdown ? `，剩余 ${roundTime - countdown} S` : ''
    const content = `点击${who}按钮来成交${timeLeft}`
    let pos = `translate(${span(5.1)},${span(2.1)})`
    if (role === 1) {
      pos = `translate(${span(1.1)},${span(3.1)})`
    }
    return (
      <g transform={pos}>
        <foreignObject
          {...{
            x: span(0),
            y: span(0)
          }}
        >
          <p style={{ fontSize: '1.6rem', width: 400, color: '#333' }}>{content}</p>
        </foreignObject>
      </g>
    )
  }

  return null
}

export default Tip
