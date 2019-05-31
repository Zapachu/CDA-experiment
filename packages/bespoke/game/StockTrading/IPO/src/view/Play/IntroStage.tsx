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
  FetchType,
  MoveType,
  PushType,
  PlayerStatus,
  MATCH_TIMER
} from "../../config";
import { Line, PlayMode, MatchModal, Modal } from "bespoke-game-stock-trading-component";

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
  FetchType,
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
    frameEmitter.on(PushType.matchTimer, ({ matchTimer, matchNum }) => {
      this.setState({ matchTimer, matchNum });
    });
    //TODO 由Match系统匹配玩家，Game内仅处理单轮的业务逻辑(临时方案，待移除此Game内match相关代码)
    frameEmitter.emit(MoveType.startMulti)
  }

  render() {
    const {
      frameEmitter,
      playerState: { playerStatus, single, multi },
      game: {
        params: { groupSize }
      }
    } = this.props;
    const { matchTimer, matchNum } = this.state;
    return (
      <section className={style.introStage}>
        <Line text={"交易规则介绍"} style={{ marginBottom: "20px" }} />
        <PlayMode
          onPlay={mode => {
            if (mode === PlayMode.Single) {
              frameEmitter.emit(MoveType.startSingle);
            }
            if (mode === PlayMode.Multi) {
              frameEmitter.emit(MoveType.startMulti);
            }
          }}
        />
        <MatchModal
          visible={playerStatus === PlayerStatus.matching && !!multi}
          totalNum={groupSize}
          matchNum={matchNum}
          timer={MATCH_TIMER - matchTimer}
        />
        <Modal
          visible={playerStatus === PlayerStatus.matching && !!single}
          width={300}
        >
          <p style={{ textAlign: "center", padding: "50px 0" }}>
            加载算法交易者...
          </p>
        </Modal>
      </section>
    );
  }
}
