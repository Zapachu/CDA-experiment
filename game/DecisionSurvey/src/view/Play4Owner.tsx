import * as React from "react";
import * as style from "./style.scss";
import Button from "antd/es/button";
import Table from "antd/es/table";
import Radio from "antd/es/radio";
import "antd/es/button/style";
import "antd/es/radio/style";
import "antd/es/table/style";
import { Request, Toast } from "@elf/component";
import { Core } from "@bespoke/register";
import {
  CARD,
  FetchRoute,
  ICreateParams,
  IGameState,
  IMoveParams,
  IPlayerState,
  IPushParams,
  MoveType,
  namespace,
  PushType,
  SheetType
} from "../config";

interface IPlay4OwnerState {
  card: CARD;
}

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
  state: IPlay4OwnerState = {
    card: undefined
  };

  getPlayersData = (playerStates: {
    [token: string]: IPlayerState;
  }): Array<{ key: string; mobile: string; status: string }> => {
    return Object.keys(playerStates).map(token => {
      const playerState = playerStates[token];
      return {
        key: token,
        mobile: playerState.mobile || "-",
        status: playerState.info ? "已完成" : "进行中"
      };
    });
  };

  render(): React.ReactNode {
    const {
      props: { game, playerStates, gameState, frameEmitter }
    } = this;
    const { card } = this.state;
    return (
      <section className={style.play4Owner}>
        <a
          className={style.exportBtn}
          href={Request.buildUrl(
            namespace,
            FetchRoute.exportXlsPlaying,
            { gameId: game.id },
            { sheetType: SheetType.result }
          )}
        >
          导出结果
        </a>
        {gameState.card ? (
          <p>现场抽牌颜色为{gameState.card}, 收益计算已完成, 可导出结果查看</p>
        ) : (
          <div>
            <label style={{ marginRight: "1rem" }}>选择现场抽牌的颜色</label>
            <Radio.Group
              onChange={e => this.setState({ card: e.target.value as CARD })}
              value={card}
            >
              <Radio value={CARD.black}>黑色</Radio>
              <Radio value={CARD.red}>红色</Radio>
            </Radio.Group>
            <div className={style.btnContainer}>
              <Button
                onClick={() => {
                  if (!card) {
                    return Toast.warn("请先选择抽牌颜色");
                  }
                  frameEmitter.emit(MoveType.dealCard, { card }, error =>
                    Toast.warn(error)
                  );
                }}
              >
                计算收益
              </Button>
            </div>
          </div>
        )}
        <Table
          className={style.table}
          dataSource={this.getPlayersData(playerStates)}
          columns={[
            { title: "手机号", dataIndex: "mobile", key: "mobile" },
            { title: "状态", dataIndex: "status", key: "status" }
          ]}
        />
      </section>
    );
  }
}
