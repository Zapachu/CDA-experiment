import * as React from "react";
import * as style from "./style.scss";
import { Stage } from "./constants";
const LOCK = require("./lock.svg");

export default class Header extends React.Component<IProps, StateType> {
  constructor(props) {
    super(props);
    this.state = {
      sub: false
    };
  }

  getStatus = (item): string => {
    const { currentStage, unlockedStage } = this.props;
    const { sub } = this.state;
    if (
      (item.subStages && item.name.includes(currentStage)) ||
      currentStage === item.name
    ) {
      return item.subStages && sub ? "" : "active";
    }
    if (
      (item.subStages && item.name.every(name => name > unlockedStage)) ||
      item.name > unlockedStage
    ) {
      return "locked";
    }
    return "";
  };

  getSubStatus = (item): string => {
    const { currentStage, unlockedStage } = this.props;
    if (item.name === currentStage) {
      return "active";
    }
    if (item.name > unlockedStage) {
      return "locked";
    }
    return "";
  };

  render(): React.ReactNode {
    const { sub } = this.state;
    const { onClick } = this.props;
    return (
      <div className={style.header}>
        {STAGES.map((item, i) => {
          const status = this.getStatus(item);
          return (
            <div
              key={`headerItem-${i}`}
              className={status ? style[status] : ""}
              onClick={
                item.subStages
                  ? () => this.setState({ sub: !sub })
                  : () => onClick(item.name as Stage)
              }
            >
              {status === "locked" ? (
                <img src={LOCK} className={style.lockImg} />
              ) : null}
              {item.text}
              {item.subStages ? <span className={style.triangle} /> : null}
              {sub && item.subStages ? (
                <ul className={style.sub}>
                  {item.subStages.map((item, i) => {
                    const subStatus = this.getSubStatus(item);
                    return (
                      <li
                        key={`subItem-${i}`}
                        className={subStatus ? style[subStatus] : ""}
                        onClick={() => onClick(item.name)}
                      >
                        {subStatus === "locked" ? (
                          <img src={LOCK} className={style.lockImg} />
                        ) : null}
                        {item.text}
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </div>
          );
        })}
      </div>
    );
  }
}

interface IProps {
  currentStage: Stage;
  unlockedStage: Stage;
  onClick: (stage: Stage) => void;
}

interface StateType {
  sub: boolean;
}

const STAGES = [
  { name: Stage.Home, text: "首页" },
  {
    name: [Stage.IPO_Median, Stage.IPO_Top],
    text: "IPO发售",
    subStages: [
      { name: Stage.IPO_Median, text: "中位数定价" },
      { name: Stage.IPO_Top, text: "最高价前K个" }
    ]
  },
  { name: Stage.TBM, text: "集合竞价" },
  { name: Stage.CBM, text: "连续竞价" }
];
