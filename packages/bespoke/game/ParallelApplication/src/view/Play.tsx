import * as React from "react";
import * as style from "./style.scss";
import { Core, Toast } from "elf-component";
import { useSpring, animated } from "react-spring";
import {
  MoveType,
  PushType,
  ICreateParams,
  IGameState,
  IMoveParams,
  IPlayerState,
  IPushParams,
  SCHOOL,
  APPLICATION_NUM,
  SCHOOL_NAME
} from "../config";
import Teacher from "./components/Teacher";
import Button from "./components/Button";
import Choice from "./components/Choice";
import Modal from "./components/Modal";
import ApplyAnimation from "./components/ApplyAnimation";

const ARROW = require("./components/arrow.png");
const SCORING = require("./components/scoring.gif");
const CLOSE = require("./components/close.png");
const SCHOOL_ICON = require("./components/school.png");
const ADMISSION_PIE = require("./components/admission_pie.png");
const UNI_ZHONG_SHAN = require("./components/zhongshanUni.png");
const UNI_ZHE_JIANG = require("./components/zhejiangUni.png");
const UNI_XIA_MEN = require("./components/XiamenUni.png");
const UNI_WU_HAN = require("./components/wuhanUni.png");
const UNI_SHANG_JIAO = require("./components/shangjiaoUni.png");
const UNI_REN_MIN = require("./components/renminUni.png");
const UNI_QING_HUA = require("./components/qinghuaUni.png");
const UNI_NAN_KAI = require("./components/nankaiUni.png");
const UNI_NAN_JING = require("./components/nanjingUni.png");
const UNI_HUA_KE = require("./components/huakeUni.png");
const UNI_FU_DAN = require("./components/fudanUni.png");
const UNI_BEI_JING = require("./components/beijingUni.png");
const QR_CODE = require("./components/qrcode.jpg");

interface IPlayState {
  schools: Array<SCHOOL>;
  curSchool: SCHOOL;
  showModal: MODAL;
  admission: SCHOOL;
}

enum MODAL {
  rule,
  admission
}

enum STATUS {
  scoring,
  beforeChoose,
  choosing,
  beforeApply,
  rechoosing,
  waiting,
  applying,
  result
}

const UNI_IMG = {
  [SCHOOL.beijingUni]: UNI_BEI_JING,
  [SCHOOL.qinghuaUni]: UNI_QING_HUA,
  [SCHOOL.renminUni]: UNI_REN_MIN,
  [SCHOOL.fudanUni]: UNI_FU_DAN,
  [SCHOOL.shangjiaoUni]: UNI_SHANG_JIAO,
  [SCHOOL.zhejiangUni]: UNI_ZHE_JIANG,
  [SCHOOL.nanjingUni]: UNI_NAN_JING,
  [SCHOOL.wuhanUni]: UNI_WU_HAN,
  [SCHOOL.huakeUni]: UNI_HUA_KE,
  [SCHOOL.nankaiUni]: UNI_NAN_KAI,
  [SCHOOL.xiamenUni]: UNI_XIA_MEN,
  [SCHOOL.zhongshanUni]: UNI_ZHONG_SHAN
};

const UNI_LETTER = {
  [SCHOOL.beijingUni]:
    "已经被$北京大学$录取，我们比隔壁清华多13年历史，我们的食堂全国第一。",
  [SCHOOL.qinghuaUni]:
    "已经被$清华大学$录取，你会有一个豪华学长团，习近平、胡锦涛、邓稼先、杨振宁，有他们成为你前进的动力。",
  [SCHOOL.renminUni]:
    "已经被$中国人民大学$录取，我们是人民的大学，你和强东是校友。",
  [SCHOOL.fudanUni]:
    "已经被$复旦大学$录取，欢迎你来到魔都享受大学时光，这是最好的大学，也是最好的城市，这是你的小时代。",
  [SCHOOL.shangjiaoUni]:
    "已经被$上海交通大学$录取，我们不是只有交通专业！不是只有交通专业！不是只有交通专业！重要事情说三遍。",
  [SCHOOL.zhejiangUni]:
    "已经被$浙江大学$录取，上有天堂，下有苏杭，这里不仅有马爸爸的阿里巨头，还有网易丁磊的养猪场。",
  [SCHOOL.nanjingUni]:
    "已经被$南京大学$录取，我们坐落于六朝古都，我们帅哥美女比浙大多。",
  [SCHOOL.wuhanUni]:
    "已经被$武汉大学$录取，听说其他大学都在晒校友，那我们也就随便推一个，小米雷军。",
  [SCHOOL.huakeUni]:
    "已经被$华中科技大学$录取，顺便说一句，你们人人都用的微信，就是我校校友张小龙的产品，低调、低调！",
  [SCHOOL.nankaiUni]:
    "已经被$南开大学$录取，我校在天津！天津！天津在南方城市！周恩来总理是你的学长，德云社总部就在你隔壁。",
  [SCHOOL.xiamenUni]:
    "已经被$厦门大学$录取，欢迎你来到全国最美大学，没有之一，不接受反驳。",
  [SCHOOL.zhongshanUni]:
    "已经被$中山大学$录取，咱们再广州、珠海、深圳都有校区，三个城市任你选，对了，福建人不好吃。"
};

const NUM = {
  0: "一",
  1: "二",
  2: "三"
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
  state = {
    schools: undefined,
    curSchool: undefined,
    showModal: undefined,
    admission: undefined
  };

  componentDidMount(): void {
    document.body.addEventListener("touchstart", function() {});
    this.checkVersion();
    const img = new Image();
    img.src = SCORING;
    img.onload = this.join;
    // frameEmitter.on(PushType.shoutTimer, ({ shoutTime }) => {
    //   this.setState({ shoutTime });
    // });
  }

  checkVersion = () => {
    const { frameEmitter } = this.props;
    frameEmitter.emit(MoveType.checkVersion, {}, url => {
      window.location = url;
    });
  };

  join = () => {
    const { frameEmitter } = this.props;
    setTimeout(() => frameEmitter.emit(MoveType.join), 5000);
  };

  apply = (schools: Array<SCHOOL>) => {
    this.props.frameEmitter.emit(MoveType.shout, { schools }, err =>
      Toast.warn(err)
    );
  };

  choose = (school: SCHOOL, index: number) => {
    const schools = [...this.state.schools];
    schools[index] = school;
    this.setState({ schools, curSchool: undefined });
  };

  finishApplying = (school: SCHOOL) => {
    const { frameEmitter } = this.props;
    this.setState({ showModal: MODAL.admission, admission: school }, () => {
      setTimeout(
        () =>
          frameEmitter.emit(MoveType.result, {}, () =>
            this.setState({ showModal: undefined })
          ),
        1000
      );
    });
  };

  _renderAdmission = (admission: SCHOOL) => {
    const letters = UNI_LETTER[admission].split("$");
    return (
      <>
        <div className={style.resultLetter}>
          <p>恭喜您:</p>
          <p>
            &nbsp;&nbsp;
            {letters.map((letter, i) => {
              return (
                <span className={i === 1 ? style.redFont : ""}>{letter}</span>
              );
            })}
          </p>
        </div>
        <img className={style.resultImg} src={UNI_IMG[admission]} />
        {this._renderBackButton()}
        <img className={style.resultQrImg} src={QR_CODE} />
        <p className={style.resultQrMsg}>更多实验 请关注公众号</p>
      </>
    );
  };

  _renderNoneAdmission = () => {
    return (
      <>
        <div className={style.resultBoard}>
          <p>很遗憾</p>
          <p>您没能被录取</p>
        </div>
        {this._renderBackButton()}
      </>
    );
  };

  _renderBackButton = () => {
    const { frameEmitter } = this.props;
    return (
      <Button
        label="再来一局"
        onClick={() =>
          frameEmitter.emit(MoveType.back, { onceMore: true }, url => {
            window.location = url;
          })
        }
      />
    );
  };

  _renderReady2Apply = (schools: Array<SCHOOL>) => {
    const applications = ["第一志愿", "第二志愿", "第三志愿"];
    return (
      <>
        <ul className={style.applyBoard}>
          {applications.map((application, index) => {
            return (
              <li key={application}>
                <span className={style.application}>
                  <img src={SCHOOL_ICON} />
                  {application}
                </span>
                <span
                  className={style.redFont}
                  style={{ cursor: "pointer" }}
                  onClick={() => this.choose(undefined, index)}
                >
                  {SCHOOL_NAME[schools[index]]}
                </span>
              </li>
            );
          })}
        </ul>
        <Button label="提交" onClick={() => this.apply(schools)} />
      </>
    );
  };

  _renderReady2Choose = (score: number, scores: Array<number>) => {
    return (
      <>
        <Ready2Choose score={score} scores={scores} />
        <img className={style.arrow} src={ARROW} />
        <Button
          label="开始填报"
          onClick={() => this.setState({ schools: [] })}
        />
      </>
    );
  };

  _renderChoosing = (index: number) => {
    const { curSchool, schools } = this.state;
    return (
      <>
        <ul className={style.choices}>
          {Object.entries(SCHOOL_NAME).map(([school, label]) => {
            return (
              <li key={school}>
                <Choice
                  label={label}
                  onClick={() => this.setState({ curSchool: +school })}
                  active={curSchool === +school}
                  disabled={schools.includes(+school)}
                />
              </li>
            );
          })}
        </ul>
        <Button
          label={"确定"}
          disabled={!curSchool}
          onClick={() => {
            if (curSchool) {
              this.choose(curSchool, index);
            }
          }}
        />
      </>
    );
  };

  _renderReady2Score = () => {
    return (
      <>
        <img className={style.scoring} src={SCORING} />
      </>
    );
  };

  getPlayerStatus = (): STATUS => {
    const { playerState, gameState } = this.props;
    const { schools } = this.state;
    if (playerState.admission !== undefined) {
      return STATUS.result;
    }
    if (gameState.sortedPlayers && gameState.sortedPlayers.length) {
      return STATUS.applying;
    }
    if (playerState.schools !== undefined) {
      return STATUS.waiting;
    }
    if (playerState.score !== undefined) {
      if (!Array.isArray(schools)) {
        return STATUS.beforeChoose;
      }
      if (schools.length === APPLICATION_NUM) {
        const index = schools.indexOf(undefined);
        if (index === -1) {
          return STATUS.beforeApply;
        } else {
          return STATUS.rechoosing;
        }
      }
      return STATUS.choosing;
    }
    return STATUS.scoring;
  };

  renderContent = () => {
    const { playerState, gameState } = this.props;
    const { schools } = this.state;
    const status = this.getPlayerStatus();
    let content, msg;
    switch (status) {
      case STATUS.scoring: {
        msg = "提交试卷，等待您的分数吧";
        content = this._renderReady2Score();
        break;
      }
      case STATUS.beforeChoose: {
        msg = `您的分数是${playerState.score}|开始填报志愿吧`;
        content = this._renderReady2Choose(
          playerState.score,
          playerState.scores
        );
        break;
      }
      case STATUS.choosing: {
        msg = `点击填报您的|第${NUM[schools.length]}志愿`;
        content = this._renderChoosing(schools.length);
        break;
      }
      case STATUS.beforeApply: {
        msg = "点击志愿可进行修改";
        content = this._renderReady2Apply(playerState.schools || schools);
        break;
      }
      case STATUS.rechoosing: {
        const index = schools.indexOf(undefined);
        msg = `点击填报您的|第${NUM[index]}志愿`;
        content = this._renderChoosing(index);
        break;
      }
      case STATUS.waiting: {
        msg = "投档中, 请等待...";
        content = this._renderReady2Apply(playerState.schools || schools);
        break;
      }
      case STATUS.applying: {
        return (
          <ApplyAnimation
            players={gameState.sortedPlayers}
            myToken={playerState.actor.token}
            onFinish={school => this.finishApplying(school)}
          />
        );
      }
      case STATUS.result: {
        if (playerState.admission === SCHOOL.none) {
          msg = "录取结果出来啦";
          content = this._renderNoneAdmission();
        } else {
          return this._renderAdmission(playerState.admission);
        }
        break;
      }
    }
    return (
      <>
        <Teacher
          msg={msg}
          onGameRuleClick={() => this.setState({ showModal: MODAL.rule })}
        />
        {content}
      </>
    );
  };

  _renderRuleModal = () => {
    return (
      <div className={style.ruleModal}>
        <p className={style.ruleTitle}>平行志愿</p>
        <p>
          平行志愿是高考志愿的一种新的投档录取模式。所谓平行志愿，即一个志愿中包含若干所平行的院校。是指考生在填报高考志愿时，可在指定的批次同时填报若干个平行院校志愿。录取时，按照“分数优先，遵循志愿”的原则进行投档，对同一科类分数线上未被录取的考生按总分从高到低排序进行一次性投档，即所有考生排一个队列，高分者优先投档。每个考生投档时，根据考生所填报的院校顺序，投档到排序在前且有计划余额的院校。
        </p>
        <img
          src={CLOSE}
          onClick={() => this.setState({ showModal: undefined })}
        />
      </div>
    );
  };

  _renderApplyModal = () => {
    return (
      <div className={style.applyModal}>
        <p>投档中, 请等待......</p>
      </div>
    );
  };

  _renderAdmissionModal = () => {
    const { admission } = this.state;
    return (
      <div className={style.admissionModal}>
        <img src={ADMISSION_PIE} />
        {admission === SCHOOL.none ? (
          <div>
            <p>很遗憾</p>
            <p>您没能被录取</p>
          </div>
        ) : (
          <div>
            <p>恭喜您</p>
            <p>
              被<span>{SCHOOL_NAME[admission]}</span>录取
            </p>
          </div>
        )}
      </div>
    );
  };

  renderModal = () => {
    const { showModal } = this.state;
    const status = this.getPlayerStatus();
    if (status === STATUS.waiting) {
      return <Modal visible={true}>{this._renderApplyModal()}</Modal>;
    }
    switch (showModal) {
      case MODAL.rule: {
        return <Modal visible={true}>{this._renderRuleModal()}</Modal>;
      }
      case MODAL.admission: {
        return <Modal visible={true}>{this._renderAdmissionModal()}</Modal>;
      }
      default: {
        return <Modal visible={false} />;
      }
    }
  };

  render() {
    const content = this.renderContent();
    return (
      <section className={style.play}>
        <div className={style.playContent}>
          {content}
          {this.renderModal()}
        </div>
      </section>
    );
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
