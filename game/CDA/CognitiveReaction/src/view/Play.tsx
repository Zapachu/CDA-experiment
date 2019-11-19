import * as React from 'react'
import * as style from './style.scss'
import { Button, ButtonProps, Input, Lang, MaskLoading, RadioGroup, Toast } from '@elf/component'
import { Core } from '@bespoke/client'
import { GameStage, MoveType, PlayerStage, PushType, QUESTIONS } from '../config'
import { ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams } from '../interface'
import GameResult from './components/GameResult'

interface IPlayState {
  seatNumber?: number
  answer: string
}

export class Play extends Core.Play<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams,
  IPlayState
> {
  state: IPlayState = {
    answer: ''
  }
  lang = Lang.extractLang({
    confirm: ['确定', 'Confirm'],
    inputSeatNumberPls: ['请输入座位号', 'Input your seat number please'],
    submit: ['提交', 'Submit'],
    invalidSeatNumber: ['座位号有误或已被占用', 'Your seat number is invalid or has been occupied'],
    wait4StartMainTest: ['等待老师开放实验', 'Wait for teacher to start the experiment']
  })

  render(): React.ReactNode {
    const {
      props: {
        gameState: { gameStage }
      }
    } = this
    return (
      <section className={style.play}>
        {(() => {
          switch (gameStage) {
            case GameStage.seatNumber: {
              return this.renderSeatNumberStage()
            }
            case GameStage.mainTest: {
              return this.renderMainTestStage()
            }
          }
        })()}
      </section>
    )
  }

  renderSeatNumberStage(): React.ReactNode {
    const {
      lang,
      props: { frameEmitter, playerState },
      state: { seatNumber }
    } = this
    if (playerState.seatNumber) {
      return <MaskLoading label={lang.wait4StartMainTest} />
    }
    return (
      <section className={style.seatNumberStage}>
        <label>{lang.inputSeatNumberPls}</label>
        <input
          type="number"
          value={seatNumber || ''}
          onChange={({ target: { value: seatNumber } }) =>
            this.setState({ seatNumber: seatNumber.substr(0, 4) } as any)
          }
        />
        <Button
          width={ButtonProps.Width.medium}
          label={lang.submit}
          onClick={() => {
            if (isNaN(Number(seatNumber))) {
              return Toast.warn(lang.invalidSeatNumber)
            }
            frameEmitter.emit(MoveType.submitSeatNumber, { seatNumber }, success => {
              if (!success) {
                Toast.warn(lang.invalidSeatNumber)
              }
            })
          }}
        />
      </section>
    )
  }

  renderMainTestStage(): React.ReactNode {
    const {
        lang,
        props: {
          frameEmitter,
          game,
          gameState: { time },
          playerState: { correctNumber, point, index, playerStage }
        },
        state: { answer }
      } = this,
      timeLeft = game.params.timeLimit * 60 - time,
      timeLeftMin = Math.floor(timeLeft / 60),
      timeLeftSec = timeLeft % 60
    if (playerStage === PlayerStage.over) {
      return <GameResult correctNumber={correctNumber} point={point} total={QUESTIONS.length} />
    }
    const curQ = QUESTIONS[index]
    return (
      <section className={style.mainTestStage}>
        <div className={style.header}>
          <label>{index + 1}、</label>
          <span>
            {timeLeftMin}:{timeLeftSec}
          </span>
        </div>
        <p className={style.title}>{curQ.title}</p>
        {curQ.unit ? (
          <div className={style.blank}>
            <Input
              type={'number'}
              value={answer}
              onChange={({ target: { value } }) => this.setState({ answer: value.toString() })}
            />
            <span>{curQ.unit}</span>
          </div>
        ) : (
          <RadioGroup
            options={curQ.options.map(op => op.label)}
            value={(curQ.options.find(op => op.value === answer) || { label: '' }).label}
            optionStyle={'inline'}
            onChange={val => {
              this.setState({
                answer: curQ.options.find(op => op.label === val).value
              })
            }}
          />
        )}
        <div className={style.btnWrapper}>
          <Button
            width={ButtonProps.Width.medium}
            label={lang.submit}
            onClick={() => {
              if (!answer) return
              frameEmitter.emit(MoveType.answer, { answer })
              this.setState({ answer: '' })
            }}
          />
        </div>
      </section>
    )
  }
}
