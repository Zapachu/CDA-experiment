import * as React from 'react'
import {Core} from '@bespoke/register'
import {MaskLoading} from '@elf/component'
import {Extend} from '@extend/share'
import {Group, TransProps} from './group'

export class Result<ICreateParams, IGameState, IPlayerState, S = {}>
    extends Core.Result<Extend.ICreateParams<ICreateParams>, Extend.IGameState<IGameState>, Extend.IPlayerState<IPlayerState>, S> {
    GroupResult: React.ComponentType<Group.IResultProps<ICreateParams, IGameState, IPlayerState>> = Group.Result

    render(): React.ReactNode {
        const {props: {game, playerState, gameState}} = this
        if (playerState.groupIndex === undefined) {
            return <MaskLoading/>
        }
        const {groupIndex} = playerState
        return <this.GroupResult {...{
            game: TransProps.game(game, groupIndex),
            gameState: TransProps.gameState(gameState, groupIndex),
            playerState: TransProps.playerState(playerState)
        }}/>
    }
}
