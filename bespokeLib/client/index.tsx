import * as React from 'react'
import {config, FrameEmitter, IGameWithId, TGameState, TPlayerState} from '@bespoke/share'
import {registerOnElf, Template} from '@elf/client'
import {BaseRequest, Lang} from '@elf/component'

export interface IGameTemplate<ICreateParams = {}, IGameState = {}, IPlayerState = {}, MoveType = any, PushType = any, IMoveParams = {}, IPushParams = {}> {
    namespace?: string
    localeNames?: Array<string>
    Create?: React.ComponentType<Core.ICreateProps<ICreateParams>>
    Play: React.ComponentType<Core.IPlayProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>>
    Play4Owner?: React.ComponentType<Core.IPlay4OwnerProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>>
    Result?: React.ComponentType<Core.IResultProps<ICreateParams, IGameState, IPlayerState>>
    Result4Owner?: React.ComponentType<Core.IResult4OwnerProps<ICreateParams, IGameState, IPlayerState, MoveType, IMoveParams>>
}

export namespace Core {
    function EmptyPage(props: { label: string[] }) {
        return <div style={{
            fontSize: '2rem',
            margin: '2rem',
            textAlign: 'center',
            color: '#999'
        }}>{Lang.extractLang(props).label}</div>
    }

    export type TCreateParams<ICreateParams> = Template.TCreateParams<ICreateParams>
    export type TSetCreateParams<ICreateParams> = Template.TSetCreateParams<ICreateParams>

    export type ICreateProps<ICreateParams> = Template.ICreateProps<ICreateParams>

    export class Create<ICreateParams, S = {}> extends Template.Create<ICreateParams, S> {
        render(): React.ReactNode {
            return <EmptyPage label={['无可配置参数', 'No parameters to config']}/>
        }
    }

    export interface IPlayProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
        game: IGameWithId<ICreateParams>,
        frameEmitter: FrameEmitter<MoveType, PushType, IMoveParams, IPushParams>
        playerState: TPlayerState<IPlayerState>
        gameState: TGameState<IGameState>
    }

    export interface IPlay4OwnerProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams> {
        game: IGameWithId<ICreateParams>,
        frameEmitter: FrameEmitter<MoveType, PushType, IMoveParams, IPushParams>
        gameState: TGameState<IGameState>,
        playerStates: { [token: string]: TPlayerState<IPlayerState> }
    }

    export interface IResultProps<ICreateParams, IGameState, IPlayerState> {
        game: IGameWithId<ICreateParams>
        gameState: TGameState<IGameState>,
        playerState: TPlayerState<IPlayerState>
    }

    export interface IResult4OwnerProps<ICreateParams, IGameState, IPlayerState, MoveType, IMoveParams> {
        game: IGameWithId<ICreateParams>,
        travelStates: Array<{
            token: string
            type: MoveType
            params: IMoveParams
            gameState: TGameState<IGameState>,
            playerStates: { [token: string]: TPlayerState<IPlayerState> }
        }>
    }

    export class Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, S = {}>
        extends React.Component<IPlayProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>, S> {
        render(): React.ReactNode {
            return <EmptyPage label={['实验进行中', 'Playing...']}/>
        }
    }

    export class Play4Owner<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, S = {}>
        extends React.Component<IPlay4OwnerProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>, S> {
        render(): React.ReactNode {
            return <EmptyPage label={['实验进行中', 'Playing...']}/>
        }
    }

    export class Result<ICreateParams, IGameState, IPlayerState, S = {}>
        extends React.Component<IResultProps<ICreateParams, IGameState, IPlayerState>, S> {
        render(): React.ReactNode {
            return <EmptyPage label={['实验已结束', 'GAME OVER']}/>
        }
    }

    export class Result4Owner<ICreateParams, IGameState, IPlayerState, MoveType, IMoveParams, S = {}>
        extends React.Component<IResult4OwnerProps<ICreateParams, IGameState, IPlayerState, MoveType, IMoveParams>, S> {
        render(): React.ReactNode {
            return <EmptyPage label={['实验已结束', 'GAME OVER']}/>
        }
    }
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