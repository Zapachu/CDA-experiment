import * as React from "react";
import * as style from "./style.scss";
const CHOICE = require("./choice.png");
const CHOICE_ACTIVE = require("./choice_active.png");
const CHOICE_DISABLED = require("./choice_disabled.png");

const Choice: React.SFC<PropType> = ({ label, onClick, active, disabled }) => {
  let imgSrc = CHOICE;
  let className = style.choice;
  if (active) {
    imgSrc = CHOICE_ACTIVE;
    className += ` ${style.active}`;
  }
  if (disabled) {
    imgSrc = CHOICE_DISABLED;
    className += ` ${style.disabled}`;
  }
  return (
    <div className={className} onClick={onClick}>
      <img src={imgSrc} />
      <span>{label}</span>
    </div>
  );
};

export default Choice;

interface PropType {
  label: string;
  onClick(): void;
  disabled: boolean;
  active: boolean;
}
