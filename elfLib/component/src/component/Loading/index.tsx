import * as React from "react";
import * as style from "./style.scss";
import { Lang } from "../../util";

export function Loading({
  label = Lang.extract(["加载中...", "Loading..."])
}: {
  label?: string;
}) {
  return (
    <section className={style.loadingWrapper}>
      <div className={style.bounceWrapper}>
        <span className={style.bounce} />
        <span className={style.bounce} />
      </div>
      <label className={style.label}>{label}</label>
    </section>
  );
}
