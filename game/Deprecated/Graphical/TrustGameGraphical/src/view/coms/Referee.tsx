import { span, Host } from '@bespoke-game/graphical-util'
import { PlayerStatus } from '../../config'
import * as React from 'react'

const Referee = ({ playerState, position, balance }: { playerState: number; position: number; balance: number }) => {
  let msg = ''
  switch (playerState) {
    case PlayerStatus.outside:
      if (position === 0) msg = '您有若干现钞，选择您要赠送给对方的金额'
      if (position === 1) msg = '等待对方赠送给您现钞然后回赠'
      break
    case PlayerStatus.timeToShout:
      if (position === 0) msg = `您有 ${balance} 金币， 请输入赠送金额`
      if (position === 1) msg = `对方已赠予，该现钞经过翻倍变为 ${balance}`
      break
    case PlayerStatus.shouted:
      if (position === 0) msg = '您已赠送，等待对方回赠您'
      if (position === 1) msg = '您已回赠给对方，请等待结果'
      break
    case PlayerStatus.nextRound:
      msg = '本轮结果，请准备下一轮'
      break
    case PlayerStatus.prepared:
      msg = '请等待您的回合'
      break
    case PlayerStatus.gameOver:
      msg = '所有实验结束，等待老师结束实验'
  }
  return (
    <>
      <g transform={`translate(${span(2)},${span(1)})`}>
        <Host msg={msg} />
      </g>
    </>
  )
}

export default Referee
