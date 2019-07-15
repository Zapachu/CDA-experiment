import * as React from "react";
import * as style from "./style.scss";
import { Core } from "@bespoke/register";
import { Request } from "@elf/component";
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
          href={Request.buildUrl(
            namespace,
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
