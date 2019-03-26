import * as React from 'react'
import {IElfCreateProps} from 'elf-linker'
import {FrameEmitter, IGame, TGameState, TPlayerState} from 'bespoke-common'
import {Fetcher} from '.'

export interface IGameTemplate {
    namespace?: string
    icon?: string
    localeNames: Array<string>
    Create?: Core.CreateClass
    CreateOnElf?: Core.CreateOnElfClass
    Info?: Core.InfoClass
    Play: Core.PlayClass
    Play4Owner?: Core.Play4OwnerClass
    Result?: Core.ResultClass
    Result4Owner?: Core.Result4OwnerClass
}

export type TRegisterGame = (namespace: string, gameTemplate: IGameTemplate) => void

export namespace Core {

    interface ICreateProps<ICreateParams, FetchType> {
        params: ICreateParams
        fetcher: Fetcher<FetchType>
        setParams: (newParams: ICreateParams) => void
        setSubmitable: (submitable: boolean) => void
    }

    interface IInfoProps<ICreateParams> {
        game: IGame<ICreateParams>,
    }

    export interface IPlayProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> extends Partial<ITravelState<IGameState, IPlayerState, MoveType, IMoveParams>> {
        game: IGame<ICreateParams>,
        fetcher: Fetcher<FetchType>
        frameEmitter?: FrameEmitter<MoveType, PushType, IMoveParams, IPushParams>
        playerState: TPlayerState<IPlayerState>
    }

    interface IPlay4OwnerProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> extends Partial<ITravelState<IGameState, IPlayerState, MoveType, IMoveParams>> {
        game: IGame<ICreateParams>,
        fetcher: Fetcher<FetchType>
        frameEmitter?: FrameEmitter<MoveType, PushType, IMoveParams, IPushParams>
    }

    interface IResult4PlayerProps<ICreateParams, IPlayerState, FetchType> {
        game: IGame<ICreateParams>,
        fetcher: Fetcher<FetchType>
        playerState: TPlayerState<IPlayerState>
    }

    export interface ITravelState<IGameState, IPlayerState, MoveType, IMoveParams> {
        token: string
        type: MoveType
        params: IMoveParams
        gameState: TGameState<IGameState>,
        playerStates: { [token: string]: TPlayerState<IPlayerState> }
    }

    interface IResult4OwnerProps<ICreateParams, IGameState, IPlayerState, MoveType, IMoveParams, FetchType> {
        game: IGame<ICreateParams>,
        fetcher: Fetcher<FetchType>
        travelStates: Array<ITravelState<IGameState, IPlayerState, MoveType, IMoveParams>>
    }


    export class Create<ICreateParams, FetchType, S = {}> extends React.Component<ICreateProps<ICreateParams, FetchType>, S> {
    }

    export type CreateSFC<ICreateParams, FetchType> = React.SFC<ICreateProps<ICreateParams, FetchType>>


    export class Info<ICreateParams, S = {}> extends React.Component<IInfoProps<ICreateParams>, S> {
    }

    export type InfoSFC<ICreateParams> = React.SFC<IInfoProps<ICreateParams>>


    export class Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType, S = {}>
        extends React.Component<IPlayProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType>, S> {
    }

    export type PlaySFC<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> =
        React.SFC<IPlayProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType>>


    export class Play4Owner<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType, S = {}>
        extends React.Component<IPlay4OwnerProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType>, S> {
    }

    export type Play4OwnerSFC<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType> =
        React.SFC<IPlay4OwnerProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType>>


    export class Result<ICreateParams, IPlayerState, FetchType, S = {}>
        extends React.Component<IResult4PlayerProps<ICreateParams, IPlayerState, FetchType>, S> {
    }

    export type ResultSFC<ICreateParams, IPlayerState, FetchType> =
        React.SFC<IResult4PlayerProps<ICreateParams, IPlayerState, FetchType>>


    export class Result4Owner<ICreateParams, IGameState, IPlayerState, MoveType, IMoveParams, FetchType, S = {}>
        extends React.Component<IResult4OwnerProps<ICreateParams, IGameState, IPlayerState, MoveType, IMoveParams, FetchType>, S> {
    }

    export type Result4OwnerSFC<ICreateParams, IGameState, IPlayerState, MoveType, IMoveParams, FetchType> =
        React.SFC<IResult4OwnerProps<ICreateParams, IGameState, IPlayerState, MoveType, IMoveParams, FetchType>>

    export type CreateClass = (new(...args) => Create<{}, any>) | CreateSFC<{}, any>

    export type InfoClass = (new(...args) => Info<{}>) | InfoSFC<{}>

    export type PlayClass = (new(...args) => Play<{}, {}, {}, any, any, {}, {}, any>)
        | PlaySFC<{}, {}, {}, any, any, {}, {}, any>

    export type Play4OwnerClass = (new(...args) => Play4Owner<{}, {}, {}, any, any, {}, {}, any>)
        | Play4OwnerSFC<{}, {}, {}, any, any, {}, {}, any>

    export type ResultClass = (new(...args) => Result<{}, {}, any>)
        | ResultSFC<{}, {}, any>

    export type Result4OwnerClass = (new(...args) => Result4Owner<{}, {}, {}, any, {}, any>)
        | Result4OwnerSFC<{}, {}, {}, any, {}, any>

    //region Elf
    export class CreateOnElf<ICreateParams, S = {}> extends React.Component<IElfCreateProps<ICreateParams>, S> {
    }

    export type CreateOnElfClass = (new(...args) => CreateOnElf<{}>)
    //endregion
}
//endregion