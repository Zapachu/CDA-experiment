import * as React from "react";
import * as style from "./style.scss";
import { Core, Lang, Toast } from "bespoke-client-util";
import {
  FetchType,
  MoveType,
  PushType,
  PlayerStatus,
  SHOUT_TIMER,
  IPOType
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
  StockInfo,
  Loading
} from "bespoke-game-stock-trading-component";

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
            maxWidth: "400px",
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
            maxWidth: "400px",
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
        <ListItem width={200} style={{ marginBottom: "10px" }}>
          <p style={{ color: "orange" }} className={style.item}>
            初始资金: {investorState.startingPrice}
          </p>
        </ListItem>
      </>
    );
  };

  renderModal = (modalType: ModalType) => {
    const type = this.props.game.params.type;
    switch (modalType) {
      case ModalType.Ipo: {
        return (
          <div className={style.modalIpo}>
            <p className={style.title}>ipo知识扩展</p>
            <p>
              IPO(Initial Public
              Offering)价格又称新股发行价格，是指获准发行股票上市的公司与其承销商共同确定的将股票公开发售给特定或非特定投资者的价格。在这一价格的确定程序中，相关的影响因素包括公司帐面价值、经营业绩、发展前景、股票发行数量、行业特点及市场波动状况等，而这些因素的量化过程会随着定价者选用方法的不同而出现很大差别。
            </p>
            <p>较为常用的估值方式可以分为两大类：收益折现法与类比法。</p>
            <p>
              1、收益折现法：就是通过合理的方式估计出上市公司未来的经营状况，并选择恰当的贴现率与贴现模型，计算出上市公司价值。如最常用的股利折现模型(ddm)、现金流贴现(dcf)模型等。
            </p>
            <p>
              2、类比法，就是通过选择同类上市公司的一些比率，如最常用的市盈率、市净率(p/b即股价/每股净资产)，再结合新上市公司的财务指标如每股收益、每股净资产来确定上市公司价值，一般都采用预测的指标。市盈率法的适用具有许多局限性，例如要求上市公司经营业绩要稳定，不能出现亏损等，而市净率法则没有这些问题，但同样也有缺陷，主要是过分依赖公司账面价值而不是最新的市场价值。因此对于那些流动资产比例高的公司如银行、保险公司比较适用此方法。
            </p>
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
            <p className={style.title}>交易规则回顾</p>
            {type === IPOType.Median ? (
              <p>
                股票的成交价格规则如下：每个股票都有一个最低的保留价格C元，即市场上股票的价格低于最低保留价格时，企业选择不发售股票，因此你的出价必需大于最低保留价格C。当所有的交易者提交自己的拟购买价格和拟购买数量后，系统根据买家的拟购买价格由大到小进行排序后，拟购买总数的中位数对应的价格即为成交价格，而拟购买价格在成交价格之上（包含成交价格）的市场交易者获得购买资格，可购买数量由系统抽签决定，你可购买到的股票数量与你的拟购买数量正相关。如若市场上拟购买总数小于企业发行的股票数量，则成交价格为最低保留价格C.
              </p>
            ) : (
              <p>
                股票的成交价格规则如下：每个股票都有一个最低的保留价格C元，即市场上股票的价格低于最低保留价格时，企业选择不发售股票，因此你的出价必需大于最低保留价格C。当所有的交易者提交自己的拟购买价格和拟购买数量后，系统根据买家的拟购买价格由大到小进行排序后，第1万股股票对应的价格即为成交价格，而拟购买价格在成交价格之上的市场交易者获得购买资格，可购买数量按照价格排序后的拟购买数量依次进行分配。如若市场上拟购买总数小于企业发行的股票数量，则成交价格为最低保留价格C.
              </p>
            )}
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
              <Loading label={"等待其他玩家"} />
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
