import * as React from "react";
import * as style from "./style.scss";
import Modal from "./Modal";
import Line from "./Line";
const PLAYER_EMPTY = require("./player_empty.svg");
const PLAYER_FOUND = require("./player_found.svg");
const LOADING = require("./loading.png");

const MatchModal: React.SFC<PropType> = ({
  visible,
  totalNum,
  matchNum,
  timer
}) => {
  return (
    <Modal visible={visible} width={400}>
      <div className={style.matchModal}>
        <p>正在为您配对玩家...</p>
        <Line color={Line.Color.White} style={{ margin: "20px 0" }} />
        <ul>
          {Array(totalNum)
            .fill("")
            .map((_, i) => {
              return (
                <li key={i}>
                  <img src={i < matchNum ? PLAYER_FOUND : PLAYER_EMPTY} />
                </li>
              );
            })}
        </ul>
        <div className={style.timer}>
          <img src={LOADING} />
          <p>{timer} S</p>
        </div>
      </div>
    </Modal>
  );
};

interface PropType {
  visible: boolean;
  totalNum: number;
  matchNum: number;
  timer: number;
}

export default MatchModal;
