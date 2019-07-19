import * as React from "react";
import * as style from "./style.scss";
import { Core, Request } from "@bespoke/register";
import { Toast } from "@elf/component";
import { useSpring, animated } from "react-spring";
import {
  MoveType,
  PushType,
  ICreateParams,
  IGameState,
  IMoveParams,
  IPlayerState,
  IPushParams,
  GARBAGE,
  ITEMS,
  namespace,
  GARBAGE_LABEL,
  SHOUT_TIMER,
  TOTAL_SCORE
} from "../config";
import Modal from "./components/Modal";
import CircleProgress from "./components/CircleProgress";
import Btn, { BTN } from "./components/Btn";

const IMG_BIN_DRY = require("./components/bin_dry.png");
const IMG_BIN_WET = require("./components/bin_wet.png");
const IMG_BIN_RECYCLABLE = require("./components/bin_recyclable.png");
const IMG_BIN_HAZARDOUS = require("./components/bin_hazardous.png");
const IMG_ITEM_UMBRELLA = require("./components/item_umbrella.png");

interface IPlayState {
  score: number;
  shoutTimer: number;
  btnStatus: {
    [garbage: number]: BTN;
  };
  modal: MODAL;
  modifier: number;
}

enum MODAL {
  rule
}

enum STATUS {
  prepare,
  playing,
  waiting,
  result
}

const IMG_BIN = {
  [GARBAGE.dry]: IMG_BIN_DRY,
  [GARBAGE.wet]: IMG_BIN_WET,
  [GARBAGE.recyclable]: IMG_BIN_RECYCLABLE,
  [GARBAGE.hazardous]: IMG_BIN_HAZARDOUS
};

const IMG_ITEM = {
  umbrella: IMG_ITEM_UMBRELLA
};

const defaultBtnStatus = {
  [GARBAGE.pass]: BTN.pass,
  [GARBAGE.dry]: BTN.default,
  [GARBAGE.wet]: BTN.default,
  [GARBAGE.recyclable]: BTN.default,
  [GARBAGE.hazardous]: BTN.default
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
  private modifierRef: React.RefObject<any>;

  constructor(props: { playerState: IPlayerState }) {
    super(props as any);
    const {
      playerState: { score }
    } = props;
    this.state = {
      score: score,
      shoutTimer: 0,
      btnStatus: { ...defaultBtnStatus },
      modal: undefined,
      modifier: 20
    };
    this.modifierRef = React.createRef();
  }

  componentDidMount(): void {
    document.body.addEventListener("touchstart", function() {});
    this.props.frameEmitter.on(PushType.shoutTimer, ({ shoutTimer }) => {
      this.setState({ shoutTimer });
    });
  }

  showModifier = () => {
    const node = this.modifierRef.current;
    node.classList.remove(style.modifier);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        node.classList.add(style.modifier);
      });
    });
  };

  choose = (garbage: GARBAGE) => {
    const {
      frameEmitter,
      playerState: { answers }
    } = this.props;
    const btnStatus = { ...this.state.btnStatus };
    btnStatus[garbage] = BTN.active;
    this.setState({ btnStatus }, () => {
      setTimeout(() => {
        frameEmitter.emit(
          MoveType.check,
          { answer: garbage, index: answers.length },
          (err, modifier: number) => {
            if (err) {
              return Toast.warn(err);
            }
            const btnStatus = { ...this.state.btnStatus };
            btnStatus[garbage] = modifier > 0 ? BTN.true : BTN.false;
            this.setState(
              ({ score }) => ({ modifier, score: score + modifier, btnStatus }),
              () => {
                setTimeout(() => {
                  frameEmitter.emit(
                    MoveType.shout,
                    { answer: garbage, index: answers.length },
                    err => {
                      Toast.warn(err);
                    }
                  );
                  this.setState({
                    btnStatus: { ...defaultBtnStatus }
                  });
                }, 1000);
              }
            );
            this.showModifier();
          }
        );
      }, 1000);
    });
  };

  pass = () => {
    const {
      frameEmitter,
      playerState: { answers }
    } = this.props;
    const { btnStatus } = this.state;
    btnStatus[GARBAGE.pass] = BTN.active;
    this.setState({ btnStatus }, () => {
      setTimeout(() => {
        frameEmitter.emit(
          MoveType.shout,
          { answer: GARBAGE.pass, index: answers.length },
          err => {
            Toast.warn(err);
          }
        );
        this.setState({ btnStatus: { ...defaultBtnStatus } });
      }, 1000);
    });
  };

  precache() {
    // const img = new Image();
    // img.src = SCORING;
    // img.onload = this.join;
  }

  getPlayerStatus = (): STATUS => {
    const {
      playerState: { answers },
      gameState
    } = this.props;
    if (gameState.averageScore !== undefined) {
      return STATUS.result;
    }
    if (!answers) {
      return STATUS.prepare;
    }
    if (answers.length === ITEMS.length) {
      return STATUS.waiting;
    }
    return STATUS.playing;
  };

  renderContent = () => {
    const { modal } = this.state;
    const status = this.getPlayerStatus();
    switch (status) {
      case STATUS.prepare: {
        return (
          <div className={style.playing}>
            {this.renderPlaying()}
            <Modal visible={true}>{this.renderPrepareModal()}</Modal>
          </div>
        );
      }
      case STATUS.playing: {
        return (
          <div className={style.playing}>
            {this.renderPlaying()}
            <Modal visible={modal === MODAL.rule}>
              {this.renderRuleModal()}
            </Modal>
          </div>
        );
      }
      case STATUS.waiting: {
        return (
          <div>
            {this.renderResult()}
            <Modal visible={true}>{this.renderWaitingModal()}</Modal>
          </div>
        );
      }
      case STATUS.result: {
        return <div>{this.renderResult()}</div>;
      }
    }
  };

  renderPlaying = () => {
    const {
      playerState: { answers }
    } = this.props;
    const { btnStatus, score, modifier, shoutTimer } = this.state;
    const index = answers ? answers.length : 0;
    const item = ITEMS[index];
    return (
      <>
        <p className={style.counter}>
          <span>{index + 1}</span>&nbsp;/&nbsp;{ITEMS.length}
        </p>
        <div className={style.scoreContainer}>
          <p className={style.modifier} ref={this.modifierRef}>
            {modifier > 0 ? "+" + modifier : modifier}
          </p>
          <div className={style.background}>
            <div
              style={{
                transform: `translateY(-${
                  score > 0 ? "" + (score / TOTAL_SCORE) * 100 + "%" : "0"
                })`
              }}
            />
            <div
              style={{
                transform: `translateY(${
                  score < 0
                    ? "" + ((-1 * score) / TOTAL_SCORE) * 100 + "%"
                    : "0"
                })`
              }}
            />
          </div>
        </div>
        <div className={style.itemContainer}>
          <img className={style.item} src={IMG_ITEM[item.img]} />
          <div className={style.gaugeContainer}>
            <CircleProgress ratio={shoutTimer / SHOUT_TIMER} />
          </div>
        </div>
        <div className={style.binsContainer}>
          <ul>
            {[
              GARBAGE.recyclable,
              GARBAGE.dry,
              GARBAGE.hazardous,
              GARBAGE.wet
            ].map(bin => {
              return (
                <li key={bin} className={style.bin}>
                  <Btn
                    className={style.btn}
                    status={btnStatus[bin]}
                    onClick={() => this.choose(bin)}
                  />
                  <img src={IMG_BIN[bin]} />
                  <span>{GARBAGE_LABEL[bin]}</span>
                </li>
              );
            })}
          </ul>
          <div className={style.passContainer}>
            <Btn
              className={style.btn}
              status={btnStatus[GARBAGE.pass]}
              onClick={this.pass}
            />
            <span>{GARBAGE_LABEL[GARBAGE.pass]}</span>
          </div>
        </div>
      </>
    );
  };

  renderResult = () => {
    return (
      <div>
        <p>result</p>
      </div>
    );
  };

  renderRuleModal = () => {
    return (
      <div className={style.ruleModal}>
        {/* <p className={style.ruleTitle}>平行志愿</p>
        <p>
          平行志愿是高考志愿的一种新的投档录取模式。所谓平行志愿，即一个志愿中包含若干所平行的院校。是指考生在填报高考志愿时，可在指定的批次同时填报若干个平行院校志愿。录取时，按照“分数优先，遵循志愿”的原则进行投档，对同一科类分数线上未被录取的考生按总分从高到低排序进行一次性投档，即所有考生排一个队列，高分者优先投档。每个考生投档时，根据考生所填报的院校顺序，投档到排序在前且有计划余额的院校。
        </p>
        <img
          src={CLOSE}
          onClick={() => this.setState({ showModal: undefined })}
        /> */}
      </div>
    );
  };

  renderWaitingModal = () => {
    return (
      <div className={style.waitingModal}>
        <p>请等待其他玩家...</p>
      </div>
    );
  };

  renderPrepareModal = () => {
    const { frameEmitter } = this.props;
    return (
      <div className={style.prepareModal}>
        <p>介绍</p>
        <p
          onClick={() => {
            frameEmitter.emit(MoveType.prepare);
            this.precache();
          }}
        >
          知道了
        </p>
      </div>
    );
  };

  render() {
    const content = this.renderContent();
    return <section className={style.play}>{content}</section>;
  }
}

const Ready2Choose: React.SFC<{ score: number; scores: Array<number> }> = ({
  score,
  scores
}) => {
  const subjects = ["语文", "数学", "英语", "综合"];
  const props = useSpring({
    config: { duration: 1000 },
    opacity: 1,
    from: { opacity: 0 }
  });
  return (
    <animated.div className={style.scoreBoard} style={props}>
      <p className={style.title}>
        总分: &nbsp;<span className={style.redFont}>{score}</span>
      </p>
      <p className={style.name}>姓名: xxx</p>
      <p className={style.name}>考号: xxx</p>
      <ul className={style.table}>
        {subjects.map((subject, index) => {
          return (
            <li key={subject}>
              <p className={style.subject}>{subject}</p>
              <p className={style.score}>{scores[index]}</p>
            </li>
          );
        })}
      </ul>
    </animated.div>
  );
};
