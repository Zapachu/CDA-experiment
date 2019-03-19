import * as React from 'react'
import * as style from './style.scss'
import {Button, ButtonProps, Core, Lang, MaskLoading, Toast, RadioGroup, Input} from 'bespoke-client-util'
import {FetchType, MoveType, PushType, Stage} from '../../config'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from '../../interface'
import TestStage from './TestStage'
import MainStage from './MainStage'
import SurveyStage from './SurveyStage'

interface IPlayState {
    seatNumber: string
}

export class Play extends Core.Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType, IPlayState> {

    state: IPlayState = {
      seatNumber: ''
    }
    lang = Lang.extractLang({
        confirm: ['确定', 'Confirm'],
        inputSeatNumberPls: ['请输入座位号', 'Input your seat number please'],
        submit: ['提交', 'Submit'],
        invalidSeatNumber: ['座位号有误或已被占用', 'Your seat number is invalid or has been occupied'],
        wait4StartMainTest: ['等待老师开放实验', 'Wait for teacher to start the experiment'],
    })

    componentDidMount() {
      this.props.frameEmitter.emit(MoveType.initPosition);
    }

    render(): React.ReactNode {
        const {lang, props: {playerState: {stage}}} = this
        console.log(this.props.playerState)
        return <section className={style.play}>
            {
                (() => {
                    switch (stage) {
                        case Stage.Seat: {
                          return this.renderSeatNumberStage()
                        }
                        case Stage.Test: {
                          return <TestStage {...this.props} />
                        }
                        case Stage.Main: {
                          return <MainStage {...this.props} />
                        }
                        case Stage.Survey: {
                          return <SurveyStage {...this.props} />
                        }
                        case Stage.End: {
                          return this.renderEndStage()
                        }
                    }
                })()
            }
        </section>
    }

    renderEndStage = () => {
      return <section>
        <p>实验结束</p>
      </section>
    }

    renderSeatNumberStage = () => {
      const {lang, props: {frameEmitter}, state: {seatNumber}} = this
      return <section className={style.seatNumberStage}>
          <label>{lang.inputSeatNumberPls}</label>
          <input value={seatNumber||''}
                 onChange={({target: {value: seatNumber}}) => this.setState({seatNumber})}/>
          <Button width={ButtonProps.Width.medium} label={lang.submit} onClick={() => {
              frameEmitter.emit(MoveType.inputSeatNumber, {seatNumber}, success => {
                  if (!success) {
                      Toast.warn(lang.invalidSeatNumber)
                  }
              })
          }}/>
      </section>
  }

}
