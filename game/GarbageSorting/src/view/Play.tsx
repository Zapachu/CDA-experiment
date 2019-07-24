import * as React from "react";
import * as QRCode from "qrcode.react";
import * as style from "./style.scss";
import { Core } from "@bespoke/client";
import { Toast } from "@elf/component";
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
  ITEM_NAME,
  ITEM_COST
} from "../config";
import Modal from "./components/Modal";
import CircleProgress from "./components/CircleProgress";
import Btn, { BTN } from "./components/Btn";

const IMG_BIN_DRY = require("./components/bin_dry.png");
const IMG_BIN_WET = require("./components/bin_wet.png");
const IMG_BIN_RECYCLABLE = require("./components/bin_recyclable.png");
const IMG_BIN_HAZARDOUS = require("./components/bin_hazardous.png");
const IMG_ITEM_UMBRELLA = require("./components/item_umbrella.png");
const IMG_RULE = require("./components/rule.png");
const IMG_ENV_GOOD = require("./components/env_good.png");
const IMG_ENV_MID = require("./components/env_mid.png");
const IMG_ENV_BAD = require("./components/env_bad.png");
const IMG_MEDAL_GOLD = require("./components/medal_gold.png");
const IMG_MEDAL_SILVER = require("./components/medal_silver.png");
const IMG_MEDAL_COPPER = require("./components/medal_copper.png");
const IMG_SHARE = require("./components/share.png");
const IMG_PREPARE_BUTTON = require("./components/prepare_button.png");
const IMG_RULE_MODAL = require("./components/rule_modal.png");
const IMG_CLOSE = require("./components/close.png");
const IMG_GARBAGE_SORTING = require("./components/garbage_sorting.png");

const DEFAULT_AVATAR = "https://qiniu1.anlint.com/img/head.jpg";

declare global {
  interface Window {
    wx: any;
  }
}

interface IPlayState {
  shoutTimer: number;
  btnStatus: {
    [garbage: number]: BTN;
  };
  modal: MODAL;
  resultPlayerIndex: number;
  itemStyle: object;
}

enum MODAL {
  rule,
  prepare1,
  prepare2,
  share
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
  [ITEM_NAME.umbrella]: IMG_ITEM_UMBRELLA
};

const defaultBtnStatus = {
  [GARBAGE.pass]: BTN.pass,
  [GARBAGE.dry]: BTN.default,
  [GARBAGE.wet]: BTN.default,
  [GARBAGE.recyclable]: BTN.default,
  [GARBAGE.hazardous]: BTN.default
};

const translateOffset = {
  [GARBAGE.pass]: { x: "0", y: "500%" },
  [GARBAGE.dry]: { x: "-50%", y: "350%" },
  [GARBAGE.wet]: { x: "150%", y: "350%" },
  [GARBAGE.recyclable]: { x: "-150%", y: "350%" },
  [GARBAGE.hazardous]: { x: "50%", y: "350%" }
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
  private isWechat: boolean;
  private shareUrl: string;

  constructor(props: { playerState: IPlayerState }) {
    super(props as any);
    this.state = {
      shoutTimer: 0,
      btnStatus: { ...defaultBtnStatus },
      modal: MODAL.prepare1,
      resultPlayerIndex: 0,
      itemStyle: {}
    };
    this.modifierRef = React.createRef();
    this.shareUrl = getShareUrl();
    this.isWechat = checkWechat();
  }

  componentDidMount(): void {
    document.body.addEventListener("touchstart", function() {});
    this.props.frameEmitter.on(PushType.shoutTimer, ({ shoutTimer }) => {
      this.setState({ shoutTimer });
    });
    if (this.isWechat) {
      initWechat(this.shareUrl).catch(err => {
        console.log(err);
        Toast.error("微信sdk加载出错");
      });
    }
  }

  componentDidUpdate(prevProps) {
    const {
      playerState: { answers, score, flyTo }
    } = this.props;
    if (flyTo && prevProps.playerState.flyTo !== flyTo) {
      const offset = translateOffset[flyTo];
      this.setState({
        itemStyle: {
          transform: `translate(${offset.x}, ${offset.y}) scale(0)`,
          transition: "transform 0.5s linear"
        }
      });
    }
    if (prevProps.playerState.score !== score) {
      this.showModifier();
    }
    if (
      prevProps.playerState.answers &&
      prevProps.playerState.answers.length !== answers.length
    ) {
      this.setState({
        btnStatus: { ...defaultBtnStatus },
        itemStyle: { transform: "none", transition: "none" }
      });
    }
  }

  showModifier = () => {
    const node = this.modifierRef.current;
    if (node) {
      node.classList.remove(style.modifier);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          node.classList.add(style.modifier);
        });
      });
    }
  };

  choose = (garbage: GARBAGE) => {
    const {
      frameEmitter,
      playerState: { answers }
    } = this.props;
    const btnStatus = { ...this.state.btnStatus };
    btnStatus[garbage] = BTN.active;
    const offset = translateOffset[garbage];
    this.setState(
      {
        btnStatus,
        itemStyle: {
          transform: `translate(${offset.x}, ${offset.y}) scale(0)`,
          transition: "transform 0.5s linear"
        }
      },
      () => {
        frameEmitter.emit(
          MoveType.check,
          { answer: garbage, index: answers.length },
          (err, isTrue: boolean) => {
            if (err) {
              return Toast.warn(err);
            }
            setTimeout(() => {
              if (garbage === GARBAGE.pass) {
                frameEmitter.emit(
                  MoveType.shout,
                  { answer: garbage, index: answers.length },
                  err => {
                    Toast.warn(err);
                  }
                );
              } else {
                const btnStatus = { ...this.state.btnStatus };
                btnStatus[garbage] = isTrue ? BTN.true : BTN.false;
                this.setState({ btnStatus }, () => {
                  setTimeout(() => {
                    frameEmitter.emit(
                      MoveType.shout,
                      { answer: garbage, index: answers.length },
                      err => {
                        Toast.warn(err);
                      }
                    );
                  }, 1000);
                });
              }
            }, 1000);
          }
        );
      }
    );
  };

  precache() {
    for (let i = 1; i < ITEMS.length; i++) {
      const item = ITEMS[i];
      const img = new Image();
      img.src = IMG_ITEM[item.img];
    }
  }

  getPlayerStatus = (): STATUS => {
    const {
      playerState: { answers },
      gameState
    } = this.props;
    if (gameState.totalScore !== undefined) {
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
          <div className={style.resultWrapper}>
            {this.renderResult({ filter: "blur(8px)" })}
            <Modal visible={true}>{this.renderWaitingModal()}</Modal>
          </div>
        );
      }
      case STATUS.result: {
        return (
          <div className={style.resultWrapper}>
            {this.renderResult()}
            <Modal visible={modal === MODAL.share}>
              {this.renderShareModal()}
            </Modal>
          </div>
        );
      }
    }
  };

  renderPlaying = () => {
    const {
      playerState: { answers, score }
    } = this.props;
    const { btnStatus, shoutTimer, itemStyle } = this.state;
    const index = answers ? answers.length : 0;
    const item = ITEMS[index];
    return (
      <>
        <img
          className={style.rule}
          src={IMG_RULE}
          onClick={() => this.setState({ modal: MODAL.rule })}
        />
        <p className={style.counter}>
          <span>{index + 1}</span>&nbsp;/&nbsp;{ITEMS.length}
        </p>
        <div className={style.scoreContainer}>
          <p className={style.modifier} ref={this.modifierRef}>
            {-ITEM_COST}
          </p>
          <div className={style.background}>
            <div
              style={{
                transform: `translateY(-${score}%)`
              }}
            />
          </div>
        </div>
        <div className={style.itemContainer}>
          <img
            style={itemStyle}
            className={style.item}
            src={IMG_ITEM[item.img]}
          />
          <div className={style.gaugeContainer}>
            <CircleProgress
              ratio={
                (shoutTimer === SHOUT_TIMER ? 0 : shoutTimer) /
                (SHOUT_TIMER - 1)
              }
            />
          </div>
        </div>
        <div className={style.binsContainer}>
          {[
            GARBAGE.recyclable,
            GARBAGE.dry,
            GARBAGE.hazardous,
            GARBAGE.wet
          ].map(bin => {
            return (
              <li key={bin} className={style.bin}>
                <img src={IMG_BIN[bin]} />
                <span>{GARBAGE_LABEL[bin]}</span>
              </li>
            );
          })}
          <ul className={style.btnsContainer}>
            {[
              GARBAGE.recyclable,
              GARBAGE.dry,
              GARBAGE.hazardous,
              GARBAGE.wet
            ].map(bin => {
              return (
                <li key={bin} className={style.btn}>
                  <Btn
                    className={style.circle}
                    status={btnStatus[bin]}
                    onClick={() => this.choose(bin)}
                  />
                </li>
              );
            })}
          </ul>
        </div>
        <div className={style.passContainer}>
          <Btn
            className={style.btn}
            status={btnStatus[GARBAGE.pass]}
            onClick={() => this.choose(GARBAGE.pass)}
          />
          <span>{GARBAGE_LABEL[GARBAGE.pass]}</span>
        </div>
      </>
    );
  };

  renderPlayerRank = (rank: number) => {
    if (rank > 3) {
      return <span>{rank}</span>;
    }
    if (rank === 1) {
      return <img className={style.rank} src={IMG_MEDAL_GOLD} />;
    }
    if (rank === 2) {
      return <img className={style.rank} src={IMG_MEDAL_SILVER} />;
    }
    if (rank === 3) {
      return <img className={style.rank} src={IMG_MEDAL_COPPER} />;
    }
  };

  getTitleInfo = (score: number): { image: string; label: string } => {
    return { image: IMG_ENV_GOOD, label: "环境健康" };
  };

  renderResult = (resultStyle = {}) => {
    const { resultPlayerIndex } = this.state;
    const {
      gameState: { sortedPlayers, totalScore }
    } = this.props;
    const resultPlayer = sortedPlayers && sortedPlayers[resultPlayerIndex];
    const { image, label } = this.getTitleInfo(totalScore);
    return (
      <div style={resultStyle}>
        <div
          className={style.result}
          style={{ backgroundImage: `url(${image})` }}
        >
          <ul className={style.title}>
            <li>{label}</li>
            <li>{totalScore}</li>
          </ul>
          <div className={style.panel}>
            <ul className={style.left}>
              {sortedPlayers &&
                sortedPlayers.map(({ img }, i) => {
                  return (
                    <li
                      key={i}
                      className={resultPlayerIndex === i ? style.active : ""}
                      onClick={() => this.setState({ resultPlayerIndex: i })}
                    >
                      {this.renderPlayerRank(i + 1)}
                      <img
                        className={style.header}
                        src={img || DEFAULT_AVATAR}
                      />
                    </li>
                  );
                })}
            </ul>
            <div className={style.right}>
              {resultPlayer && (
                <>
                  <p className={style.score}>{resultPlayer.score}</p>
                  <p>
                    经游戏结果判断：我是文案我是文案我是文案经游戏结果判断我是文案我是文案我是文案经游戏结果判断我是文案我是文案我是文案经游戏结果
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
        <div
          className={style.shareButton}
          onClick={() => this.setState({ modal: MODAL.share })}
        >
          <img src={IMG_SHARE} />
          <span>分享</span>
        </div>
      </div>
    );
  };

  renderRuleModal = () => {
    return (
      <div className={style.ruleModal}>
        <div className={style.ruleContent}>
          <img src={IMG_RULE_MODAL} />
          <p className={style.title}>游戏规则</p>
          <div className={style.content}>
            经游戏结果判断：我是文案我是文案我是文案经游戏结果判断我是文案我是文案我是文案经游戏结果判断我是文案我是文案我是文案经游戏结果
            拷贝
          </div>
        </div>
        <img
          src={IMG_CLOSE}
          onClick={() => this.setState({ modal: undefined })}
        />
      </div>
    );
  };

  renderShareModal = () => {
    const { playerState } = this.props;
    if (this.isWechat) {
      return (
        <div className={style.shareModal}>
          <p>点击右上角分享</p>
          <img
            src={IMG_CLOSE}
            onClick={() => this.setState({ modal: undefined })}
          />
        </div>
      );
    }
    return (
      <div className={style.shareModal}>
        <p>扫码分享到微信</p>
        <QRCode
          size={150}
          value={this.shareUrl + `?userId=${playerState.user.id}`}
        />
        <img
          src={IMG_CLOSE}
          onClick={() => this.setState({ modal: undefined })}
        />
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
    const { modal } = this.state;
    switch (modal) {
      case MODAL.prepare1: {
        return (
          <div className={style.prepareModal}>
            <div className={style.itemContainer}>
              <img src={IMG_ITEM[ITEMS[0].img]} />
              <div className={style.outer}>
                <div className={style.inner} />
              </div>
            </div>
            <div className={style.binsContainer}>
              {[
                GARBAGE.recyclable,
                GARBAGE.dry,
                GARBAGE.hazardous,
                GARBAGE.wet
              ].map(bin => {
                return (
                  <li key={bin} className={style.bin}>
                    <img src={IMG_BIN[bin]} />
                  </li>
                );
              })}
              <div className={style.btnsContainer}>
                {[
                  GARBAGE.recyclable,
                  GARBAGE.dry,
                  GARBAGE.hazardous,
                  GARBAGE.wet
                ].map(bin => {
                  return (
                    <li key={bin} className={style.btn}>
                      <Btn
                        className={style.btnCircle + " " + style.placeholder}
                        status={BTN.default}
                      />
                      <div className={style.circle}>
                        <div className={style.innerCircle} />
                      </div>
                    </li>
                  );
                })}
                <div className={style.border} />
              </div>
            </div>
            <div className={style.passContainer}>
              <div className={style.passWrapper}>
                <Btn className={style.btn} status={BTN.pass} />
                <div className={style.border} />
              </div>
              <div className={style.prepareButton}>
                <div
                  onClick={() => {
                    this.setState({ modal: MODAL.prepare2 });
                    this.precache();
                  }}
                >
                  <img src={IMG_PREPARE_BUTTON} />
                  <span>我知道了</span>
                </div>
              </div>
            </div>
            <p className={style.word}>根据图中的物体选择分类</p>
          </div>
        );
      }
      case MODAL.prepare2: {
        return (
          <div className={style.prepareModal}>
            <div className={style.itemContainer}>
              <img src={IMG_ITEM[ITEMS[0].img]} style={{ opacity: 0 }} />
              <div className={style.gaugeContainer}>
                <CircleProgress ratio={0.5} />
                <div className={style.border} />
              </div>
            </div>
            <div className={style.passContainer}>
              <div className={style.passWrapper}>
                <Btn className={style.btn} status={BTN.pass} />
                <div className={style.border} />
              </div>
              <div className={style.prepareButton}>
                <div
                  onClick={() => {
                    frameEmitter.emit(MoveType.prepare);
                  }}
                >
                  <img src={IMG_PREPARE_BUTTON} />
                  <span>开始体验</span>
                </div>
              </div>
            </div>
            <div className={style.word} style={{ bottom: "30%" }}>
              <p>每个物体思考时间为10秒</p>
              <p>时间到会自动选择垃圾堆</p>
              <p>或者在10秒内主动选择垃圾堆</p>
            </div>
          </div>
        );
      }
    }
  };

  render() {
    const content = this.renderContent();
    return <section className={style.play}>{content}</section>;
  }
}

function checkWechat(): boolean {
  return (
    window.navigator.userAgent.toLowerCase().indexOf("micromessenger") > -1
  );
}

function getShareUrl() {
  let originalUrl = window.location.search
    ? window.location.href.split(window.location.search)[0]
    : window.location.href;
  return originalUrl.replace("/play", "/share");
}

async function initWechat(shareUrl: string) {
  if (!window.wx) {
    await loadScript("https://res.wx.qq.com/open/js/jweixin-1.4.0.js");
  }
  const res = await ajax(
    "/wechat/jssdk?url=" + encodeURIComponent(window.location.href)
  );
  if (res.err) {
    return alert("微信加载出错");
  }
  const option = res.msg;
  window.wx.config({
    debug: false,
    appId: option.appId,
    timestamp: option.timestamp,
    nonceStr: option.nonceStr,
    signature: option.signature,
    jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage"]
  });
  window.wx.ready(function() {
    window.wx.onMenuShareTimeline({
      title: "垃圾分类", // 分享标题
      link: shareUrl, // 分享链接
      imgUrl: IMG_GARBAGE_SORTING
    });
    window.wx.onMenuShareAppMessage({
      title: "垃圾分类", // 分享标题
      desc: "快来垃圾分类吧!", // 分享描述
      link: shareUrl, // 分享链接
      imgUrl: IMG_GARBAGE_SORTING
    });
  });
}

async function loadScript(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script: any = document.createElement("script");
    script.type = "text/javascript";
    if (script.readyState) {
      script.onreadystatechange = function() {
        if (
          script.readyState === "loaded" ||
          script.readyState === "complete"
        ) {
          script.onreadystatechange = null;
          resolve();
        }
      };
    } else {
      script.onload = function() {
        resolve();
      };
    }
    script.onerror = function() {
      reject(new Error("script loading failed"));
    };
    script.src = url;
    document.body.appendChild(script);
  });
}

async function ajax(
  urlOrOptions: string | { url: string; method: string; data: object }
): Promise<any> {
  if (
    typeof urlOrOptions === "string" ||
    urlOrOptions.method.toLowerCase() === "get"
  ) {
    const url =
      typeof urlOrOptions === "string" ? urlOrOptions : urlOrOptions.url;
    return fetch(url, {
      method: "GET",
      cache: "default",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(response => response.json());
  }
  return fetch(urlOrOptions.url, {
    method: urlOrOptions.method,
    cache: "default",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(urlOrOptions.data)
  }).then(response => response.json());
}
