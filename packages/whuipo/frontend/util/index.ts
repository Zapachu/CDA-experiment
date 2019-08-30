import axios from 'axios'

export async function reqInitInfo() {
    const {data} = await axios('/api/initInfo')
    return data
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