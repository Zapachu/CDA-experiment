import * as React from "react";
import * as style from "./style.scss";
import InfoBar from "./coms/InfoBar";
import {
  Button,
  Input,
  Line,
  ListItem,
  Loading,
  Modal,
  StockInfo
} from "bespoke-game-stock-trading-component";
import { Core, Toast } from "bespoke-client-util";
import {
  MoveType,
  PushType,
  ICreateParams,
  IGameState,
  IMoveParams,
  IPlayerState,
  IPushParams,
  Role
} from "../config";

interface IPlayState {
  price: string;
  count: string;
  showRule: boolean;
  showTBMRule: boolean;
}

export class Play extends Core.Play<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams,
  IPlayState
> {
  state = {
    price: "",
    count: "",
    showRule: false,
    showTBMRule: false
  };

  componentDidMount(): void {
    this.props.frameEmitter.emit(MoveType.join);
  }

  setPriceVal = value => this.setState({ price: value });

  setCountVal = value => this.setState({ count: value });

  onPricePlus = value => this.setState({ price: (++value).toString() });

  onPriceMinus = value => this.setState({ price: (--value).toString() });

  onCountPlus = value => this.setState({ count: (++value).toString() });

  onCountMinus = value => this.setState({ count: (--value).toString() });

  allIn = () => this.setState({ price: "100", count: "1000" });

  halfIn = () => this.setState({ price: "100", count: "500" });

  showRule = () => this.setState({ showRule: !this.state.showRule });

  showTBMRule = () => this.setState({ showTBMRule: !this.state.showTBMRule });

  shout = () => {
    const {
      frameEmitter,
      playerState: { role, startingPrice, startingQuota }
    } = this.props;
    const { price, count } = this.state;
    if (
      Number.isNaN(+price) ||
      Number.isNaN(+count) ||
      (role === Role.Buyer && +price * +count > startingPrice) ||
      (role === Role.Seller && +count > startingQuota)
    ) {
      Toast.warn("输入的值无效");
    } else {
      frameEmitter.emit(MoveType.shout, {
        price: +price,
        num: +count
      });
    }
  };

  dynamicAction = () => {
    const {
      playerState: { price: shoutedPrice, startingPrice, role }
    } = this.props;
    const { price, count } = this.state;
    if (shoutedPrice !== undefined) {
      return <Loading label="等待中" />;
    }
    return (
      <div className={style.shoutStage}>
        <li>
          <Input
            value={price}
            onChange={this.setPriceVal}
            onMinus={this.onPriceMinus}
            onPlus={this.onPricePlus}
            placeholder={`价格`}
          />
        </li>
        {role === Role.Buyer ? (
          <li style={{ marginTop: 12 }}>
            <a className={style.countLimit}>
              可买{" "}
              <span className={style.priceHighlight}>
                {!isNaN(parseInt(price)) && parseInt(price) !== 0
                  ? Math.floor(startingPrice / Number(price))
                  : ""}
              </span>{" "}
              股
            </a>
          </li>
        ) : (
          <li style={{ marginTop: 42 }} />
        )}
        <li style={{ marginTop: 12 }}>
          <Input
            value={count}
            onChange={this.setCountVal}
            onMinus={this.onCountMinus}
            onPlus={this.onCountPlus}
            placeholder={`数量`}
          />
        </li>
        {role === Role.Buyer ? (
          <li style={{ marginTop: 12 }}>
            <div className={style.feeInfo}>
              <a className={style.feeNumber}>
                总花费
                <span className={style.priceHighlight}>
                  {count !== "" && price !== ""
                    ? Number(count) * Number(price)
                    : ""}
                </span>
              </a>
              <a className={style.halfIn} onClick={this.halfIn}>
                半仓
              </a>
              <a className={style.allIn} onClick={this.allIn}>
                全仓
              </a>
            </div>
          </li>
        ) : (
          <li style={{ marginTop: 12 }} />
        )}
      </div>
    );
  };

  dynamicTip = () => {
    const {
      playerState: { role, price }
    } = this.props;
    if (price === undefined) {
      return role === Role.Buyer ? "买入" : "卖出";
    }
    return "等待其他玩家";
  };

  dynamicBtnView = () => {
    const {
      playerState: { price: shoutedPrice }
    } = this.props;
    if (shoutedPrice !== undefined) {
      return null;
    }
    return (
      <Button
        label={this.dynamicTip()}
        onClick={this.shout}
        style={{ marginTop: 36 }}
      />
    );
  };

  dynamicInfo = () => {
    const {
      playerState: { role, startingPrice, startingQuota }
    } = this.props;
    return role === Role.Buyer ? (
      <InfoBar text={`账户余额${startingPrice}元`} />
    ) : (
      <InfoBar text={`拥有股票${startingQuota}股`} />
    );
  };

  renderResult = () => {
    const {
      frameEmitter,
      playerState: { role, profit, startingPrice, startingQuota, actualNum },
      gameState: { strikePrice }
    } = this.props;
    const listData = [
      { label: "股票的成交价格", value: strikePrice.toFixed(2) },
      {
        label: role === Role.Buyer ? "你购买的股票数量" : "你出售的股票数量",
        value: actualNum
      },
      { label: "你的总收益", value: profit },
      {
        label: "你的现有总资产",
        value:
          role === Role.Buyer
            ? `资金${(startingPrice - strikePrice * actualNum).toFixed(
                2
              )}元; 股票${actualNum}股`
            : `资金${(strikePrice * actualNum).toFixed(
                2
              )}元; 股票${startingQuota - actualNum}股`
      }
    ];
    return (
      <>
        <Line
          text={"交易结果展示"}
          style={{
            margin: "auto",
            maxWidth: "400px",
            marginTop: "70px",
            marginBottom: "20px"
          }}
        />
        <ul>
          {listData.map(({ label, value }) => {
            return (
              <li key={label} style={{ marginBottom: "10px" }}>
                <ListItem>
                  <p className={style.item}>
                    <span style={{ color: "#fff" }}>{label}:&nbsp;</span>
                    <span style={{ color: "orange" }}>{value}</span>
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
            maxWidth: "400px",
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
              frameEmitter.emit(
                MoveType.nextStage,
                { onceMore: true },
                lobbyUrl => (location.href = lobbyUrl)
              );
            }}
          />
          <Button
            label={"下一阶段"}
            onClick={() => {
              frameEmitter.emit(
                MoveType.nextStage,
                { onceMore: false },
                lobbyUrl => (location.href = lobbyUrl)
              );
            }}
          />
        </div>
      </>
    );
  };

  renderPlay = () => {
    const {
      playerState: { privateValue },
      gameState: { stockIndex }
    } = this.props;
    return (
      <>
        <StockInfo
          stockIndex={stockIndex}
          style={{ maxWidth: "900px", marginTop: "10vh" }}
        />
        <p style={{ margin: "10px 0 30px 0" }}>
          *私人信息: 你们公司对该股票的估值是
          <span style={{ color: "orange" }}>{privateValue}</span>
        </p>
        <div className={style.workBox}>
          <div className={style.tipText}>
            <Line text={` ${this.dynamicTip()} `} />
          </div>
          {this.dynamicAction()}
          {this.dynamicBtnView()}
        </div>
        {this.dynamicInfo()}
      </>
    );
  };

  renderStage = () => {
    const {
      playerState: { role, price },
      gameState: { strikePrice }
    } = this.props;
    if (role === undefined) {
      return (
        <>
          <Line text={"集合竞价"} style={{ margin: "10vh auto 20px" }} />
          <Loading label="" />
        </>
      );
    }
    if (strikePrice === undefined) {
      return this.renderPlay();
    }
    return this.renderResult();
  };

  render() {
    const {
      state: { showRule, showTBMRule }
    } = this;
    return (
      <section className={style.play}>
        {this.renderStage()}

        <div className={style.tradeBtn}>
          <Button
            onClick={this.showRule}
            color={Button.Color.Blue}
            label={`交易规则回顾`}
          />
        </div>
        <div className={style.tbmBtn}>
          <Button
            onClick={this.showTBMRule}
            color={Button.Color.Blue}
            label={`集合竞价知识扩展`}
          />
        </div>

        <Modal
          visible={showRule}
          children={
            <div className={style.modalContent}>
              <p>交易规则回顾</p>
              <p>...</p>
              <Button
                style={{ marginTop: "30px" }}
                label={"关闭"}
                color={Button.Color.Blue}
                onClick={this.showRule}
              />
            </div>
          }
        />
        <Modal
          visible={showTBMRule}
          children={
            <div className={style.modalContent}>
              <p>集合竞价知识扩展</p>
              <p>
                在这个模拟市场中，您将会被随机的分配为买家或者卖家，您的的身份由系统随机确定。
              </p>
              <p>
                在本次实验中，每位买家有M实验币的初始禀赋，股票对于每位买家而言心理价值不同，该价格都是V1到V2之间的随机数；
                对于每位卖家而言成本也不同，成本是从C1到C2之间的随机数。
              </p>
              <p>
                股票交易开始，每位参与者对拍卖品出一个报价，买家的报价是买家愿意购买该商品的最高出价，
                卖家的报价是卖家愿意出售该商品的最低售价，系统将自动撮合买方和卖方的报价，产生当期的市场成交价格，
                该价格使买卖双方的交易需求最大程度地得到满足。
                买家作为商品的需求方，报价大于等于市场成交价格者成交（报价高者有更大的可能性成交）；
                卖家作为商品的供给方，报价小于等于市场成交价格者成交（报价低者有更大的可能性成交）
              </p>
              <Button
                style={{ marginTop: "30px" }}
                label={"关闭"}
                color={Button.Color.Blue}
                onClick={this.showTBMRule}
              />
            </div>
          }
        />
      </section>
    );
  }
}
