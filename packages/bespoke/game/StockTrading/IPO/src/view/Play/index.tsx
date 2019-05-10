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
import MatchingStage from "./MatchingStage";
import PlayingStage from "./PlayingStage";
import IntroStage from "./IntroStage";
import Header from "../../../../components/Header";

interface IPlayState {
  seatNumber: string;
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
  state: IPlayState = {
    seatNumber: ""
  };
  lang = Lang.extractLang({
    confirm: ["确定", "Confirm"],
    inputSeatNumberPls: ["请输入座位号", "Input your seat number please"],
    submit: ["提交", "Submit"],
    invalidSeatNumber: [
      "座位号有误或已被占用",
      "Your seat number is invalid or has been occupied"
    ],
    wait4StartMainTest: [
      "等待老师开放实验",
      "Wait for teacher to start the experiment"
    ],
    end: ["实验结束", "Game Over"],
    totalPoint: [
      "你在本场试验共获得积分 ",
      "Total points you have got in this game are "
    ],
    totalProfit: [
      "你的最终收益为 ",
      "Total profit you have earned in this game is "
    ]
  });

  // componentDidMount() {
  //   const {playerState:{actor}, frameEmitter, fetcher} = this.props;
  //   frameEmitter.emit(MoveType.initPosition);
  //   fetcher.getFromGame(FetchType.getUserId, {token: actor.token, actorType: actor.type});
  // }

  render(): React.ReactNode {
    const {
      props: {
        playerState: { playerStatus }
      }
    } = this;
    let content;
    switch (playerStatus) {
      case PlayerStatus.intro: {
        content = <IntroStage {...this.props} />;
        break;
      }
      case PlayerStatus.matching: {
        content = <MatchingStage {...this.props} />;
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
