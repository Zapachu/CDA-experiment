import * as React from 'react'
import {Core} from '@bespoke/register'
import {MaskLoading} from '@elf/component'
import {Extend} from '@extend/share'
import {Group} from './group'

export class Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>
    extends Core.Play<Extend.ICreateParams<ICreateParams>, Extend.IGameState<IGameState>, Extend.IPlayerState<IPlayerState>, MoveType | Extend.MoveType, PushType, IMoveParams, IPushParams> {
    GroupPlay: React.ComponentClass<Group.IPlayProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>>

    componentDidMount(): void {
        const {props: {frameEmitter}} = this
        frameEmitter.emit(Extend.MoveType.getGroup)
    }

    render(): React.ReactNode {
        const {props: {game, playerState, gameState, frameEmitter}} = this
        if (playerState.groupIndex === undefined) {
            return <MaskLoading/>
        }
        const {params, ...extraGame} = game,
            {groupIndex, state, ...extraPlayerState} = playerState,
            {groups, ...extraGameState} = gameState
        return <this.GroupPlay {...{
            game: {...extraGame, params: params.groupsParams[groupIndex]},
            frameEmitter,
            gameState: {...extraGameState, ...groups[groupIndex].state},
            playerState: {...extraPlayerState, ...state}
        }}/>
    }
}
