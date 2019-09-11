import * as React from 'react';
import {Core} from '@bespoke/client';
import {Template} from '@elf/client';

export namespace Group {
    export interface ICreateProps<ICreateParams> extends Template.ICreateProps<ICreateParams> {
        groupSize: number
    }

    export interface IPlayProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> extends Core.IPlayProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    }

    export interface IPlay4OwnerProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> extends Core.IPlay4OwnerProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
    }

    export interface IResultProps<ICreateParams, IGameState, IPlayerState> extends Core.IResultProps<ICreateParams, IGameState, IPlayerState> {
    }

    export interface IResult4OwnerProps<ICreateParams, IGameState, IPlayerState, MoveType, IMoveParams> extends Core.IResult4OwnerProps<ICreateParams, IGameState, IPlayerState, MoveType, IMoveParams> {
    }

    export class Create<ICreateParams, S = {}> extends React.Component<ICreateProps<ICreateParams>, S> {
    }

    export class Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, S = {}>
        extends Core.Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, S> {
    }

    export class Play4Owner<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, S = {}>
        extends Core.Play4Owner<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, S> {
    }

    export class Result<ICreateParams, IGameState, IPlayerState, S = {}>
        extends Core.Result<ICreateParams, IGameState, IPlayerState, S> {
    }

    export class Result4Owner<ICreateParams, IGameState, IPlayerState, MoveType, IMoveParams, S = {}>
        extends Core.Result4Owner<ICreateParams, IGameState, IPlayerState, MoveType, IMoveParams, S> {
    }
}
