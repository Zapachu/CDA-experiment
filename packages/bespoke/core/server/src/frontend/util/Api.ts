import {baseEnum, IGameConfig, IGameThumb, IGameWithId, IMoveLog, ISimulatePlayer, IUserWithId} from 'bespoke-common'
import {IHttpRes, Request} from 'bespoke-client-util'

export const Api = new class {
    get: (path: string, params?: {}, query?: {}) => Promise<any>
    post: (path: string, params?: {}, query?: {}, data?: {}) => Promise<any>

    constructor() {
        this.get = async (path, params, query) => await Request.get(NAMESPACE, path, params, query)
        this.post = async (path, params, query, data) => await Request.post(NAMESPACE, path, params, query, data)
    }

    //region user
    async getVerifyCode(nationCode: baseEnum.NationCode, mobile: string): Promise<IHttpRes & { msg: string }> {
        return await this.get('/user/verifyCode', null, {nationCode, mobile})
    }

    async login(nationCode: baseEnum.NationCode, mobile: string, verifyCode: string): Promise<IHttpRes & { returnToUrl: string }> {
        return await this.post('/user/login', null, null, {nationCode, mobile, verifyCode})
    }

    async getUser(): Promise<IHttpRes & { user: IUserWithId }> {
        return await this.get('/user')
    }

    async logout(): Promise<IHttpRes> {
        return await this.post('/user/logout')
    }

    //endregion
    //region game
    async getGame(gameId: string): Promise<IHttpRes & { game: IGameWithId<any> }> {
        return await this.get('/game/:gameId', {gameId})
    }

    async getHistoryGames(): Promise<IHttpRes & { historyGameThumbs: Array<IGameThumb> }> {
        return await this.get('/game/historyThumb', null)
    }

    async newGame(game: IGameConfig<any>): Promise<IHttpRes & { gameId: string }> {
        return await this.post('/game/new', null, null, {game})
    }

    async shareGame(gameId: string): Promise<IHttpRes & { shareCode: string, title: string }> {
        return await this.get('/game/share/:gameId', {gameId})
    }

    async getSimulatePlayers(gameId: string): Promise<IHttpRes & { simulatePlayers: Array<ISimulatePlayer> }> {
        return await this.get('/game/simulatePlayer/:gameId', {gameId})
    }

    async newSimulatePlayer(gameId: string, name: string): Promise<IHttpRes & { token: string }> {
        return await this.post('/game/simulatePlayer/:gameId', {gameId}, null, {name})
    }

    async joinGameWithCode(code: string): Promise<IHttpRes & { gameId?: string }> {
        return await this.post('/game/joinWithShareCode', null, null, {code})
    }

    async getMoveLogs(gameId: string): Promise<IHttpRes & { moveLogs: IMoveLog<any, any>[] }> {
        return this.get('/game/moveLogs/:gameId', {gameId})
    }

    //end region
}