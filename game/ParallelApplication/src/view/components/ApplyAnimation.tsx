import * as React from "react";
import * as style from "./style.scss";
import { SCHOOL, QUOTA, SCHOOL_NAME } from "../../config";

const SCHOOL_PIE = require("./school_pie.png");
const SCHOOL_PIE_ACTIVE = require("./school_pie_active.png");
const STUDENT = require("./student.png");
const STUDENT_ACTIVE = require("./student_active.png");

const UNIT = 45.72;
const EMPTY_PLAYER = {
  token: "",
  schools: [],
  score: 0,
  admission: 0
};
const APPLY_NAME = ["第一志愿", "第二志愿", "第三志愿"];
enum SCHOOL_STATUS {
  default = 0,
  applying,
  accepted,
  refused
}
const DEFAULT_SCHOOL_STATUS = {
  [SCHOOL.beijingUni]: SCHOOL_STATUS.default,
  [SCHOOL.qinghuaUni]: SCHOOL_STATUS.default,
  [SCHOOL.renminUni]: SCHOOL_STATUS.default,
  [SCHOOL.fudanUni]: SCHOOL_STATUS.default,
  [SCHOOL.shangjiaoUni]: SCHOOL_STATUS.default,
  [SCHOOL.zhejiangUni]: SCHOOL_STATUS.default,
  [SCHOOL.nanjingUni]: SCHOOL_STATUS.default,
  [SCHOOL.wuhanUni]: SCHOOL_STATUS.default,
  [SCHOOL.huakeUni]: SCHOOL_STATUS.default,
  [SCHOOL.nankaiUni]: SCHOOL_STATUS.default,
  [SCHOOL.xiamenUni]: SCHOOL_STATUS.default,
  [SCHOOL.zhongshanUni]: SCHOOL_STATUS.default
};

class ApplyAnimation extends React.Component<PropType, StateType> {
  private duration = 500;

  constructor(props) {
    super(props);
    this.state = {
      quota: QUOTA,
      playerIndex: 3,
      players: [EMPTY_PLAYER, EMPTY_PLAYER, EMPTY_PLAYER, ...props.players],
      schoolStatus: DEFAULT_SCHOOL_STATUS,
      msg: ""
    };
  }

  componentDidMount = () => {
    setTimeout(() => this.applyForSchool(0), 1000);
  };

  applyForSchool = (schoolIndex: number) => {
    const { myToken } = this.props;
    const { players, playerIndex, schoolStatus, quota } = this.state;
    const currentPlayer = players[playerIndex];
    const school = currentPlayer.schools[schoolIndex];
    const newSchoolStatus = { ...schoolStatus };
    const isMe = currentPlayer.token === myToken;
    this.duration = isMe ? 1000 : 500;
    let partialState;
    let next = false;
    if (quota[school] > 0) {
      newSchoolStatus[school] = SCHOOL_STATUS.accepted;
      const newQuota = { ...quota };
      newQuota[school]--;
      partialState = {
        schoolStatus: newSchoolStatus,
        quota: newQuota
      };
      next = true;
    } else {
      newSchoolStatus[school] = SCHOOL_STATUS.refused;
      partialState = {
        schoolStatus: newSchoolStatus
      };
    }
    if (schoolIndex === 2) {
      next = true;
    }
    this.setState(partialState, () => {
      setTimeout(() => {
        if (next) {
          return isMe
            ? this.finish(currentPlayer.admission)
            : this.nextPlayer(currentPlayer.admission);
        }
        this.applyForSchool(schoolIndex + 1);
      }, this.duration);
    });
  };

  finish = (school: SCHOOL) => {
    const { onFinish } = this.props;
    onFinish(school);
  };

  nextPlayer = (school: SCHOOL) => {
    const { playerIndex } = this.state;
    this.toast(
      school === SCHOOL.none ? "未被录取" : `被${SCHOOL_NAME[school]}录取`
    );
    setTimeout(() => {
      this.setState(
        {
          playerIndex: playerIndex + 1,
          schoolStatus: DEFAULT_SCHOOL_STATUS
        },
        () => {
          setTimeout(() => this.applyForSchool(0), this.duration);
        }
      );
    }, this.duration);
  };

  toast = (msg: string) => {
    this.setState({ msg }, () => {
      setTimeout(() => this.setState({ msg: "" }), 600);
    });
  };

  getFillerClassName = (school: SCHOOL): string => {
    const { schoolStatus } = this.state;
    const fillerClassName = style.filler;
    switch (schoolStatus[school]) {
      case SCHOOL_STATUS.accepted: {
        return fillerClassName + " " + style.accepted;
      }
      case SCHOOL_STATUS.refused: {
        return fillerClassName + " " + style.refused;
      }
      default: {
        return fillerClassName;
      }
    }
  };

  renderPlayers = () => {
    const { players, playerIndex } = this.state;
    const { myToken } = this.props;
    return (
      <div className={style.players}>
        <ul
          className={style.slots}
          style={{ transform: `translateX(-${(playerIndex - 3) * UNIT}px)` }}
        >
          {Object.values(players).map((player, i) => {
            if (player === EMPTY_PLAYER) {
              return <li key={i} className={style.empty} />;
            }
            return (
              <li
                key={i}
                className={i === playerIndex ? style.active : ""}
                style={
                  players[i].token === myToken
                    ? { backgroundColor: "#F25D7D" }
                    : {}
                }
              >
                <p>组员:{i - 2}</p>
                <p>成绩:{player.score}</p>
                <img src={i === 3 ? STUDENT_ACTIVE : STUDENT} />
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  renderSchools = () => {
    const { playerIndex, quota, schoolStatus, players } = this.state;
    const currentPlayer = players[playerIndex];
    const schoolPies = [
      [SCHOOL.qinghuaUni, SCHOOL.beijingUni],
      [SCHOOL.renminUni, SCHOOL.fudanUni, SCHOOL.shangjiaoUni],
      [SCHOOL.zhejiangUni, SCHOOL.nanjingUni, SCHOOL.wuhanUni, SCHOOL.huakeUni],
      [SCHOOL.nankaiUni, SCHOOL.xiamenUni, SCHOOL.zhongshanUni]
    ];
    return (
      <div className={style.schools}>
        <ul className={style.applies}>
          {currentPlayer.schools.map((school, i) => {
            return (
              <li
                key={school}
                className={
                  schoolStatus[school] === SCHOOL_STATUS.default
                    ? style.disabled
                    : ""
                }
              >
                <p>{SCHOOL_NAME[school]}</p>
                <p>{APPLY_NAME[i]}</p>
              </li>
            );
          })}
        </ul>
        {schoolPies.map(pies => {
          return (
            <ul key={pies.toString()} className={style.schoolPie}>
              {pies.map(school => {
                const fillerClassName = this.getFillerClassName(school);
                return (
                  <li key={school}>
                    <img
                      src={
                        currentPlayer.schools.includes(school)
                          ? SCHOOL_PIE_ACTIVE
                          : SCHOOL_PIE
                      }
                    />
                    <div className={style.quota}>
                      <p>{SCHOOL_NAME[school]}</p>
                      <p>{quota[school]}</p>
                    </div>
                    <div className={fillerClassName} />
                  </li>
                );
              })}
            </ul>
          );
        })}
      </div>
    );
  };

  renderToast = () => {
    const { msg } = this.state;
    return (
      <div
        className={style.toast}
        style={{ visibility: msg ? "visible" : "hidden" }}
      >
        <p>{msg}</p>
      </div>
    );
  };

  render() {
    return (
      <div className={style.applyAnimation}>
        {this.renderPlayers()}
        {this.renderSchools()}
        {this.renderToast()}
      </div>
    );
  }
}

export default ApplyAnimation;

interface PropType {
  players: Array<{
    token: string;
    schools: Array<SCHOOL>;
    score: number;
    admission: SCHOOL;
  }>;
  myToken: string;
  onFinish: (school: SCHOOL) => void;
}

interface StateType {
  quota: { [school: number]: number };
  playerIndex: number;
  players: Array<{
    token: string;
    schools: Array<SCHOOL>;
    score: number;
    admission: SCHOOL;
  }>;
  schoolStatus: { [school: number]: SCHOOL_STATUS };
  msg: string;
}
