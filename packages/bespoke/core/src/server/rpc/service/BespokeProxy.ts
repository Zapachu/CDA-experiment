import {setting} from '../../util'
import {BespokeProxy} from 'elf-proto'

export function getProxyService() {
    return BespokeProxy.getProxyService(setting.proxyService)
}