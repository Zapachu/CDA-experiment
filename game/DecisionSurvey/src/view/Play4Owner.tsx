import * as React from "react";
import * as style from "./style.scss";
import Button from "antd/es/button";
import Table from "antd/es/table";
import Radio from "antd/es/radio";
import "antd/es/button/style";
import "antd/es/radio/style";
import "antd/es/table/style";
import { Toast } from "@elf/component";
import { Core, Request } from "@bespoke/register";
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
  card1: CARD;
  card2: CARD;
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
    card1: undefined,
    card2: undefined
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
    const { card1, card2 } = this.state;
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
        {gameState.card1 && gameState.card2 ? (
          <p>
            现场抽牌决策1的颜色为{gameState.card1}，决策2的颜色为
            {gameState.card2}。收益计算已完成，可导出结果查看
          </p>
        ) : (
          <div>
            <div>
              <label style={{ marginRight: "1rem" }}>选择决策1抽牌的颜色</label>
              <Radio.Group
                onChange={e => this.setState({ card1: e.target.value as CARD })}
                value={card1}
              >
                <Radio value={CARD.black}>黑色</Radio>
                <Radio value={CARD.red}>红色</Radio>
              </Radio.Group>
            </div>
            <div>
              <label style={{ marginRight: "1rem" }}>选择决策2抽牌的颜色</label>
              <Radio.Group
                onChange={e => this.setState({ card2: e.target.value as CARD })}
                value={card2}
              >
                <Radio value={CARD.black}>黑色</Radio>
                <Radio value={CARD.red}>红色</Radio>
              </Radio.Group>
            </div>
            <div className={style.btnContainer}>
              <Button
                onClick={() => {
                  if (!card1 || !card2) {
                    return Toast.warn("请先选择抽牌颜色");
                  }
                  frameEmitter.emit(
                    MoveType.dealCard,
                    { card1, card2 },
                    error => Toast.warn(error)
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
