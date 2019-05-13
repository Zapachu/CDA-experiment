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
import {
  StockInfo,
  Input,
  Button,
  ListItem,
  Line,
  Modal
} from "../../../../components";

enum ModalType {
  None,
  Ipo,
  Trade
}

interface IPlayState {
  price: number;
  num: number;
  stockIndex: number;
  modalType: ModalType;
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
        stockIndex: curRound.stockIndex,
        modalType: ModalType.None
      };
    } else {
      const curGroup = groups[multi.groupIndex];
      return {
        price: multi.price,
        num: multi.bidNum,
        stockIndex: curGroup.stockIndex,
        modalType: ModalType.None
      };
    }
  };

  lang = Lang.extractLang({});

  inputNum = (multiplier: number, startingPrice: number) => {
    const { price } = this.state;
    const money = multiplier * startingPrice;
    const num = Math.floor(money / price);
    this.setState({ num });
  };

  renderResult = (investorState, marketState) => {
    const { frameEmitter } = this.props;
    const listData = [
      { label: "股票的成交价格", value: marketState.strikePrice },
      { label: "你们公司对股票的估值", value: investorState.privateValue },
      {
        label: "每股股票收益",
        value: (investorState.privateValue - marketState.strikePrice).toFixed(2)
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
    return (
      <>
        <div style={{ position: "fixed", top: "30vh", right: "15vw" }}>
          <Button
            label={"ipo知识扩展"}
            size={Button.Size.Small}
            color={Button.Color.Blue}
            onClick={() => this.setState({ modalType: ModalType.Ipo })}
          />
        </div>
        <Line
          text={"交易结果展示"}
          style={{
            margin: "auto",
            width: "400px",
            marginTop: "15vh",
            marginBottom: "20px"
          }}
        />
        <ul>
          {listData.map(({ label, value, red }) => {
            return (
              <li key={label} style={{ marginBottom: "10px" }}>
                <ListItem>
                  <p className={style.item}>
                    <span>{label}:&nbsp;</span>
                    <span style={{ color: red ? "#F0676D" : "orange" }}>
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
      </>
    );
  };

  renderPrepared = (stock, investorState, marketState) => {
    const {
      frameEmitter,
      game: {
        params: { total }
      }
    } = this.props;
    const { price, num } = this.state;
    return (
      <>
        <div style={{ position: "fixed", top: "35vh", right: "15vw" }}>
          <Button
            label={"交易规则回顾"}
            size={Button.Size.Small}
            color={Button.Color.Blue}
            onClick={() => this.setState({ modalType: ModalType.Trade })}
          />
        </div>
        <div style={{ position: "fixed", top: "42vh", right: "15vw" }}>
          <Button
            label={"ipo知识扩展"}
            size={Button.Size.Small}
            color={Button.Color.Blue}
            onClick={() => this.setState({ modalType: ModalType.Ipo })}
          />
        </div>
        <StockInfo
          {...stock}
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
              onChange={val => this.setState({ price: +val })}
              placeholder={"价格"}
              onMinus={val => this.setState({ price: val - 1 })}
              onPlus={val => this.setState({ price: val + 1 })}
            />
            <p style={{ fontSize: "12px", marginTop: "5px" }}>
              可买
              {price ? Math.floor(investorState.startingPrice / price) : " "}股
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
            <p
              style={{
                fontSize: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "5px"
              }}
            >
              <span>
                总花费
                {price && num ? (price * num).toFixed(2) : " "}
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
          style={{ marginBottom: "20px", marginTop: "20px" }}
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
        frameEmitter,
        playerState: { playerStatus, single, multi },
        gameState: { groups },
        game: {
          params: { total }
        }
      },
      state: { price, num, stockIndex, modalType }
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
        content = this.renderPrepared(stock, investorState, marketState);
        break;
      }
      case PlayerStatus.shouted: {
        content = (
          <>
            <StockInfo
              {...stock}
              style={{ marginTop: "15vh", marginBottom: "20px" }}
            />
            <div>
              <p>waiting for others</p>
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
