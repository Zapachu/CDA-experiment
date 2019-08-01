import * as React from 'react'
import * as style from './style.scss'
import {Core} from '@bespoke/client'
import {Lang} from '@elf/component'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from '../../interface'
import {IPOType, MoveType, PushType} from '../../config'
import {Button, Line, Loading} from '@bespoke-game/stock-trading-component'

interface IPlayState {
  matchTimer: number;
  matchNum: number;
}

export default class IntroStage extends Core.Play<ICreateParams,
    IGameState,
    IPlayerState,
    MoveType,
    PushType,
    IMoveParams,
    IPushParams,
    IPlayState> {
  constructor(props) {
    super(props)
    this.state = {
      matchTimer: null,
      matchNum: null
    }
  }

  lang = Lang.extractLang({})

  render() {
    const {
      frameEmitter,
      game: {
        params: {type}
      }
    } = this.props
    const {} = this.state
    const lang = Lang.extractLang({
      confirm: ['确认', 'Confirm']
    })
    return (
        <section className={style.introStage}>
          <Line
              text={type === IPOType.Median ? 'IPO中位数定价' : 'IPO荷兰式定价'}
              style={{marginBottom: '20px'}}
          />
          <Button label={lang.confirm} onClick={() => frameEmitter.emit(MoveType.getIndex)}/>
        </section>
    )
  }
}
