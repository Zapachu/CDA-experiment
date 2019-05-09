import * as React from "react";
import * as style from "./style.scss";
import {
  Button,
  ButtonProps,
  Core,
  Lang,
  Radio,
  MaskLoading
} from "bespoke-client-util";
import {
  FetchType,
  MoveType,
  PushType,
  MATCH_TIMER
} from "../../config";
import {
  ICreateParams,
  IGameState,
  IMoveParams,
  IPlayerState,
  IPushParams
} from "../../interface";

interface IPlayState {
  matchTimer: number;
  matchNum: number;
}

export default class MatchingStage extends Core.Play<
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

  componentDidMount() {
    const {
      props: { frameEmitter }
    } = this;
    frameEmitter.on(PushType.matchTimer, ({ matchTimer, matchNum }) => {
      this.setState({ matchTimer, matchNum });
    });
  }

  lang = Lang.extractLang({
    confirm: ["确定", "Confirm"],
    inputSeatNumberPls: ["请输入座位号", "Input your seat number please"],
    submit: ["提交", "Submit"],
    invalidSeatNumber: [
      "座位号有误或已被占用",
      "Your seat number is invalid or has been occupied"
    ],
    instructionTitle: [
      "本页面是为了帮助你熟悉操作界面。你可以尝试在界面上进行不同的选择。当你确定已经熟悉了操作界面之后，请点击最下方的“确定”按钮。",
      'This page aims to help you get familiar with the interface. You can try to make different choices. After you are familiar with the interface, please click the "Confirm" button below.'
    ],
    instructionFirstT1: [
      "每一轮中，你需要点击按钮做出选择:",
      "You should make a choice in every round:"
    ],
    instructionFirstT2: [
      "首先，做出你在第一阶段的选择:",
      "Now, make your choice for the first action:"
    ],
    instructionSecondWait: [
      "因为你在第一阶段已经等待，请针对第一阶段可能出现的两种结果，做出你第二阶段的选择:",
      "Since you have chosen to wait in the first action, make your choice for the second action based on possible results of the previous action:"
    ],
    instructionSecond1: [
      "因为你在第一阶段已经选择了1，第二阶段不需要选择，请点击下面的“确定按钮”:",
      'Since you have chosen 1 in the first action, you do not need to make the choice for the second action, please click the "Confirm" button below:'
    ],
    next: [
      "选择完成后，点击“确定”进入下一轮:",
      'After making the choices, click "Confirm" button for the next round:'
    ],
    wait4Others: [
      "等待其他玩家完成测试",
      "Waiting for others to complete the test"
    ],
    wrong: ["(错误)", "(Wrong)"],
    nextToMain: [
      "理解测试结束，下面进入正式实验",
      'The test is over, click "Confirm" button for the main game'
    ],
    pageIndex: [(m, n) => `第${m}/${n}页`, (m, n) => `Page ${m}/${n}`]
  });

  render() {
    const {
      lang,
      props: {
        frameEmitter,
        game: {
          params: { groupSize }
        }
      },
      state: { matchTimer, matchNum }
    } = this;
    return (
      <section className={style.testStage}>
        <p>倒计时 {MATCH_TIMER - matchTimer}</p>
        <p>匹配玩家 {matchNum}/{groupSize}</p>
      </section>
    );
  }
}
