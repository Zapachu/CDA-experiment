import * as React from 'react'
import {Core} from '@bespoke/client'
import {MaskLoading} from '@elf/component'
import {Extractor, Wrapper} from '@extend/share'
import {Group} from './group'

export class Result<ICreateParams, IGameState, IPlayerState, S = {}>
    extends Core.Result<Wrapper.ICreateParams<ICreateParams>, Wrapper.IGameState<IGameState>, Wrapper.IPlayerState<IPlayerState>, S> {
    GroupResult: React.ComponentType<Group.IResultProps<ICreateParams, IGameState, IPlayerState>> = Group.Result

    render(): React.ReactNode {
        const {props: {game, playerState, gameState}} = this
        if (playerState.groupIndex === undefined) {
            return <MaskLoading/>
        }
        const {groupIndex} = playerState
        return <this.GroupResult {...{
            game: Extractor.game(game, groupIndex),
            gameState: Extractor.gameState(gameState, groupIndex),
            playerState: Extractor.playerState(playerState)
        }}/>
    }
}
