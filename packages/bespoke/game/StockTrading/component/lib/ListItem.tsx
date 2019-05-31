import * as React from "react";
import * as style from "./style.scss";
const LIST_ITEM = require("./list_item.svg");

const ListItem: React.SFC<PropType> = ({
  style: propStyle,
  children,
  width = 300
}) => {
  return (
    <div className={style.listItem} style={propStyle}>
      <span>
        <img src={LIST_ITEM} width={width} />
        <span className={style.label}>{children}</span>
      </span>
    </div>
  );
};

interface PropType {
  style?: object;
  width?: number;
}

export default ListItem;
