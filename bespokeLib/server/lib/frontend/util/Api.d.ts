import { IGameConfig, IGameThumb, IGameWithId, IMoveLog, ISimulatePlayer, IUserWithId, NationCode } from '@bespoke/share';
import { IHttpRes } from '@elf/component';
export declare const Api: {
    get: (path: string, params?: {}, query?: {}) => Promise<any>;
    post: (path: string, params?: {}, query?: {}, data?: {}) => Promise<any>;
    getVerifyCode(nationCode: NationCode, mobile: string): Promise<IHttpRes & {
        msg: string;
    }>;
    login(nationCode: NationCode, mobile: string, verifyCode: string): Promise<IHttpRes & {
        returnToUrl: string;
    }>;
    getUser(): Promise<IHttpRes & {
        user: IUserWithId;
    }>;
    logout(): Promise<IHttpRes>;
    getGame(gameId: string): Promise<IHttpRes & {
        game: IGameWithId<any>;
    }>;
    getHistoryGames(): Promise<IHttpRes & {
        historyGameThumbs: IGameThumb[];
    }>;
    newGame(game: IGameConfig<any>): Promise<IHttpRes & {
        gameId: string;
    }>;
    shareGame(gameId: string): Promise<IHttpRes & {
        shareCode: string;
        title: string;
    }>;
    getSimulatePlayers(gameId: string): Promise<IHttpRes & {
        simulatePlayers: ISimulatePlayer[];
    }>;
    newSimulatePlayer(gameId: string, name: string): Promise<IHttpRes & {
        token: string;
    }>;
    joinGameWithCode(code: string): Promise<IHttpRes & {
        gameId?: string;
    }>;
    getMoveLogs(gameId: string): Promise<IHttpRes & {
        moveLogs: IMoveLog<any, any, any, any>[];
    }>;
};
