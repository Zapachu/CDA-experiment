declare module 'elf-game/lib/game/common/baseEnum' {
	export enum Language {
	    chinese = 0,
	    english = 1
	}
	export enum ACADEMUS_ROLE {
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
declare module 'elf-game/lib/game/common/interface' {
	import { PhaseStatus, PlayerStatus, Actor } from 'elf-game/lib/game/common/baseEnum';
	import { Socket } from 'socket.io-client';
	export type TSocket = typeof Socket;
	export interface IUser {
	    _csrf: string;
	    orgCode: string;
	    password: string;
	    role: any;
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
	export interface IGroup {
	    gameId: string;
	    size: number;
	    phaseConfigs: Array<IPhaseConfig<{}>>;
	    owner?: string;
	}
	export interface IGroupWithId extends IGroup {
	    id: string;
	}
	export interface IGame {
	    title: string;
	    desc: string;
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

}
declare module 'elf-game/lib/game/common/config' {
	import { LogLevel } from 'elf-game/lib/game/common/baseEnum';
	export const config: {
	    rootName: string;
	    apiPrefix: string;
	    appPrefix: string;
	    socketPath: string;
	    logLevel: LogLevel;
	    academusHomePage: string;
	    cookieKey: {
	        csrf: string;
	    };
	};

}
declare module 'elf-game/lib/game/common' {
	import * as baseEnum from 'elf-game/lib/game/common/baseEnum';
	export { baseEnum };
	export * from 'elf-game/lib/game/common/interface';
	export { config } from 'elf-game/lib/game/common/config';
	export enum CorePhaseNamespace {
	    start = "start",
	    end = "end"
	}

}
declare module 'elf-game/lib/game/client/context' {
	/// <reference types="react" />
	/// <reference types="socket.io-client" />
	import { IGroupState, IGroupWithId, TSocket, IActor } from 'elf-game/lib/game/common';
	export type TRootContext = Partial<{}>;
	export const rootContext: import("react").Context<Partial<{}>>;
	export type TPlayContext = Partial<{
	    group: IGroupWithId;
	    actor: IActor;
	    groupState: IGroupState;
	    socketClient: TSocket;
	}>;
	export const playContext: import("react").Context<Partial<{
	    group: IGroupWithId;
	    actor: IActor;
	    groupState: IGroupState;
	    socketClient: SocketIOClient.Socket;
	}>>;

}
declare module 'elf-game/lib/game/client/util/request' {
	import { baseEnum, IPhaseConfig, IGroupWithId, IActor } from 'elf-game/lib/game/common';
	export function GET(url: string, params?: {}, query?: {}): Promise<any>;
	export function POST(url: string, params?: {}, query?: {}, data?: {}): Promise<any>;
	/******************  API request methods *************************/
	interface IHttpRes {
	    code: baseEnum.ResponseCode;
	}
	export class Request {
	    static getGroup(groupId: string): Promise<IHttpRes & {
	        group: IGroupWithId;
	    }>;
	    static getPhaseTemplates(): Promise<IHttpRes & {
	        templates: Array<{
	            namespace: string;
	            jsUrl: string;
	        }>;
	    }>;
	    static postNewGame(title: string, desc: string): Promise<IHttpRes & {
	        gameId: string;
	    }>;
	    static postNewGroup(gameId: string, size: number, phaseConfigs: Array<IPhaseConfig<{}>>): Promise<IHttpRes & {
	        groupId: string;
	    }>;
	    static getActor(groupId: string, hash: string, token?: string): Promise<IHttpRes & {
	        actor: IActor;
	    }>;
	}
	export {};

}
declare module 'elf-game/lib/game/client/util/fileLoader' {
	export function loadScript(list: Array<string>, callback?: () => any): void;

}
declare module 'elf-game/lib/game/client/util/language' {
	import { baseEnum } from 'elf-game/lib/game/common';
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
declare module 'elf-game/lib/game/client/util' {
	import * as React from "react";
	export { Request as Api } from 'elf-game/lib/game/client/util/request';
	export { loadScript } from 'elf-game/lib/game/client/util/fileLoader';
	export { Lang } from 'elf-game/lib/game/client/util/language';
	export function getCookie(key: string): string;
	export function getCookies(): string[];
	export function genePhaseKey(): string;
	export const connCtx: <C extends {}>(Context: React.Context<C>) => <P, S>(ComponentClass: React.ComponentClass<P & C, S>) => any;
	export function clsNames(...classes: Array<string>): string;

}
declare module 'elf-game/lib/game/client/view/Group/Create' {
	import * as React from 'react';
	import { RouteComponentProps } from 'react-router';
	import { IPhaseConfig } from 'elf-game/lib/game/common';
	import { TRootContext } from 'elf-game/lib/game/client/context'; interface ICreateState {
	    loading: boolean;
	    size: number;
	    phaseConfigs: Array<IPhaseConfig<{}>>;
	    activePhaseKey: string;
	    flowChartSize: number;
	    addAnchorEl?: any;
	    highlightPhaseKeys?: Array<string>;
	    showSnackbar?: boolean;
	}
	export class Create extends React.Component<TRootContext & RouteComponentProps<{
	    gameId: string;
	}>, ICreateState> {
	    readonly defaultState: {
	        size: number;
	        phaseConfigs: any[];
	        activePhaseKey: string;
	        highlightPhaseKeys: any[];
	    };
	    lang: {
	        cancel: string & ((...args: any[]) => string);
	        submit: string & ((...args: any[]) => string);
	        name: string & ((...args: any[]) => string);
	        groupPhases: string & ((...args: any[]) => string);
	        add: string & ((...args: any[]) => string);
	        remove: string & ((...args: any[]) => string);
	        clone: string & ((...args: any[]) => string);
	        title: string & ((...args: any[]) => string);
	        groupInfo: string & ((...args: any[]) => string);
	        groupSize: string & ((...args: any[]) => string);
	        phasePointedByAnotherOne: string & ((...args: any[]) => string);
	    };
	    state: ICreateState;
	    componentDidMount(): Promise<void>;
	    handleNewPhase(namespace: string): void;
	    handleUpdatePhase(i: number, newConfig: Partial<IPhaseConfig<{}>>): void;
	    handleRemovePhase(i: number): void;
	    handleClonePhase(i: number): void;
	    handleSubmit(): Promise<void>;
	    render(): React.ReactNode;
	    renderGroupInfo(): JSX.Element;
	    renderPhases(): JSX.Element;
	    renderFlowChart(): JSX.Element;
	    renderAddBtn(): JSX.Element;
	    renderPhaseEditor(): JSX.Element;
	    renderSnackbars(): JSX.Element;
	}
	export {};

}
declare module 'elf-game/lib/game/client/view/Group/Play/Owner' {
	import * as React from "react";
	import { TPlayContext, TRootContext } from 'elf-game/lib/game/client/context';
	export class Play4Owner extends React.Component<TRootContext & TPlayContext> {
	    lang: {
	        [x: string]: string & ((...args: any[]) => string);
	        phaseStatus: string & ((...args: any[]) => string);
	        playerStatus: string & ((...args: any[]) => string);
	    };
	    render(): React.ReactNode;
	}

}
declare module 'elf-game/lib/game/client/view/Group/Play/Player' {
	import { TPlayContext, TRootContext } from 'elf-game/lib/game/client/context';
	import * as React from "react";
	import { IPhaseState } from 'elf-game/lib/game/common';
	export class Play4Player extends React.Component<TRootContext & TPlayContext> {
	    readonly curPhaseState: IPhaseState;
	    render(): React.ReactNode;
	}

}
declare module 'elf-game/lib/game/client/view/Group/Play' {
	import * as React from "react";
	import { RouteComponentProps } from "react-router";
	import { IGroupState, IGroupWithId, TSocket, IActor } from 'elf-game/lib/game/common';
	import { TRootContext } from 'elf-game/lib/game/client/context'; interface IPlayState {
	    group?: IGroupWithId;
	    actor?: IActor;
	    socketClient?: TSocket;
	    groupState?: IGroupState;
	}
	export class Play extends React.Component<TRootContext & RouteComponentProps<{
	    groupId: string;
	}>, IPlayState> {
	    state: IPlayState;
	    componentDidMount(): Promise<void>;
	    private registerStateReducer;
	    render(): React.ReactNode;
	}
	export {};

}
declare module 'elf-game/lib/game/client/view/Group/CorePhase' {
	export function registerCorePhases(): void;

}
declare module 'elf-game/lib/game/client/view/Group' {
	export { Create } from 'elf-game/lib/game/client/view/Group/Create';
	export { Play } from 'elf-game/lib/game/client/view/Group/Play';
	export { registerCorePhases } from 'elf-game/lib/game/client/view/Group/CorePhase';

}
declare module 'elf-game/lib/game/client/view/Game' {
	import * as React from 'react';
	import { RouteComponentProps } from "react-router-dom";
	import { TRootContext } from 'elf-game/lib/game/client/context'; interface ICreateState {
	    title: string;
	    desc: string;
	}
	export class Create extends React.Component<TRootContext & RouteComponentProps<{}>, ICreateState> {
	    readonly defaultState: ICreateState;
	    state: ICreateState;
	    render(): React.ReactNode;
	    submitGame(): Promise<void>;
	}
	export {};

}
declare module 'elf-game/lib/game/client/view' {
	import * as React from 'react';
	import { TRootContext } from 'elf-game/lib/game/client/context'; interface IRootState extends TRootContext {
	}
	export class Root extends React.Component<{}, IRootState> {
	    componentWillMount(): void;
	    render(): React.ReactNode;
	}
	export {};

}
declare module 'elf-game/lib/game/client/vendor' {
	import { IPhaseConfig } from 'elf-game/lib/game/common';
	import { registerPhaseCreate } from 'elf-game/lib/game/client';
	export interface IElfCreateProps<ICreateParam> {
	    phases: Array<{
	        label: string;
	        key: string;
	        namespace: string;
	    }>;
	    curPhase: IPhaseConfig<ICreateParam>;
	    updatePhase?: (suffixPhaseKeys: Array<string>, param: Partial<ICreateParam>) => void;
	    highlightPhases: (phaseKeys: Array<string>) => void;
	}
	export type TregisterPhaseCreate = typeof registerPhaseCreate;

}
declare module 'elf-game/lib/game/client' {
	import * as React from 'react';
	import { IElfCreateProps } from 'elf-game/lib/game/client/vendor';
	export { Lang } from 'elf-game/lib/game/client/util';
	export { IPhaseConfig, CorePhaseNamespace } from 'elf-game/lib/game/common';
	export class BaseCreate<ICreateParam, State = ICreateParam> extends React.Component<IElfCreateProps<ICreateParam>, State> {
	}
	export interface IPhaseTemplate {
	    namespace?: string;
	    localeNames: Array<string>;
		Create?: typeof BaseCreate;
		type: string
	}
	export const phaseTemplates: {
	    [phase: string]: IPhaseTemplate;
	};
	export function registerPhaseCreate(namespace: string, phaseTemplate: IPhaseTemplate): void;

}
declare module 'elf-game/bin/script/webpack' {
	import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin'; const _default: ({ webpackHmr }: {
	    webpackHmr: boolean;
	}) => {
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
	    mode: string;
	    devtool: string;
	    resolve: {
	        extensions: string[];
	        alias: {
	            '@ant-design/icons/lib/dist$': string;
	        };
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
	            exclude: RegExp[];
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
declare module 'elf-game' {
	import main = require('elf-game/lib/game/client/vendor');
	export = main;
}
