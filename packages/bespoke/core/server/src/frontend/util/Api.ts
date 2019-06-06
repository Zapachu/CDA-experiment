import {baseEnum, config, Request} from 'bespoke-common'
import {IFetcher} from 'bespoke-client-util'

const baseFetchOption = {
    credentials: 'include',
    method: baseEnum.RequestMethod.GET,
    headers: {'Content-Type': 'application/json; charset=utf-8'},
    cache: 'default'
}

function getCookie(key: string) {
    return decodeURIComponent(document.cookie)
        .split('; ')
        .find(str => str.startsWith(`${key}=`))
        .substring(key.length + 1)
}

async function request(url, method: baseEnum.RequestMethod = baseEnum.RequestMethod.GET, data = null): Promise<any> {
    const option = {
        ...baseFetchOption,
        method,
        ...(data ? {body: JSON.stringify({...data, _csrf: getCookie(config.cookieKey.csrf)})} : {})
    } as RequestInit
    const res = await fetch(url, option)
    if (res.ok) {
        return res.json()
    }
}

export const Api = new Request(
    NAMESPACE,
    async (url: string) => await request(url),
    async (url: string, data = {}) => await request(url, baseEnum.RequestMethod.POST, data)
)

export function buildFetcher<FetchType>(gameId?: string): IFetcher<FetchType> {
    return {
        buildGetUrl(type: FetchType, params = {}): string {
            return Api.buildUrl('/pass2Game/:gameId', {gameId}, {type, ...params})
        },

        getFromGame(type: FetchType, params = {}) {
            return Api.getFromGame(gameId, type.toString(), params)
        },

        postToGame(type: FetchType, params = {}) {
            return Api.postToGame(gameId, type.toString(), params)
        },

        getFromNamespace(type: FetchType, params = {}) {
            return Api.getFromNamespace(type.toString(), params)
        },

        postToNamespace(type: FetchType, params = {}) {
            return Api.postToNamespace(type.toString(), params)
        }
    }
}