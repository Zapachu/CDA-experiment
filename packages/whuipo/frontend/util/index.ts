import axios from 'axios'
import {iLabX, csrfCookieKey, ResCode, UserDoc} from '@micro-experiment/share';

export namespace Api {
    function getCookie(key: string) {
        return decodeURIComponent(document.cookie)
            .split('; ')
            .find(str => str.startsWith(`${key}=`))
            .substring(key.length + 1)
    }

    async function get(url: string, data = {}) {
        const res = await axios.get(`/api${url}`)
        return res.data
    }

    async function post(url: string, data={}) {
        const res = await axios.post(`/api${url}`, {...data, _csrf: getCookie(csrfCookieKey)})
        return res.data
    }

    export async function reqInitInfo():Promise<{code:ResCode, user:UserDoc, count:number, waiting:number, msg?:string}> {
        return await get('/initInfo')
    }

    export async function loginIn(username: string, password: string): Promise<{ code: ResCode, msg:iLabX.ResCode}> {
        return await post('/login', {username, password})
    }

    export async function asGuest(): Promise<{ code: iLabX.ResCode}> {
        return await post('/asGuest')
    }
}

export function redirect(url) {
    if (APP_TYPE === 'production') {
        location.href = url
        return
    }
    const obj = new URL(url)
    obj.hostname = location.hostname
    location.href = obj.toString()
}

export function getEnumKeys<E>(e: {}): Array<string> {
    const keys: Array<string> = []
    for (let key in e) {
        if (!isNaN(+key)) {
            keys.push(e[key])
        }
    }
    return keys
}