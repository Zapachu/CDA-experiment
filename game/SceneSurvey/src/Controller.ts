import {
  BaseController,
  IActor,
  IMoveCallback,
  TPlayerState
} from "@bespoke/server";
import {
  ICreateParams,
  IGameState,
  IMoveParams,
  IPlayerState,
  IPushParams,
  MoveType,
  PAGES,
  PushType,
  SheetType,
  STATUS
} from "./config";

export default class Controller extends BaseController<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams
> {
  // initGameState(): TGameState<IGameState> {
  //   const gameState = super.initGameState();
  //   return gameState;
  // }

  async initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
    const playerState = await super.initPlayerState(actor);
    playerState.answers = [];
    playerState.status = STATUS.instruction;
    return playerState;
  }

  protected async playerMoveReducer(
    actor: IActor,
    type: string,
    params: IMoveParams,
    cb: IMoveCallback
  ): Promise<void> {
    const playerState = await this.stateManager.getPlayerState(actor);
    // const gameState = await this.stateManager.getGameState();
    const playerStates = await this.stateManager.getPlayerStates();
    switch (type) {
      case MoveType.prepare: {
        playerState.status = STATUS.playing;
        break;
      }
      case MoveType.shout: {
        const { answer, index } = params;
        if (playerState.answers[index] !== undefined) {
          return;
        }
        if (!answer) {
          return cb("请选择一项再提交");
        }
        playerState.answers[index] = answer;
        if (index === PAGES.length - 1) {
          playerState.status = STATUS.info;
        }
        break;
      }
      case MoveType.info: {
        if (playerState.key) {
          return;
        }
        const { key, name } = params;
        if (
          Object.values(playerStates)
            .map(ps => ps.key)
            .includes(key)
        ) {
          return cb("编号已使用");
        }
        playerState.key = key;
        playerState.name = name;
        playerState.status = STATUS.end;
        break;
      }
    }
  }

  async onGameOver() {
    const gameState = await this.stateManager.getGameState();
    const resultData = await this.genExportData();
    Object.assign(gameState, {
      sheets: {
        [SheetType.result]: {
          data: resultData
        }
      }
    });
  }

  async genExportData(): Promise<Array<Array<any>>> {
    // const gameState = await this.stateManager.getGameState();
    const playerStates = await this.stateManager.getPlayerStates();
    const resultData: Array<Array<any>> = [
      ["编号", "姓名", "情景1", "情景2", "情景3", "情景4", "情景5"]
    ];
    const playerStateArray = Object.values(playerStates);
    playerStateArray.forEach(ps => {
      const row = [
        ps.key || "-",
        ps.name || "-",
        ps.answers[0] || "-",
        ps.answers[1] || "-",
        ps.answers[2] || "-",
        ps.answers[3] || "-",
        ps.answers[4] || "-"
      ];
      resultData.push(row);
    });
    return resultData;
  }
}
