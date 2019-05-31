import * as React from "react";
import * as style from "./style.scss";

const Modal: React.SFC<PropType> = ({ visible, children, width=600 }) => {
  return (
    <div className={style.modal} style={visible ? {} : { display: "none" }}>
      <div className={style.mask} />
      <div className={style.window} style={{width}}>{children}</div>
    </div>
  );
};

interface PropType {
  visible: boolean;
  width?: number
}

export default Modal;
