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

class ApplyAnimation extends React.Component<PropType, StateType> {
  private scroll: React.RefObject<any>;

  constructor(props) {
    super(props);
    this.state = {
      quota: QUOTA,
      playerIndex: 3,
      players: [EMPTY_PLAYER, EMPTY_PLAYER, EMPTY_PLAYER, ...props.players]
    };
    this.scroll = React.createRef();
  }

  forward = () => {
    const { playerIndex } = this.state;
    this.setState({ playerIndex: playerIndex + 1 });
    this.scroll.current.style.transform = `translateX(-${(playerIndex - 2) *
      UNIT}px)`;
  };

  renderPlayers = () => {
    const { players, playerIndex } = this.state;
    const { myToken } = this.props;
    return (
      <div className={style.players} onClick={this.forward}>
        <ul className={style.slots} ref={this.scroll}>
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
    const { playerIndex } = this.state;
    const { players } = this.props;
    const currentPlayer = players[playerIndex];
    return (
      <div>
        <ul>
          {currentPlayer.schools.map(school => {
            return <li key={school}>{SCHOOL_NAME[school]}</li>;
          })}
        </ul>
      </div>
    );
  };

  render() {
    return (
      <div className={style.applyAnimation}>
        {this.renderPlayers()}
        {this.renderSchools()}
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
}
