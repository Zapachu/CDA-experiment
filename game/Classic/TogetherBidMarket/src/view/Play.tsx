import * as React from "react";
import * as style from "./style.scss";
import { Core } from "@bespoke/client";
import {
  MaskLoading,
  Input,
  Label,
  Button,
  ButtonProps,
  Toast
} from "@elf/component";
import {
  ICreateParams,
  IGameState,
  IMoveParams,
  IPlayerState,
  IPushParams,
  MoveType,
  PushType,
  NEW_ROUND_TIMER,
  PlayerStatus
} from "../config";

interface IPlayState {
  price: string;
  num: string;
  newRoundTimers: Array<number>;
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
    num: "",
    newRoundTimers: []
  };

  async componentDidMount() {
    const {
      props: { frameEmitter }
    } = this;
    // frameEmitter.on(PushType.newRoundTimer, ({roundIndex, newRoundTimer}) => {
    //     this.setState(state => {
    //         const newRoundTimers = state.newRoundTimers.slice()
    //         newRoundTimers[roundIndex] = newRoundTimer
    //         return {newRoundTimers}
    //     })
    // })
    frameEmitter.emit(MoveType.getPosition);
  }

  shout = () => {
    const {
      props: {
        frameEmitter,
        gameState: { groups },
        playerState: { groupIndex }
      },
      state
    } = this;
    const price = Number(state.price);
    const num = Number(state.num);
    if (!price || !num) {
      Toast.warn("输入的值无效");
    } else {
      frameEmitter.emit(MoveType.shout, {
        price,
        num: Math.floor(num),
        roundIndex: groups[groupIndex].roundIndex
      });
      this.setState({ price: "", num: "" });
    }
  };

  dynamicAction = () => {
    const {
      props: {
        gameState: { groups },
        playerState: { groupIndex, positionIndex, rounds: playerRounds }
      },
      state: { price, num }
    } = this;
    const { rounds: gameRounds, roundIndex } = groups[groupIndex],
      { status } = playerRounds[roundIndex];
    if (status === PlayerStatus.shouted) {
      return <MaskLoading label="您已出价，请等待其他玩家..." />;
    }
    if (status === PlayerStatus.result) {
      return <MaskLoading label="所有轮次结束，等待老师结束实验..." />;
    }
    return (
      <div>
        <li>
          <Label label="输入您的价格" />
          <Input
            type="number"
            value={price}
            onChange={e => this.setState({ price: e.target.value })}
          />
        </li>
        <li>
          <Label label="输入您的配额数量" />
          <Input
            type="number"
            value={num}
            onChange={e => this.setState({ num: e.target.value })}
          />
        </li>
        <li>
          <Button
            width={ButtonProps.Width.large}
            label="出价"
            onClick={this.shout.bind(this)}
          />
        </li>
      </div>
    );
  };

  dynamicResult = () => {
    const {
      props: {
        gameState: { groups },
        playerState: { rounds: playerRounds, groupIndex, role }
      }
    } = this;
    const { roundIndex, rounds: gameRounds } = groups[groupIndex];
    const playerRound = playerRounds[roundIndex];
    const gameRound = gameRounds[roundIndex];
    if (roundIndex === 0) {
      return null;
    }
    return (
      <table className={style.profits}>
        <thead>
          <tr>
            <td>轮次</td>
            <td>成交价格</td>
            <td>{["购买股数", "出售股数"][role]}</td>
            <td>心理价值</td>
            <td>收益</td>
          </tr>
        </thead>
        {Array(roundIndex)
          .fill(null)
          .map((_, i) => (
            <tbody key={`tb${i}`}>
              <tr>
                <td>{i + 1}</td>
                <td>{gameRound.strikePrice}</td>
                <td>{playerRound.actualNum}</td>
                <td>{playerRound.privateValue}</td>
                <td>{playerRound.profit}</td>
              </tr>
            </tbody>
          ))}
      </table>
    );
  };

  render() {
    const {
      props: {
        game: {
          params: { groupSize, rounds }
        },
        gameState: { groups },
        playerState: { role, groupIndex, rounds: playerRounds }
      },
      state: { newRoundTimers }
    } = this;
    if (groupIndex === undefined) {
      return <MaskLoading label="正在匹配玩家..." />;
    }
    const { rounds: gameRounds, roundIndex } = groups[groupIndex];
    // newRoundTimer = newRoundTimers[roundIndex]
    return (
      <section className={style.play}>
        <div className={style.title}>集合竞价市场</div>
        {/* {newRoundTimer ? <div>
                <div>本轮结束剩余时间</div>
                <div className={style.highlight}>{NEW_ROUND_TIMER - newRoundTimer}</div>
            </div> : null} */}
        <div className={style.line}>
          <div>游戏总人数</div>
          <div className={style.highlight}>{groupSize}</div>
        </div>
        <div className={style.line}>
          <div>游戏总轮数</div>
          <div className={style.highlight}>{rounds}</div>
        </div>
        <div className={style.line}>
          <div>正在进行轮次</div>
          <div className={style.highlight}>{roundIndex + 1} </div>
        </div>
        <div className={style.line}>
          <div>您的角色</div>
          <div className={style.highlight}>{["买家", "卖家"][role]}</div>
        </div>
        <div className={style.line}>
          <div>物品对于您的心理价值</div>
          <div className={style.highlight}>
            {playerRounds[roundIndex].privateValue}
          </div>
        </div>
        <div className={style.line}>
          <div>{["您的初始资金", "您的股票配额"][role]}</div>
          <div className={style.highlight}>
            {
              [
                playerRounds[roundIndex].startingPrice,
                playerRounds[roundIndex].startingQuota
              ][role]
            }
          </div>
        </div>
        {this.dynamicAction()}
        {this.dynamicResult()}
      </section>
    );
  }
}
