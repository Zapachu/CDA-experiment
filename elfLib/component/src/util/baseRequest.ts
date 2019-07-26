import * as queryString from 'query-string'
import {csrfCookieKey, ResponseCode} from '@elf/share'

enum RequestMethod {
    GET = 'get',
    POST = 'post'
}

export interface IHttpRes {
    code: ResponseCode
}

export class BaseRequest {
    private static baseFetchOption = {
        credentials: 'include',
        method: RequestMethod.GET,
        headers: {'Content-Type': 'application/json; charset=utf-8'},
        cache: 'default'
    }

    private static getCookie(key: string) {
        return decodeURIComponent(document.cookie)
            .split('; ')
            .find(str => str.startsWith(`${key}=`))
            .substring(key.length + 1)
    }

    private static async request(url: string, method: RequestMethod = RequestMethod.GET, data = null): Promise<any> {
        const option = {
            ...BaseRequest.baseFetchOption,
            method,
            ...(data ? {body: JSON.stringify({...data, _csrf: BaseRequest.getCookie(csrfCookieKey)})} : {})
        } as RequestInit
        const res = await fetch(url, option)
        if (res.ok) {
            return res.json()
        }
    }

    buildUrl(path: string, params = {}, query = {}): string {
        let _path = path
        if (params) {
            _path = _path.replace(/:([\w\d]+)/, (matchedParam, paramName) => params[paramName])
        }
        return `${_path}?${queryString.stringify(query)}`
    }

    async get(path: string, params = {}, query = {}) {
        return await BaseRequest.request(this.buildUrl(path, params, query))
    }

    async post(path: string, params = {}, query = {}, data = {}) {
        return await BaseRequest.request(this.buildUrl(path, params, query), RequestMethod.POST, data)
    }
}