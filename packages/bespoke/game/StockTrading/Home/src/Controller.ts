import {
  BaseController,
  IActor,
  IMoveCallback,
  TPlayerState
} from "bespoke-server";
import { MoveType, PushType, FetchType } from "./config";
import {
  ICreateParams,
  IGameState,
  IPlayerState,
  IMoveParams,
  IPushParams
} from "./interface";
import { Stage } from "../../components/constants";

export default class Controller extends BaseController<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams,
  FetchType
> {
  async initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
    const playerState = await super.initPlayerState(actor);
    playerState.currentStage = Stage.Home;
    playerState.unlockedStage = Stage.IPO_Median;
    return playerState;
  }

  async playerMoveReducer(
    actor: IActor,
    type: string,
    params: IMoveParams,
    cb: IMoveCallback
  ): Promise<void> {
    const { playUrls } = this.game.params;
    const playerState = await this.stateManager.getPlayerState(actor);
    switch (type) {
      case MoveType.switchStage: {
        playerState.currentStage = params.stage;
        if (playerState.currentStage < playUrls.length) {
          playerState.unlockedStage = Math.max(
            playerState.currentStage + 1,
            playerState.unlockedStage
          );
        }
        break;
      }
    }
  }
}
