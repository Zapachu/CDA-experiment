import * as React from "react";
import * as style from "./style.scss";
import { Lang, Button, ButtonProps, Core } from "bespoke-client-util";
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
  STOCKS
} from "../../config";
import Line from '../../../../components/Line'

interface IPlayState {}

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
  lang = Lang.extractLang({
    lowest: ["组内最低的选择", "Lowest choice in the group"],
    choose1: ["选1", "Choose 1"],
    choose2: ["选2", "Choose 2"],
    chooseWait: ["等待", "Wait"],
    yourChoice: ["你的选择", "Your choice"],
    noShow: ["不可能出现", "Will not happen"]
  });

  render() {
    const { frameEmitter } = this.props;
    return (
      <section className={style.introStage}>
        <Line text={'交易规则介绍'} style={{marginBottom:'20px'}} />
        <Button
          width={ButtonProps.Width.small}
          label={"多人玩法"}
          onClick={() => {
            frameEmitter.emit(MoveType.startMultiPlayer);
          }}
        />
        <Button
          width={ButtonProps.Width.small}
          label={"单人玩法"}
          onClick={() => {
            frameEmitter.emit(MoveType.startSinglePlayer);
          }}
        />
      </section>
    );
  }
}
