import * as React from 'react'
import {Core} from '@bespoke/register'
import {MaskLoading} from '@elf/component'
import {Extend} from '@extend/share'
import {Group, TransProps} from './group'

export class Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, S = {}>
    extends Core.Play<Extend.ICreateParams<ICreateParams>, Extend.IGameState<IGameState>, Extend.IPlayerState<IPlayerState>, MoveType | Extend.MoveType, PushType, Extend.IMoveParams<IMoveParams>, IPushParams, S> {
    GroupPlay: React.ComponentType<Group.IPlayProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>> = Group.Play

    componentDidMount(): void {
        const {props: {frameEmitter}} = this
        frameEmitter.emit(Extend.MoveType.getGroup)
    }

    render(): React.ReactNode {
        const {props: {game, playerState, gameState, frameEmitter}} = this
        if (playerState.groupIndex === undefined) {
            return <MaskLoading/>
        }
        const {groupIndex} = playerState
        return <this.GroupPlay {...{
            game: TransProps.game(game, groupIndex),
            frameEmitter : TransProps.frameEmitter(frameEmitter, groupIndex),
            gameState: TransProps.gameState(gameState, groupIndex),
            playerState: TransProps.playerState(playerState)
        }}/>
    }
}
