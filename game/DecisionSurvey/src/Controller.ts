import {
  BaseController,
  IActor,
  IMoveCallback,
  TPlayerState
} from "@bespoke/server";
import {
  CARD,
  DATE,
  DECISION,
  ICreateParams,
  IGameState,
  IMoveParams,
  IPlayerState,
  IPushParams,
  MoveType,
  PAGE,
  PushType,
  SheetType
} from "./config";

export default class Controller extends BaseController<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams
> {
  private shoutTimer: NodeJS.Timer;

  // initGameState(): TGameState<IGameState> {
  //   const gameState = super.initGameState();
  //   return gameState;
  // }

  async initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
    const playerState = await super.initPlayerState(actor);
    playerState.profit = {
      [DATE.jul5]: 0,
      [DATE.aug4]: 0,
      [DATE.oct13]: 0,
      [DATE.nov12]: 0
    };
    playerState.profit14 = {
      [DATE.jul5]: 0,
      [DATE.aug4]: 0,
      [DATE.oct13]: 0,
      [DATE.nov12]: 0
    };
    playerState.profit56 = {
      [DATE.jul5]: 0,
      [DATE.aug4]: 0,
      [DATE.oct13]: 0,
      [DATE.nov12]: 0
    };
    playerState.answer = {};
    return playerState;
  }

  protected async teacherMoveReducer(
    actor: IActor,
    type: string,
    params: IMoveParams,
    cb: IMoveCallback
  ): Promise<void> {
    const playerStates = await this.stateManager.getPlayerStates();
    const gameState = await this.stateManager.getGameState();
    switch (type) {
      case MoveType.dealCard: {
        if (gameState.card1 !== undefined) {
          return;
        }
        const playerStateArray = Object.values(playerStates);
        if (playerStateArray.length < 2) {
          return cb("被试数量不足");
        }
        if (!playerStateArray.every(ps => !!ps.random56)) {
          return cb("还有被试未完成问卷");
        }
        const { card1, card2 } = params;
        gameState.card1 = card1;
        gameState.card2 = card2;
        this.processProfit(card1, card2, playerStates);
        break;
      }
    }
  }

  protected async playerMoveReducer(
    actor: IActor,
    type: string,
    params: IMoveParams,
    cb: IMoveCallback
  ): Promise<void> {
    const playerState = await this.stateManager.getPlayerState(actor);
    // gameState = await this.stateManager.getGameState(),
    // playerStates = await this.stateManager.getPlayerStates();
    switch (type) {
      case MoveType.shout: {
        const { answer, decision } = params;
        if (!Array.isArray(answer) || !answer.length || !decision) {
          return cb("请选择一项再提交");
        }
        if (playerState.answer.hasOwnProperty(decision)) {
          return;
        }
        playerState.answer[decision] = answer;
        break;
      }
      case MoveType.info: {
        const { gender, age, institute, name, grade } = params;
        if (playerState.info) {
          return;
        }
        playerState.info = {
          gender,
          age,
          institute,
          name,
          grade
        };
        break;
      }
      case MoveType.random: {
        const { randomKey } = params;
        if (playerState[randomKey]) {
          return;
        }
        const decision14 = [
          DECISION.one,
          DECISION.two,
          DECISION.three,
          DECISION.four
        ];
        const decision56 = [DECISION.five, DECISION.six];
        switch (randomKey) {
          case "profitDecision14": {
            const rand14 = genRandomInt(0, decision14.length - 1);
            playerState[randomKey] = decision14[rand14];
            break;
          }
          case "random56": {
            const rand56 = genRandomInt(0, decision56.length - 1);
            playerState[randomKey] = decision56[rand56];
            break;
          }
          case "random100": {
            playerState[randomKey] = genRandomInt(1, 100);
            break;
          }
        }
        break;
      }
    }
  }

  async onGameOver() {
    const gameState = await this.stateManager.getGameState();
    const resultData = await this.genExportData();
    Object.assign(gameState, {
      sheets: {
        [SheetType.result]: {
          data: resultData
        }
      }
    });
  }

  private processProfit(
    card1: CARD,
    card2: CARD,
    playerStates: { [token: string]: TPlayerState<IPlayerState> }
  ) {
    const playerStateArray = Object.values(playerStates);
    this._makePairs(playerStateArray);
    this._chooseDecisions(playerStates);
    this._calcProfits(card1, card2, playerStates);
    playerStateArray.forEach(ps => {
      this.setPhaseResult(ps.actor.token, {
        point: ps.profit[DATE.jul5],
        uniKey: ps.mobile
          ? `手机号${ps.mobile}的收益: ${this.getProfitString(ps.profit)}`
          : "-"
      });
    });
  }

  private getProfitString(profit): string {
    let str = "";
    if (profit[DATE.jul5]) {
      str += `${DATE.jul5}发放${profit[DATE.jul5]} `;
    }
    if (profit[DATE.aug4]) {
      str += `${DATE.aug4}发放${profit[DATE.aug4]} `;
    }
    if (profit[DATE.oct13]) {
      str += `${DATE.oct13}发放${profit[DATE.oct13]} `;
    }
    if (profit[DATE.nov12]) {
      str += `${DATE.nov12}发放${profit[DATE.nov12]} `;
    }
    str = str ? str : "没有收益";
    return str;
  }

  async genExportData(): Promise<Array<Array<any>>> {
    // const gameState = await this.stateManager.getGameState();
    const playerStates = await this.stateManager.getPlayerStates();
    const resultData: Array<Array<any>> = [
      [
        "手机号",
        "决策1",
        "决策2",
        "决策3",
        "决策4",
        "决策5",
        "决策6",
        "配对手机号",
        "1-4抽中的决策",
        "5-6抽中的决策",
        `${DATE.jul5}收益`,
        `${DATE.aug4}收益`,
        `${DATE.oct13}收益`,
        `${DATE.nov12}收益`,
        "性别",
        "年龄",
        "姓名",
        "专业",
        "年级"
      ]
    ];
    const playerStateArray = Object.values(playerStates);
    playerStateArray.forEach(ps => {
      const row = [
        ps.mobile || "-",
        ps.answer[DECISION.one]
          ? `${
              PAGE[DECISION.one].questions[0].options.find(
                option => option.value === ps.answer[DECISION.one][0]
              ).label
            }; ${ps.answer[DECISION.one][1]}`
          : "",
        ps.answer[DECISION.two]
          ? `${
              PAGE[DECISION.two].questions[0].options.find(
                option => option.value === ps.answer[DECISION.two][0]
              ).label
            }; ${ps.answer[DECISION.two][1]}`
          : "",
        ps.answer[DECISION.three]
          ? PAGE[DECISION.three].questions[0].options.find(
              option => option.value === ps.answer[DECISION.three][0]
            ).label
          : "",
        ps.answer[DECISION.four]
          ? PAGE[DECISION.four].questions[0].options.find(
              option => option.value === ps.answer[DECISION.four][0]
            ).label
          : "",
        ps.answer[DECISION.five]
          ? PAGE[DECISION.five].questions[0].options.find(
              option => option.value === ps.answer[DECISION.five][0]
            ).label
          : "",
        ps.answer[DECISION.six]
          ? PAGE[DECISION.six].questions[0].options.find(
              option => option.value === ps.answer[DECISION.six][0]
            ).label
          : "",
        ps.pair ? playerStates[ps.pair].mobile : "-",
        ps.profitDecision14 || "-",
        ps.won56 ? ps.profitDecision56 : `对方${ps.profitDecision56}`,
        ps.profit[DATE.jul5],
        ps.profit[DATE.aug4],
        ps.profit[DATE.oct13],
        ps.profit[DATE.nov12],
        ps.info ? ps.info.gender : "-",
        ps.info ? ps.info.age : "-",
        ps.info ? ps.info.name : "-",
        ps.info ? ps.info.institute : "-",
        ps.info ? ps.info.grade : "-"
      ];
      resultData.push(row);
    });
    return resultData;
  }

  private _makePairs(playerStates: Array<TPlayerState<IPlayerState>>) {
    const unpairedPlayers = [...playerStates];
    while (unpairedPlayers.length) {
      const player1 = unpairedPlayers.shift();
      if (!unpairedPlayers.length) {
        const player2 = playerStates[0];
        player1.pair = player2.actor.token;
        player2.extraPair = player1.actor.token;
      } else {
        const player2 = unpairedPlayers.shift();
        player1.pair = player2.actor.token;
        player2.pair = player1.actor.token;
      }
    }
  }

  private _chooseDecisions(playerStates: {
    [token: string]: TPlayerState<IPlayerState>;
  }) {
    const decision14 = [
      DECISION.one,
      DECISION.two,
      DECISION.three,
      DECISION.four
    ];
    const decision56 = [DECISION.five, DECISION.six];
    const playerStateArray = Object.values(playerStates);
    playerStateArray.forEach(ps => {
      if (!ps.profitDecision14) {
        // 兼容旧数据
        const rand14 = genRandomInt(0, decision14.length - 1);
        ps.profitDecision14 = decision14[rand14];
      }
      if (ps.random100) {
        const pair = playerStates[ps.pair];
        if (ps.random100 === pair.random100) {
          ps.won56 = pair.won56 !== undefined ? !pair.won56 : true;
        } else {
          ps.won56 = ps.random100 - pair.random100 > 0;
        }
        ps.profitDecision56 = ps.won56 ? ps.random56 : pair.random56;
      } else {
        // 兼容旧数据
        let luckyOne;
        const isMe = genRandomInt(0, 1);
        luckyOne = isMe ? ps : playerStates[ps.pair];
        const rand56 = genRandomInt(0, decision56.length - 1);
        luckyOne.profitDecision56 = rand56;
      }
    });
  }

  private _calcProfits(
    card1: CARD,
    card2: CARD,
    playerStates: { [token: string]: TPlayerState<IPlayerState> }
  ) {
    const playerStateArray = Object.values(playerStates);
    playerStateArray.forEach(ps => {
      const decision14 = ps.profitDecision14;
      const answer14 = ps.answer[decision14];
      const calc14 = CALC_PROFIT[decision14];
      const profit14 = calc14(answer14, card1, card2) as Partial<PROFIT>;
      this._addProfit(ps.profit14, profit14);
      this._addProfit(ps.profit, profit14);
      const decision56 = ps.profitDecision56;
      const calc56 = CALC_PROFIT[decision56];
      if (ps.won56) {
        const profit56 = calc56(ps.answer[decision56]) as Array<
          Partial<PROFIT>
        >;
        this._addProfit(ps.profit56, profit56[0]);
        this._addProfit(ps.profit, profit56[0]);
      } else {
        const pair = playerStates[ps.pair];
        const profit56 = calc56(pair.answer[decision56]) as Array<
          Partial<PROFIT>
        >;
        this._addProfit(ps.profit56, profit56[1]);
        this._addProfit(ps.profit, profit56[1]);
      }
    });
  }

  private _addProfit(profit: PROFIT, increment: Partial<PROFIT>) {
    if (increment[DATE.jul5]) {
      profit[DATE.jul5] += increment[DATE.jul5];
    }
    if (increment[DATE.aug4]) {
      profit[DATE.aug4] += increment[DATE.aug4];
    }
    if (increment[DATE.oct13]) {
      profit[DATE.oct13] += increment[DATE.oct13];
    }
    if (increment[DATE.nov12]) {
      profit[DATE.nov12] += increment[DATE.nov12];
    }
  }
}
interface PROFIT {
  [DATE.jul5]: number;
  [DATE.aug4]: number;
  [DATE.oct13]: number;
  [DATE.nov12]: number;
}

const CALC_PROFIT = {
  [DECISION.one]: (answer: Array<string>, card1?: CARD): Partial<PROFIT> => {
    const start = 20;
    const invest = +answer[0].split(":")[0];
    const chosenCard = answer[1];
    let profit: number;
    if (chosenCard === card1) {
      profit = start - invest + invest * 2.5;
    } else {
      profit = start - invest;
    }
    return { [DATE.jul5]: profit };
  },
  [DECISION.two]: (
    answer: Array<string>,
    card1?: CARD,
    card2?: CARD
  ): Partial<PROFIT> => {
    const start = 20;
    const invest = +answer[0].split(":")[0];
    const chosenCard = answer[1];
    let profit: number;
    if (chosenCard === card2) {
      profit = start - invest + invest * 2.5;
    } else {
      profit = start - invest;
    }
    return { [DATE.jul5]: profit };
  },
  [DECISION.three]: (answer: Array<string>): Partial<PROFIT> => {
    const profits = answer[0].split(":");
    return { [DATE.jul5]: +profits[0], [DATE.aug4]: +profits[1] };
  },
  [DECISION.four]: (answer: Array<string>): Partial<PROFIT> => {
    const profits = answer[0].split(":");
    return { [DATE.oct13]: +profits[0], [DATE.nov12]: +profits[1] };
  },
  [DECISION.five]: (answer: Array<string>): Array<Partial<PROFIT>> => {
    const profits = answer[0].split(":");
    return [{ [DATE.jul5]: +profits[0] }, { [DATE.jul5]: +profits[1] }];
  },
  [DECISION.six]: (answer: Array<string>): Array<Partial<PROFIT>> => {
    const profits = answer[0].split(":");
    return [{ [DATE.jul5]: +profits[0] }, { [DATE.jul5]: +profits[1] }];
  }
};

function genRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
