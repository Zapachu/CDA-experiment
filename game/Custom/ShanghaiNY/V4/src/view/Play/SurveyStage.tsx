import * as React from 'react';
import {Lang, Toast} from '@elf/component';
import {Core} from '@bespoke/client';
import * as style from './style.scss';
import {Button, Input, Radio, Select} from 'antd';
import {
    ICreateParams,
    IGameState,
    IMoveParams,
    IPlayerState,
    IPushParams,
    MoveType,
    PushType,
    Survey
} from '../../config';

const {Option} = Select;

interface IPlayState {
    answers: Array<string>,
}

export default class SurveyStage extends Core.Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, IPlayState> {
    state: IPlayState = {
        answers: []
    };

    lang = Lang.extractLang({
        confirm: ['确定', 'Confirm'],
        inputSeatNumberPls: ['请输入座位号', 'Input your seat number please'],
        submit: ['提交', 'Submit'],
        invalidSeatNumber: ['座位号有误或已被占用', 'Your seat number is invalid or has been occupied'],
        wait4StartMainTest: ['等待老师开放实验', 'Wait for teacher to start the experiment'],
        checkPls: ['请检查您的填写信息', 'Check your answers please'],
    });

    submit = () => {
        const {lang, props: {frameEmitter}, state: {answers}} = this;
        if (answers.length !== Survey.length || answers.includes(undefined)) {
            return Toast.warn(lang.checkPls);
        }
        frameEmitter.emit(MoveType.answerSurvey, {surveys: answers});
    };

    answer = (val: string, i: number) => {
        const {state: {answers}} = this;
        const newAnswers = [...answers];
        newAnswers[i] = val;
        this.setState({answers: newAnswers});
    };

    render() {
        const {lang, state: {answers}} = this;
        return <section className={style.surveyStage}>
            <ul className={style.questions}>
                {Survey.map((s, i) => {
                    if (s.options) {
                        return <li key={i}>
                            <p>{i + 1}. {s.title}</p>
                            {s.options.length > 4
                                ? <Select style={{width: '10rem'}} value={answers[i] || ''}
                                          onChange={value => this.answer(value, i)}>
                                    {
                                        s.options.map(option => <Option value={option}>{option}</Option>)
                                    }
                                </Select>
                                : <Radio.Group options={s.options}
                                               value={answers[i] || ''}
                                               onChange={({target: {value}}) => this.answer(value, i)}>
                                    {
                                        s.options.map(option => <Radio value={option}>{option}</Radio>)
                                    }
                                </Radio.Group>
                            }
                        </li>;
                    }
                    return <li key={i}>
                        <p>{i + 1}. {s.title}</p>
                        <Input style={{maxWidth: '12rem'}} value={answers[i] || ''}
                               onChange={({target: {value}}) => this.answer(value, i)}/>
                    </li>;
                })}
            </ul>
            <div style={{textAlign: 'center'}}>
                <Button type='primary' onClick={this.submit}>{lang.confirm}</Button>
            </div>
        </section>;
    }
}