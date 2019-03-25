import {setting} from '../../util'
import {BespokeProxy} from 'elf-protocol'

export function getProxyService() {
    const {proxyService: {rpcHost, rpcPort}} = setting
    return BespokeProxy.getProxyService(`${rpcHost}:${rpcPort}`)
}
