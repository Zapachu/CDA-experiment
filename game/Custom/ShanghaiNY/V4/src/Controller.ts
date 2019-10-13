import {BaseController, IActor, IMoveCallback, TGameState, TPlayerState} from '@bespoke/server';
import {
  Choice,
  getTest,
  ICreateParams,
  IGameGroupState,
  IGameState,
  IMoveParams,
  IPlayerState,
  IPushParams,
  MainStageIndex,
  Mode,
  MoveType,
  PushType,
  SheetType,
  Stage,
  Survey,
  TestStageIndex
} from './config';

export default class Controller extends BaseController<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {

  initGameState(): TGameState<IGameState> {
    const gameState = super.initGameState();
    gameState.groups = [];
    return gameState;
  }

  async initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
    const playerState = await super.initPlayerState(actor);
    playerState.mobile = playerState.user.mobile;
    playerState.stage = Stage.Seat;
    playerState.stageIndex = TestStageIndex.Interface;
    playerState.choices = [];
    playerState.profits = [];
    playerState.surveyAnswers = [];
    playerState.roundIndex = 0;
    return playerState;
  }

  async genExportData(): Promise<Array<Array<any>>> {
    const gameState = await this.stateManager.getGameState();
    const playerStates = await this.stateManager.getPlayerStates();
    const {rounds, participationFee, s} = this.game.params;
    let {groups} = gameState;

    const choiceTerms = {
      [Choice.One]: 1,
      [Choice.Two]: 2,
      [Choice.Wait]: 0,
    };

    const resultData: Array<Array<any>> = [['组', '座位号', '手机号', '最终收益', '轮次', '第一阶段选择', '第二阶段选择', '最终选择', '第一阶段选1人数', '第一阶段选2人数', '组内最低选择', '该轮积分', '专业', '年龄', '年级', '家庭住址', '性别']];
    const playersByGroup = Object.values(playerStates).sort((a, b) => a.groupIndex - b.groupIndex);
    if (!groups) {
      groups = this._rebuildGroups(playersByGroup, this.game.params);
    }
    playersByGroup.forEach(ps => {
      const curGroup = groups[ps.groupIndex];
      let curRound = 0;
      while (curRound < rounds) {
        const row = curRound === 0 ? [ps.groupIndex + 1, ps.seatNumber || '-', ps.mobile || '-', participationFee + (ps.finalProfit * s || 0), curRound + 1] : ['', '', '', '', curRound + 1];
        const curChoice = ps.choices[curRound];
        if (curChoice) {
          row.push(choiceTerms[curChoice.c1], curChoice.c === curChoice.c1 ? '' : curChoice.c2.map(c => choiceTerms[c]).join('/'));
          const curRoundState = curGroup.rounds[curRound];
          if (curRoundState.min) {
            row.push(curChoice.c ? curChoice.c : curChoice.c1, curRoundState.one1, curRoundState.two1, curRoundState.min, ps.profits[curRound]);
            if (ps.surveyAnswers.length && curRound === 0) {
              row.push(...this._formatSurveyAnswers(ps.surveyAnswers));
            }
          }
        }
        resultData.push(row);
        curRound++;
      }
    });
    return resultData;
  }

  _rebuildGroups(playerStates: Array<TPlayerState<IPlayerState>>, {rounds, p, playersPerGroup}: ICreateParams): Array<IGameGroupState> {
    const groups: Array<IGameGroupState> = [];
    const playerArrayByGroup: Array<Array<TPlayerState<IPlayerState>>> = [];
    playerStates.forEach(ps => {
      const groupIndex = ps.groupIndex;
      if (!playerArrayByGroup[groupIndex]) {
        playerArrayByGroup[groupIndex] = [];
      }
      playerArrayByGroup[groupIndex].push(ps);
      if (!groups[groupIndex]) {
        groups[groupIndex] = {
          playerNum: playersPerGroup,
          rounds: []
        };
      }
    });
    groups.forEach((group, groupIndex) => {
      const playersInGroup = playerArrayByGroup[groupIndex];
      let roundIndex = 0;
      while (roundIndex >= 0) {
        if (playersInGroup.every(ps => !!ps.choices[roundIndex])) {
          group.rounds[roundIndex] = {
            one1: playersInGroup.filter(ps => ps.choices[roundIndex].c1 === Choice.One).length,
            two1: playersInGroup.filter(ps => ps.choices[roundIndex].c1 === Choice.Two).length,
            wait1: playersInGroup.filter(ps => ps.choices[roundIndex].c1 === Choice.Wait).length,
            x: playersInGroup.filter(ps => ps.choices[roundIndex].c === Choice.One).length,
            y: playersInGroup.filter(ps => ps.choices[roundIndex].c === Choice.Two).length,
            min: playersInGroup.some(ps => ps.choices[roundIndex].c === Choice.One) ? Choice.One : Choice.Two
          };
          roundIndex++;
        } else {
          roundIndex = -1;
        }
      }
    });
    return groups;
  }

  _formatSurveyAnswers(surveyAnswers: Array<string>): Array<string> {
    return surveyAnswers.map((ans, i) => {
      if ([0, 2, 4].includes(i)) {
        return '' + (Survey[i].options.indexOf(ans) + 1);
      } else {
        return ans;
      }
    });
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
    });
    const {participationFee, s} = this.game.params;
    const playerStates = await this.stateManager.getPlayerStates();
    Object.keys(playerStates).forEach(token => {
      const ps = playerStates[token];
      const point = participationFee + (ps.finalProfit * s || 0);
      this.setPhaseResult(token, {point, uniKey: ps.seatNumber || '-'});
    });
  }

  protected async playerMoveReducer(actor: IActor, type: string, params: IMoveParams, cb: IMoveCallback): Promise<void> {
    const gameState = await this.stateManager.getGameState(),
        playerState = await this.stateManager.getPlayerState(actor),
        playerStates = await this.stateManager.getPlayerStates(),
        {groups} = gameState,
        {playersPerGroup, rounds, a, b, c, d, eH, eL, mode} = this.game.params;
    switch (type) {
      case MoveType.initPosition: {
        if (playerState.groupIndex !== undefined) {
          break;
        }
        let openGroupIndex = groups.findIndex(({playerNum}) => playerNum < playersPerGroup);
        if (openGroupIndex === -1) {
          const group: IGameGroupState = {
            playerNum: 0,
            rounds: []
          };
          openGroupIndex = groups.push(group) - 1;
        }
        playerState.groupIndex = openGroupIndex;
        playerState.positionIndex = groups[openGroupIndex].playerNum++;
        break;
      }
      case MoveType.inputSeatNumber: {
        const hasBeenOccupied = Object.values(playerStates).some(({seatNumber}) => seatNumber === params.seatNumber);
        if (hasBeenOccupied) {
          cb(false);
          break;
        }
        playerState.seatNumber = params.seatNumber;
        this.setPhaseResult(playerState.actor.token, {uniKey: params.seatNumber});
        break;
      }
      case MoveType.answerTest: {
        if (playerState.stageIndex < TestStageIndex.Interface) {
          break;
        }
        if (playerState.stageIndex === getTest(mode).length - 1) {
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
        if (ready) {
          playersInGroup.forEach(ps => {
            ps.stageIndex = MainStageIndex.Choose;
            ps.stage = Stage.Main;
          });
        }
        break;
      }
      case MoveType.answerMain: {
        const {roundIndex} = playerState;
        if (playerState.choices[roundIndex]) {
          break;
        }
        playerState.choices[roundIndex] = {c1: params.c1, c2: params.c2 || []};
        playerState.stageIndex = MainStageIndex.Wait4Result;
        const playersInGroup = await this.getPlayersInGroup(playerState.groupIndex);
        const ready = playersInGroup.length === playersPerGroup && playersInGroup.every(ps => !!ps.choices[roundIndex]);
        if (ready) {
          const one1 = playersInGroup.filter(ps => ps.choices[roundIndex].c1 === Choice.One).length,
              two1 = playersInGroup.filter(ps => ps.choices[roundIndex].c1 === Choice.Two).length,
              wait1 = playersInGroup.filter(ps => ps.choices[roundIndex].c1 === Choice.Wait).length
          playersInGroup.forEach(ps => {
            const curChoice = ps.choices[roundIndex];
            curChoice.c = curChoice.c2.some(c => [Choice.One, Choice.Two].includes(c)) ? curChoice.c2[mode === Mode.LR ? two1 : one1] : curChoice.c1;
          });
          const min = playersInGroup.some(ps => ps.choices[roundIndex].c === Choice.One) ? Choice.One : Choice.Two;
          groups[playerState.groupIndex].rounds[roundIndex] = {
            one1,
            two1,
            wait1,
            x: playersInGroup.filter(ps => ps.choices[roundIndex].c === Choice.One).length,
            y: playersInGroup.filter(ps => ps.choices[roundIndex].c === Choice.Two).length,
            min
          };
          playersInGroup.forEach(ps => {
            ps.profits[roundIndex] = calcProfit(ps, min);
            ps.finalProfit = ps.profits.reduce((acc, cur) => acc + cur, 0);
            ps.stageIndex = MainStageIndex.Result;
          });
          break;
        }
        break;
      }
      case MoveType.advanceRoundIndex: {
        const nextRoundIndex = params.nextRoundIndex;
        if (nextRoundIndex === rounds) {
          playerState.stageIndex = 0;
          playerState.stage = Stage.Survey;
        } else {
          playerState.roundIndex = nextRoundIndex;
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
      const roundIndex = playerState.roundIndex;
      const curChoice = playerState.choices[roundIndex];
      const x = curChoice.c || curChoice.c1;
      const ei = eH * (x - 1) + eL * (2 - x);
      const emin = min === Choice.One ? eL : eH;
      let ui = a * emin - b * ei + c;
      if (curChoice.c1 === Choice.Wait || curChoice.c !== curChoice.c1) {
        ui = ui - d;
      }
      return ui;
    }
  }

  protected async teacherMoveReducer(actor: IActor, type: string, params: IMoveParams, cb: IMoveCallback): Promise<void> {
    const playerStates = await this.stateManager.getPlayerStates();
    switch (type) {
      case MoveType.startTest: {
        Object.values(playerStates).forEach(playerState => {
          if (playerState.stage === Stage.Seat && playerState.seatNumber) {
            playerState.stage = Stage.Test;
          }
        });
        break;
      }
    }
  }

  private async getPlayersInGroup(groupIndex: number) {
    const playerStates = await this.stateManager.getPlayerStates();
    return Object.values(playerStates).filter(ps => ps.groupIndex === groupIndex);
  }
}
