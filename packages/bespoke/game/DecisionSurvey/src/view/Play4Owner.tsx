import * as React from "react";
import * as style from "./style.scss";
import { Button, Core, Toast, Request, Radio } from "elf-component";
import {
  FetchRoute,
  MoveType,
  PushType,
  SheetType,
  ICreateParams,
  IGameState,
  IMoveParams,
  IPlayerState,
  IPushParams,
  namespace,
  CARD
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
          导出
        </a>
        {gameState.card ? (
          <p>收益计算完成，抽牌颜色为 {gameState.card}</p>
        ) : (
          <div>
            <p>选择抽牌的颜色</p>
            <Radio
              value={card}
              options={[CARD.black, CARD.red]}
              onChange={val => this.setState({ card: val as CARD })}
            />
            <Button
              label={"计算收益"}
              onClick={() => {
                if (!card) {
                  return Toast.warn("请选择颜色");
                }
                frameEmitter.emit(MoveType.dealCard, { card }, error =>
                  Toast.warn(error)
                );
              }}
            />
          </div>
        )}

        <table className={style.resultTable}>
          <tbody>
            <tr>
              <td>手机号</td>
              <td>状态</td>
            </tr>
            {Object.values(playerStates).map((ps, i) => (
              <tr key={i}>
                <td>{ps.mobile || "-"}</td>
                <td>{ps.info ? "已完成" : "进行中"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    );
  }
}
