import * as React from 'react';
import * as Extend from '@extend/client';
import {Button} from 'antd';
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams, MoveType, PushType} from '../config';

class GroupPlay4Owner extends Extend.Group.Play4Owner<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    render(): React.ReactNode {
        const {playerStates, groupGameState, frameEmitter} = this.props;
        return <>
            {Object.values(playerStates).map(({count}) => count).join(',')}
            <h2>{groupGameState.total}</h2>
            <Button onClick={() => frameEmitter.emit(MoveType.reset)}>Reset</Button>
        </>
    }
}

export class Play4Owner extends Extend.Play4Owner<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    GroupPlay4Owner = GroupPlay4Owner
}