async function request(url): Promise<any> {
    let option = {
        credentials: 'include',
        method: 'GET',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        cache: 'default',
    } as RequestInit
    const res = await fetch(url, option)
    if (res.ok) {
        return res.json()
    }
}

function buildQuery(query) {
    return (Object as any).entries(query || {}).map(([key, val]) => `${key}=${val}`).join('&')
}

function buildPath(pathFragment, params) {
    const path = pathFragment
    if (!Object.keys(params).length) {
        return path
    }
    return path.replace(/:([\w\d]+)/, (matchedParam, paramName) => {
        if (params[paramName] === undefined) {
            throw new Error(`could not build path ("${path}") - param "${paramName}" does not exist`)
        }
        return params[paramName]
    })
}

export const fetchData = async function (url: string, params = {}, query = {}): Promise<any> {
    return await request(`${buildPath(url, params)}?${buildQuery(query)}`)
}
