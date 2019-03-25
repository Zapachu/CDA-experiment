import {
    config,
    baseEnum,
    IGameWithId,
    IActor,
    IBaseGameWithId,
    IUserWithId,
    TApiGroupPlayers,
    IGameToUpdate,
    IPhaseConfig,
    TPhaseType
} from '@common'
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
        baseEnum.RequestMethod.post, {...data, _csrf: getCookie(config.cookieKey.csrf)})
}

/******************  API request methods *************************/
interface IHttpRes {
    code: baseEnum.ResponseCode
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

    static async getPlayers(gameId: string): Promise<IHttpRes & { players: TApiGroupPlayers }> {
        return await GET('/game/getPlayers/:gameId', {gameId})
    }

    static async getGameList(page: number = 0): Promise<IHttpRes & { gameList: Array<IGameWithId>, count: number }> {
        return await GET('/game/list', {}, {page})
    }

    static async getPhaseTemplates(): Promise<IHttpRes & {
        templates: Array<ITemplateRegInfo>
    }> {
        const registeredRes = await GET('/game/phaseTemplates') as IHttpRes & {
            templates: Array<ITemplateRegInfo>
        }
        try {
            const authorizedRes = await this.getAuthorizedTemplates()
            if (authorizedRes.code === baseEnum.AcademusResCode.success) {
                registeredRes.templates = registeredRes.templates.filter(t =>
                    authorizedRes.templates.find(({type, namespace}) => type === t.type && t.namespace == namespace)
                )
            }
        } catch (e) {
            console.log(e)
            registeredRes.templates = []
        }
        return registeredRes
    }

    static async postNewGame(title: string, desc: string, mode: baseEnum.GameMode, phaseConfigs?: Array<IPhaseConfig<{}>>): Promise<IHttpRes & {
        gameId: string
    }> {
        return await POST('/game/create', null, null, {
            title, desc, mode, phaseConfigs
        })
    }

    static async postEditGame(gameId: string, toUpdate: IGameToUpdate): Promise<IHttpRes & {
        game: IGameWithId
    }> {
        return await POST('/game/edit/:gameId', {gameId}, null, {
            toUpdate
        })
    }

    static async shareGame(gameId: string): Promise<IHttpRes & { shareCode: string, title: string }> {
        return await GET('/game/share/:gameId', {gameId})
    }

    static async getActor(gameId: string, token: string = ''): Promise<IHttpRes & { actor: IActor }> {
        return await GET('/game/actor/:gameId', {gameId}, {token})
    }

    static async getRewarded(playerId: string): Promise<IHttpRes & { reward: string }> {
        return await GET('/game/rewarded', null, {playerId})
    }

    /**** V5 ****/
    static async reward(orgCode: string, gameId: string, data: {
        money: number,
        subject: number,
        task: string,
        tasker: string,
        payeeId: string
    }): Promise<{ code: number, msg: string }> {
        return await request(`/v5/apiv5/${orgCode}/researcher/trans/reward`, baseEnum.RequestMethod.post, data)
    }

    /**** adminDev****/
    static async getAuthorizedTemplates(): Promise<{ code: number, templates: Array<{ type: TPhaseType, namespace: string }> }> {
        return await request('/admindev/api/gametpl/myList')
    }
}
