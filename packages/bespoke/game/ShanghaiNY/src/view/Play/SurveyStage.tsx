import * as React from 'react'
import * as style from './style.scss'
import {Button, ButtonProps, Core, Lang, MaskLoading, Toast, RadioGroup, Input} from 'bespoke-client-util'
import {FetchType, MoveType, PushType, Stage, GameType, Test1, Test2, Survey} from '../../config'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from '../../interface'

interface IPlayState {
  answers: Array<string>,
}

export default class SurveyStage extends Core.Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType, IPlayState> {
  state: IPlayState = {
    answers: [],
  }

  lang = Lang.extractLang({
      confirm: ['确定', 'Confirm'],
      inputSeatNumberPls: ['请输入座位号', 'Input your seat number please'],
      submit: ['提交', 'Submit'],
      invalidSeatNumber: ['座位号有误或已被占用', 'Your seat number is invalid or has been occupied'],
      wait4StartMainTest: ['等待老师开放实验', 'Wait for teacher to start the experiment'],
  })

  submit = () => {
    const {lang, props: {frameEmitter}, state: {answers}} = this
    if(answers.length !== Survey.length) return;
    frameEmitter.emit(MoveType.answerSurvey, {surveys: answers});
  }

  answer = (val: string, i: number) => {
    const {state: {answers}} = this
    const newAnswers = [...answers];
    newAnswers[i] = val;
    this.setState({answers: newAnswers});
  }

  render() {
    const {lang, state: {answers}} = this;
    return <section>
      <ul>
      {Survey.map((s,i) => {
        if(s.options) {
          return <li key={i}>
            <p>{i+1}. {s.title}</p>
            {s.options.length > 10
              ? <select value={answers[i] || ''} onChange={({target:{value}}) => this.answer(value, i)}>
                {s.options.map(option => <option key={option} value={option}>{option}</option>)}
              </select>
              : <RadioGroup options={s.options}
                            value={answers[i] || ''}
                            onChange={e => this.answer(e, i)}
              />
            }
          </li>
        }
        return <li key={i}>
          <p>{i+1}. {s.title}</p>
          <input value={answers[i] || ''} onChange={({target:{value}}) => this.answer(value, i)} />
        </li>
      })}
      </ul>
      <Button width={ButtonProps.Width.small}
              label={lang.confirm}
              onClick={this.submit}
      />
    </section>
  }
}