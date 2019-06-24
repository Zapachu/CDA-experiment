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
        <p className={style.ruleTitle}>平行志愿</p>
        <p>
          平行志愿是高考志愿的一种新的投档录取模式。所谓平行志愿，即一个志愿中包含若干所平行的院校。是指考生在填报高考志愿时，可在指定的批次同时填报若干个平行院校志愿。录取时，按照“分数优先，遵循志愿”的原则进行投档，对同一科类分数线上未被录取的考生按总分从高到低排序进行一次性投档，即所有考生排一个队列，高分者优先投档。每个考生投档时，根据考生所填报的院校顺序，投档到排序在前且有计划余额的院校。</p>
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
