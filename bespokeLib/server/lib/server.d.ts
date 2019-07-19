import * as Express from 'express';
import { IGameConfig, IStartOption } from '@bespoke/share';
import { AnyLogic } from './service';
export declare class Server {
    private static sessionMiddleware;
    private static initMongo;
    private static initSessionMiddleware;
    private static initExpress;
    private static initPassPort;
    private static bindServerListener;
    private static withLinker;
    static start(namespace: string, Logic: new (...args: any[]) => AnyLogic, staticPath: string, bespokeRouter?: Express.Router, startOption?: IStartOption): void;
    static newGame<ICreateParams>(gameConfig: IGameConfig<ICreateParams>): Promise<string>;
}
