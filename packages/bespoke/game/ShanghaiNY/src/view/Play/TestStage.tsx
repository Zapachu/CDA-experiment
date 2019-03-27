import * as React from 'react'
import * as style from './style.scss'
import {Button, ButtonProps, Core, Lang, RadioGroup, MaskLoading} from 'bespoke-client-util'
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

interface Word {
  text: string,
  color?: boolean
}

interface Test {
  desc: Array<Word>,
  questions: Array<{
    title: Array<Word>,
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
      instructionTitle: ['本页面是为了帮助你熟悉操作界面。你可以尝试在界面上进行不同的选择。当你确定已经熟悉了操作界面之后，请点击最下方的“确定”按钮。', 'This page aims to help you get familiar with the interface. You can try to make different choices. After you are familiar with the interface, please click the "Confirm" button below.'],
      instructionFirst: ['首先，做出你在第一阶段的选择:', 'Now, make your choice for the first action:'],
      instructionSecondWait: ['因为你在第一阶段已经等待，请针对第一阶段可能出现的两种结果，做出你第二阶段的选择:', 'Since you have chosen to wait in the first action, make your choice for the second action based on possible results of the previous action:'],
      instructionSecond1: ['因为你在第一阶段已经选择了1，第二阶段不需要选择，请点击下面的“确定按钮”:', 'Since you have chosen 1 in the first action, you do not need to make the choice for the second action, please click the "Confirm" button below:'],
      next: ['选择完成后，点击“确定”进入下一轮:', 'After making the choices, click "Confirm" button for the next round:'],
      wait4Others: ['等待其他玩家完成测试', 'Waiting for others to complete the test'],
      wrong: ['(错误)', '(Wrong)']
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

  joinWords = (words: Array<Word>) => {
    return <>
      {words.map(({text, color}, i) => <span key={i} className={color?style.blueWords:''}>{text}</span>)}
    </>
  }

  render() {
    const {lang, props: {frameEmitter, playerState:{stageIndex}, game:{params:{gameType,version,d}}}, state: {c1, c2, answers, tips}} = this
    let content;
    if(stageIndex === 0) {
      switch(gameType) {
        case GameType.T1: {
          content = (<>
            <p className={style.instruction}>{lang.instructionTitle}</p>
            <Display />
            <p className={style.instruction}>{lang.instructionFirst}</p>
            <Choice1 c1={c1} d={d} version={version} gameType={gameType} onChoose={c1 => this.setState({c1})}/>
            <p className={style.instruction}>{lang.next}</p>
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
            <p className={style.instruction}>{lang.instructionTitle}</p>
            <Display />
            <p className={style.instruction}>{lang.instructionFirst}</p>
            <Choice1 c1={c1} d={d} version={version} gameType={gameType} onChoose={c1 => this.setState({c1})}/>
            {c1
              ? c1 === Choice.Wait
                  ? <p className={style.instruction}>{lang.instructionSecondWait}</p>
                  : <p className={style.instruction}>{lang.instructionSecond1}</p>
              : null
            }
            <Choice2 c1={c1} c2={c2} d={d} version={version} gameType={gameType} onChoose={c2 => this.setState({c2})}/>
            <p className={style.instruction}>{lang.next}</p>
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
        <p className={style.desc}>{this.joinWords(curTest.desc)}</p>
        <ul>
          {curTest.questions.map(({title, options}, i) => <li key={i}>
            <p className={tips[i]===Tip.Wrong?style.tipWrong:''}>{this.joinWords(title)} {tips[i] === Tip.Wrong ? <span>{lang.wrong}</span> : null}</p>
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
        <MaskLoading label={lang.wait4Others} />
      </div>
    }
    return <section className={style.testStage}>
      {content}
    </section>
  }
}