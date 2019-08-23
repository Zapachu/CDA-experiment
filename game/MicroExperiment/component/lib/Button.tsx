import * as React from "react";
import * as style from "./style.scss";
const GREEN_BIG_BTN = require("./green_big_btn.svg");
const BLUE_BIG_BTN = require("./blue_big_btn.svg");
const BLUE_SMALL_BTN = require("./blue_small_btn.svg");

const Button: ButtonType = ({
  label,
  style: propStyle,
  onClick,
  size = Size.Big,
  color = Color.Green
}) => {
  let width: number;
  let src: string;
  if (size === Size.Small) {
    width = 100;
    if (color === Color.Blue) {
      src = BLUE_SMALL_BTN;
    } else {
    }
  } else {
    width = 130;
    if (color === Color.Blue) {
      src = BLUE_BIG_BTN;
    } else {
      src = GREEN_BIG_BTN;
    }
  }
  return (
    <div className={style.button} style={propStyle}>
      <span onClick={() => onClick()}>
        <img src={src} width={width} />
        <span className={style.label + " " + style[color]}>{label}</span>
      </span>
    </div>
  );
};

interface PropType {
  label: string;
  style?: object;
  onClick: Function;
  size?: Size;
  color?: Color;
}

interface SizeProp {
  Big: Size;
  Small: Size;
}

interface ColorProp {
  Blue: Color;
  Green: Color;
}

enum Size {
  Big = "big",
  Small = "small"
}

enum Color {
  Green = "green",
  Blue = "blue"
}

type ButtonType = React.SFC<PropType> & { Size: SizeProp; Color: ColorProp };

Button.Size = { Big: Size.Big, Small: Size.Small };
Button.Color = { Green: Color.Green, Blue: Color.Blue };

export default Button;
