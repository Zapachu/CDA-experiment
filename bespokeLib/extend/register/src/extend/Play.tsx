import * as React from 'react'
import {Core} from '@bespoke/register'
import {MaskLoading} from '@elf/component'
import {ICreateParams, IGameState, IPlayerState, MoveType} from '@extend/share'

export class Play<IGroupParams, IGameGroupState, IPlayerGroupState, GroupMoveType, PushType, IMoveParams, IPushParams>
    extends Core.Play<ICreateParams<IGroupParams>, IGameState<IGameGroupState>, IPlayerState<IPlayerGroupState>, GroupMoveType | MoveType, PushType, IMoveParams, IPushParams> {

    GroupPlay: Core.PlayClass<IGroupParams, IGameGroupState, IPlayerGroupState, GroupMoveType, PushType, IMoveParams, IPushParams>

    componentDidMount(): void {
        const {props: {frameEmitter}} = this
        frameEmitter.emit(MoveType.getGroup)
    }

    render(): React.ReactNode {
        const {props:{playerState}} = this
        if(playerState.groupIndex === undefined){
            return <MaskLoading/>
        }
        const {props:{game:{params}}} = this
        const {groupIndex, state} = playerState
        console.log(this.props)
        return null
/*        const {props: {game:{params:{groupsParams}, ...extraGame}, frameEmitter, playerState: {groupId, state: playerState, ...extraPlayerState}, gameState: {groups}}} = this

        return <this.GroupPlay {...{
            game:{...extraGame}, frameEmitter, playerState: {...playerState, ...extraPlayerState}, gameState: null
        }}/>*/
    }
}