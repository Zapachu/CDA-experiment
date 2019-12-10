import * as React from "react";
import { RoundDecorator } from "@extend/share";
import { Group } from "./group";
import { Button } from "antd";
import { Lang, MaskLoading } from "@elf/component";
import * as style from "./style.scss";

export namespace Round {
  export interface IPlayProps<
    IGroupCreateParams,
    IRoundGameState,
    IRoundPlayerState,
    MoveType,
    PushType,
    IMoveParams,
    IPushParams
  >
    extends Group.IPlayProps<
      IGroupCreateParams,
      RoundDecorator.IGameState<IRoundGameState>,
      RoundDecorator.TPlayerState<IRoundPlayerState>,
      RoundDecorator.MoveType<MoveType>,
      PushType,
      IMoveParams,
      IPushParams
    > {
    roundGameState: IRoundGameState;
    roundPlayerState: IRoundPlayerState;
  }

  export class Play<
    IGroupCreateParams,
    IRoundGameState,
    IRoundPlayerState,
    MoveType,
    PushType,
    IMoveParams,
    IPushParams,
    S = {}
  > extends React.Component<
    IPlayProps<
      IGroupCreateParams,
      IRoundGameState,
      IRoundPlayerState,
      MoveType,
      PushType,
      IMoveParams,
      IPushParams
    >
  > {}
}

export class Play<
  IGroupCreateParams,
  IRoundGameState,
  IRoundPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams,
  S = {}
> extends Group.Play<
  IGroupCreateParams,
  RoundDecorator.IGameState<IRoundGameState>,
  RoundDecorator.TPlayerState<IRoundPlayerState>,
  RoundDecorator.MoveType<MoveType>,
  PushType,
  IMoveParams,
  IPushParams,
  S
> {
  RoundPlay: React.ComponentType<
    Round.IPlayProps<
      IGroupCreateParams,
      IRoundGameState,
      IRoundPlayerState,
      MoveType,
      PushType,
      IMoveParams,
      IPushParams
    >
  > = Round.Play;

  lang = Lang.extractLang({
    round1: ["第", "Round"],
    round2: ["轮", ""],
    wait4OtherPlayers: ["等待其它玩家加入......"],
    gameOver: ["所有轮次结束，等待老师关闭实验"]
  });

  render(): React.ReactNode {
    const { lang, props } = this,
      { playerState, groupGameState, groupFrameEmitter } = props;
    if (playerState.status === RoundDecorator.PlayerStatus.guide) {
      return (
        <section className={style.groupGuide}>
          <Button
            type="primary"
            onClick={() =>
              groupFrameEmitter.emit(RoundDecorator.RoundMoveType.guideDone)
            }
          >
            Start
          </Button>
        </section>
      );
    }
    if (playerState.status === RoundDecorator.PlayerStatus.result) {
      return <section className={style.groupResult}>{lang.gameOver}</section>;
    }
    const roundPlayerState = playerState.rounds[groupGameState.round],
      roundGameState = groupGameState.rounds[groupGameState.round];
    if (!roundPlayerState) {
      return <MaskLoading label={lang.wait4OtherPlayers} />;
    }
    return (
      <section className={style.groupPlay}>
        <h2 className={style.title}>
          {lang.round1}
          {groupGameState.round + 1}
          {lang.round2}
        </h2>
        <this.RoundPlay
          {...props}
          {...{
            roundGameState,
            roundPlayerState
          }}
        />
      </section>
    );
  }
}
