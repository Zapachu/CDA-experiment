import {config, baseEnum, IPhaseConfig, IGroupWithId, IActor, IGameWithId, IBaseGroupWithId, IUserWithId, TApiGroupPlayers} from '@common'
import {getCookie} from '@client-util'
import * as queryString from 'query-string'

const baseFetchOption = {
    credentials: 'include',
    method: baseEnum.RequestMethod.get,
    headers: {'Content-Type': 'application/json; charset=utf-8'},
    cache: 'default'
}

async function request(url, method: baseEnum.RequestMethod = baseEnum.RequestMethod.get, data = null): Promise<any> {
    let option = {
        ...baseFetchOption,
        method,
        ...(data ? {body: JSON.stringify(data)} : {})
    } as RequestInit
    const res = await fetch(`/${config.rootName}${url}`, option)
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
        baseEnum.RequestMethod.post, {...data, _csrf: getCookie(config.cookieKey.csrf)})
}

/******************  API request methods *************************/
interface IHttpRes {
    code: baseEnum.ResponseCode
}

export class Request {
    static async getUser(): Promise<IHttpRes & { user: IUserWithId }> {
        return await GET('/user')
    }

    static async postNewGame(title: string, desc: string): Promise<IHttpRes & {
        gameId: string
    }> {
        return await POST('/game/create', null, null, {
            title, desc
        })
    }

    static async getGame(gameId: string): Promise<IHttpRes & { game: IGameWithId }> {
        return await GET('/game/:gameId', {gameId})
    }

    static async getGameList(): Promise<IHttpRes & { gameList: Array<IGameWithId> }> {
        return await GET('/game/list')
    }

    static async getBaseGroup(groupId: string): Promise<IHttpRes & {
        group: IBaseGroupWithId
    }> {
        return await GET('/group/baseInfo/:groupId', {groupId})
    }

    static async getGroup(groupId: string): Promise<IHttpRes & {
        group: IGroupWithId
    }> {
        return await GET('/group/:groupId', {groupId})
    }

    static async joinGameWithCode(code: string): Promise<IHttpRes & { groupId?: string }> {
        return await POST('/group/joinWithShareCode', null, null, {code})
    }

    static async joinGroup(groupId: string):Promise<IHttpRes>{
        return await POST('/group/join/:groupId',{groupId})
    }

    static async getPlayers(groupId: string):Promise<IHttpRes & {players:TApiGroupPlayers}>{
        return await GET('/group/getPlayers/:groupId',{groupId})
    }

    static async getGroupList(gameId: string): Promise<IHttpRes & { groupList: Array<IGroupWithId> }> {
        return await GET('/group/list/:gameId', {gameId})
    }

    static async getPhaseTemplates(): Promise<IHttpRes & {
        templates: Array<{ namespace: string, jsUrl: string }>
    }> {
        return await GET('/group/phaseTemplates')
    }

    static async postNewGroup(gameId: string, title: string, desc: string, phaseConfigs: Array<IPhaseConfig<{}>>): Promise<IHttpRes & {
        groupId: string
    }> {
        return await POST('/group/create/:gameId', {gameId}, null, {
            title, desc, phaseConfigs
        })
    }

    static async shareGroup(groupId: string): Promise<IHttpRes & { shareCode: string, title: string }> {
        return await GET('/group/share/:groupId', {groupId})
    }

    static async getActor(groupId: string, token: string = ''): Promise<IHttpRes & { actor: IActor }> {
        return await GET('/group/actor/:groupId', {groupId}, {token})
    }

}
