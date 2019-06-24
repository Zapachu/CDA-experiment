import * as React from "react";
import * as style from "./style.scss";
const BUTTON = require("./button.png");

const Button: React.SFC<PropType> = ({ label, onClick }) => {
  return (
    <div className={style.button} onClick={onClick}>
      <img src={BUTTON} />
      <span>{label}</span>
    </div>
  );
};

export default Button;

interface PropType {
  label: string;
  onClick(): void;
}
