import {config, baseEnum, Request} from '@common'

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
    async (url: string) => await request(url),
    async (url: string, data = {}) => await request(url, baseEnum.RequestMethod.POST, data)
)
