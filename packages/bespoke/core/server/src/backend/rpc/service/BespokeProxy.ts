import {elfSetting} from 'elf-setting'
import {BespokeProxy} from 'elf-protocol'

export function getProxyService() {
    const {proxyService: {rpcHost, rpcPort}} = elfSetting
    return BespokeProxy.getProxyService(`${rpcHost}:${rpcPort}`)
}
