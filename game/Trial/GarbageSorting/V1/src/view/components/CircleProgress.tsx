import * as React from 'react'
import * as style from './style.scss'

const CIRCUMFERENCE = 282.74

const CircleProgress: React.SFC<PropType> = ({ ratio, className = '' }) => {
  return (
    <svg className={style.circleProgress + ' ' + className} version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle r="45%" cx="50%" cy="50%" fill="transparent" />
      <circle
        className={style.bar}
        r="45%"
        cx="50%"
        cy="50%"
        fill="transparent"
        stroke-dasharray={`${CIRCUMFERENCE}%`}
        stroke-dashoffset={`${CIRCUMFERENCE * (1 - ratio)}%`}
      />
    </svg>
  )
}

interface PropType {
  ratio: number // [0, 1]
  className?: string
}

export default CircleProgress
