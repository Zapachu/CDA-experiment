import * as React from 'react'
import * as style from './style.scss'
import Timer from './Timer'

export const Header: React.SFC<{
  period: number
  role: string
  roleB: boolean
  balance: number
  showTimer: boolean
}> = ({ period, role, roleB, balance, showTimer }) => (
  <ul className={`${style.subHeader} ${roleB ? style.roleB : ''}`}>
    <li>
      Period : <em>{period}</em> of ∞
    </li>
    <li>
      Your role : <em>{role}</em>
    </li>
    <li>
      Your Current Balance : <em>{balance}</em>
    </li>
    {showTimer ? (
      <li>
        Time : <Timer /> s
      </li>
    ) : (
      <li />
    )}
  </ul>
)
