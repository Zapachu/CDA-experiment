import * as React from 'react'
import {Core} from '@bespoke/client'
import {MaskLoading} from '@elf/component'
import {Wrapper, Extractor} from '@extend/share'
import {Group} from './group'

export class Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, S = {}>
    extends Core.Play<Wrapper.ICreateParams<ICreateParams>, Wrapper.IGameState<IGameState>, Wrapper.IPlayerState<IPlayerState>, Wrapper.MoveType<MoveType>, PushType, Wrapper.IMoveParams<IMoveParams>, IPushParams, S> {
    GroupPlay: React.ComponentType<Group.IPlayProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>> = Group.Play

    componentDidMount(): void {
        const {props: {frameEmitter}} = this
        frameEmitter.emit(Wrapper.GroupMoveType.getGroup)
    }

    render(): React.ReactNode {
        const {props: {game, playerState, gameState, frameEmitter}} = this
        if (playerState.groupIndex === undefined) {
            return <MaskLoading/>
        }
        const {groupIndex} = playerState
        return <this.GroupPlay {...{
            game: Extractor.game(game, groupIndex),
            frameEmitter: Extractor.frameEmitter(frameEmitter, groupIndex),
            gameState: Extractor.gameState(gameState, groupIndex),
            playerState: Extractor.playerState(playerState)
        }}/>
    }
}
