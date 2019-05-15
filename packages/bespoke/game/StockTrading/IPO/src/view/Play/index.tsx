import * as React from "react";
import * as style from "./style.scss";
import {
  Button,
  ButtonProps,
  MaskLoading,
  Core,
  Lang,
  Toast,
  Label,
  Input
} from "bespoke-client-util";
import { FetchType, MoveType, PushType, PlayerStatus } from "../../config";
import {
  ICreateParams,
  IGameState,
  IMoveParams,
  IPlayerState,
  IPushParams
} from "../../interface";
import PlayingStage from "./PlayingStage";
import IntroStage from "./IntroStage";
import { Header } from "../../../../components";

interface IPlayState {
}

export class Play extends Core.Play<
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
  lang = Lang.extractLang({});

  render(): React.ReactNode {
    const {
      props: {
        playerState: { playerStatus }
      }
    } = this;
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
        <Header stage={"ipo"} />
        {content}
      </section>
    );
  }
}
