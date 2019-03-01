import {setting} from '../../util'
import {BespokeProxy} from 'elf-proto'

export function getProxyService() {
    const {proxyService: {host, rpcPort}} = setting
    return BespokeProxy.getProxyService(`${host}:${rpcPort}`)
}