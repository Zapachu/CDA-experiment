import {
  BaseController,
  baseEnum,
  FreeStyleModel,
  IActor,
  IMoveCallback,
  TGameState,
  TPlayerState,
  Log,
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
  SheetType
} from './config'
import {GameState, ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from './interface'
import * as dateFormat from 'dateformat'

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
      playerState.stageIndex = 0;
      playerState.choices = [];
      playerState.profits = [];
      playerState.surveyAnswers = [];
      return playerState
  }

  //region play
  // protected async teacherMoveReducer(actor: IActor, type: string, params: IMoveParams, cb?: IMoveCallback): Promise<void> {
  //     const gameState = await this.stateManager.getGameState(),
  //         playerStates = await this.stateManager.getPlayerStates()
  //     switch (type) {
  //         case MoveType.assignPosition: {
  //             Object.values(playerStates).forEach(async playerState => {
  //                 const positionIndex = (playerState.actor.type === baseEnum.Actor.serverRobot ?
  //                     this.positionStack.robot : this.positionStack.player).pop()
  //                 if (positionIndex === undefined) {
  //                     return Log.d('角色已分配完')
  //                 }
  //                 playerState.positionIndex = positionIndex
  //                 playerState.unitLists = this.game.params.phases.map(({templateName, params}) =>
  //                     templateName === phaseNames.mainGame ? params.unitLists[positionIndex] : ''
  //                 )
  //                 this.push(playerState.actor, PushType.assignedPosition)
  //             })
  //             gameState.positionAssigned = true
  //             break
  //         }
  //         case MoveType.openMarket: {
  //             gameState.gamePhaseIndex = 1
  //             await this.startPeriod()
  //             break
  //         }
  //     }
  // }

  protected async playerMoveReducer(actor: IActor, type: string, params: IMoveParams, cb: IMoveCallback): Promise<void> {
      const gameState = await this.stateManager.getGameState(),
          playerState = await this.stateManager.getPlayerState(actor),
          playerStates = await this.stateManager.getPlayerStates(),
          {groups} = gameState,
          {playersPerGroup, gameType, version, rounds, a,b,b0,b1,c,d,eH,eL,s,p} = this.game.params;
      switch (type) {
          case MoveType.initPosition: {
            if (playerState.groupIndex !== undefined) {
                break
            }
            let openGroupIndex = groups.findIndex(({playerNum}) => playerNum < playersPerGroup)
            if (openGroupIndex === -1) {
                const group: GameState.IGroup = {
                    roundIndex: 0,
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
              playerState.stage = Stage.Test;
              break
          }
          case MoveType.answerTest: {
            playerState.stageIndex++;
            if(playerState.stageIndex === this.Test.length+1) {
              const playersInGroup = await this.getPlayersInGroup(playerState.groupIndex);
              const ready = playersInGroup.length === playersPerGroup && playersInGroup.every(ps => ps.stageIndex === this.Test.length+1);
              if(ready) {
                playersInGroup.forEach(ps => {
                  ps.stageIndex = 0;
                  ps.stage = Stage.Main;
                })
              }
            }
            break;
          }
          case MoveType.answerMain: {
            const curRoundIndex = groups[playerState.groupIndex].roundIndex;
            playerState.choices[curRoundIndex] = {c1: params.c1, c2: params.c2 || []};
            playerState.stageIndex = 1;
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
                    ps.finalProfit = ps.profits.reduce((acc, cur, i) => acc + Math.pow(cur, i+1)*s, 0);
                    ps.stageIndex = 2;
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
                    ps.finalProfit = ps.profits.reduce((acc, cur, i) => acc + Math.pow(cur, i+1)*s, 0);
                    ps.stageIndex = 2;
                  })
                  break;
                }
              }
            }
            break;
          }
          case MoveType.advanceRoundIndex: {
            playerState.stageIndex = 3;
            const playersInGroup = await this.getPlayersInGroup(playerState.groupIndex);
            const ready = playersInGroup.length === playersPerGroup && playersInGroup.every(ps => ps.stageIndex === 3);
            if(ready) {
              playersInGroup.forEach(ps => {
                ps.stageIndex = 0;
              })
              if(groups[playerState.groupIndex].roundIndex++ === rounds-1) {
                playersInGroup.forEach(ps => {
                  ps.stage = Stage.Survey;
                })
              }
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
        const {roundIndex, probs} = groups[playerState.groupIndex];
        const curChoice = playerState.choices[roundIndex];
        const x = curChoice.c || curChoice.c1;
        const bi = version===Version.V3 ? (probs[roundIndex] ? b1 : b0) : b;
        const ei = eH*(x-1) + eL*(2-x);
        let ui = a*min - bi*ei + c;
        if(curChoice.c1===Choice.Wait && curChoice.c===Choice.One) ui = ui - d;
        return ui;
      }

      function isP(): boolean {
        const random = Math.floor(Math.random()*10)/10;
        return random < p;
      }
  }

  private async getPlayersInGroup(groupIndex: number) {
    const playerStates = await this.stateManager.getPlayerStates();
    const playersInGroup = Object.values(playerStates).filter(ps => ps.groupIndex === groupIndex);
    return playersInGroup;
  }

  async onGameOver() {
      const gameState = await this.stateManager.getGameState()
      const playerStates = await this.stateManager.getPlayerStates()
      const {rounds} = this.game.params;
      const {groups} = gameState;

      const resultData: Array<Array<any>> = [['组', '座位号', '轮次', '第一阶段选择', '第二阶段选择', '最终选择', '组内有人选1', '组内最低选择', '该轮收益', '最终收益', '专业', '年龄', '年级', '家庭住址', '性别']]
      const playersByGroup = Object.values(playerStates).sort((a, b) => a.groupIndex - b.groupIndex);
      playersByGroup.forEach(ps => {
        const curGroup = groups[ps.groupIndex];
        let curRound = 0;
        while(curRound < rounds) {
          const row = curRound===0 ? [ps.groupIndex+1, ps.seatNumber, curRound+1] : ['', '', ''];
          const curChoice = ps.choices[curRound];
          if(curChoice) {
            row.push(curChoice.c1, curChoice.c2.toString()||'-')
            if(curGroup.mins[curRound]) {
              row.push(curChoice.c?curChoice.c:curChoice.c1, curGroup.ones[curRound]?'yes':'no', curGroup.mins[curRound], ps.profits[curRound], ps.finalProfit)
              if(ps.surveyAnswers.length) {
                row.push(...ps.surveyAnswers)
              } else {
                row.push('-','-','-','-','-')
              }
            } else {
              row.push('-','-','-','-','-','-','-','-','-','-')
            }
          } else {
            row.push('-','-','-','-','-','-','-','-','-','-','-','-')
          }
          resultData.push(row);
          curRound++;
        }
      })

      Object.assign(gameState, {
          sheets: {
              [SheetType.result]: {
                  data: resultData
              },
          }
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
      }
  }
}