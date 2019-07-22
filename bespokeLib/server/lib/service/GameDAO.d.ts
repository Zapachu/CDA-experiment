import { IGameConfig, IGameWithId, TGameState, TPlayerState } from '@bespoke/share';
export declare class GameDAO {
    static newGame<ICreateParams>(owner: string, gameConfig: IGameConfig<ICreateParams>): Promise<any>;
    static getGame<ICreateParams>(gameId: string): Promise<IGameWithId<ICreateParams>>;
    static saveGameState(gameId: string, gameState: TGameState<any>): void;
    static savePlayerState(gameId: string, token: string, playerState: TPlayerState<any>): void;
    static queryGameState<IGameState>(gameId: string): Promise<TGameState<IGameState>>;
    static queryPlayerState<IPlayerState>(gameId: string, token: string): Promise<TPlayerState<IPlayerState>>;
    static getPlayerTokens(gameId: string): Promise<Array<string>>;
}
