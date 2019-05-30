import * as React from 'react';
import * as style from './style.scss';

const Line: LineType = ({text, style: propStyle, color=Color.Green}) => {
    return (
        <div className={style.line+' '+style[color]} style={propStyle}>
          <span></span>
          {text ? <p>{text}</p> : null}
          <span></span>
        </div>
    )
}

interface PropType {
    text?: string;
    style?: object;
    color?: Color;
}

interface ColorType {
    Green: Color;
    White: Color;
}

type LineType = React.SFC<PropType> & {Color: ColorType};

enum Color {
    Green='green',
    White='white'
}

Line.Color = {Green: Color.Green, White: Color.White};

export default Line;