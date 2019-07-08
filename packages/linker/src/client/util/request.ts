import {config, IBaseGameWithId, IGameWithId, ILinkerActor, IUserWithId, RequestMethod} from '@common'
import {getCookie} from '@client-util'
import * as queryString from 'query-string'
import {ResponseCode} from '@elf/share'

const baseFetchOption = {
    credentials: 'include',
    method: RequestMethod.get,
    headers: {'Content-Type': 'application/json; charset=utf-8'},
    cache: 'default'
}

async function request(url, method: RequestMethod = RequestMethod.get, data = null): Promise<any> {
    let option = {
        ...baseFetchOption,
        method,
        ...(data ? {body: JSON.stringify(data)} : {})
    } as RequestInit
    const res = await fetch(url.match(/^\/v5|admindev/) ? url : `/${config.rootName}${url}`, option)
    if (res.ok) {
        return res.json()
    }
}

function buildPath(pathFragment, params) {
    const path = `/${config.apiPrefix}${pathFragment}`
    if (!params) {
        return path
    }
    return path.replace(/:([\w\d]+)/, (matchedParam, paramName) => {
        if (params[paramName] === undefined) {
            throw new Error(`could not build path ("${path}") - param "${paramName}" does not exist`)
        }
        return params[paramName]
    })
}

export async function GET(url: string, params = {}, query = {}): Promise<any> {
    return await request(`${buildPath(url, params)}?${queryString.stringify(query)}`)
}

export async function POST(url: string, params = {}, query = {}, data = {}): Promise<any> {
    return await request(`${buildPath(url, params)}?${queryString.stringify(query)}`,
        RequestMethod.post, {...data, _csrf: getCookie(config.cookieKey.csrf)})
}

/******************  API request methods *************************/
interface IHttpRes {
    code: ResponseCode
}

interface ITemplateRegInfo {
    namespace: string,
    jsUrl: string,
    type: string
}

export class Request {
    static async getUser(): Promise<IHttpRes & { user: IUserWithId }> {
        return await GET('/user')
    }

    static async getBaseGame(gameId: string): Promise<IHttpRes & {
        game: IBaseGameWithId
    }> {
        return await GET('/game/baseInfo/:gameId', {gameId})
    }

    static async getGame(gameId: string): Promise<IHttpRes & {
        game: IGameWithId
    }> {
        return await GET('/game/:gameId', {gameId})
    }

    static async joinGameWithCode(code: string): Promise<IHttpRes & { gameId?: string }> {
        return await POST('/game/joinWithShareCode', null, null, {code})
    }

    static async joinGame(gameId: string): Promise<IHttpRes> {
        return await POST('/game/join/:gameId', {gameId})
    }

    static async getGameList(page: number = 0): Promise<IHttpRes & { gameList: Array<IGameWithId>, count: number }> {
        return await GET('/game/list', {}, {page})
    }

    static async getPhaseTemplates(): Promise<IHttpRes & {
        templates: Array<ITemplateRegInfo>
    }> {
        return await GET('/game/phaseTemplates')
    }

    static async postNewGame(title: string, desc: string, namespace: string, param: {}): Promise<IHttpRes & {
        gameId: string
    }> {
        return await POST('/game/create', null, null, {
            title, desc, namespace, param
        })
    }

    static async shareGame(gameId: string): Promise<IHttpRes & { shareCode: string, title: string }> {
        return await GET('/game/share/:gameId', {gameId})
    }

    static async getActor(gameId: string, token: string = ''): Promise<IHttpRes & { actor: ILinkerActor }> {
        return await GET('/game/actor/:gameId', {gameId}, {token})
    }
}
