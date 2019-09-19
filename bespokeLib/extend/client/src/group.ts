import * as React from 'react';
import {Core} from '@bespoke/client';
import {Wrapper} from '@extend/share';
import {FrameEmitter} from '@bespoke/share';

export namespace Group {
    export interface ICreateProps<ICreateParams> extends Core.ICreateProps<Wrapper.ICreateParams<ICreateParams>> {
        groupIndex?: number
        groupParams: ICreateParams
        setGroupParams: Core.TSetCreateParams<ICreateParams>
    }

    export interface IPlayProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> extends Core.IPlayProps<Wrapper.ICreateParams<ICreateParams>, Wrapper.IGameState<IGameState>, Wrapper.TPlayerState<IPlayerState>, Wrapper.MoveType<MoveType>, PushType, Wrapper.IMoveParams<IMoveParams>, IPushParams> {
        groupParams: ICreateParams
        groupGameState: IGameState
        groupFrameEmitter: FrameEmitter<MoveType, PushType, IMoveParams, IPushParams>
    }

    export interface IPlay4OwnerProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> extends Core.IPlay4OwnerProps<Wrapper.ICreateParams<ICreateParams>, Wrapper.IGameState<IGameState>, Wrapper.TPlayerState<IPlayerState>, Wrapper.MoveType<MoveType>, PushType, IMoveParams, IPushParams> {
        groupParams: ICreateParams
        groupGameState: IGameState
        groupPlayerStates: Wrapper.TPlayerState<IPlayerState>[]
        groupFrameEmitter: FrameEmitter<MoveType, PushType, IMoveParams, IPushParams>
    }

    export interface IResultProps<ICreateParams, IGameState, IPlayerState> extends Core.IResultProps<Wrapper.ICreateParams<ICreateParams>, Wrapper.IGameState<IGameState>, Wrapper.TPlayerState<IPlayerState>> {
        groupParams: ICreateParams
        groupGameState: IGameState
    }

    export interface IResult4OwnerProps<ICreateParams, IGameState, IPlayerState, MoveType, IMoveParams> extends Core.IResult4OwnerProps<ICreateParams, IGameState, IPlayerState, MoveType, IMoveParams> {
    }

    export class Create<ICreateParams, S = {}> extends React.Component<ICreateProps<ICreateParams>, S> {
    }

    export class Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, S = {}>
        extends React.Component<IPlayProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>> {
    }

    export class Play4Owner<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, S = {}>
        extends React.Component<IPlay4OwnerProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>, S> {
    }

    export class Result<ICreateParams, IGameState, IPlayerState, S = {}>
        extends React.Component<IResultProps<ICreateParams, IGameState, IPlayerState>, S> {
    }

    export class Result4Owner<ICreateParams, IGameState, IPlayerState, MoveType, IMoveParams, S = {}>
        extends React.Component<IResult4OwnerProps<ICreateParams, IGameState, IPlayerState, MoveType, IMoveParams>> {
    }
}
