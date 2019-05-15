import * as React from "react";
import * as style from "./style.scss";
import { Core, Lang } from "bespoke-client-util";
import {
  FetchType,
  MoveType,
  PushType,
  PlayerStatus,
  IPOType
} from "../../config";
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

interface IPlayState {}

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
      playerState: { playerStatus },
      game: {
        params: { type }
      }
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
    let stage;
    if (type === IPOType.Median) {
      stage = Header.Stage.IPO_Median;
    } else {
      stage = Header.Stage.IPO_Top;
    }
    return (
      <section className={style.play}>
        <Header stage={stage} />
        {content}
      </section>
    );
  }
}
