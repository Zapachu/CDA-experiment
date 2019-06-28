import * as React from "react";
import * as style from "./style.scss";
const BUTTON = require("./button.png");
const BUTTON_DISABLED = require("./button_disabled.png");

const Button: React.SFC<PropType> = ({ label, onClick, disabled = false }) => {
  return (
    <div className={style.button} onClick={onClick}>
      <img src={disabled ? BUTTON_DISABLED : BUTTON} />
      <span>{label}</span>
    </div>
  );
};

export default Button;

interface PropType {
  label: string;
  onClick(): void;
  disabled?: boolean;
}
