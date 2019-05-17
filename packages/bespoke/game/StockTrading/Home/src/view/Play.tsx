import * as React from "react";
import * as style from "./style.scss";
import { Core } from "bespoke-client-util";
import {
  ICreateParams,
  IGameState,
  IMoveParams,
  IPlayerState,
  IPushParams
} from "../interface";
import { FetchType, MoveType, PushType } from "../config";
import { Header, Button, Input } from "../../../components";
const SLOPED_LINE = require("./assets/sloped_line.svg");
const HORIZONTAL_LINE = require("./assets/horizontal_line.svg");

type TProps = Core.IPlayProps<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams,
  FetchType
>;

export function Play({
  playerState: { currentStage, unlockedStage },
  game: {
    params: { playUrls }
  },
  frameEmitter
}: TProps) {
  return (
    <div className={style.play}>
      <Header
        currentStage={currentStage}
        unlockedStage={unlockedStage}
        onClick={stage => frameEmitter.emit(MoveType.switchStage, { stage })}
      />
      {currentStage === 0 ? (
        renderHomePage(frameEmitter, unlockedStage)
      ) : (
        <iframe
          style={{ width: "100vw", height: "100vh", border: "none" }}
          src={playUrls[currentStage - 1]}
        />
      )}
    </div>
  );
}

function renderHomePage(frameEmitter, unlockedStage) {
  return (
    <div className={style.home}>
      <div className={style.intro}>
        <Input value={"1.IPO发售"} disabled={true} />
        <div>
          <img
            src={SLOPED_LINE}
            className={style.arrow}
            style={{ marginBottom: "10px" }}
          />
          <img
            src={SLOPED_LINE}
            className={style.arrow}
            style={{ transform: "rotate(45deg)" }}
          />
        </div>
        <div>
          <Input
            value={"中位数定价"}
            disabled={true}
            style={{ marginBottom: "40px" }}
          />
          <Input value={"最高价前K个"} disabled={true} />
        </div>
        <img
          src={HORIZONTAL_LINE}
          className={style.arrow}
          style={{ transform: "rotate(19deg)" }}
        />
        <Input value={"2.集合竞价"} disabled={true} />
        <img
          src={HORIZONTAL_LINE}
          className={style.arrow}
          style={{ transform: "rotate(19deg)" }}
        />
        <Input value={"3.连续竞价"} disabled={true} />
      </div>
      <Button
        label={"开始游戏"}
        onClick={() =>
          frameEmitter.emit(MoveType.switchStage, { stage: unlockedStage })
        }
      />
    </div>
  );
}
