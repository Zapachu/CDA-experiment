import * as React from 'react'
import * as style from './style.scss'
import {Button, ButtonProps, Core, Lang, RadioGroup} from 'bespoke-client-util'
import {FetchType, MoveType, PushType, GameType, Test1, Test2, Choice} from '../../config'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from '../../interface'
import Display from './Display'
import Choice1 from './Choice1'
import Choice2 from './Choice2'

interface IPlayState {
  c1: number,
  c2: Array<number>,
  answers: Array<string>,
  tips: Array<Tip>
}

enum Tip {
  Correct = 1,
  Wrong,
}

interface Test {
  desc: string,
  questions: Array<{
    title: string,
    options: Array<string>,
    answer: string
  }>
}

export default class TestStage extends Core.Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType, IPlayState> {
  private Test: Array<Test>

  constructor(props) {
    super(props);
    this.Test = props.game.params.gameType===GameType.T1 ? Test1 : Test2;
  }

  state: IPlayState = {
    c1: 0,
    c2: [],
    answers: [],
    tips: [],
  }

  lang = Lang.extractLang({
      confirm: ['确定', 'Confirm'],
      inputSeatNumberPls: ['请输入座位号', 'Input your seat number please'],
      submit: ['提交', 'Submit'],
      invalidSeatNumber: ['座位号有误或已被占用', 'Your seat number is invalid or has been occupied'],
      wait4StartMainTest: ['等待老师开放实验', 'Wait for teacher to start the experiment'],
  })

  submit = () => {
    const { props: {frameEmitter, playerState:{stageIndex}}, state: {answers, tips}} = this
    const curTest = this.Test[stageIndex-1];
    if(answers.length !== curTest.questions.length) {
      return;
    }
    if(tips.some(tip => tip !== Tip.Correct)) {
      return;
    }
    frameEmitter.emit(MoveType.answerTest);
    this.setState({answers: [], tips: []});
  }

  answer = (val: string, i: number) => {
    const {props: {playerState:{stageIndex}}, state: {answers, tips}} = this
    const newAnswers = [...answers];
    newAnswers[i] = val;
    const answer = this.Test[stageIndex-1].questions[i].answer;
    const newTips = [...tips];
    newTips[i] = val === answer ? Tip.Correct : Tip.Wrong;
    this.setState({answers: newAnswers, tips: newTips});
  }

  render() {
    const {lang, props: {frameEmitter, playerState:{stageIndex}, game:{params:{gameType,version}}}, state: {c1, c2, answers, tips}} = this
    let content;
    if(stageIndex === 0) {
      switch(gameType) {
        case GameType.T1: {
          content = (<>
            <p className={style.instruction}>本页面是为了帮助你熟悉操作界面。你可以尝试在界面上进行不同的选择。当你确定已经熟悉了操作界面之后，请点击最下方的“确定”按钮。</p>
            <Display />
            <p className={style.instruction}>首先，做出你在第一阶段的选择:</p>
            <Choice1 c1={c1} version={version} gameType={gameType} onChoose={c1 => this.setState({c1})}/>
            <p className={style.instruction}>选择完成后，点击“确定”进入下一轮:</p>
            <Button width={ButtonProps.Width.small}
                    label={lang.confirm}
                    onClick={() => {
                      if(!c1) return;
                      frameEmitter.emit(MoveType.answerTest)
                      this.setState({c1: 0})
                    }}
            />
          </>)
          break;
        }
        case GameType.T2: {
          content = (<>
            <p className={style.instruction}>本页面是为了帮助你熟悉操作界面。你可以尝试在界面上进行不同的选择。当你确定已经熟悉了操作界面之后，请点击最下方的“确定”按钮。</p>
            <Display />
            <p className={style.instruction}>首先，做出你在第一阶段的选择:</p>
            <Choice1 c1={c1} version={version} gameType={gameType} onChoose={c1 => this.setState({c1})}/>
            {c1
              ? c1 === Choice.Wait
                  ? <p className={style.instruction}>因为你在第一阶段已经等待，请针对第一阶段可能出现的两种结果，做出你第二阶段的选择:</p>
                  : <p className={style.instruction}>因为你在第一阶段已经选择了1，第二阶段不需要选择，请点击下面的“确定按钮”:</p>
              : null
            }
            <Choice2 c1={c1} c2={c2} version={version} gameType={gameType} onChoose={c2 => this.setState({c2})}/>
            <p className={style.instruction}>选择完成后，点击“确定”进入下一轮:</p>
            <Button width={ButtonProps.Width.small}
                    label={lang.confirm}
                    onClick={() => {
                      if(!c1 || (c1===Choice.Wait&&!c2.every(c => !!c))) return;
                      frameEmitter.emit(MoveType.answerTest)
                      this.setState({c1: 0})
                    }}
            />
          </>)
          break;
        }
      }
    }
    else if(stageIndex-1 < this.Test.length) {
      const curTest = this.Test[stageIndex-1]
      content = <div>
        <Display />
        <p>{curTest.desc}</p>
        <ul>
          {curTest.questions.map(({title, options}, i) => <li key={i}>
            <p>{title}</p>
            {tips[i] === Tip.Wrong ? <p>错误</p> : null}
            <RadioGroup options={options}
                        value={answers[i] || ''}
                        onChange={e => this.answer(e, i)}
            />
          </li>)}
        </ul>
        <Button width={ButtonProps.Width.small}
                label={lang.confirm}
                onClick={this.submit}
        />
      </div>
    }
    else {
      content = <div>
        <p>等待其他玩家完成测试</p>
      </div>
    }
    return <section className={style.testStage}>
      {content}
    </section>
  }
}