/// <reference types="express-serve-static-core" />
/// <reference types="express-session" />
/// <reference types="passport" />
import { Request, Response } from 'express';
export declare class UserCtrl {
    static renderApp(req: any, res: Response): Promise<void>;
    static getVerifyCode(req: any, res: any): Promise<void>;
    static handleLogin(req: any, res: Response, next: any): Promise<import("express-serve-static-core").Response>;
    static handleLogout(req: Express.Request, res: Response): Promise<void>;
    static getUser(req: any, res: Response): import("express-serve-static-core").Response;
}
export declare class GameCtrl {
    static getGame(req: any, res: any): Promise<void>;
    static newGame(req: any, res: any): Promise<void>;
    static shareGame(req: any, res: any): Promise<any>;
    static joinWithShareCode(req: any, res: any): Promise<void>;
    static getSimulatePlayers(req: Request, res: any): Promise<void>;
    static newSimulatePlayer(req: any, res: any): Promise<void>;
    static getMoveLogs(req: any, res: any): Promise<void>;
    static getHistoryGameThumbs(req: any, res: any): Promise<void>;
}
