import * as baseEnum from './baseEnum'
import {IActor, IGameConfig, IGameThumb, IGameWithId, IMoveLog, ISimulatePlayer, IUserWithId} from './interface'
import {config} from './config'
import * as queryString from 'query-string'

interface IHttpRes {
    code: baseEnum.ResponseCode
}

export function buildUrl(pathFragment: string, params = {}, query = {}): string {
    let path = `/${config.rootName}/${config.apiPrefix}${pathFragment}`
    if (params) {
        path = path.replace(/:([\w\d]+)/, (matchedParam, paramName) => params[paramName])
    }
    return `${path}?${queryString.stringify(query)}`
}

export class Request {
    private readonly get: (path: string, params?: {}, query?: {}) => Promise<any>
    private readonly post: (path: string, params?: {}, query?: {}, data?: {}) => Promise<any>

    constructor(get: (url: string) => Promise<any>,
                post: (url: string, data?: {}) => Promise<any>) {
        this.get = async (path: string, params?: {}, query?: {}) => await get(buildUrl(path, params, query))
        this.post = async (path: string, params?: {}, query?: {}, data?: {}) => await post(buildUrl(path, params, query), data)
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
    async getAccessibleTemplates(): Promise<IHttpRes & { namespaces: Array<string> }> {
        return await this.get('/game/accessibleTemplates')
    }

    async getGameTemplateUrl(): Promise<IHttpRes & { jsUrl: string }> {
        return await this.get('/game/gameTemplateUrl')
    }

    async getHistoryGames(namespace?: string): Promise<IHttpRes & { historyGameThumbs: Array<IGameThumb> }> {
        return await this.get('/game/historyThumb', null, {namespace})
    }

    async newGame(game: IGameConfig<any>, namespace: string): Promise<IHttpRes & { gameId: string }> {
        return await this.post('/game/new', null, null, {game, namespace})
    }

    async getGame(gameId: string): Promise<IHttpRes & { game: IGameWithId<any> }> {
        return await this.get('/game/:gameId', {gameId})
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

    async getActor(gameId: string, hash: string, token: string = ''): Promise<IHttpRes & { actor: IActor }> {
        return await this.get('/game/actor/:gameId', {gameId}, {hash, token})
    }

    async getMoveLogs(gameId: string): Promise<IHttpRes & { moveLogs: IMoveLog<any, any>[] }> {
        return this.get('/game/moveLogs/:gameId', {gameId})
    }

    //region passthrough
    async getFromNamespace(namespace: string, type: string, params: {}) {
        return await this.get('/game/pass2Namespace/:namespace', {namespace}, {type, ...params})
    }

    async postToNamespace(namespace: string, type: string, params: {}) {
        return await this.post('/game/pass2Namespace/:namespace', {namespace}, {type, ...params})
    }

    async getFromeGame(gameId: string, type: string, params: {}) {
        return await this.get('/game/pass2Game/:gameId', {gameId}, {type, ...params})
    }

    async postToGame(gameId: string, type: string, params: {}) {
        return await this.post('/game/pass2Game/:gameId', {gameId}, {type, ...params})
    }

    //endregion
    //endregion
}