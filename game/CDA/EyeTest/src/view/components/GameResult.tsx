import * as React from 'react'
import * as style from './style.scss'
import { MoveType, PushType } from '../../config'
import { ICreateParams, IMoveParams, IPushParams } from '../../interface'
import { Button } from '@elf/component'
import { FrameEmitter, IGame } from '@bespoke/share'

interface Props {
  result: {
    emotionNum?: number
    genderNum?: number
    point?: number
  }
  total: number
  game?: IGame<ICreateParams>
  frameEmitter?: FrameEmitter<MoveType, PushType, IMoveParams, IPushParams>
}

const GameResult = ({ result, total, game, frameEmitter }: Props) => {
  return (
    <section className={style.result}>
      <p>
        情绪判断题，您一共答对了：<em>{result.emotionNum || 0}</em>/{total} 个
      </p>
      <p>
        性别判断题，您一共答对了：<em>{result.genderNum || 0}</em>/{total} 个
      </p>
      <p>
        在该部分的实验中，您的收益为：<em>{result.point || 0}</em> 人民币
      </p>
      <PhaseOver {...{ game, frameEmitter }} />
    </section>
  )
}

const PhaseOver: React.SFC<{
  game?: IGame<ICreateParams>
  frameEmitter?: FrameEmitter<MoveType, PushType, IMoveParams, IPushParams>
}> = () => {
  return (
    <section className={style.phaseOver}>
      <p>您已完成该部分的实验，请在实验说明的结果记录表上填写您该部分的实验收益。</p>
      <p>点击下方按钮，跳转到输入快速加入码页面，并耐心等待实验员发放下一部分实验的快速加入码。</p>
      <div className={style.btnWrapper}>
        <Button
          {...{
            label: '进入实验下一部分',
            onClick: () => window.open('https://www.ancademy.org/subject/fastjoin', '_blank')
          }}
        />
      </div>
    </section>
  )
}

export default GameResult
