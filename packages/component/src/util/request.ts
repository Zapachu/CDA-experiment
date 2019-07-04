import * as queryString from 'query-string'
import {ResponseCode, config} from '@bespoke/share'

enum RequestMethod {
    GET = 'get',
    POST = 'post'
}

export interface IHttpRes {
    code: ResponseCode
}

export namespace Request {
    const baseFetchOption = {
        credentials: 'include',
        method: RequestMethod.GET,
        headers: {'Content-Type': 'application/json; charset=utf-8'},
        cache: 'default'
    }

    async function request(url: string, method: RequestMethod = RequestMethod.GET, data = null): Promise<any> {
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

    function getCookie(key: string) {
        return decodeURIComponent(document.cookie)
            .split('; ')
            .find(str => str.startsWith(`${key}=`))
            .substring(key.length + 1)
    }

    export function buildUrl(namespace: string, path: string, params = {}, query = {}): string {
        let _path = `/${config.rootName}/${namespace}${path}`
        if (params) {
            _path = _path.replace(/:([\w\d]+)/, (matchedParam, paramName) => params[paramName])
        }
        return `${_path}?${queryString.stringify(query)}`
    }

    export async function get(namespace: string, path: string, params = {}, query = {}) {
        return await request(buildUrl(namespace, path, params, query))
    }

    export async function post(namespace: string, path: string, params = {}, query = {}, data) {
        return await request(buildUrl(namespace, path, params, query), RequestMethod.POST, data)
    }
}