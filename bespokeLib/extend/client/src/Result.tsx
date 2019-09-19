import * as React from 'react';
import {Core} from '@bespoke/client';
import {MaskLoading} from '@elf/component';
import {Wrapper} from '@extend/share';
import {Group} from './group';

export class Result<ICreateParams, IGameState, IPlayerState, S = {}>
    extends Core.Result<Wrapper.ICreateParams<ICreateParams>, Wrapper.IGameState<IGameState>, Wrapper.TPlayerState<IPlayerState>, S> {
    GroupResult: React.ComponentType<Group.IResultProps<ICreateParams, IGameState, IPlayerState>> = Group.Result;

    render(): React.ReactNode {
        const {props} = this,
            {game, playerState, gameState} = props;
        if (playerState.groupIndex === undefined) {
            return <MaskLoading/>;
        }
        const {groupIndex} = playerState;
        return <this.GroupResult {...{
            ...props,
            groupParams: game.params.groupsParams[groupIndex],
            groupGameState: gameState.groups[groupIndex].state,
        }}/>;
    }
}
