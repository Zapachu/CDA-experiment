import * as React from "react";
import * as style from "./style.scss";
import { Core, Lang, MaskLoading, Toast } from "bespoke-client-util";
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
import StockInfo from "../../../../components/StockInfo";
import Input from "../../../../components/Input";
import Button from "../../../../components/Button";
import ListItem from "../../../../components/ListItem";
import Line from "../../../../components/Line";

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
      state: { price, num, stockIndex }
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
    const stock = STOCKS[stockIndex];
    let content;
    switch (playerStatus) {
      case PlayerStatus.prepared: {
        content = (
          <>
            <StockInfo {...stock} style={{ margin: "40px 20px 20px 20px" }} />
            <p style={{ marginBottom: "10px" }}>
              *私人信息: 你们公司对该股票的估值是
              <span style={{ color: "orange" }}>
                {investorState.privateValue}
              </span>
            </p>
            <p style={{ marginBottom: "30px" }}>
              *市场信息: 该公司共发行了
              <span style={{ color: "orange" }}>{total}股</span>股票,
              最低保留价格为{marketState.min}
            </p>
            <div className={style.inputContainer}>
              <div>
                <Input
                  value={price}
                  onChange={val => this.setState({ price: +val })}
                  placeholder={"价格"}
                  onMinus={val => this.setState({ price: val - 1 })}
                  onPlus={val => this.setState({ price: val + 1 })}
                />
                <p>
                  可买
                  {price
                    ? Math.floor(investorState.startingPrice / price)
                    : " "}
                  股
                </p>
              </div>
            </div>
            <div className={style.inputContainer}>
              <div>
                <Input
                  value={num}
                  onChange={val => this.setState({ num: +val })}
                  placeholder={"数量"}
                  onMinus={val => this.setState({ num: val - 1 })}
                  onPlus={val => this.setState({ num: val + 1 })}
                />
                <p>
                  总花费
                  {price && num ? (price * num).toFixed(2) : " "}
                </p>
              </div>
            </div>
            <Button
              label={"买入"}
              style={{ marginBottom: "20px" }}
              onClick={() => {
                if (!price || !num) return;
                frameEmitter.emit(MoveType.shout, { price, num }, err => {
                  if (err) Toast.warn(err);
                });
              }}
            />
            <ListItem width={200}>
              <p style={{ color: "orange" }} className={style.item}>
                初始资金: {investorState.startingPrice}
              </p>
            </ListItem>
          </>
        );
        break;
      }
      case PlayerStatus.shouted: {
        content = (
          <>
            <StockInfo {...stock} />
            <div>
              <p>waiting for others</p>
            </div>
          </>
        );
        break;
      }
      case PlayerStatus.result: {
        const listData = [
          { label: "股票的成交价格", value: marketState.strikePrice },
          { label: "你们公司对股票的估值", value: investorState.privateValue },
          {
            label: "每股股票收益",
            value: (
              investorState.privateValue - marketState.strikePrice
            ).toFixed(2)
          },
          { label: "你的购买数量", value: investorState.actualNum || 0 },
          { label: "你的总收益为", value: investorState.profit || 0 },
          { label: "你的初始账户资金", value: investorState.startingPrice },
          {
            label: "你的现有账户资金",
            value: investorState.startingPrice + (investorState.profit || 0),
            red: true
          }
        ];
        content = (
          <>
            <Line
              text={"交易结果展示"}
              style={{
                margin: "auto",
                width: "400px",
                marginTop: "30px",
                marginBottom: "20px"
              }}
            />
            <ul>
              {listData.map(({ label, value, red }) => {
                return (
                  <li key={label} style={{ marginBottom: "10px" }}>
                    <ListItem>
                      <p className={style.item}>
                        <span style={{ color: "#000" }}>{label}:&nbsp;</span>
                        <span style={{ color: red ? "red" : "orange" }}>
                          {value}
                        </span>
                      </p>
                    </ListItem>
                  </li>
                );
              })}
            </ul>
            <Line
              color={Line.Color.White}
              style={{
                margin: "auto",
                width: "400px",
                marginTop: "20px",
                marginBottom: "20px"
              }}
            />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                label={"再玩一局"}
                color={Button.Color.Blue}
                style={{ marginRight: "20px" }}
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
                label={"下一局"}
                onClick={() => {
                  frameEmitter.emit(MoveType.nextGame);
                }}
              />
            </div>
            {/* <Button
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
            /> */}
          </>
        );
        break;
      }
    }

    return <section className={style.playingStage}>{content}</section>;
  }
}
