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
  Choice,
  Version
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
          // case MoveType.advanceStageIndex: {
          //   playerState.stageIndex++;
          //   break;
          // }
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
            playerState.choices[curRoundIndex] = {c1: params.c1, c2: params.c2};
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



  //region result

  // async onGameOver() {
  //     const gameState = await this.stateManager.getGameState()
  //     const playerStates = await this.stateManager.getPlayerStates(),
  //         playerStatesArray = Object.values(playerStates)

  //     const {positions} = this.game.params.phases.filter(ph => ph.templateName === phaseNames.assignPosition)[0].params
  //     const players = {}
  //     playerStatesArray.forEach(state => {
  //         const {positionIndex} = state
  //         if (positionIndex === undefined) {
  //             return
  //         }
  //         const periods = {}
  //         state.unitLists.forEach((unitStr, p) => {
  //             if (p === 0) return
  //             const units = {}
  //             unitStr.split(' ').forEach((unit, u) => {
  //                 units[u] = {
  //                     period: p,
  //                     subject: positionIndex,
  //                     box: u,
  //                     role: positions[positionIndex].role,
  //                     traderType: positions[positionIndex].identity,
  //                     valueCost: unit
  //                 }
  //             })
  //             periods[p] = units
  //         })
  //         players[positionIndex] = periods
  //     })

  //     const logs: Array<EventParams> = []

  //     const playerProfits: Array<number> = new Array(playerStatesArray.length).fill(0)

  //     const events = await this.getMoveEvent(
  //         {},
  //         {sort: {createAt: 1}}
  //     )
  //     events.map(e => e.data).forEach((data, i) => {
  //         const {period, subject, box, role, valueCost, traderType, trade, partnerSubject, partnerBox, partnerShout, partnerProfit, tradeOrder, tradeTime, tradeType, price, bidAsk, profit, eventType, orderId, eventTime, maxBid, minAsk, partnerId} = data
  //         //result
  //         if (trade) {
  //             players[subject][period][box] = {...data}
  //             let pair = players[partnerSubject][period][partnerBox]
  //             pair = Object.assign(pair, {
  //                 trade: TRADE.success,
  //                 tradeOrder,
  //                 tradeTime,
  //                 tradeType,
  //                 price,
  //                 profit: Math.abs(price - pair.valueCost),
  //                 partnerSubject: subject,
  //                 partnerBox: box,
  //                 partnerShout: bidAsk,
  //                 partnerProfit: profit
  //             })
  //         } else {
  //             players[subject][period][box] = {...data}
  //         }
  //         //log
  //         switch (eventType) {
  //             case EVENT_TYPE.rejected:
  //             case EVENT_TYPE.entered:
  //                 logs.push({
  //                     orderId,
  //                     period,
  //                     subject,
  //                     box,
  //                     role,
  //                     traderType,
  //                     valueCost,
  //                     eventType,
  //                     eventNum: i,
  //                     eventTime,
  //                     maxBid,
  //                     minAsk,
  //                     bidAsk
  //                 })
  //                 break
  //             case EVENT_TYPE.traded:
  //                 logs.push({
  //                     orderId,
  //                     period,
  //                     subject,
  //                     box,
  //                     role,
  //                     traderType,
  //                     valueCost,
  //                     eventType,
  //                     eventNum: i,
  //                     eventTime,
  //                     maxBid,
  //                     minAsk,
  //                     bidAsk,
  //                     trade,
  //                     tradeOrder,
  //                     tradeTime,
  //                     tradeType,
  //                     price,
  //                     profit,
  //                     partnerSubject,
  //                     partnerBox,
  //                     partnerShout,
  //                     partnerProfit
  //                 })
  //                 const pair = logs.find(l => l.orderId === partnerId)
  //                 Object.assign(pair, {
  //                     ...pair,
  //                     eventEndTime: eventTime,
  //                     matchEventNum: i,
  //                     trade: TRADE.success,
  //                     tradeOrder,
  //                     tradeTime,
  //                     tradeType,
  //                     price,
  //                     profit: Math.abs(price - pair.valueCost),
  //                     partnerSubject: subject,
  //                     partnerBox: box,
  //                     partnerShout: bidAsk,
  //                     partnerProfit: profit
  //                 })
  //                 break
  //             case EVENT_TYPE.cancelled:
  //                 logs.push({
  //                     orderId,
  //                     period,
  //                     subject,
  //                     box,
  //                     role,
  //                     traderType,
  //                     valueCost,
  //                     eventType,
  //                     eventNum: i,
  //                     eventTime,
  //                     maxBid,
  //                     minAsk,
  //                     bidAsk
  //                 })
  //                 const origin = logs.find(l => l.orderId === orderId)
  //                 Object.assign(origin, {
  //                     ...origin,
  //                     eventEndTime: eventTime,
  //                     matchEventNum: i
  //                 })
  //                 break
  //         }
  //         //profit
  //         if (profit) {
  //             playerProfits[subject] = playerProfits[subject] + profit
  //         }
  //         if (partnerProfit) {
  //             playerProfits[partnerSubject] = playerProfits[partnerSubject] + partnerProfit
  //         }
  //     })

  //     const resultData: Array<Array<any>> = [['Period', 'Subject', 'Box', 'Role: 0-seller,1-buyer', 'TraderType: 0-human,1-zip,2-gd', 'ValueCost', 'BidAsk', 'Trade', 'TradeOrder', 'TradeTime', 'TradeType: 1-buyer_first,2-seller_first', 'Price', 'Profit', 'PartnerSubject', 'PartnerBox', 'PartnerShout', 'PartnerProfit']]
  //     Object.values(players).forEach(period => {
  //         Object.values(period).forEach(box => {
  //             Object.values(box).forEach(params => {
  //                 const {period, subject, box, role, traderType, valueCost, trade, partnerSubject, partnerBox, partnerShout, partnerProfit, tradeOrder, tradeTime, tradeType, price, bidAsk, profit} = params as EventParams
  //                 resultData.push([
  //                     period,
  //                     Number(subject) + 1,
  //                     Number(box) + 1,
  //                     role,
  //                     traderType,
  //                     valueCost,
  //                     bidAsk || '',
  //                     trade || '',
  //                     tradeOrder || '',
  //                     tradeTime || '',
  //                     tradeType || '',
  //                     price || '',
  //                     profit || 0,
  //                     partnerSubject === undefined ? '' : Number(partnerSubject) + 1,
  //                     partnerBox === undefined ? '' : Number(partnerBox) + 1,
  //                     partnerShout === undefined ? '' : partnerShout,
  //                     partnerProfit === undefined ? '' : partnerProfit
  //                 ])
  //             })
  //         })
  //     })

  //     const logData: Array<Array<any>> = [['Period', 'Subject', 'Box', 'Role: 0-seller,1-buyer', 'TraderType: 0-human,1-zip,2-gd', 'ValueCost', 'EventType: 1-rejected,2-entered,3-traded,4-cancelled', 'EventNum', 'EventTime', 'EventEndTime', 'MaxBid', 'MinAsk', 'MatchEventNum', 'BidAsk', 'Trade', 'TradeOrder', 'TradeTime', 'TradeType: 1-buyer_first,2-seller_first', 'Price', 'Profit', 'PartnerSubject', 'PartnerBox', 'PartnerShout', 'PartnerProfit']]
  //     logs.forEach(log => {
  //         const {period, subject, box, role, traderType, valueCost, eventType, eventNum, eventTime, eventEndTime, maxBid, minAsk, matchEventNum, trade, partnerSubject, partnerBox, partnerShout, partnerProfit, tradeOrder, tradeTime, tradeType, price, bidAsk, profit} = log
  //         logData.push([
  //             period,
  //             Number(subject) + 1,
  //             Number(box) + 1,
  //             role,
  //             traderType,
  //             valueCost,
  //             eventType,
  //             Number(eventNum) + 1,
  //             eventTime,
  //             eventEndTime || '',
  //             maxBid,
  //             minAsk,
  //             matchEventNum === undefined ? '' : Number(matchEventNum) + 1,
  //             bidAsk || '',
  //             trade || '',
  //             tradeOrder || '',
  //             tradeTime || '',
  //             tradeType || '',
  //             price || '',
  //             profit || 0,
  //             partnerSubject === undefined ? '' : Number(partnerSubject) + 1,
  //             partnerBox === undefined ? '' : Number(partnerBox) + 1,
  //             partnerShout === undefined ? '' : partnerShout,
  //             partnerProfit === undefined ? '' : partnerProfit
  //         ])
  //     })

  //     const profitData: Array<Array<any>> = [['Period', 'Subject', 'PeriodProfit', 'MarketProfit', 'ShowUpFee', 'ExchangeRate', 'Money']]
  //     Object.values(players).forEach(period => {
  //         Object.values(period).forEach(box => {
  //             Object.values(box).forEach(params => {
  //                 const {period, subject, profit} = params as EventParams
  //                 profitData.push([
  //                     period,
  //                     Number(subject) + 1,
  //                     profit || 0,
  //                     playerProfits[subject],
  //                     '',
  //                     positions[subject].exchangeRate,
  //                     (playerProfits[subject] / Number(positions[subject].exchangeRate)).toFixed(2)
  //                 ])
  //             })
  //         })
  //     })

  //     Object.assign(gameState, {
  //         sheets: {
  //             [SheetType.result]: {
  //                 data: resultData
  //             },
  //             [SheetType.log]: {
  //                 data: logData
  //             },
  //             [SheetType.profit]: {
  //                 data: profitData
  //             }
  //         }
  //     })
  // }

  //endregion

  //region util
  // insertMoveEvent(data: Object): void {
  //     new FreeStyleModel({data, game: this.game.id, key: DBKey.moveEvent}).save(err => {
  //         if (err) console.log(err)
  //     })
  // }

  // async getMoveEvent(query = {}, options = {sort: null}): Promise<Array<{ data: EventParams }>> {
  //     const queryObj = {...query, game: this.game.id, key: DBKey.moveEvent}
  //     if (options.sort) {
  //         return FreeStyleModel.find(queryObj).lean().sort(options.sort).exec()
  //     }
  //     return FreeStyleModel.find(queryObj).lean().exec()
  // }

  // //endregion

  // async handleFetch(req, res) {
  //     const {query: {type, sheetType}} = req
  //     const gameState = await this.stateManager.getGameState()
  //     switch (type) {
  //         case FetchType.exportXls: {
  //             const name = SheetType[sheetType]
  //             let data = [], option = {}
  //             switch (sheetType) {
  //                 case SheetType.robotCalcLog: {
  //                     data.push(['seq', 'Subject', 'role', 'box', 'R', 'A', 'q', 'tau', 'beta', 'p', 'delta', 'r', 'LagGamma', 'Gamma', 'ValueCost', 'u', 'CalculatedPrice', 'Timestamp'])
  //                     const robotCalcLogs: Array<{ data: RobotCalcLog }> = await FreeStyleModel.find({
  //                         game: this.game.id,
  //                         key: DBKey.robotCalcLog
  //                     }) as any
  //                     robotCalcLogs.sort(({data: {seq: m}}, {data: {seq: n}}) => m - n)
  //                         .forEach(({data: {seq, playerSeq, role, unitIndex, R, A, q, tau, beta, p, delta, r, LagGamma, Gamma, ValueCost, u, CalculatedPrice, timestamp}}) =>
  //                             data.push([seq, playerSeq, role, unitIndex + 1, R, A, q, tau, beta, p, delta, r, LagGamma, Gamma, ValueCost, u, CalculatedPrice, timestamp]
  //                                 .map(v => typeof v === 'number' && v % 1 ? v.toFixed(2) : v)
  //                             ))
  //                     break
  //                 }
  //                 case SheetType.robotSubmitLog: {
  //                     data.push(['seq', 'Subject', 'role', 'box', 'ValueCost', 'Price', 'BuyOrders', 'SellOrders', `ShoutResult:${getEnumKeys(ShoutResult).join('/')}`, 'MarketBuyOrders', 'MarketSellOrders', 'Timestamp'])
  //                     const robotSubmitLogs: Array<{ data: RobotSubmitLog }> = await FreeStyleModel.find({
  //                         game: this.game.id,
  //                         key: DBKey.robotSubmitLog
  //                     }) as any
  //                     robotSubmitLogs.sort(({data: {seq: m}}, {data: {seq: n}}) => m - n)
  //                         .forEach(({data: {seq, playerSeq, role, unitIndex, ValueCost, price, buyOrders, sellOrders, shoutResult, marketBuyOrders, marketSellOrders, timestamp}}) =>
  //                             data.push([seq, playerSeq, role, unitIndex + 1, ValueCost, price, buyOrders, sellOrders, `${shoutResult + 1}:${ShoutResult[shoutResult]}`, marketBuyOrders, marketSellOrders, timestamp]
  //                                 .map(v => typeof v === 'number' && v % 1 ? v.toFixed(2) : v)
  //                             ))
  //                     break
  //                 }
  //                 case SheetType.seatNumber: {
  //                     data.push(['Subject', 'seatNumber'])
  //                     const seatNumberRows: Array<{ data: ISeatNumberRow }> = await FreeStyleModel.find({
  //                         game: this.game.id,
  //                         key: DBKey.seatNumber
  //                     }) as any
  //                     seatNumberRows.forEach(({data: {seatNumber, playerSeq}}) => data.push([playerSeq, seatNumber]))
  //                     break
  //                 }
  //                 default: {
  //                     const sheet = gameState['sheets'][sheetType]
  //                     data = sheet.data
  //                     option = sheet.data
  //                 }
  //             }
  //             let buffer = nodeXlsx.build([{name, data}], option)
  //             res.setHeader('Content-Type', 'application/vnd.openxmlformats')
  //             res.setHeader('Content-Disposition', 'attachment; filename=' + `${encodeURI(name)}.xlsx`)
  //             return res.end(buffer, 'binary')
  //         }
  //     }
  // }
}