import {setting} from '../../util'
import {BespokeProxy} from 'elf-protocol'

export function getProxyService() {
    const {proxyService: {host, rpcPort}} = setting
    return BespokeProxy.getProxyService(`${host}:${rpcPort}`)
}