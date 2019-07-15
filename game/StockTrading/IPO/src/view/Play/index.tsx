import * as React from "react";
import * as style from "./style.scss";
import {Core} from '@bespoke/register'
import {Lang } from "@elf/component";
import { MoveType, PushType, PlayerStatus } from "../../config";
import {
  ICreateParams,
  IGameState,
  IMoveParams,
  IPlayerState,
  IPushParams
} from "../../interface";
import PlayingStage from "./PlayingStage";
import IntroStage from "./IntroStage";

interface IPlayState {}

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
  lang = Lang.extractLang({});

  render(): React.ReactNode {
    const {
      playerState: { playerStatus }
    } = this.props;
    let content;
    switch (playerStatus) {
      case PlayerStatus.intro:
      case PlayerStatus.matching: {
        content = <IntroStage {...this.props} />;
        break;
      }
      default: {
        content = <PlayingStage {...this.props} />;
        break;
      }
    }
    return (
      <section className={style.play}>
        {/* <Header stage={stage} /> */}
        {content}
      </section>
    );
  }
}
