import * as React from "react";
import * as style from "./style.scss";

const Loading: React.SFC<{}> = () => {
  return (
    <div className={style.loading}>
      <div
        className={style["lds-spin"]}
        style={{ width: "100%", height: "100%" }}
      >
        <div>
          <div />
        </div>
        <div>
          <div />
        </div>
        <div>
          <div />
        </div>
        <div>
          <div />
        </div>
        <div>
          <div />
        </div>
        <div>
          <div />
        </div>
        <div>
          <div />
        </div>
        <div>
          <div />
        </div>
      </div>
    </div>
  );
};

export default Loading;
