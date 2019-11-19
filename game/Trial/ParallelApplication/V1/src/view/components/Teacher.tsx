import * as React from 'react'
import * as style from './style.scss'
const { useEffect, useState } = React

const TEACHER = require('./teacher.png')
const TEACHER_BLINKING = require('./teacher_blinking.gif')
const GAME_RULE = require('./game_rule.png')

const Teacher: React.SFC<PropType> = ({ msg, onGameRuleClick }) => {
  const [teacherSrc, setTeacherSrc] = useState(TEACHER)
  useEffect(() => {
    setTeacherSrc(TEACHER_BLINKING)
    setTimeout(() => setTeacherSrc(TEACHER), 2000)
  }, [msg])
  const messages = msg.split('|')
  return (
    <div className={style.teacher}>
      <img className={style.teacherPic} src={teacherSrc} />
      <div className={style.chat}>
        {messages.map((m, i) => (
          <p key={i}>{m}</p>
        ))}
      </div>
      <img className={style.gameRulePic} src={GAME_RULE} onClick={onGameRuleClick} />
    </div>
  )
}

export default Teacher

interface PropType {
  msg: string
  onGameRuleClick: () => void
}
