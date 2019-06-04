import * as React from "react";
import * as style from "./style.scss";
import { Core, Lang, Toast } from "bespoke-client-util";
import {
  FetchType,
  MoveType,
  PushType,
  PlayerStatus,
  SHOUT_TIMER
} from "../../config";
import {
  ICreateParams,
  IGameState,
  IMoveParams,
  IPlayerState,
  IPushParams,
  PlayerState,
  GameState
} from "../../interface";
import {
  TableInfo,
  Input,
  Button,
  ListItem,
  Line,
  Modal,
  StockInfo
} from "bespoke-game-stock-trading-component";
const LOADING = require("bespoke-game-stock-trading-component/lib/loading.png");

enum ModalType {
  None,
  Ipo,
  Trade
}

interface IPlayState {
  price: string;
  num: string;
  modalType: ModalType;
  shoutTimer: number;
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

  initState = (
    props: Core.IPlayProps<
      ICreateParams,
      IGameState,
      IPlayerState,
      MoveType,
      PushType,
      IMoveParams,
      IPushParams,
      FetchType
    >
  ) => {
    const {
      playerState: { multi, single },
      gameState: { groups }
    } = props;
    if (single) {
      const { rounds, groupIndex } = single;
      const curRound = rounds[groups[groupIndex].roundIndex];
      return {
        price: curRound.price && "" + curRound.price,
        num: curRound.bidNum && "" + curRound.bidNum,
        modalType: ModalType.None,
        shoutTimer: null
      };
    } else {
      return {
        price: multi.price && "" + multi.price,
        num: multi.bidNum && "" + multi.bidNum,
        modalType: ModalType.None,
        shoutTimer: null
      };
    }
  };

  lang = Lang.extractLang({});

  componentDidMount() {
    const { frameEmitter } = this.props;
    frameEmitter.on(PushType.shoutTimer, ({ shoutTimer }) => {
      const {
        playerState: { playerStatus }
      } = this.props;
      if (playerStatus === PlayerStatus.prepared) {
        this.setState({ shoutTimer });
      }
    });
  }

  inputNum = (multiplier: number, startingPrice: number) => {
    const { price } = this.state;
    if (!+price) {
      return;
    }
    const money = multiplier * startingPrice;
    const num = Math.floor(money / +price);
    this.setState({ num: "" + num });
  };

  exitGame(onceMore?: boolean) {
    this.props.frameEmitter.emit(
      MoveType.nextGame,
      { onceMore },
      lobbyUrl => (location.href = lobbyUrl)
    );
  }

  renderResult = (
    investorState: Partial<PlayerState.IMulti>,
    marketState: Partial<GameState.Group.IRound>
  ) => {
    const { frameEmitter } = this.props;
    const dataList = [
      {
        label: "股票的成交价格",
        value: (
          <span style={{ color: "orange" }}>{marketState.strikePrice}</span>
        )
      },
      {
        label: "你们公司对股票的估值",
        value: (
          <span style={{ color: "orange" }}>{investorState.privateValue}</span>
        )
      },
      {
        label: "每股股票收益",
        value: (
          <span style={{ color: "orange" }}>
            {(investorState.privateValue - marketState.strikePrice).toFixed(2)}
          </span>
        )
      },
      {
        label: "你的购买数量",
        value: (
          <span style={{ color: "orange" }}>
            {investorState.actualNum || 0}
          </span>
        )
      },
      {
        label: "你的总收益为",
        value: (
          <span style={{ color: "orange" }}>{investorState.profit || 0}</span>
        )
      },
      {
        label: "你的初始账户资金",
        value: (
          <span style={{ color: "orange" }}>{investorState.startingPrice}</span>
        )
      },
      {
        label: "你的现有账户资金",
        value: (
          <span style={{ color: "red" }}>
            {investorState.startingPrice + (investorState.profit || 0)}
          </span>
        )
      }
    ];
    return (
      <>
        <Line
          text={"交易结果展示"}
          style={{
            margin: "auto",
            width: "400px",
            marginTop: "15vh",
            marginBottom: "20px"
          }}
        />
        <TableInfo dataList={dataList} style={{ margin: "30px auto" }} />
        <Button
          style={{ justifyContent: "flex-end", marginBottom: "50px" }}
          label={"ipo知识扩展"}
          size={Button.Size.Small}
          color={Button.Color.Blue}
          onClick={() => this.setState({ modalType: ModalType.Ipo })}
        />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            label={"再玩一局"}
            color={Button.Color.Blue}
            style={{ marginRight: "20px" }}
            onClick={() => {
              this.setState({
                shoutTimer: null,
                price: undefined,
                num: undefined
              });
              this.exitGame(true);
            }}
          />
          <Button
            label={"下一局"}
            onClick={() => {
              this.exitGame();
            }}
          />
        </div>
        <Line
          color={Line.Color.White}
          style={{
            margin: "auto",
            width: "400px",
            marginTop: "40px",
            marginBottom: "20px"
          }}
        />
      </>
    );
  };

  renderPrepared = (
    investorState: Partial<PlayerState.IMulti>,
    marketState: Partial<GameState.Group.IRound>
  ) => {
    const {
      frameEmitter,
      game: {
        params: { total }
      }
    } = this.props;
    const { price, num, shoutTimer } = this.state;
    return (
      <>
        <div className={style.tradeBtn}>
          <Button
            label={"交易规则回顾"}
            size={Button.Size.Small}
            color={Button.Color.Blue}
            onClick={() => this.setState({ modalType: ModalType.Trade })}
          />
        </div>
        <div className={style.ipoBtn}>
          <Button
            label={"ipo知识扩展"}
            size={Button.Size.Small}
            color={Button.Color.Blue}
            onClick={() => this.setState({ modalType: ModalType.Ipo })}
          />
        </div>
        <StockInfo
          stockIndex={marketState.stockIndex}
          style={{ marginTop: "15vh", marginBottom: "20px" }}
        />
        <p style={{ marginBottom: "10px" }}>
          *私人信息: 你们公司对该股票的估值是
          <span style={{ color: "orange" }}>{investorState.privateValue}</span>
        </p>
        <p style={{ marginBottom: "30px" }}>
          *市场信息: 该公司共发行了
          <span style={{ color: "orange" }}>{total}股</span>股票, 最低保留价格为
          <span style={{ color: "orange" }}>{marketState.min}</span>
        </p>
        <div className={style.inputContainer}>
          <div>
            <Input
              value={price}
              onChange={val => this.setState({ price: "" + val })}
              placeholder={"价格"}
              onMinus={val => this.setState({ price: "" + (+val - 1) })}
              onPlus={val => this.setState({ price: "" + (+val + 1) })}
            />
            <p
              style={{ fontSize: "12px", marginTop: "5px", marginLeft: "45px" }}
            >
              可买
              <span style={{ color: "orange" }}>
                {+price
                  ? Math.floor(investorState.startingPrice / +price)
                  : " "}
              </span>
              股
            </p>
          </div>
        </div>
        <div className={style.inputContainer}>
          <div>
            <Input
              value={num}
              onChange={val => this.setState({ num: "" + val })}
              placeholder={"数量"}
              onMinus={val => this.setState({ num: "" + (+val - 1) })}
              onPlus={val => this.setState({ num: "" + (+val + 1) })}
            />
            <p
              style={{
                fontSize: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "5px",
                marginLeft: "45px"
              }}
            >
              <span>
                总花费
                <span style={{ color: "orange" }}>
                  {+price && +num ? (+price * +num).toFixed(2) : " "}
                </span>
              </span>
              <span>
                <span
                  className={style.operation}
                  onClick={() =>
                    this.inputNum(0.5, investorState.startingPrice)
                  }
                >
                  半仓
                </span>
                <span
                  className={style.operation}
                  onClick={() => this.inputNum(1, investorState.startingPrice)}
                >
                  全仓
                </span>
              </span>
            </p>
          </div>
        </div>
        <Button
          label={"买入"}
          style={{
            marginBottom: shoutTimer !== null ? "5px" : "30px",
            marginTop: "20px"
          }}
          onClick={() => {
            if (!+price || !+num || num.includes(".")) return;
            frameEmitter.emit(
              MoveType.shout,
              { price: +price, num: +num },
              err => {
                if (err) {
                  Toast.warn(err);
                } else {
                  this.setState({
                    price: undefined,
                    num: undefined
                  });
                }
              }
            );
          }}
        />
        {shoutTimer !== null ? (
          <p style={{ marginBottom: "20px", textAlign: "center" }}>
            {SHOUT_TIMER - shoutTimer} S
          </p>
        ) : null}
        <ListItem width={200}>
          <p style={{ color: "orange" }} className={style.item}>
            初始资金: {investorState.startingPrice}
          </p>
        </ListItem>
      </>
    );
  };

  renderModal = (modalType: ModalType) => {
    switch (modalType) {
      case ModalType.Ipo: {
        return (
          <div className={style.modalIpo}>
            <p>ipo知识扩展</p>
            <Button
              style={{ marginTop: "30px" }}
              label={"关闭"}
              color={Button.Color.Blue}
              onClick={() => this.setState({ modalType: ModalType.None })}
            />
          </div>
        );
      }
      case ModalType.Trade: {
        return (
          <div className={style.modalIpo}>
            <p>交易规则回顾</p>
            <Button
              style={{ marginTop: "30px" }}
              label={"关闭"}
              color={Button.Color.Blue}
              onClick={() => this.setState({ modalType: ModalType.None })}
            />
          </div>
        );
      }
    }
  };

  render() {
    const {
      lang,
      props: {
        playerState: { playerStatus, single, multi },
        gameState: { groups }
      },
      state: { modalType }
    } = this;
    let investorState: Partial<PlayerState.IMulti>;
    let marketState: Partial<GameState.Group.IRound>;
    if (single) {
      const { rounds: playerRounds, groupIndex } = single;
      const { roundIndex, rounds: gameRounds } = groups[groupIndex];
      investorState = playerRounds[roundIndex] || {};
      marketState = gameRounds[roundIndex] || {};
    } else {
      const { roundIndex, rounds: gameRounds } = groups[multi.groupIndex];
      investorState = multi || {};
      marketState = gameRounds[roundIndex] || {};
    }
    let content;
    switch (playerStatus) {
      case PlayerStatus.prepared: {
        content = this.renderPrepared(investorState, marketState);
        break;
      }
      case PlayerStatus.shouted: {
        content = (
          <>
            <StockInfo
              stockIndex={marketState.stockIndex}
              style={{ marginTop: "15vh", marginBottom: "100px" }}
            />
            <div
              style={{ width: "200px", margin: "auto", textAlign: "center" }}
            >
              <img src={LOADING} style={{ marginBottom: "20px" }} />
              <p>等待其他玩家</p>
            </div>
          </>
        );
        break;
      }
      case PlayerStatus.result: {
        content = this.renderResult(investorState, marketState);
        break;
      }
    }

    return (
      <section className={style.playingStage}>
        {content}
        <Modal visible={modalType !== ModalType.None}>
          {this.renderModal(modalType)}
        </Modal>
      </section>
    );
  }
}
