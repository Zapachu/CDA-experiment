import {
  BaseController,
  IActor,
  IMoveCallback,
  TGameState,
  TPlayerState,
} from 'bespoke-server'
import nodeXlsx from 'node-xlsx'
import {
  FetchType,
  MoveType,
  PushType,
  Stage,
  GameType,
  Test1,
  Test2,
  Choice,
  Version,
  SheetType,
  MainStageIndex,
  TestStageIndex
} from './config'
import {GameState, ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from './interface'

export default class Controller extends BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> {
  private Test: Array<any>;

  //region init
  async init() {
      await super.init();
      switch(this.game.params.gameType) {
        case GameType.T1: {
          this.Test = Test1;
          break;
        }
        case GameType.T2: {
          this.Test = Test2;
          break;
        }
      }
      return this
  }

  initGameState(): TGameState<IGameState> {
      const gameState = super.initGameState()
      gameState.groups = [];
      return gameState
  }

  async initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
      const playerState = await super.initPlayerState(actor)
      playerState.stage = Stage.Seat;
      playerState.stageIndex = TestStageIndex.Interface;
      playerState.choices = [];
      playerState.profits = [];
      playerState.surveyAnswers = [];
      playerState.roundIndex = 0;
      return playerState
  }

  protected async playerMoveReducer(actor: IActor, type: string, params: IMoveParams, cb: IMoveCallback): Promise<void> {
      const gameState = await this.stateManager.getGameState(),
          playerState = await this.stateManager.getPlayerState(actor),
          playerStates = await this.stateManager.getPlayerStates(),
          {groups} = gameState,
          {playersPerGroup, gameType, version, rounds, a,b,b0,b1,c,d,eH,eL,p} = this.game.params;
      switch (type) {
          case MoveType.initPosition: {
            if (playerState.groupIndex !== undefined) {
                break
            }
            let openGroupIndex = groups.findIndex(({playerNum}) => playerNum < playersPerGroup)
            if (openGroupIndex === -1) {
                const group: GameState.IGroup = {
                    playerNum: 0,
                    mins: [],
                    ones: [],
                    probs: new Array(rounds).fill('').map(() => isP())
                }
                openGroupIndex = groups.push(group) - 1
            }
            playerState.groupIndex = openGroupIndex;
            playerState.positionIndex = groups[openGroupIndex].playerNum++;
            break;
          }
          case MoveType.inputSeatNumber: {
            const hasBeenOccupied = Object.values(playerStates).some(({seatNumber}) => seatNumber === params.seatNumber)
              if (hasBeenOccupied) {
                  cb(false)
                  break
              }
              playerState.seatNumber = params.seatNumber;
              this.setPhaseResult(playerState.actor.token, {uniKey:params.seatNumber})
              break
          }
          case MoveType.answerTest: {
            if(playerState.stageIndex < TestStageIndex.Interface) {
              break;
            }
            if(playerState.stageIndex === this.Test.length-1) {
              playerState.stageIndex = TestStageIndex.Next;
            } else {
              playerState.stageIndex++;
            }
            break;
          }
          case MoveType.toMain: {
            playerState.stageIndex = TestStageIndex.Wait4Others;
            const playersInGroup = await this.getPlayersInGroup(playerState.groupIndex);
            const ready = playersInGroup.length === playersPerGroup && playersInGroup.every(ps => ps.stageIndex === TestStageIndex.Wait4Others);
            if(ready) {
              playersInGroup.forEach(ps => {
                ps.stageIndex = MainStageIndex.Choose;
                ps.stage = Stage.Main;
              })
            }
            break;
          }
          case MoveType.answerMain: {
            const curRoundIndex = playerState.roundIndex;
            playerState.choices[curRoundIndex] = {c1: params.c1, c2: params.c2 || []};
            playerState.stageIndex = MainStageIndex.Wait4Result;
            const playersInGroup = await this.getPlayersInGroup(playerState.groupIndex);
            const ready = playersInGroup.length === playersPerGroup && playersInGroup.every(ps => !!ps.choices[curRoundIndex]);
            if(ready) {
              switch(gameType) {
                case GameType.T1: {
                  const min = playersInGroup.some(ps => ps.choices[curRoundIndex].c1 === Choice.One) ? Choice.One : Choice.Two;
                  groups[playerState.groupIndex].mins[curRoundIndex] = min;
                  playersInGroup.forEach(ps => {
                    const ui = calcProfit(ps, min);
                    ps.profits[curRoundIndex] = ui;
                    ps.finalProfit = ps.profits.reduce((acc, cur) => acc + cur, 0);
                    ps.stageIndex = MainStageIndex.Result;
                  })
                  break;
                }
                case GameType.T2: {
                  let choseOne: boolean = playersInGroup.some(ps => ps.choices[curRoundIndex].c1 === Choice.One);
                  if(version === Version.V3) {
                    choseOne = choseOne && groups[playerState.groupIndex].probs[curRoundIndex];
                  }
                  groups[playerState.groupIndex].ones[curRoundIndex] = choseOne;
                  playersInGroup.forEach(ps => {
                    const curChoice = ps.choices[curRoundIndex];
                    const c = curChoice.c1===Choice.Wait ? (choseOne ? curChoice.c2[0] : curChoice.c2[1]) : curChoice.c1
                    curChoice.c = c;
                  })
                  const min = playersInGroup.some(ps => ps.choices[curRoundIndex].c === Choice.One) ? Choice.One : Choice.Two;
                  groups[playerState.groupIndex].mins[curRoundIndex] = min;
                  playersInGroup.forEach(ps => {
                    const ui = calcProfit(ps, min);
                    ps.profits[curRoundIndex] = ui;
                    ps.finalProfit = ps.profits.reduce((acc, cur) => acc + cur, 0);
                    ps.stageIndex = MainStageIndex.Result;
                  })
                  break;
                }
              }
            }
            break;
          }
          case MoveType.advanceRoundIndex: {
            if(playerState.roundIndex === rounds-1) {
              playerState.stageIndex = 0;
              playerState.stage = Stage.Survey;
            } else {
              playerState.roundIndex++;
              playerState.stageIndex = MainStageIndex.Choose;
            }
            break;
          }
          case MoveType.answerSurvey: {
            playerState.surveyAnswers = params.surveys;
            playerState.stage = Stage.End;
            break;
          }
      }

      function calcProfit(playerState: TPlayerState<IPlayerState>, min: number): number {
        const {probs} = groups[playerState.groupIndex];
        const roundIndex = playerState.roundIndex;
        const curChoice = playerState.choices[roundIndex];
        const x = curChoice.c || curChoice.c1;
        const bi = version===Version.V3 ? (probs[roundIndex] ? b1 : b0) : b;
        const ei = eH*(x-1) + eL*(2-x);
        const emin = min===Choice.One ? eL : eH;
        let ui = a*emin - bi*ei + c;
        if(curChoice.c1===Choice.Wait && curChoice.c===Choice.One) ui = ui - d;
        return ui;
      }

      function isP(): boolean {
        const random = Math.floor(Math.random()*10)/10;
        return random < p;
      }
  }

  protected async teacherMoveReducer(actor: IActor, type: string, params: IMoveParams, cb: IMoveCallback): Promise<void> {
      const playerStates = await this.stateManager.getPlayerStates()
      switch (type) {
          case MoveType.startTest:{
              Object.values(playerStates).forEach(playerState=>{
                  if(playerState.stage === Stage.Seat && playerState.seatNumber){
                      playerState.stage = Stage.Test
                  }
              })
              break;
          }
      }
  }

  private async getPlayersInGroup(groupIndex: number) {
    const playerStates = await this.stateManager.getPlayerStates();
    const playersInGroup = Object.values(playerStates).filter(ps => ps.groupIndex === groupIndex);
    return playersInGroup;
  }

  private async genExportData(): Promise<Array<Array<any>>> {
    const gameState = await this.stateManager.getGameState()
    const playerStates = await this.stateManager.getPlayerStates()
    const {rounds,gameType,participationFee,s} = this.game.params;
    const {groups} = gameState;

    const choiceTerms = {
      [Choice.One]: 1,
      [Choice.Two]: 2,
      [Choice.Wait]: 0,
    }

    const resultData: Array<Array<any>> = [['组', '座位号', '最终收益', '轮次', '第一阶段选择', '第二阶段选择(结果1)', '第二阶段选择(结果2)', '最终选择', '第一阶段有人选1', '组内最低选择', '该轮积分', '专业', '年龄', '年级', '家庭住址', '性别']]
    const playersByGroup = Object.values(playerStates).sort((a, b) => a.groupIndex - b.groupIndex);
    playersByGroup.forEach(ps => {
      const curGroup = groups[ps.groupIndex];
      let curRound = 0;
      while(curRound < rounds) {
        const row = curRound===0 ? [ps.groupIndex+1, ps.seatNumber||'-', participationFee+(ps.finalProfit*s||0), curRound+1] : ['', '', '', curRound+1];
        const curChoice = ps.choices[curRound];
        if(curChoice) {
          row.push(choiceTerms[curChoice.c1], curChoice.c1===Choice.Wait?choiceTerms[curChoice.c2[0]]:0, curChoice.c1===Choice.Wait?choiceTerms[curChoice.c2[1]]:0)
          if(curGroup.mins[curRound]) {
            row.push(curChoice.c?curChoice.c:curChoice.c1, gameType===GameType.T2?(curGroup.ones[curRound]?1:0):'-', curGroup.mins[curRound], ps.profits[curRound])
            if(ps.surveyAnswers.length && curRound===0) {
              row.push(...ps.surveyAnswers)
            }
          }
        }
        resultData.push(row);
        curRound++;
      }
    })
    return resultData;
  }

  async onGameOver() {
    const gameState = await this.stateManager.getGameState();
    const resultData = await this.genExportData();
    Object.assign(gameState, {
        sheets: {
            [SheetType.result]: {
                data: resultData
            },
        }
    })
    const {participationFee,s} = this.game.params;
    const playerStates = await this.stateManager.getPlayerStates();
    Object.keys(playerStates).forEach(token => {
      const ps = playerStates[token];
      const point = participationFee+(ps.finalProfit*s||0);
      this.sendBackPlayer(token, {point: point.toString(), uniKey: ps.seatNumber||'-'});
    })
  }

  async handleFetch(req, res) {
      const {query: {type, sheetType}} = req
      const gameState = await this.stateManager.getGameState()
      switch (type) {
          case FetchType.exportXls: {
              const name = SheetType[sheetType]
              let data = [], option = {}
              switch (sheetType) {
                  case SheetType.result:
                  default: {
                      const sheet = gameState['sheets'][sheetType]
                      data = sheet.data
                      option = sheet.data
                  }
              }
              let buffer = nodeXlsx.build([{name, data}], option)
              res.setHeader('Content-Type', 'application/vnd.openxmlformats')
              res.setHeader('Content-Disposition', 'attachment; filename=' + `${encodeURI(name)}.xlsx`)
              return res.end(buffer, 'binary')
          }
          case FetchType.exportXlsPlaying: {
            const name = SheetType[sheetType]
            let data = [], option = {}
            switch (sheetType) {
                case SheetType.result:
                default: {
                    data = await this.genExportData();
                }
            }
            let buffer = nodeXlsx.build([{name, data}], option)
            res.setHeader('Content-Type', 'application/vnd.openxmlformats')
            res.setHeader('Content-Disposition', 'attachment; filename=' + `${encodeURI(name)}.xlsx`)
            return res.end(buffer, 'binary')
        }
        case FetchType.getUserId: {
          const {token, actorType} = req.query;
          const userId = req.user._id;
          if(this.game.owner.toString() !== userId.toString()) {
            const playerState = await this.stateManager.getPlayerState({type: actorType, token});
            playerState.userId = userId;
          }
          return res.end();
      }
      }
  }
}
