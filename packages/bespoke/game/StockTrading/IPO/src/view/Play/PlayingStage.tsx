import * as React from "react";
import * as style from "./style.scss";
import {
  Button,
  ButtonProps,
  Core,
  Lang,
  MaskLoading,
  Toast,
  Input
} from "bespoke-client-util";
import {
  FetchType,
  MoveType,
  PushType,
  PlayerStatus,
  STOCKS
} from "../../config";
import {
  ICreateParams,
  IGameState,
  IMoveParams,
  IPlayerState,
  IPushParams
} from "../../interface";

interface IPlayState {
  price: number;
  num: number;
  stockIndex: number;
}

export default class PlayingStage extends Core.Play<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams,
  FetchType,
  IPlayState
> {
  constructor(props) {
    super(props);
    this.state = this.initState(props);
  }

  initState = props => {
    const {
      playerState: { multi, single },
      gameState: { groups }
    } = props;
    if (single) {
      const { rounds, roundIndex } = single;
      const curRound = rounds[roundIndex];
      return {
        price: curRound.price,
        num: curRound.bidNum,
        stockIndex: curRound.stockIndex
      };
    } else {
      const curGroup = groups[multi.groupIndex];
      return {
        price: multi.price,
        num: multi.bidNum,
        stockIndex: curGroup.stockIndex
      };
    }
  };

  lang = Lang.extractLang({
    confirm: ["确定", "Confirm"],
    inputSeatNumberPls: ["请输入座位号", "Input your seat number please"],
    submit: ["提交", "Submit"],
    invalidSeatNumber: [
      "座位号有误或已被占用",
      "Your seat number is invalid or has been occupied"
    ],
    chooseInFirstAction: ["在第一阶段选择", "In the first action chose "],
    chooseInSecondActionLeft: [
      "等待, 如果第一阶段有人选1, 则选",
      "Wait, if someone has chosen 1 in the first action, choose "
    ],
    chooseInSecondActionRight: [
      "; 如果第一阶段没有人选1, 则选",
      "; if on one has chosen 1 in the first action, choose "
    ],
    yourFirstChoiceLeft: ["你在第", "Your choice in round "],
    yourFirstChoiceRight: ["轮的选择为:", " is:"],
    lowestChocieLeft: ["第", "The lowest choice of the group in round "],
    lowestChocieRight: ["轮的组内最低选择为:", " is:"],
    profitLeft: ["你在第", "Your profit in round "],
    profitRight: ["轮的积分为:", " is:"],
    totalProfitLeft: ["截止第", "Until round "],
    totalProfitRight: ["轮，你的积分为:", " your total profit is:"],
    inFirstAction: ["在第一阶段中,", "In the first action,"],
    chose1: ["有人选1", "someone has chosen 1"],
    notChose1: ["没有人选1", "no one has chosen 1"],
    yourSecondChoice: [
      "你在第二阶段的选择为:",
      "Your choice in the second action is:"
    ],
    wait4Others2Choose: ["等待其他玩家选择", "Waiting for others to choose"],
    wait4Others2Next: [
      "等待其他玩家进入下一轮",
      "Waiting for others to enter the next round"
    ],
    roundIndex: [(m, n) => `第${m}/${n}轮`, (m, n) => `Round ${m}/${n}`]
  });

  renderStock() {
    const stock = STOCKS[this.state.stockIndex];
    return (
      <table>
        <tbody>
          <tr>
            <td>证券代码</td>
            <td>证券简称</td>
            <td>主承销商</td>
            <td>初步询价起始日期</td>
            <td>初步询价截止日期</td>
          </tr>
          <tr>
            <td>{stock.code}</td>
            <td>{stock.name}</td>
            <td>{stock.contractor}</td>
            <td>{stock.startDate}</td>
            <td>{stock.endDate}</td>
          </tr>
        </tbody>
      </table>
    );
  }

  render() {
    const {
      lang,
      props: {
        frameEmitter,
        playerState: { playerStatus, single, multi },
        gameState: { groups },
        game: {
          params: { total }
        }
      },
      state: { price, num }
    } = this;
    let investorState;
    let marketState;
    if (single) {
      const { rounds, roundIndex } = single;
      investorState = rounds[roundIndex];
      marketState = rounds[roundIndex];
    } else {
      investorState = multi;
      marketState = groups[multi.groupIndex];
    }
    let content;
    switch (playerStatus) {
      case PlayerStatus.prepared: {
        content = (
          <>
            {this.renderStock()}
            <p>心里价值: {investorState.privateValue}</p>
            <p>最低保留价格: {marketState.min}</p>
            <p>初始资金: {investorState.startingPrice}</p>
            <div>
              <Input
                value={price}
                onChange={e => this.setState({ price: +e.target.value })}
              />
              <Input
                value={num}
                onChange={e => this.setState({ num: +e.target.value })}
              />
              <Button
                width={ButtonProps.Width.small}
                label={lang.confirm}
                onClick={() => {
                  if (!price || !num) return;
                  frameEmitter.emit(MoveType.shout, { price, num }, err => {
                    if (err) Toast.warn(err);
                  });
                }}
              />
            </div>
          </>
        );
        break;
      }
      case PlayerStatus.shouted: {
        content = (
          <>
            {this.renderStock()}
            <div>
              <p>waiting for others</p>
            </div>
          </>
        );
        break;
      }
      case PlayerStatus.result: {
        content = (
          <div>
            <ul>
              <li>股票的成交价格: ${marketState.strikePrice}</li>
              <li>你们公司对股票的估值: ${investorState.privateValue}</li>
              <li>
                每股股票收益: $
                {(investorState.privateValue - marketState.strikePrice).toFixed(
                  2
                )}
              </li>
              <li>你的购买数量: {investorState.actualNum || 0}</li>
              <li>你的总收益为: ${investorState.profit || 0}</li>
              <li>你的初始账户资金: ${investorState.startingPrice}</li>
              <li>
                你的现有账户资金: $
                {investorState.startingPrice + (investorState.profit || 0)}
              </li>
            </ul>
            <Button
              width={ButtonProps.Width.small}
              label={"再玩一局"}
              onClick={() => {
                frameEmitter.emit(MoveType.replay, {}, (err, stockIndex) => {
                  if (!err)
                    this.setState({
                      price: undefined,
                      num: undefined,
                      stockIndex
                    });
                });
              }}
            />
            <Button
              width={ButtonProps.Width.small}
              label={"下一局"}
              onClick={() => {
                frameEmitter.emit(MoveType.nextGame);
              }}
            />
          </div>
        );
        break;
      }
    }

    return (
      <section>
        <p>header</p>
        {content}
      </section>
    );
  }
}
