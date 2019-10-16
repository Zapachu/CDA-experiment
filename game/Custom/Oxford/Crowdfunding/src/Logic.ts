import * as Extend from '@extend/server';
import {IActor, IMoveCallback, IUserWithId} from '@bespoke/share';
import {
    Arm,
    ICreateParams,
    IGameState,
    IMoveParams,
    IPlayerState,
    IPushParams,
    MoveType,
    PlayerStatus,
    projectConfigs,
    PushType,
    Treatment
} from './config';
import {GroupDecorator} from '@extend/share';
import shuffle = require('lodash/shuffle');

function getRandomEnumItem(e): any {
    const keys = Object.keys(e).filter(k => typeof k !== 'number');
    return keys[~~(Math.random() * keys.length)];
}

class GroupLogic extends Extend.Group.Logic<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    initGameState(): IGameState {
        const gameState = super.initGameState();
        gameState.contribution = Array(this.groupSize).fill(null).map(() =>
            Array(projectConfigs.length).fill(0)
        );
        return gameState;
    }

    async initPlayerState(user: IUserWithId, index: number): Promise<GroupDecorator.TPlayerState<IPlayerState>> {
        const playerState = await super.initPlayerState(user, index);
        playerState.status = PlayerStatus.instruction;
        playerState.projectSort = shuffle(projectConfigs.map((_, i) => i));
        playerState.arm = getRandomEnumItem(Arm);
        playerState.treatment = getRandomEnumItem(Treatment);
        return playerState;
    }

    async playerMoveReducer(actor: IActor, type: MoveType, params: IMoveParams, cb: IMoveCallback): Promise<void> {
        const gameState = await this.stateManager.getGameState(),
            playerState = await this.stateManager.getPlayerState(actor);
        switch (type) {
            case MoveType.username:
                playerState.username = params.username;
                playerState.status = PlayerStatus.contribute;
                break;
            case MoveType.contribute:
                const myC = gameState.contribution[playerState.index]
                myC[params.p] = params.c;
                cb();
                if(myC.every(p=>p) || myC.reduce((m,n)=>m+n,0) >= this.params.endowment){
                    playerState.status = PlayerStatus.questionnaire
                }
                break;
            case MoveType.toInstruction:
                playerState.status = PlayerStatus.instruction;
                break;
            case MoveType.toContribute:
                playerState.status = PlayerStatus.contribute;
                break;
        }
    }
}

export class Logic extends Extend.Logic<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    GroupLogic = GroupLogic;
}
