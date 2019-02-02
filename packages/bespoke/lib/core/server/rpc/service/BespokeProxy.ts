import * as path from 'path'
import {loadPackageDefinition, credentials} from 'grpc'
import {loadSync} from '@grpc/proto-loader'
import {setting, Log} from '@server-util'
import {proto} from '..'

export const {proto: {ProxyService}} = loadPackageDefinition(loadSync(path.resolve(__dirname, '../proto/BespokeProxy.proto'))) as any

let proxyService: proto.ProxyService

export function getProxyService(): proto.ProxyService {
    if (!proxyService) {
        try {
            const {host, port} = setting.proxyService
            proxyService = new ProxyService(`${host}:${port}`, credentials.createInsecure()) as proto.ProxyService
        } catch (e) {
            Log.e('Failed to build RPC channel')
        }
    }
    return proxyService
}