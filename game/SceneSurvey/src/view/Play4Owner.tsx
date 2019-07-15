import * as React from "react";
import * as style from "./style.scss";
import { Table } from "antd";
import { Core, Request } from "@bespoke/register";
import {
  FetchRoute,
  ICreateParams,
  IGameState,
  IMoveParams,
  IPlayerState,
  IPushParams,
  MoveType,
  namespace,
  PushType,
  SheetType,
  STATUS
} from "../config";

interface IPlay4OwnerState {}

const STATUS_LABEL = {
  [STATUS.instruction]: "开场介绍",
  [STATUS.playing]: "答题中",
  [STATUS.info]: "填写信息",
  [STATUS.end]: "已完成"
};

export class Play4Owner extends Core.Play4Owner<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams,
  IPlay4OwnerState
> {
  state: IPlay4OwnerState = {};

  getPlayersData = (playerStates: {
    [token: string]: IPlayerState;
  }): Array<{ key: string; status: string }> => {
    return Object.keys(playerStates).map(token => {
      const playerState = playerStates[token];
      return {
        key: playerState.key || "-",
        status: STATUS_LABEL[playerState.status]
      };
    });
  };

  render(): React.ReactNode {
    const {
      props: { game, playerStates }
    } = this;
    return (
      <section className={style.play4Owner}>
        <a
          className={style.exportBtn}
          href={Request.instance(namespace).buildUrl(
            FetchRoute.exportXlsPlaying,
            { gameId: game.id },
            { sheetType: SheetType.result }
          )}
        >
          导出结果
        </a>
        <Table
          className={style.table}
          dataSource={this.getPlayersData(playerStates)}
          columns={[
            { title: "编号", dataIndex: "key", key: "key" },
            { title: "阶段", dataIndex: "status", key: "status" }
          ]}
        />
      </section>
    );
  }
}
