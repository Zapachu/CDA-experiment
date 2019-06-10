import {baseEnum, Request} from 'bespoke-common'
import {request} from 'bespoke-client-util'

export const Api = new Request(
    NAMESPACE,
    async (url: string) => await request(url),
    async (url: string, data = {}) => await request(url, baseEnum.RequestMethod.POST, data)
)