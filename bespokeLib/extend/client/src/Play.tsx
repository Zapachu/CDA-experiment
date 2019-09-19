import * as React from 'react';
import {Core} from '@bespoke/client';
import {MaskLoading} from '@elf/component';
import {Extractor, Wrapper} from '@extend/share';
import {Group} from './group';

export class Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, S = {}>
    extends Core.Play<Wrapper.ICreateParams<ICreateParams>, Wrapper.IGameState<IGameState>, Wrapper.TPlayerState<IPlayerState>, Wrapper.MoveType<MoveType>, PushType, Wrapper.IMoveParams<IMoveParams>, IPushParams, S> {
    GroupPlay: React.ComponentType<Group.IPlayProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>> = Group.Play;

    componentDidMount(): void {
        const {props: {frameEmitter}} = this;
        frameEmitter.emit(Wrapper.GroupMoveType.getGroup);
    }

    render(): React.ReactNode {
        const {props} = this,
            {game, playerState, gameState, frameEmitter} = props;
        if (playerState.groupIndex === undefined) {
            return <MaskLoading/>;
        }
        const {groupIndex} = playerState;
        return <this.GroupPlay {...{
            ...props,
            groupParams: game.params.groupsParams[groupIndex],
            groupGameState: gameState.groups[groupIndex].state,
            groupFrameEmitter: Extractor.frameEmitter(frameEmitter, groupIndex),
        }}/>;
    }
}
