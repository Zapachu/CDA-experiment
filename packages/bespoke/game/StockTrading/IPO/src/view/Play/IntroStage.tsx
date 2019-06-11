import * as React from "react";
import * as style from "./style.scss";
import { Lang, Core } from "bespoke-client-util";
import {
  ICreateParams,
  IGameState,
  IMoveParams,
  IPlayerState,
  IPushParams
} from "../../interface";
import {
  MoveType,
  PushType,
  IPOType
} from "../../config";
import {
  Line,
  Loading
} from "bespoke-game-stock-trading-component";

interface IPlayState {
  matchTimer: number;
  matchNum: number;
}

export default class IntroStage extends Core.Play<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams,
  IPlayState
> {
  constructor(props) {
    super(props);
    this.state = {
      matchTimer: null,
      matchNum: null
    };
  }

  lang = Lang.extractLang({});

  componentDidMount() {
    const { frameEmitter } = this.props;
    // frameEmitter.on(PushType.matchTimer, ({ matchTimer, matchNum }) => {
    //   this.setState({ matchTimer, matchNum });
    // });
    //TODO 由Match系统匹配玩家，Game内仅处理单轮的业务逻辑(临时方案，待移除此Game内match相关代码)
    frameEmitter.emit(MoveType.startMulti);
  }

  render() {
    const {
      frameEmitter,
      playerState: { playerStatus, single, multi },
      game: {
        params: { groupSize, type }
      }
    } = this.props;
    const { matchTimer, matchNum } = this.state;
    return (
      <section className={style.introStage}>
        <Line
          text={type === IPOType.Median ? "IPO中位数定价" : "IPO荷兰式定价"}
          style={{ marginBottom: "20px" }}
        />
        <Loading label={""} />
      </section>
    );
  }
}
