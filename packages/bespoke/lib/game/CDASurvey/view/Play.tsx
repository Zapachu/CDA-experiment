import * as React from 'react'
import * as style from './style.scss'
import {Button, Core, Lang, MaskLoading, Toast, RadioGroup, Input} from 'client-vendor'
import {FetchType, GameStage, MoveType, PushType, SURVEY_STAGE, SURVEY_BASIC, SURVEY_FEEDBACK, SURVEY_TEST} from '../config'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from '../interface'

interface IPlayState {
    seatNumber?: number
    inputs: Array<string>
}

export class Play extends Core.Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType, IPlayState> {

    state: IPlayState = {
        inputs: []
    }
    lang = Lang.extractLang({
        confirm: ['确定', 'Confirm'],
        inputSeatNumberPls: ['请输入座位号', 'Input your seat number please'],
        submit: ['提交', 'Submit'],
        invalidSeatNumber: ['座位号有误或已被占用', 'Your seat number is invalid or has been occupied'],
        wait4StartMainTest: ['等待老师开放实验', 'Wait for teacher to start the experiment'],
    })

    render(): React.ReactNode {
        const {props: {gameState: {gameStage}}} = this
        return <section className={style.play}>
            {
                (() => {
                    switch (gameStage) {
                        case GameStage.seatNumber: {
                            return this.renderSeatNumberStage()
                        }
                        case GameStage.mainTest: {
                            return this.renderMainTestStage()
                        }
                    }
                })()
            }
        </section>
    }

    renderSeatNumberStage(): React.ReactNode {
        const {lang, props: {frameEmitter, playerState}, state: {seatNumber}} = this
        if (playerState.seatNumber) {
            return <MaskLoading label={lang.wait4StartMainTest}/>
        }
        return <section className={style.seatNumberStage}>
            <label>{lang.inputSeatNumberPls}</label>
            <input type='number'
                   value={seatNumber||''}
                   onChange={({target: {value: seatNumber}}) => this.setState({seatNumber: seatNumber.substr(0, 4)} as any)}/>
            <Button width={Button.Width.medium} label={lang.submit} onClick={() => {
                if (isNaN(Number(seatNumber))) {
                    return Toast.warn(lang.invalidSeatNumber)
                }
                frameEmitter.emit(MoveType.submitSeatNumber, {seatNumber}, success => {
                    if (!success) {
                        Toast.warn(lang.invalidSeatNumber)
                    }
                })
            }}/>
        </section>
    }

    checkInputs(stage: SURVEY_STAGE): Boolean {
        const {inputs} = this.state
        let length
        switch (stage) {
            case SURVEY_STAGE.basic:
                length = SURVEY_BASIC.length
                break
            case SURVEY_STAGE.feedback:
                if (inputs[0] === '有') {
                    length = 6
                }
                if (inputs[0] === '没有') {
                    length = 4
                }
                break
            case SURVEY_STAGE.test:
                length = SURVEY_TEST.length
                break
        }
        return inputs.length && inputs.length === length && inputs.every(p => !!p)
    }

    renderOptions(q, i, inline = false) {
        const {inputs} = this.state
        if (q.items) {
            return <RadioGroup options={q.items}
                               value={inputs[i] || ''}
                               optionStyle={inline ? 'inline' : null}
                               onChange={e => {
                                   const newInputs = [...inputs]
                                   newInputs[i] = e
                                   this.setState({inputs: newInputs})
                               }}
            />
        }
        return <Input value={inputs[i] || ''}
                      onChange={e => {
                          const newInputs = [...inputs]
                          newInputs[i] = e.target.value
                          this.setState({inputs: newInputs})
                      }}
        />
    }

    renderMainTestStage(): React.ReactNode {
        const {lang, props: {frameEmitter, playerState: {surveyStage}}, state: {inputs}} = this
        if(surveyStage === SURVEY_STAGE.over) {
            return <section className={style.mainTestStage}>问卷结束</section>
        }
        let survey
        switch (surveyStage) {
            case SURVEY_STAGE.feedback:
                const l1 = inputs[0] === '有' ? 1 : 2
                const l2 = inputs[0] === '有' ? 3 : 4
                survey = (
                    <ul>
                        <li>
                            <p className={style.title}>1. {SURVEY_FEEDBACK[0].title}</p>
                            <RadioGroup options={SURVEY_FEEDBACK[0].items}
                                        value={inputs[0] || ''}
                                        onChange={e => {
                                            this.setState({inputs: [e]})
                                        }}
                            />
                        </li>
                        {
                            ['有', '没有'].includes(inputs[0])
                                ? (
                                    <li>
                                        <p className={style.title}>2. {SURVEY_FEEDBACK[l1].title}</p>
                                        {SURVEY_FEEDBACK[l1].blanks.map((b, i) => {
                                            const words = b.split('$__$')
                                            const n = words.length - 1
                                            return (
                                                <p className={style.blanks}>
                                                    {words.map((w, j) => {
                                                        if (j === 0) return <span>{w}</span>
                                                        else return <span>
                                                            <input value={inputs[i * n + j] || ''}
                                                                    onChange={e => {
                                                                        const newInputs = [...inputs]
                                                                        newInputs[i * n + j] = e.target.value
                                                                        this.setState({inputs: newInputs})
                                                                    }}
                                                            />
                                                            {w}
                                                        </span>
                                                    })}
                                                </p>
                                            )
                                        })}
                                    </li>
                                )
                                : null
                        }
                        {
                            ['有', '没有'].includes(inputs[0])
                                ? (
                                    <li>
                                        <p className={style.title}>3. {SURVEY_FEEDBACK[l2].title}</p>
                                        <textarea value={inputs[SURVEY_FEEDBACK[l2].index] || ''}
                                                    onChange={e => {
                                                        const newInputs = [...inputs]
                                                        newInputs[SURVEY_FEEDBACK[l2].index] = e.target.value
                                                        this.setState({inputs: newInputs})
                                                    }}
                                        />
                                    </li>
                                )
                                : null
                        }
                    </ul>
                )
                break
            case SURVEY_STAGE.test:
                survey = (
                    <div>
                        <p style={{marginBottom: '1rem'}}>以下是描述您的一些句子。请仔细阅读并选择您有多同意或不同意每一句子的描述。请不要漏填任何问题。</p>
                        <ul>
                            {SURVEY_TEST.map((q, i) => (
                                <li>
                                    <p className={style.title}>{i + 1}. {q.title}</p>
                                    {this.renderOptions(q, i, true)}
                                </li>
                            ))}
                        </ul>
                    </div>
                )
                break
            case SURVEY_STAGE.basic:
            default:
                survey = (
                    <ul>
                        {SURVEY_BASIC.map((q, i) => (
                            <li>
                                <p className={style.title}>{i + 1}. {q.title}</p>
                                {this.renderOptions(q, i)}
                            </li>
                        ))}
                    </ul>
                )
        }
        return <section className={style.mainTestStage}>
            <p style={{textAlign: 'center', fontSize: '18px', marginBottom: '2rem'}}>问卷</p>
            {survey}
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <Button {...{
                    label: lang.confirm,
                    onClick: () => {
                        if (this.checkInputs(surveyStage || SURVEY_STAGE.basic)) {
                            frameEmitter.emit(MoveType.answerSurvey, {
                                inputs,
                                stage: surveyStage || SURVEY_STAGE.basic
                            })
                            this.setState({inputs: []})
                        } else {
                            Toast.info('输入不正确')
                        }
                    }
                }}/>
            </div>
        </section>
    }
}
