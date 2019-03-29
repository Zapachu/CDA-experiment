import * as React from 'react'
import * as style from './style.scss'
import {Button, ButtonProps, Core, Lang, MaskLoading} from 'bespoke-client-util'
import {FetchType, MoveType, PushType, GameType, Version, Choice, MainStageIndex} from '../../config'
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
      chooseInFirstAction: ['在第一阶段选择', 'In the first action chose '],
      chooseInSecondActionLeft: ['等待, 如果第一阶段有人选1, 则选', 'Wait, if someone has chosen 1 in the first action, choose '],
      chooseInSecondActionRight: ['; 如果第一阶段没有人选1, 则选', '; if on one has chosen 1 in the first action, choose '],
      yourFirstChoiceLeft: ['你在第', 'Your choice in round '],
      yourFirstChoiceRight: ['轮的选择为:', ' is:'],
      lowestChocieLeft: ['第', 'The lowest choice of the group in round '],
      lowestChocieRight: ['轮的组内最低选择为:', ' is:'],
      profitLeft: ['你在第', 'Your profit in round '],
      profitRight: ['轮的积分为:', ' is:'],
      totalProfitLeft: ['截止第', 'Until round '],
      totalProfitRight: ['轮，你的积分为:', ' your total profit is:'],
      inFirstAction: ['在第一阶段中,', 'In the first action,'],
      chose1: ['有人选1', 'someone has chosen 1'],
      notChose1: ['没有人选1', 'no one has chosen 1'],
      yourSecondChoice: ['你在第二阶段的选择为:', 'Your choice in the second action is:'],
      wait4Others2Choose: ['等待其他玩家选择', 'Waiting for others to choose'],
      wait4Others2Next: ['等待其他玩家进入下一轮', 'Waiting for others to enter the next round'],
      roundLeft: ['第', 'Round '],
      roundRight: ['轮', ''],
  })

  calcDisplayData = () => {
    const {props: {playerState:{groupIndex,roundIndex}, gameState:{groups}, game:{params:{a,b,c,eL,eH,b0,b1,version}}}} = this
    const curGroup = groups[groupIndex];
    if(version === Version.V3) {
      const prob = curGroup.probs[roundIndex];
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
    const {lang} = this;
    if(c1 !== Choice.Wait) {
      return <p>{lang.chooseInFirstAction}{c1}</p>
    }
    return <p>{lang.chooseInSecondActionLeft}{c2[0]}{lang.chooseInSecondActionRight}{c2[1]}</p>
  }

  renderResult = () => {
    const {lang, props: {frameEmitter, playerState:{groupIndex,roundIndex,choices,profits,finalProfit}, gameState:{groups}, game:{params:{gameType}}}, state: {c1, c2}} = this
    const curGroup = groups[groupIndex];
    const curRoundIndex = roundIndex;
    const curChoice = choices[curRoundIndex];
    if(!curChoice) return null;
    const curProfit = profits[curRoundIndex];
    switch(gameType) {
      case GameType.T1: {
        return <>
          <p>{lang.yourFirstChoiceLeft}{curRoundIndex + 1}{lang.yourFirstChoiceRight} {curChoice.c1}</p>
          <p>{lang.lowestChocieLeft}{curRoundIndex + 1}{lang.lowestChocieRight} {curGroup.mins[curRoundIndex]}</p>
          <p>{lang.profitLeft}{curRoundIndex + 1}{lang.profitRight} {curProfit.toFixed(2)}</p>
          <p>{lang.totalProfitLeft}{curRoundIndex + 1}{lang.totalProfitRight} {finalProfit.toFixed(2)}</p>
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
          <p>{lang.yourFirstChoiceLeft}{curRoundIndex + 1}{lang.yourFirstChoiceRight} </p>
          {this.renderChoice2(c1, c2)}
          <p style={{margin:'30px 0'}}>{lang.inFirstAction} {curGroup.ones[curRoundIndex] ? lang.chose1 : lang.notChose1}</p>
          {curChoice.c1!==Choice.One ? <p>{lang.yourSecondChoice} {curChoice.c}</p> : null}
          <p>{lang.lowestChocieLeft}{curRoundIndex + 1}{lang.lowestChocieRight} {curGroup.mins[curRoundIndex]}</p>
          <p>{lang.profitLeft}{curRoundIndex + 1}{lang.profitRight} {curProfit.toFixed(2)}</p>
          <p>{lang.totalProfitLeft}{curRoundIndex + 1}{lang.totalProfitRight} {finalProfit.toFixed(2)}</p>
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
    const {lang, props: {frameEmitter, playerState:{stageIndex,roundIndex}, game:{params:{gameType,version,d}}}, state: {c1, c2}} = this;
    const displayData = this.calcDisplayData();
    let content;
    switch(stageIndex) {
      case MainStageIndex.Choose: {
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
      case MainStageIndex.Wait4Result: {
        content = <div>
          <Display data={displayData} />
          <MaskLoading label={lang.wait4Others2Choose} />
        </div>
        break;
      }
      case MainStageIndex.Result: {
        content = <div>
          <Display data={displayData} />
          <div className={style.resultLines}>{this.renderResult()}</div>
        </div>
        break;
      }
    }

    return <section>
      <p>{lang.roundLeft}{roundIndex + 1}{lang.roundRight}</p>
      {content}
    </section>
  }
}