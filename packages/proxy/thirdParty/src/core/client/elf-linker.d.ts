declare module 'elf-linker/common/baseEnum' {
	export enum Language {
	    chinese = "chinese",
	    english = "english"
	}
	export enum AcademusRole {
	    student = 0,
	    teacher = 1
	}
	export enum Role {
	    owner = 0,
	    player = 1
	}
	export enum RequestMethod {
	    get = "get",
	    post = "post"
	}
	export enum ResponseCode {
	    invalidInput = 0,
	    success = 1,
	    notFound = 2,
	    serverError = 3
	}
	export enum Actor {
	    owner = "o",
	    player = "p",
	    clientRobot = "cr",
	    serverRobot = "sr"
	}
	export enum LogLevel {
	    log = 0,
	    trace = 1,
	    debug = 2,
	    info = 3,
	    warn = 4,
	    error = 5,
	    fatal = 6
	}
	export enum SocketEvent {
	    connection = "connection",
	    disconnect = "disconnect",
	    upFrame = "upFrame",
	    downFrame = "downFrame"
	}
	export enum PhaseStatus {
	    playing = 0,
	    paused = 1,
	    closed = 2
	}
	export enum PlayerStatus {
	    playing = 0,
	    left = 1
	}

}
declare module 'elf-linker/common/interface' {
	import { PhaseStatus, PlayerStatus, Actor, AcademusRole } from 'elf-linker/common/baseEnum';
	import { Socket } from 'socket.io-client';
	export type TSocket = typeof Socket;
	export interface IUser {
	    orgCode: string;
	    password: string;
	    role: AcademusRole;
	    name: string;
	    mobile: number;
	}
	export interface IUserWithId extends IUser {
	    id: string;
	}
	export interface IActor {
	    token: string;
	    type: Actor;
	}
	export interface IPhaseConfig<ICreateParam = {}> {
	    namespace: string;
	    key: string;
	    title: string;
	    param: ICreateParam;
	    suffixPhaseKeys: Array<string>;
	}
	export interface IPhaseState {
	    key: string;
	    status: PhaseStatus;
	    playUrl?: string;
	    playerStatus: {
	        [code: string]: PlayerStatus;
	    };
	}
	export interface IBaseGame {
	    title: string;
	    desc: string;
	    owner?: string;
	    published?: boolean;
	    mode: string;
	}
	export interface IBaseGameWithId extends IBaseGame {
	    id: string;
	}
	export interface IGame extends IBaseGame {
	    phaseConfigs: Array<IPhaseConfig<{}>>;
	}
	export interface IGameWithId extends IGame {
	    id: string;
	}
	export interface IGameToUpdate {
	    phaseConfigs?: Array<IPhaseConfig<{}>>;
	    published?: boolean;
	}
	export interface IPlayer {
	    gameId: string;
	    userId: string;
	}
	export interface IPlayerWithId {
	    id: string;
	}
	export interface IGroupState {
	    groupId: string;
	    phaseStates: Array<IPhaseState>;
	}
	export namespace NFrame {
	    enum UpFrame {
	        joinRoom = "joinRoom",
	        leaveRoom = "leaveRoom"
	    }
	    enum DownFrame {
	        syncGroupState = "joinRoom"
	    }
	    interface BaseUpFrame {
	        userId: string;
	        groupId: string;
	    }
	    interface JoinRoom extends BaseUpFrame {
	    }
	    interface JoinFirstPhase extends BaseUpFrame {
	    }
	    interface SyncGroupState {
	        groupState: IGroupState;
	    }
	}
	export type TApiGroupPlayers = Array<{
	    playerId: string;
	    userId: string;
	    name: string;
	}>;

}
declare module 'elf-linker/common/config' {
	import { LogLevel } from 'elf-linker/common/baseEnum';
	export const config: {
	    rootName: string;
	    apiPrefix: string;
	    appPrefix: string;
	    socketPath: string;
	    logLevel: LogLevel;
	    academusLoginRoute: string;
	    cookieKey: {
	        csrf: string;
	    };
	};

}
declare module 'elf-linker/common' {
	import * as baseEnum from 'elf-linker/common/baseEnum';
	export { baseEnum };
	export * from 'elf-linker/common/interface';
	export { config } from 'elf-linker/common/config';
	export enum CorePhaseNamespace {
	    start = "start",
	    end = "end"
	}
	export enum GameMode {
	    easy = "easy",
	    extended = "extended"
	}

}
declare module 'elf-linker/client/context' {
	/// <reference types="react" />
	/// <reference types="socket.io-client" />
	import { IUserWithId, IGroupState, IGameWithId, TSocket, IActor } from 'elf-linker/common';
	export type TRootContext = Partial<{
	    user: IUserWithId;
	}>;
	export const rootContext: import("react").Context<Partial<{
	    user: IUserWithId;
	}>>;
	export type TPlayContext = Partial<{
	    game: IGameWithId;
	    actor: IActor;
	    groupState: IGroupState;
	    socketClient: TSocket;
	}>;
	export const playContext: import("react").Context<Partial<{
	    game: IGameWithId;
	    actor: IActor;
	    groupState: IGroupState;
	    socketClient: SocketIOClient.Socket;
	}>>;

}
declare module 'elf-linker/client/util/request' {
	import { baseEnum, IGameWithId, IActor, IBaseGameWithId, IUserWithId, TApiGroupPlayers, IGameToUpdate } from 'elf-linker/common';
	export function GET(url: string, params?: {}, query?: {}): Promise<any>;
	export function POST(url: string, params?: {}, query?: {}, data?: {}): Promise<any>;
	/******************  API request methods *************************/
	interface IHttpRes {
	    code: baseEnum.ResponseCode;
	}
	export class Request {
	    static getUser(): Promise<IHttpRes & {
	        user: IUserWithId;
	    }>;
	    static getBaseGame(gameId: string): Promise<IHttpRes & {
	        game: IBaseGameWithId;
	    }>;
	    static getGame(gameId: string): Promise<IHttpRes & {
	        game: IGameWithId;
	    }>;
	    static joinGameWithCode(code: string): Promise<IHttpRes & {
	        gameId?: string;
	    }>;
	    static joinGame(gameId: string): Promise<IHttpRes>;
	    static getPlayers(gameId: string): Promise<IHttpRes & {
	        players: TApiGroupPlayers;
	    }>;
	    static getGameList(): Promise<IHttpRes & {
	        gameList: Array<IGameWithId>;
	    }>;
	    static getPhaseTemplates(): Promise<IHttpRes & {
	        templates: Array<{
	            namespace: string;
	            jsUrl: string;
	        }>;
	    }>;
	    static postNewGame(title: string, desc: string, mode: string): Promise<IHttpRes & {
	        gameId: string;
	    }>;
	    static postEditGame(gameId: string, toUpdate: IGameToUpdate): Promise<IHttpRes & {
	        game: IGameWithId;
	    }>;
	    static shareGame(gameId: string): Promise<IHttpRes & {
	        shareCode: string;
	        title: string;
	    }>;
	    static getActor(gameId: string, token?: string): Promise<IHttpRes & {
	        actor: IActor;
	    }>;
	}
	export {};

}
declare module 'elf-linker/client/util/fileLoader' {
	export function loadScript(list: Array<string>, callback?: () => any): any;

}
declare module 'elf-linker/client/util/language' {
	import { baseEnum } from 'elf-linker/common';
	import Language = baseEnum.Language;
	export const languageNames: baseEnum.Language[];
	export class Lang {
	    static languageName: Language;
	    static switchListeners: Array<() => void>;
	    static extractLang<TLangDict>(LangDict: TLangDict): {
	        [K in keyof TLangDict]: (string & ((...args: any[]) => string));
	    };
	    static switchLang(lang: Language): void;
	}

}
declare module 'elf-linker/client/util' {
	import * as React from "react";
	export { Request as Api } from 'elf-linker/client/util/request';
	export { loadScript } from 'elf-linker/client/util/fileLoader';
	export { Lang, languageNames } from 'elf-linker/client/util/language';
	export function getCookie(key: string): string;
	export function getCookies(): string[];
	export function genePhaseKey(): string;
	export const connCtx: <C extends {}>(Context: React.Context<C>) => <P, S>(ComponentClass: React.ComponentClass<P & C, S>) => any;
	export function clsNames(...classes: Array<string>): string;

}
declare module 'elf-linker/client/component/Label' {
	import * as React from 'react';
	export const Label: React.SFC<{
	    label: string;
	}>;

}
declare module 'elf-linker/client/component/Breadcrumb' {
	import * as React from 'react';
	import { History } from 'history';
	interface IBreadcrumbProps {
	    history: History;
	    links: Array<{
	        to: string;
	        label: string;
	    }>;
	}
	export const Breadcrumb: React.SFC<IBreadcrumbProps>;
	export {};

}
declare module 'elf-linker/client/component/Loading' {
	import * as React from 'react';
	export const Loading: React.SFC<{
	    label?: string;
	}>;

}
declare module 'elf-linker/client/component/Title' {
	import * as React from 'react';
	export const Title: React.SFC<{
	    label: string;
	}>;

}
declare module 'elf-linker/client/component/CodePanel' {
	import * as React from "react"; interface ICodePanelProps {
	    number: number;
	    onFinish: (code: string) => void;
	    goBack: () => void;
	} interface ICodePanelState {
	    code: Array<string>;
	    active: number;
	    focus: number;
	    inputValue: string;
	}
	export class CodePanel extends React.Component<ICodePanelProps, ICodePanelState> {
	    state: ICodePanelState;
	    readonly codeStr: string;
	    componentDidMount(): void;
	    componentWillUnmount(): void;
	    handleKeyDown: (e: any) => void;
	    handleClick(): void;
	    handleItemClick(i: any, e: any): void;
	    render(): JSX.Element;
	    setCode(key: string): false | void;
	    del(): void;
	}
	export {};

}
declare module 'elf-linker/client/component/LanguageSwitcher' {
	import * as React from 'react';
	export const LanguageSwitcher: React.SFC;

}
declare module 'elf-linker/client/view/Group/Create' {
	import * as React from 'react';
	import { RouteComponentProps } from 'react-router';
	import { IPhaseConfig, GameMode } from 'elf-linker/common';
	import { TRootContext } from 'elf-linker/client/context'; interface ICreateState {
	    loading: boolean;
	    activePhaseKey: string;
	    highlightPhaseKeys?: Array<string>;
	    showSvgModal: boolean;
	    showAddPhaseModal: boolean;
	    phaseConfigs: Array<IPhaseConfig<{
	        [key: string]: string;
	    }>>;
	    published: boolean;
	    mode: string;
	}
	export class Create extends React.Component<TRootContext & RouteComponentProps<{
	    gameId: string;
	}>, ICreateState> {
	    private mode;
	    readonly defaultState: {
	        activePhaseKey: string;
	        highlightPhaseKeys: any[];
	        showSvgModal: boolean;
	        showAddPhaseModal: boolean;
	        phaseConfigs: any[];
	        published: boolean;
	        mode: GameMode;
	    };
	    lang: {
	        addPhase: string & ((...args: any[]) => string);
	        startPhase: string & ((...args: any[]) => string);
	        start: string & ((...args: any[]) => string);
	        end: string & ((...args: any[]) => string);
	        goBack: string & ((...args: any[]) => string);
	        cancel: string & ((...args: any[]) => string);
	        submit: string & ((...args: any[]) => string);
	        name: string & ((...args: any[]) => string);
	        groupPhases: string & ((...args: any[]) => string);
	        add: string & ((...args: any[]) => string);
	        remove: string & ((...args: any[]) => string);
	        clone: string & ((...args: any[]) => string);
	        title: string & ((...args: any[]) => string);
	        desc: string & ((...args: any[]) => string);
	        groupInfo: string & ((...args: any[]) => string);
	        phasePointedByAnotherOne: string & ((...args: any[]) => string);
	        createSuccess: string & ((...args: any[]) => string);
	        view: string & ((...args: any[]) => string);
	        console: string & ((...args: any[]) => string);
	        newGroup: string & ((...args: any[]) => string);
	        goPublish: string & ((...args: any[]) => string);
	        lackPhaseConfigs: string & ((...args: any[]) => string);
	        lackStartPhase: string & ((...args: any[]) => string);
	    };
	    state: ICreateState;
	    componentDidMount(): void;
	    fetchPhaseTemplates: () => Promise<null>;
	    fetchGame: () => Promise<null>;
	    handleNewPhase: (newPhase: IPhaseConfig<{}>) => void;
	    handleUpdatePhase(i: number, newConfig: Partial<IPhaseConfig<{}>>): void;
	    handleRemovePhase(i: number): void;
	    handleClonePhase(i: number): void;
	    handleStartPhase(key: string): void;
	    handleSubmit(): Promise<any>;
	    renderButtons: () => JSX.Element;
	    render(): React.ReactNode;
	    renderPhases(): JSX.Element;
	    renderPhaseEditor(curPhaseIndex: number): JSX.Element;
	}
	export const PhaseFlowChart: React.SFC<{
	    phaseConfigs: Array<IPhaseConfig<{}>>;
	    onClickPhase: (phaseKey: string) => void;
	    highlightPhaseKeys?: Array<string>;
	}>;
	export {};

}
declare module 'elf-linker/client/view/Group/Play/Owner' {
	import * as React from 'react';
	import { TPlayContext, TRootContext } from 'elf-linker/client/context';
	import { History } from 'history';
	export class Play4Owner extends React.Component<TRootContext & TPlayContext & {
	    history: History;
	}> {
	    lang: {
	        [x: string]: string & ((...args: any[]) => string);
	        groupConfiguration: string & ((...args: any[]) => string);
	        share: string & ((...args: any[]) => string);
	        playerList: string & ((...args: any[]) => string);
	        phaseStatus: string & ((...args: any[]) => string);
	        console: string & ((...args: any[]) => string);
	        playerStatus: string & ((...args: any[]) => string);
	    };
	    render(): React.ReactNode;
	}

}
declare module 'elf-linker/client/view/Group/Play/Player' {
	import { TPlayContext, TRootContext } from 'elf-linker/client/context';
	import * as React from "react";
	import { IPhaseState } from 'elf-linker/common';
	export class Play4Player extends React.Component<TRootContext & TPlayContext> {
	    readonly curPhaseState: IPhaseState;
	    render(): React.ReactNode;
	}

}
declare module 'elf-linker/client/view/Group/Play' {
	import * as React from "react";
	import { RouteComponentProps } from "react-router";
	import { IGroupState, IGameWithId, TSocket, IActor } from 'elf-linker/common';
	import { TRootContext } from 'elf-linker/client/context'; interface IPlayState {
	    game?: IGameWithId;
	    actor?: IActor;
	    socketClient?: TSocket;
	    groupState?: IGroupState;
	}
	export class Play extends React.Component<TRootContext & RouteComponentProps<{
	    gameId: string;
	}>, IPlayState> {
	    state: IPlayState;
	    componentDidMount(): Promise<void>;
	    private registerStateReducer;
	    render(): React.ReactNode;
	}
	export {};

}
declare module 'elf-linker/client/view/Group/Configuration' {
	import * as React from 'react';
	import { IGameWithId } from 'elf-linker/common';
	import { RouteComponentProps } from 'react-router'; interface IInfoState {
	    loading: boolean;
	    game?: IGameWithId;
	    activePhaseKey?: string;
	}
	export class Configuration extends React.Component<RouteComponentProps<{
	    gameId: string;
	}>, IInfoState> {
	    lang: {
	        back2Game: string & ((...args: any[]) => string);
	        console: string & ((...args: any[]) => string);
	        title: string & ((...args: any[]) => string);
	        desc: string & ((...args: any[]) => string);
	        groupInfo: string & ((...args: any[]) => string);
	        groupPhases: string & ((...args: any[]) => string);
	    };
	    state: IInfoState;
	    componentDidMount(): Promise<void>;
	    render(): React.ReactNode;
	    renderActivePhaseModal(): JSX.Element;
	}
	export {};

}
declare module 'elf-linker/client/view/Group/Share' {
	import * as React from 'react';
	import { RouteComponentProps } from 'react-router-dom'; interface IShareState {
	    shareCode: string;
	    title: string;
	}
	export class Share extends React.Component<RouteComponentProps<{
	    gameId: string;
	}>, IShareState> {
	    state: IShareState;
	    lang: {
	        groupInfo: string & ((...args: any[]) => string);
	        console: string & ((...args: any[]) => string);
	        shareCode: string & ((...args: any[]) => string);
	        failed2GeneShareCode: string & ((...args: any[]) => string);
	    };
	    componentDidMount(): Promise<void>;
	    render(): React.ReactNode;
	}
	export {};

}
declare module 'elf-linker/client/view/Group/Info' {
	import * as React from 'react';
	import { IBaseGameWithId } from 'elf-linker/common';
	import { RouteComponentProps } from 'react-router';
	import { TRootContext } from 'elf-linker/client/context'; interface IInfoState {
	    loading: boolean;
	    game?: IBaseGameWithId;
	}
	export class Info extends React.Component<TRootContext & RouteComponentProps<{
	    gameId: string;
	}>, IInfoState> {
	    lang: {
	        back2Game: string & ((...args: any[]) => string);
	        enterPlayRoom: string & ((...args: any[]) => string);
	        joinGroup: string & ((...args: any[]) => string);
	        joinSuccess: string & ((...args: any[]) => string);
	        share: string & ((...args: any[]) => string);
	        playerList: string & ((...args: any[]) => string);
	    };
	    state: IInfoState;
	    componentDidMount(): Promise<void>;
	    render(): React.ReactNode;
	}
	export {};

}
declare module 'elf-linker/client/view/Group/Join' {
	import * as React from 'react';
	import { RouteComponentProps } from 'react-router-dom';
	export class Join extends React.Component<RouteComponentProps<{}>> {
	    lang: {
	        joinGame: string & ((...args: any[]) => string);
	        notFound: string & ((...args: any[]) => string);
	        tips: string & ((...args: any[]) => string);
	    };
	    joinGame(code: string): Promise<void>;
	    render(): React.ReactNode;
	}

}
declare module 'elf-linker/client/view/Group/PlayerList' {
	import * as React from 'react';
	import { RouteComponentProps } from 'react-router';
	import { TApiGroupPlayers } from 'elf-linker/common';
	interface IPlayerListState {
	    players: TApiGroupPlayers;
	}
	export class PlayerList extends React.Component<RouteComponentProps<{
	    gameId: string;
	}>, IPlayerListState> {
	    lang: {
	        console: string & ((...args: any[]) => string);
	        groupPlayers: string & ((...args: any[]) => string);
	    };
	    state: IPlayerListState;
	    componentDidMount(): Promise<void>;
	    render(): React.ReactNode;
	}
	export {};

}
declare module 'elf-linker/client/view/WithTab' {
	/// <reference types="react" />
	export enum NAV {
	    basic = 0,
	    group = 1,
	    publish = 2
	}
	export const withTab: (Component: any, nav: NAV, created?: boolean) => (props: any) => JSX.Element;

}
declare module 'elf-linker/client/view/Group/CorePhase' {
	export function registerCorePhases(): void;

}
declare module 'elf-linker/client/view/Group' {
	import * as React from 'react';
	import { RouteComponentProps } from 'react-router'; type IGroupProps = RouteComponentProps<{}>;
	export const Group: React.SFC<IGroupProps>;
	export { registerCorePhases } from 'elf-linker/client/view/Group/CorePhase';

}
declare module 'elf-linker/client/view/Game/List' {
	import * as React from 'react';
	import { RouteComponentProps } from 'react-router';
	import { IGameWithId } from 'elf-linker/common';
	interface IGameListState {
	    gameList: Array<IGameWithId>;
	}
	export class GameList extends React.Component<RouteComponentProps<{}>, IGameListState> {
	    lang: {
	        createdGames: string & ((...args: any[]) => string);
	        create: string & ((...args: any[]) => string);
	        view: string & ((...args: any[]) => string);
	        title: string & ((...args: any[]) => string);
	        desc: string & ((...args: any[]) => string);
	        cancel: string & ((...args: any[]) => string);
	        submit: string & ((...args: any[]) => string);
	        published: string & ((...args: any[]) => string);
	        unpublished: string & ((...args: any[]) => string);
	    };
	    state: IGameListState;
	    componentDidMount(): Promise<void>;
	    render(): React.ReactNode;
	}
	export {};

}
declare module 'elf-linker/client/view/Game/Info' {
	import * as React from 'react';
	import { RouteComponentProps } from 'react-router';
	interface IInfoState {
	    loading: boolean;
	    title: string;
	    desc: string;
	    created: boolean;
	    mode: string;
	}
	export class Info extends React.Component<RouteComponentProps<{
	    gameId: string;
	}>, IInfoState> {
	    lang: {
	        title: string & ((...args: any[]) => string);
	        desc: string & ((...args: any[]) => string);
	        save: string & ((...args: any[]) => string);
	        lackInfo: string & ((...args: any[]) => string);
	        extendedMode: string & ((...args: any[]) => string);
	    };
	    state: IInfoState;
	    componentDidMount(): Promise<void>;
	    submitGame(): Promise<any>;
	    render(): React.ReactNode;
	}
	export {};

}
declare module 'elf-linker/client/view/Game' {
	import * as React from 'react';
	import { RouteComponentProps } from 'react-router'; type IGameProps = RouteComponentProps<{}>;
	export const Game: React.SFC<IGameProps>;
	export {};

}
declare module 'elf-linker/client/view' {
	import * as React from 'react';
	import { TRootContext } from 'elf-linker/client/context'; interface IRootState extends TRootContext {
	}
	export class Root extends React.Component<{}, IRootState> {
	    componentWillMount(): void;
	    state: IRootState;
	    componentDidMount(): Promise<void>;
	    render(): React.ReactNode;
	}
	export {};

}
declare module 'elf-linker/client/vendor' {
	import { IPhaseConfig } from 'elf-linker/common';
	export { registerPhaseCreate, IPhaseTemplate } from 'elf-linker/client';
	export interface IElfCreateProps<ICreateParam> {
	    phases: Array<{
	        label: string;
	        key: string;
	        namespace: string;
	    }>;
	    curPhase: IPhaseConfig<ICreateParam>;
	    updatePhase: (suffixPhaseKeys: Array<string>, param: Partial<ICreateParam>) => void;
	    highlightPhases: (phaseKeys: Array<string>) => void;
	}

}
declare module 'elf-linker/client' {
	import * as React from 'react';
	import { IElfCreateProps } from 'elf-linker/client/vendor';
	export { Lang } from 'elf-linker/client/util';
	export { IPhaseConfig, CorePhaseNamespace } from 'elf-linker/common';
	export class BaseCreate<ICreateParam, State = ICreateParam> extends React.Component<IElfCreateProps<ICreateParam>, State> {
	    render(): any;
	}
	export interface IPhaseTemplate {
	    namespace?: string;
	    localeNames: Array<string>;
	    Create?: typeof BaseCreate;
	    type: 'bespoke' | 'otree' | 'qualtrics' | 'qqwj' | 'wjx';
	    otreeName?: string;
	}
	export const phaseTemplates: {
	    [phase: string]: IPhaseTemplate;
	};
	export function registerPhaseCreate(namespace: string, phaseTemplate: IPhaseTemplate): void;

}
declare module 'elf-linker/client/script/buildDts' {
	export {};

}
declare module 'elf-linker/client/script/webpack' {
	import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin'; const _default: ({ webpackHmr }: {
	    webpackHmr: boolean;
	}) => {
	    mode: string;
	    devtool: string;
	    watch: boolean;
	    watchOptions: {
	        poll: boolean;
	    };
	    entry: {
	        'coreCommon': string[];
	        'elfCore': string[];
	    };
	    output: {
	        path: string;
	        filename: string;
	        library: string;
	        libraryTarget: string;
	        publicPath: string;
	    };
	    resolve: {
	        extensions: string[];
	        alias: {};
	        plugins: TsconfigPathsPlugin[];
	    };
	    module: {
	        rules: ({
	            test: RegExp;
	            loader: string;
	            options: {
	                transpileOnly: boolean;
	                getCustomTransformers: () => {
	                    before: import("typescript").TransformerFactory<import("typescript").SourceFile>[];
	                };
	                compilerOptions: {
	                    module: string;
	                };
	            };
	            exclude: RegExp;
	            use?: undefined;
	        } | {
	            test: RegExp;
	            exclude: RegExp;
	            use: (string | {
	                loader: string;
	                options: {
	                    includePaths: string[];
	                };
	            })[];
	            loader?: undefined;
	            options?: undefined;
	        } | {
	            test: RegExp;
	            use: string[];
	            loader?: undefined;
	            options?: undefined;
	            exclude?: undefined;
	        } | {
	            test: RegExp;
	            exclude: RegExp;
	            use: string;
	            loader?: undefined;
	            options?: undefined;
	        })[];
	    };
	    externals: {
	        'react': string;
	        'react-dom': string;
	    };
	    plugins: any[];
	};
	export = _default;

}
declare module 'elf-linker' {
	import main = require('elf-linker/client/vendor');
	export = main;
}
