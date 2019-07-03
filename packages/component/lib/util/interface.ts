import * as React from 'react'
import {FrameEmitter, IGameWithId, TGameState, TPlayerState, IUserWithId} from 'bespoke-core-share'
import {RouteComponentProps} from 'react-router-dom'

export type TPageProps = Partial<{
    gameTemplate: IGameTemplate
    user: IUserWithId
} & RouteComponentProps<{ gameId?: string }>>

export interface IGameTemplate {
    namespace?: string
    localeNames?: Array<string>
    Create?: Core.CreateClass
    Info?: Core.InfoClass
    Play: Core.PlayClass
    Play4Owner?: Core.Play4OwnerClass
    Result?: Core.ResultClass
    Result4Owner?: Core.Result4OwnerClass
}

export type TRegisterGame = (gameTemplate: IGameTemplate) => void

export namespace Core {

    interface ICreateProps<ICreateParams> {
        params: Partial<ICreateParams>
        setParams: (newParams: Partial<ICreateParams>) => void
        submitable?: boolean
        setSubmitable?: (submitable: boolean) => void
    }

    interface IInfoProps<ICreateParams> {
        game: IGameWithId<ICreateParams>,
    }

    export interface IPlayProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> extends Partial<ITravelState<IGameState, IPlayerState, MoveType, IMoveParams>> {
        game: IGameWithId<ICreateParams>,
        frameEmitter?: FrameEmitter<MoveType, PushType, IMoveParams, IPushParams>
        playerState: TPlayerState<IPlayerState>
    }

    interface IPlay4OwnerProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> extends Partial<ITravelState<IGameState, IPlayerState, MoveType, IMoveParams>> {
        game: IGameWithId<ICreateParams>,
        frameEmitter?: FrameEmitter<MoveType, PushType, IMoveParams, IPushParams>
    }

    interface IResult4PlayerProps<ICreateParams, IGameState, IPlayerState> {
        game: IGameWithId<ICreateParams>
        gameState: TGameState<IGameState>,
        playerState: TPlayerState<IPlayerState>
    }

    export interface ITravelState<IGameState, IPlayerState, MoveType, IMoveParams> {
        token: string
        type: MoveType
        params: IMoveParams
        gameState: TGameState<IGameState>,
        playerStates: { [token: string]: TPlayerState<IPlayerState> }
    }

    interface IResult4OwnerProps<ICreateParams, IGameState, IPlayerState, MoveType, IMoveParams> {
        game: IGameWithId<ICreateParams>,
        travelStates: Array<ITravelState<IGameState, IPlayerState, MoveType, IMoveParams>>
    }


    export class Create<ICreateParams, S = {}> extends React.Component<ICreateProps<ICreateParams>, S> {
    }

    export type CreateSFC<ICreateParams> = React.FC<ICreateProps<ICreateParams>>


    export class Info<ICreateParams, S = {}> extends React.Component<IInfoProps<ICreateParams>, S> {
    }

    export type InfoSFC<ICreateParams> = React.FC<IInfoProps<ICreateParams>>


    export class Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, S = {}>
        extends React.Component<IPlayProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>, S> {
    }

    export type PlaySFC<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> =
        React.FC<IPlayProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>>


    export class Play4Owner<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, S = {}>
        extends React.Component<IPlay4OwnerProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>, S> {
    }

    export type Play4OwnerSFC<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> =
        React.FC<IPlay4OwnerProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>>


    export class Result<ICreateParams, IGameState, IPlayerState, S = {}>
        extends React.Component<IResult4PlayerProps<ICreateParams, IGameState, IPlayerState>, S> {
    }

    export type ResultSFC<ICreateParams, IGameState, IPlayerState> =
        React.FC<IResult4PlayerProps<ICreateParams, IGameState, IPlayerState>>

    export class Result4Owner<ICreateParams, IGameState, IPlayerState, MoveType, IMoveParams, S = {}>
        extends React.Component<IResult4OwnerProps<ICreateParams, IGameState, IPlayerState, MoveType, IMoveParams>, S> {
    }

    export type Result4OwnerSFC<ICreateParams, IGameState, IPlayerState, MoveType, IMoveParams> =
        React.FC<IResult4OwnerProps<ICreateParams, IGameState, IPlayerState, MoveType, IMoveParams>>

    export type CreateClass = (new(...args) => Create<{}, any>) | CreateSFC<{}>

    export type InfoClass = (new(...args) => Info<{}>) | InfoSFC<{}>

    export type PlayClass = (new(...args) => Play<{}, {}, {}, any, any, {}, {}, any>)
        | PlaySFC<{}, {}, {}, any, any, {}, {}>

    export type Play4OwnerClass = (new(...args) => Play4Owner<{}, {}, {}, any, any, {}, {}, any>)
        | Play4OwnerSFC<{}, {}, {}, any, any, {}, {}>

    export type ResultClass = (new(...args) => Result<{}, {}, {}, any>)
        | ResultSFC<{}, {}, {}>

    export type Result4OwnerClass = (new(...args) => Result4Owner<{}, {}, {}, any, {}, any>)
        | Result4OwnerSFC<{}, {}, {}, any, {}>
}