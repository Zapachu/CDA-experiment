import * as baseEnum from './baseEnum'
import {IGameConfig, IGameThumb, IGameWithId, IMoveLog, ISimulatePlayer, IUserWithId} from './interface'
import {config} from './config'
import * as queryString from 'query-string'

interface IHttpRes {
    code: baseEnum.ResponseCode
}

export class Request {
    private readonly get: (path: string, params?: {}, query?: {}) => Promise<any>
    private readonly post: (path: string, params?: {}, query?: {}, data?: {}) => Promise<any>

    constructor(public namespace: string, get: (url: string) => Promise<any>,
                post: (url: string, data?: {}) => Promise<any>) {
        this.get = async (path, params, query) => await get(this.buildUrl(path, params, query))
        this.post = async (path, params, query, data) => await post(this.buildUrl(path, params, query), data)
    }

    buildUrl(pathFragment: string, params = {}, query = {}): string {
        let path = `/${config.rootName}/${this.namespace}/${config.apiPrefix}${pathFragment}`
        if (params) {
            path = path.replace(/:([\w\d]+)/, (matchedParam, paramName) => params[paramName])
        }
        return `${path}?${queryString.stringify(query)}`
    }

    //region /
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

    //endregion
    //endregion
    //region /namespace
    async getGame(gameId: string): Promise<IHttpRes & { game: IGameWithId<any> }> {
        return await this.get('/game/:gameId', {gameId})
    }

    async getFromNamespace(type: string, params: {}) {
        return await this.get(`/pass2Namespace`, null, {type, ...params})
    }

    async postToNamespace(type: string, params: {}) {
        return await this.post(`/pass2Namespace`, null, {type, ...params})
    }

    async getFromGame(gameId: string, type: string, params: {}) {
        return await this.get(`/pass2Game/:gameId`, {gameId}, {type, ...params})
    }

    async postToGame(gameId: string, type: string, params: {}) {
        return await this.post(`/pass2Game/:gameId`, {gameId}, {type, ...params})
    }

    //endregion
}
