import {baseEnum, config} from 'bespoke-common'

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

export async function request(url, method: baseEnum.RequestMethod = baseEnum.RequestMethod.GET, data = null): Promise<any> {
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