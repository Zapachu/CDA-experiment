import * as React from 'react'
import * as style from './style.scss'
import {Button, ButtonProps, Core, Lang, MaskLoading} from 'bespoke-client-util'
import {FetchType, MoveType, PushType, GameType, Version, Choice} from '../../config'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from '../../interface'
import Display from './Display'
import Choice1 from './Choice1'
import Choice2 from './Choice2'

interface IPlayState {
  c1: number,
  c2: Array<number>,
}

export default class MainStage extends Core.Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType, IPlayState> {

  constructor(props) {
    super(props);
    this.state = this.initState(props);
  }

  initState = props => {
    const {playerState:{groupIndex,choices}, gameState:{groups}} = props;
    const curGroup = groups[groupIndex];
    const curChoice = choices[curGroup.roundIndex];
    return curChoice ? {c1: curChoice.c1 || 0, c2: curChoice.c2 || []} : {c1: 0, c2: []}
  }

  state: IPlayState = {
    c1: 0,
    c2: [],
  }

  lang = Lang.extractLang({
      confirm: ['确定', 'Confirm'],
      inputSeatNumberPls: ['请输入座位号', 'Input your seat number please'],
      submit: ['提交', 'Submit'],
      invalidSeatNumber: ['座位号有误或已被占用', 'Your seat number is invalid or has been occupied'],
      wait4StartMainTest: ['等待老师开放实验', 'Wait for teacher to start the experiment'],
  })

  calcDisplayData = () => {
    const {props: {playerState:{groupIndex}, gameState:{groups}, game:{params:{a,b,c,eL,eH,b0,b1,version}}}} = this
    const curGroup = groups[groupIndex];
    if(version === Version.V3) {
      const prob = curGroup.probs[curGroup.roundIndex];
      return prob 
        ? {
          p11: a*eL-b0*eL+c,
          p21: a*eL-b0*eH+c,
          p22: a*eH-b0*eH+c,
        }
        : {
          p11: a*eL-b1*eL+c,
          p21: a*eL-b1*eH+c,
          p22: a*eH-b1*eH+c,
        }
    } else {
      return {
        p11: a*eL-b*eL+c,
        p21: a*eL-b*eH+c,
        p22: a*eH-b*eH+c,
      }
    }
  }

  renderChoice2 = (c1, c2) => {
    if(c1 !== Choice.Wait) {
      return <p>在第一阶段选择{c1}</p>
    }
    return <p>等待, 如果第一阶段有人选1, 则选{c2[0]}; 如果第一阶段没有人选1, 则选{c2[1]}</p>
  }

  renderResult = () => {
    const {lang, props: {frameEmitter, playerState:{groupIndex,choices,profits,finalProfit}, gameState:{groups}, game:{params:{gameType}}}, state: {c1, c2}} = this
    const curGroup = groups[groupIndex];
    const curRoundIndex = curGroup.roundIndex;
    const curChoice = choices[curRoundIndex];
    if(!curChoice) return null;
    const curProfit = profits[curRoundIndex];
    switch(gameType) {
      case GameType.T1: {
        return <>
          <p>你在第{curRoundIndex + 1}轮的选择为: {curChoice.c1}</p>
          <p>第{curRoundIndex + 1}轮的组内最低选择为: {curGroup.mins[curRoundIndex]}</p>
          <p>你在第{curRoundIndex + 1}轮的收益为: {curProfit.toFixed(2)}</p>
          <p>截止第{curRoundIndex + 1}轮，你的收益为: {finalProfit.toFixed(2)}</p>
          <Button width={ButtonProps.Width.small}
                  label={lang.confirm}
                  onClick={() => {
                    frameEmitter.emit(MoveType.advanceRoundIndex);
                    this.setState({c1: 0, c2: []})
                  }}
          />
        </>
      }
      case GameType.T2: {
        return <>
          <p>你在第{curRoundIndex + 1}轮的选择为: </p>
          {this.renderChoice2(c1, c2)}
          <p style={{marginTop:'30px'}}>在第一阶段中, {curGroup.ones[curRoundIndex] ? '有人选1' : '没有人选1'}</p>
          {curChoice.c1!==Choice.One ? <p>你在第二阶段的选择为: {curChoice.c}</p> : null}
          <p>第{curRoundIndex + 1}轮的组内最低选择为: {curGroup.mins[curRoundIndex]}</p>
          <p>你在第{curRoundIndex + 1}轮的收益为: {curProfit.toFixed(2)}</p>
          <p>截止第{curRoundIndex + 1}轮，你的收益为: {finalProfit.toFixed(2)}</p>
          <Button width={ButtonProps.Width.small}
                  label={lang.confirm}
                  onClick={() => {
                    frameEmitter.emit(MoveType.advanceRoundIndex);
                    this.setState({c1: 0, c2: []})
                  }}
          />
        </>
      }
    }
  }

  render() {
    const {lang, props: {frameEmitter, playerState:{stageIndex,groupIndex}, gameState:{groups}, game:{params:{gameType,version,d}}}, state: {c1, c2}} = this
    const curGroup = groups[groupIndex];
    const displayData = this.calcDisplayData();
    let content;
    switch(stageIndex) {
      case 0: {
        content = <div>
          <Display data={displayData} />
          <Choice1 c1={c1} d={d} version={version} gameType={gameType} onChoose={c1 => this.setState({c1})}/>
          <Choice2 c1={c1} c2={c2} d={d} version={version} gameType={gameType} onChoose={c2 => this.setState({c2})}/>
          {gameType===GameType.T1
            ? <Button width={ButtonProps.Width.small}
                      label={lang.confirm}
                      onClick={() => {
                        if(!c1) return;
                        frameEmitter.emit(MoveType.answerMain, {c1})
                      }}
              />
            : c1
                ? <Button width={ButtonProps.Width.small}
                          label={lang.confirm}
                          onClick={() => {
                            if(c1===Choice.Wait && !c2.every(c => !!c)) return;
                            frameEmitter.emit(MoveType.answerMain, {c1, c2})
                          }}
                  />
                : null
          }
        </div>
        break;
      }
      case 1: {
        content = <div>
          <Display data={displayData} />
          <MaskLoading label={'等待其他玩家选择'} />
        </div>
        break;
      }
      case 2: {
        content = <div>
          <Display data={displayData} />
          <div className={style.resultLines}>{this.renderResult()}</div>
        </div>
        break;
      }
      case 3: {
        content = <div>
          <Display data={displayData} />
          <MaskLoading label={'等待其他玩家进入下一轮'} />
        </div>
        break;
      }
    }

    return <section>
      <p>第{curGroup.roundIndex + 1}轮</p>
      {content}
    </section>
  }
}