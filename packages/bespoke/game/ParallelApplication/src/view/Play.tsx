import * as React from "react";
import * as style from "./style.scss";
import { Core, Toast } from "elf-component";
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

const ARROW = require("./components/arrow.png");
const SCORING = require("./components/scoring.gif");
const CLOSE = require("./components/close.png");
const SCHOOL_ICON = require("./components/school.png");

interface IPlayState {
  schools: Array<SCHOOL>;
  curSchool: SCHOOL;
  showModal: MODAL;
}

enum MODAL {
  rule
}

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
    showModal: undefined
  };

  componentDidMount(): void {
    const img = new Image();
    img.src = SCORING;
    img.onload = this.join;
    // frameEmitter.on(PushType.shoutTimer, ({ shoutTime }) => {
    //   this.setState({ shoutTime });
    // });
  }

  join = () => {
    const { frameEmitter } = this.props;
    setTimeout(() => frameEmitter.emit(MoveType.join), 4000);
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

  renderMessage = (): string => {
    const { playerState } = this.props;
    const { schools } = this.state;
    if (playerState.admission !== undefined) {
      return "录取结果出来啦";
    }
    if (playerState.schools !== undefined) {
      return "投档中，等待其他考生";
    }
    if (playerState.score !== undefined) {
      if (!Array.isArray(schools)) {
        return `您的分数是${playerState.score}|开始填报志愿吧`;
      }
      const words = {
        0: "一",
        1: "二",
        2: "三"
      };
      if (schools.length === APPLICATION_NUM) {
        const index = schools.indexOf(undefined);
        if (index === -1) {
          return "点击志愿可进行修改";
        }
        return `点击填报您的|第${words[index]}志愿`;
      }
      return `点击填报您的|第${words[schools.length]}志愿`;
    }
    return "提交试卷，等待您的分数吧";
  };

  _renderAdmission = (admission: SCHOOL) => {
    const { frameEmitter } = this.props;
    return (
      <>
        <div className={style.resultBoard}>
          {admission === SCHOOL.none ? (
            <>
              <p>很遗憾</p>
              <p>您没能被录取</p>
            </>
          ) : (
            <>
              <p>录取通知书</p>
              <p>
                恭喜您被
                <span className={style.redFont}>{SCHOOL_NAME[admission]}</span>
                录取了
              </p>
            </>
          )}
        </div>
        <Button
          label="再来一局"
          onClick={() =>
            frameEmitter.emit(MoveType.back, { onceMore: true }, url => {
              window.location = url;
            })
          }
        />
      </>
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
    const subjects = ["语文", "数学", "英语", "综合"];
    return (
      <>
        <div className={style.scoreBoard}>
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
        </div>
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
        {curSchool ? (
          <Button
            label={"确定"}
            onClick={() => {
              if (curSchool) {
                this.choose(curSchool, index);
              }
            }}
          />
        ) : null}
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

  renderContent = () => {
    const { playerState } = this.props;
    const { schools } = this.state;
    if (playerState.admission !== undefined) {
      return this._renderAdmission(playerState.admission);
    }
    if (playerState.schools !== undefined) {
      return this._renderReady2Apply(playerState.schools);
    }
    if (playerState.score !== undefined) {
      if (!Array.isArray(schools)) {
        return this._renderReady2Choose(playerState.score, playerState.scores);
      }
      if (schools.length === APPLICATION_NUM) {
        const index = schools.indexOf(undefined);
        if (index === -1) {
          return this._renderReady2Apply(schools);
        }
        return this._renderChoosing(index);
      }
      return this._renderChoosing(schools.length);
    }
    return this._renderReady2Score();
  };

  _renderRuleModal = () => {
    return (
      <div className={style.ruleModal}>
        <p className={style.ruleTitle}>游戏规则</p>
        <p>
          本实验共进行R轮，每组N人。参与者会被随机分配到某一组中，担任卖家或者买家其中一种角色，实验中角色不变，双方人数对半，每轮进行1单位商品的交易；每轮实验中，每单位商品对于买家有一个货币价值，该价值是V1到V2之间的随机数，买家根据自身的货币价值进行出价（Bid
          prices），买家的出价只有低于货币价值时才会获得收益；每单位商品对于卖家有一定的成本，该成本是C1到C2之间的随机数，卖家根据商品的成本进行
          要价（Ask
          prices），卖家的要价只有高于商品成本时才能获得收益。卖家接受买家的出价或者买家同意卖家的要价时，交易达成。实验中可及时修价格（降低要价、提高出价），最终收益计算：买家（Buyer）——每买进一单位商品，收益=货币价值-成交价格；卖家（Seller）——每卖出一单位商品，收益=成交价格-商品成本
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
        <p>投档中...</p>
      </div>
    );
  };

  renderModal = () => {
    const { playerState } = this.props;
    const { showModal } = this.state;
    if (
      playerState.admission === undefined &&
      playerState.schools !== undefined
    ) {
      return <Modal visible={true}>{this._renderApplyModal()}</Modal>;
    }
    switch (showModal) {
      case MODAL.rule: {
        return <Modal visible={true}>{this._renderRuleModal()}</Modal>;
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
          <Teacher
            msg={this.renderMessage()}
            onGameRuleClick={() => this.setState({ showModal: MODAL.rule })}
          />
          {content}
          {this.renderModal()}
        </div>
      </section>
    );
  }
}
