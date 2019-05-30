import request from '../utils/request'

export async function reqInitInfo () {
    return request('/api/initInfo', {})
}