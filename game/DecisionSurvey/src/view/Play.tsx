import * as React from "react";
// import { Col, Row, Input, Radio } from "antd";
import Button from "antd/es/button";
import Row from "antd/es/row";
import Input from "antd/es/input";
import Radio from "antd/es/radio";
import "antd/es/button/style";
import "antd/es/radio/style";
import "antd/es/row/style";
import "antd/es/input/style";

import * as style from "./style.scss";
import { Request, Toast } from "@elf/component";
import { Core } from "@bespoke/register";
import {
  CARD,
  DATE,
  DECISION,
  FetchRoute,
  GENDER,
  ICreateParams,
  IGameState,
  IMoveParams,
  IPlayerState,
  IPushParams,
  MoveType,
  namespace,
  PAGE,
  PushType
} from "../config";

interface IPlayState {
  answer: string;
  card: CARD;
  stage: STAGE;
  gender: GENDER;
  age: string;
  institute: string;
  grade: string;
  name: string;
  timer: number;
}

enum STAGE {
  beginning,
  instruction14,
  instruction56,
  playing
}

enum STATUS {
  playing,
  info,
  random,
  waiting,
  result
}

const ANSWER_LEN_TO_DECISION = [
  DECISION.one,
  DECISION.two,
  DECISION.three,
  DECISION.four,
  DECISION.five,
  DECISION.six
];

const DECISION_LABEL = {
  [DECISION.one]: "决策1",
  [DECISION.two]: "决策2",
  [DECISION.three]: "决策3",
  [DECISION.four]: "决策4",
  [DECISION.five]: "决策5",
  [DECISION.six]: "决策6"
};

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
  private interval: NodeJS.Timer;
  constructor(props) {
    super(props);
    const len = Object.values(props.playerState.answer).length;
    const stage =
      len === 4
        ? STAGE.instruction56
        : len > 0
        ? STAGE.playing
        : STAGE.beginning;
    this.state = {
      answer: undefined,
      card: undefined,
      stage,
      gender: undefined,
      age: undefined,
      institute: undefined,
      grade: undefined,
      name: undefined,
      timer: this.getTimer(stage)
    };
  }

  componentDidMount(): void {
    const {
      playerState: { actor },
      game
    } = this.props;
    Request.get(
      namespace,
      FetchRoute.getUserMobile,
      { gameId: game.id },
      { token: actor.token, actorType: actor.type }
    );
    this.ticking(this.state.timer);
  }

  getTimer = (stage: STAGE): number => {
    switch (stage) {
      case STAGE.beginning:
      case STAGE.instruction14:
      case STAGE.instruction56: {
        return 20;
      }
      case STAGE.playing: {
        return 40;
      }
    }
  };

  ticking = (duration: number) => {
    clearInterval(this.interval);
    this.setState({ timer: duration });
    this.interval = setInterval(() => {
      if (this.state.timer > 0) {
        this.setState(({ timer }) => ({ timer: timer - 1 }));
      } else {
        clearInterval(this.interval);
      }
    }, 1000);
  };

  getPlayerStatus = (): STATUS => {
    const { playerState, gameState } = this.props;
    if (gameState.card1 !== undefined) {
      return STATUS.result;
    }
    // if (playerState.profitDecision56) {
    //   return STATUS.waiting;
    // }
    if (playerState.info) {
      return STATUS.random;
    }
    if (playerState.answer.hasOwnProperty(DECISION.six)) {
      return STATUS.info;
    }
    return STATUS.playing;
  };

  renderInstruction = (
    instructions: Array<string | { text: string; style: object }>
  ) => {
    if (!instructions) return null;
    return instructions.map((word, i) => {
      if (typeof word === "string") {
        return <Row key={i}>{this.renderWord(word)}</Row>;
      }
      return (
        <Row key={i} style={word.style}>
          {this.renderWord(word.text)}
        </Row>
      );
    });
  };

  renderWord = (word: string) => {
    const words = word.split("$bold$");
    if (words.length === 1) {
      return words[0];
    }
    return (
      <p>
        {words.map((w, i) => {
          return (
            <span key={i} style={i % 2 === 1 ? { fontWeight: "bolder" } : {}}>
              {w}
            </span>
          );
        })}
      </p>
    );
  };

  renderPlaying = () => {
    const {
      answer,
      card,
      gender,
      age,
      institute,
      grade,
      name,
      timer
    } = this.state;
    const { playerState, gameState, frameEmitter } = this.props;
    const status = this.getPlayerStatus();
    switch (status) {
      case STATUS.playing: {
        const decision =
          ANSWER_LEN_TO_DECISION[Object.values(playerState.answer).length];
        const page: any = PAGE[decision];
        return (
          <div className={style.stage}>
            <Row>决策{decision}</Row>
            {this.renderInstruction(page.instructions)}
            {page.questions.map(({ title, options }, i) => {
              return (
                <div key={i} className={style.question}>
                  <Row>{title}</Row>
                  <Radio.Group
                    onChange={e => {
                      i === 0
                        ? this.setState({ answer: "" + e.target.value })
                        : this.setState({ card: e.target.value as CARD });
                    }}
                    value={i === 0 ? answer : card}
                  >
                    {options.map(({ label, value }) => {
                      return (
                        <Radio
                          className={style.radio}
                          key={value}
                          value={value}
                        >
                          {label}
                        </Radio>
                      );
                    })}
                  </Radio.Group>
                </div>
              );
            })}
            <Button
              disabled={timer > 0}
              onClick={() => {
                if (page.required.some(required => !this.state[required])) {
                  return Toast.warn("请选择");
                }
                console.log(answer, card);
                frameEmitter.emit(
                  MoveType.shout,
                  { answer: [answer, card], decision },
                  error => {
                    Toast.warn(error);
                  }
                );
                if (decision === DECISION.four) {
                  this.ticking(20);
                  return this.setState({
                    stage: STAGE.instruction56,
                    answer: undefined,
                    card: undefined
                  });
                }
                this.ticking(40);
                this.setState({ answer: undefined, card: undefined });
              }}
            >
              确定{timer > 0 ? `(${timer}s)` : ""}
            </Button>
          </div>
        );
      }
      case STATUS.info: {
        return (
          <div className={style.stage}>
            <Row>
              问卷决策环节到此结束，下面请填写你的个人信息（我们将严格保密）。
            </Row>
            <div className={style.info}>
              <label>性别</label>
              <Radio.Group
                onChange={e =>
                  this.setState({ gender: e.target.value as GENDER })
                }
                value={gender}
              >
                <Radio value={GENDER.male}>男</Radio>
                <Radio value={GENDER.female}>女</Radio>
              </Radio.Group>
            </div>
            {/* <div className={style.info}>
              <label>年龄</label>
              <Input
                value={age}
                onChange={e => this.setState({ age: "" + e.target.value })}
              />
            </div> */}
            <div className={style.info}>
              <label>姓名</label>
              <Input
                value={name}
                onChange={e => this.setState({ name: "" + e.target.value })}
              />
            </div>
            {/* <div className={style.info}>
              <label>专业</label>
              <Input
                value={institute}
                onChange={e =>
                  this.setState({ institute: "" + e.target.value })
                }
              />
            </div> */}
            {/* <div className={style.info}>
              <label>年级</label>
              <Input
                value={grade}
                onChange={e => this.setState({ grade: "" + e.target.value })}
              />
            </div> */}
            <Button
              onClick={() => {
                if (!gender || !name) {
                  return Toast.warn("请填写个人信息");
                }
                frameEmitter.emit(MoveType.info, { gender, name }, error => {
                  Toast.warn(error);
                });
              }}
            >
              确定
            </Button>
          </div>
        );
      }
      case STATUS.random: {
        return (
          <div className={style.stage}>
            <Row>
              请首先在1-4之间随机抽取一个数字决定第一部分中用于支付的问题。（如果你抽中的问题涉及抽牌，我们将在实验结束后安排现场抽牌，根据抽中的牌的颜色以及你在相应问题中猜测的颜色决定你的最终收益）
            </Row>
            <Row>
              {!playerState.profitDecision14 ? (
                <Button
                  onClick={() => {
                    frameEmitter.emit(MoveType.random, {
                      randomKey: "profitDecision14"
                    });
                  }}
                >
                  抽取
                </Button>
              ) : (
                `已抽取决策${playerState.profitDecision14}`
              )}
            </Row>
            <Row>
              对于第二部分，请先在1-100中随机抽取一个数字（你抽取的数字和你的配对者抽取的数字中更大的一方将被选中）
            </Row>
            <Row>
              {!playerState.random100 ? (
                <Button
                  disabled={!playerState.profitDecision14}
                  onClick={() => {
                    frameEmitter.emit(MoveType.random, {
                      randomKey: "random100"
                    });
                  }}
                >
                  抽取
                </Button>
              ) : (
                `已抽取数字${playerState.random100}`
              )}
            </Row>
            <Row>
              再从5和6之中随机抽取一个数字（我们将根据被选中方最终抽取的数字决定你们双方在第二部分的最终收益）
            </Row>
            <Row>
              {!playerState.random56 ? (
                <Button
                  disabled={!playerState.random100}
                  onClick={() => {
                    frameEmitter.emit(MoveType.random, {
                      randomKey: "random56"
                    });
                  }}
                >
                  抽取
                </Button>
              ) : (
                `已抽取决策${playerState.random56}`
              )}
            </Row>
            {playerState.random56 ? (
              <Row>等待老师结束实验并计算收益...</Row>
            ) : null}
          </div>
        );
      }
      // case STATUS.waiting: {
      //   return (
      //     <div>
      //       <p>等待老师结束实验</p>
      //     </div>
      //   );
      // }
      case STATUS.result: {
        if (!playerState.random56) {
          return (
            <div>
              <p>你未完成实验。</p>
            </div>
          );
        }
        return (
          <div>
            <p>感谢参加。</p>
            <p>
              你在第一部分抽中的题目是
              {DECISION_LABEL[playerState.profitDecision14]}，收益是
              {this.renderProfit(playerState.profit14)}
            </p>
            <p>
              你在第二部分抽中的题目是
              {playerState.won56
                ? DECISION_LABEL[playerState.profitDecision56]
                : `对方的${DECISION_LABEL[playerState.profitDecision56]}`}
              ，收益是{this.renderProfit(playerState.profit56)}
            </p>
            <p>最终收益为 {this.renderProfit(playerState.profit)}</p>
          </div>
        );
      }
    }
  };

  renderProfit = (profit): string => {
    let str = "";
    if (profit[DATE.jul5]) {
      str += `${DATE.jul5}发放${profit[DATE.jul5]} `;
    }
    if (profit[DATE.aug4]) {
      str += `${DATE.aug4}发放${profit[DATE.aug4]} `;
    }
    if (profit[DATE.oct13]) {
      str += `${DATE.oct13}发放${profit[DATE.oct13]} `;
    }
    if (profit[DATE.nov12]) {
      str += `${DATE.nov12}发放${profit[DATE.nov12]} `;
    }
    str = str ? str : "没有收益";
    return str;
  };

  renderStage = () => {
    // const { playerState, gameState } = this.props;
    const { stage, timer } = this.state;
    switch (stage) {
      case STAGE.beginning: {
        return (
          <div className={style.stage}>
            <Row>问卷说明</Row>
            <Row>
              欢迎参加本次的决策问卷，你在本问卷中的所有信息都将被严格保密。
            </Row>
            <Row>
              本次问卷共包含6个决策问题，1-4为个人决策问题，5-6为涉及他人的决策问题。
            </Row>
            <Row>
              我们将根据你在问卷中的决策实现你的收益（通过微信转账）。每个决策都有一定的机会被选中，因此，请认真对待每个决策，并根据你的真实偏好做出选择。
            </Row>
            <Row>
              <Button
                disabled={timer > 0}
                onClick={() => {
                  this.setState({ stage: STAGE.instruction14 });
                  this.ticking(20);
                }}
              >
                下一页{timer > 0 ? `(${timer}s)` : ""}
              </Button>
            </Row>
          </div>
        );
      }
      case STAGE.instruction14: {
        return (
          <div className={style.stage}>
            <Row>以下为问卷第一部分，包括决策问题1-4。</Row>
            <Row>
              4组决策问题均为个人决策，每组决策中你需要在七个选项中选择一个。
            </Row>
            <Row>
              最终我们将在4组问题中随机选择1组，并根据你在该组中的选择实现你的最终收益。
            </Row>
            <Row>
              <Button
                disabled={timer > 0}
                onClick={() => {
                  this.setState({ stage: STAGE.playing });
                  this.ticking(40);
                }}
              >
                下一页{timer > 0 ? `(${timer}s)` : ""}
              </Button>
            </Row>
          </div>
        );
      }
      case STAGE.instruction56: {
        return (
          <div className={style.stage}>
            <Row>问卷第一部分到此结束，下面开始第二部分，包括决策问题5-6。</Row>
            <Row>
              这两组决策问题涉及他人，具体来说，你在决策中将决定甲乙双方的收益，其中甲方是你自己，乙方为调查员中随机与你配对的另外一个人（我们已经根据所有调查员的ID号完成随机配对）。与你配对这个人是匿名的，意味着你无法知道他或她的身份。
            </Row>
            <Row>
              最终，我们会从每一组配对的甲乙双方中随机选择一位，并从其两组决策中随机选择一组，根据其在对应的选择中的决策决定你们双方各自的收入。即：如果你的某一次决策被选中，则你在该决策中的选择将决定甲方（你自己）和乙方（与你配对的人）的收入。如果与你配对的人的某次决策被选中，则她在该决策中的选择将决定甲方（她）和乙方（你）的收入。
            </Row>
            <Row>下面请开始你的选择。</Row>
            <Row>
              <Button
                disabled={timer > 0}
                onClick={() => {
                  this.setState({ stage: STAGE.playing });
                  this.ticking(40);
                }}
              >
                下一页{timer > 0 ? `(${timer}s)` : ""}
              </Button>
            </Row>
          </div>
        );
      }
      case STAGE.playing: {
        return this.renderPlaying();
      }
    }
  };

  render() {
    const content = this.renderStage();
    return <section className={style.play}>{content}</section>;
  }
}
