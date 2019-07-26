import * as React from "react";
import * as style from "./style.scss";
import { Core, Request } from "@bespoke/client";
import {
  ICreateParams,
  IGameState,
  IMoveParams,
  IPlayerState,
  FetchRoute,
  MoveType,
  namespace,
  SheetType
} from "../config";

export class Result4Owner extends Core.Result4Owner<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  IMoveParams
> {
  render(): React.ReactNode {
    const {
      props: { game }
    } = this;
    return (
      <section className={style.result4Owner}>
        <a
          className={style.exportBtn}
          href={Request.instance(namespace).buildUrl(
            FetchRoute.exportXls,
            { gameId: game.id },
            { sheetType: SheetType.result }
          )}
        >
          导出结果
        </a>
      </section>
    );
  }
}
