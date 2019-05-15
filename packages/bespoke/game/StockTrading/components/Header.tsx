import * as React from "react";
import * as style from "./style.scss";
const LOCK = require("./lock.svg");

interface IProps {
  stage: string;
}

interface StateType {
  sub: boolean;
}

export default class Header extends React.Component<IProps, StateType> {
  static Stage = {
    Home: "home",
    IPO_Median: "ipo_median",
    IPO_Top: "ipo_top",
    TBM: "tbm",
    CBM: "cbm"
  };

  constructor(props) {
    super(props);
    this.state = {
      sub: false
    };
  }

  getStatus = (stage: string, item): string => {
    const { sub } = this.state;
    if ((item.subStages && item.name.includes(stage)) || stage === item.name) {
      return sub ? "" : "active";
    }
    if (
      (item.subStages && item.name.every(name => ORDER[stage] < ORDER[name])) ||
      ORDER[stage] < ORDER[item.name]
    ) {
      return "locked";
    }
    return "";
  };

  getSubStatus = (stage: string, item): string => {
    if (stage === item.name) {
      return "active";
    }
    if (ORDER[stage] < ORDER[item.name]) {
      return "locked";
    }
    return "";
  };

  render(): React.ReactNode {
    const { stage } = this.props;
    const { sub } = this.state;
    return (
      <div className={style.header}>
        {STAGES.map((item, i) => {
          const status = this.getStatus(stage, item);
          return (
            <div
              key={`headerItem-${i}`}
              className={status ? style[status] : ""}
              onClick={
                item.subStages ? () => this.setState({ sub: !sub }) : () => {}
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
                    const subStatus = this.getSubStatus(stage, item);
                    return (
                      <li
                        key={`subItem-${i}`}
                        className={subStatus ? style[subStatus] : ""}
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

const ORDER = {
  [Header.Stage.Home]: 0,
  [Header.Stage.IPO_Median]: 1,
  [Header.Stage.IPO_Top]: 2,
  [Header.Stage.TBM]: 3,
  [Header.Stage.CBM]: 4
};

const STAGES = [
  { name: Header.Stage.Home, text: "首页" },
  {
    name: [Header.Stage.IPO_Median, Header.Stage.IPO_Top],
    text: "IPO发售",
    subStages: [
      { name: Header.Stage.IPO_Median, text: "中位数定价" },
      { name: Header.Stage.IPO_Top, text: "最高价前K个" }
    ]
  },
  { name: Header.Stage.TBM, text: "集合竞价" },
  { name: Header.Stage.CBM, text: "连续竞价" }
];
