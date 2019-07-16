import * as React from 'react'
import {config, FrameEmitter, IGameWithId, TGameState, TPlayerState} from '@bespoke/share'
import {registerOnElf, Template} from '@elf/register'
import {BaseRequest, Lang} from '@elf/component'

export interface IGameTemplate<ICreateParams = {}, IGameState = {}, IPlayerState = {}, MoveType = any, PushType = any, IMoveParams = {}, IPushParams = {}> {
    namespace?: string
    localeNames?: Array<string>
    Create?: Core.CreateClass<ICreateParams>
    Play: Core.PlayClass<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>
    Play4Owner?: Core.Play4OwnerClass<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>
    Result?: Core.ResultClass<ICreateParams, IGameState, IPlayerState>
    Result4Owner?: Core.Result4OwnerClass<ICreateParams, IGameState, IPlayerState, MoveType, IMoveParams>
}

export namespace Core {
    function emptyPage(label: string) {
        return () => <div style={{
            fontSize: '2rem',
            margin: '2rem',
            textAlign: 'center',
            color: '#999'
        }}>{label}</div>
    }


    export type ICreateProps<ICreateParams> = Template.ICreateProps<ICreateParams>

    export class Create<ICreateParams, S = {}> extends Template.Create<ICreateParams, S> {
        render(): React.ReactNode {
            return emptyPage(Lang.extractLang({label: ['无可配置参数', 'No parameters to config']}).label)
        }
    }

    export type CreateSFC<ICreateParams> = Template.CreateSFC<ICreateParams>
    export type CreateClass<ICreateParams> = (new(...args) => Create<ICreateParams, any>) | CreateSFC<ICreateParams>

    export interface IPlayProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> extends Partial<ITravelState<IGameState, IPlayerState, MoveType, IMoveParams>> {
        game: IGameWithId<ICreateParams>,
        frameEmitter?: FrameEmitter<MoveType, PushType, IMoveParams, IPushParams>
        playerState: TPlayerState<IPlayerState>
    }

    export interface IPlay4OwnerProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> extends Partial<ITravelState<IGameState, IPlayerState, MoveType, IMoveParams>> {
        game: IGameWithId<ICreateParams>,
        frameEmitter?: FrameEmitter<MoveType, PushType, IMoveParams, IPushParams>
    }

    export interface IResult4PlayerProps<ICreateParams, IGameState, IPlayerState> {
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

    export interface IResult4OwnerProps<ICreateParams, IGameState, IPlayerState, MoveType, IMoveParams> {
        game: IGameWithId<ICreateParams>,
        travelStates: Array<ITravelState<IGameState, IPlayerState, MoveType, IMoveParams>>
    }

    export class Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, S = {}>
        extends React.Component<IPlayProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>, S> {
    }

    export type PlaySFC<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> =
        React.FC<IPlayProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>>


    export class Play4Owner<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, S = {}>
        extends React.Component<IPlay4OwnerProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>, S> {
        render(): React.ReactNode {
            return emptyPage(Lang.extractLang({label: ['实验进行中', 'Playing...']}).label)
        }
    }

    export type Play4OwnerSFC<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> =
        React.FC<IPlay4OwnerProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>>


    export class Result<ICreateParams, IGameState, IPlayerState, S = {}>
        extends React.Component<IResult4PlayerProps<ICreateParams, IGameState, IPlayerState>, S> {
        render(): React.ReactNode {
            return emptyPage(Lang.extractLang({label: ['实验已结束', 'GAME OVER']}).label)
        }
    }

    export type ResultSFC<ICreateParams, IGameState, IPlayerState> =
        React.FC<IResult4PlayerProps<ICreateParams, IGameState, IPlayerState>>

    export class Result4Owner<ICreateParams, IGameState, IPlayerState, MoveType, IMoveParams, S = {}>
        extends React.Component<IResult4OwnerProps<ICreateParams, IGameState, IPlayerState, MoveType, IMoveParams>, S> {
        render(): React.ReactNode {
            return emptyPage(Lang.extractLang({label: ['实验已结束', 'GAME OVER']}).label)
        }
    }

    export type Result4OwnerSFC<ICreateParams, IGameState, IPlayerState, MoveType, IMoveParams> =
        React.FC<IResult4OwnerProps<ICreateParams, IGameState, IPlayerState, MoveType, IMoveParams>>

    export type PlayClass<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> =
        (new(...args) => Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>)
        | PlaySFC<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>

    export type Play4OwnerClass<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> =
        (new(...args) => Play4Owner<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>)
        | Play4OwnerSFC<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>

    export type ResultClass<ICreateParams, IGameState, IPlayerState> =
        (new(...args) => Result<ICreateParams, IGameState, IPlayerState>)
        | ResultSFC<ICreateParams, IGameState, IPlayerState>

    export type Result4OwnerClass<ICreateParams, IGameState, IPlayerState, MoveType, IMoveParams> =
        (new(...args) => Result4Owner<ICreateParams, IGameState, IPlayerState, MoveType, IMoveParams>)
        | Result4OwnerSFC<ICreateParams, IGameState, IPlayerState, MoveType, IMoveParams>
}

export class Request extends BaseRequest {
    private static _instance: Request

    constructor(private namespace: string) {
        super()
    }

    static instance(namespace: string) {
        if (!this._instance) {
            this._instance = new Request(namespace)
        }
        return this._instance
    }

    buildUrl(path: string, params: {} = {}, query: {} = {}): string {
        return super.buildUrl(`/${config.rootName}/${this.namespace}${path}`, params, query)
    }
}

export function registerOnFramework(namespace: string, gameTemplate: IGameTemplate) {
    if (window['BespokeServer']) {
        window['BespokeServer'].registerOnBespoke(gameTemplate)
    } else {
        registerOnElf(namespace, {localeNames: [namespace], ...gameTemplate})
    }
}