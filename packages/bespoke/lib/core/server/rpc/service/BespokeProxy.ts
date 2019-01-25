import * as path from 'path'
import {loadPackageDefinition, credentials} from 'grpc'
import {loadSync} from '@grpc/proto-loader'
import {setting} from '@server-util'
import {proto} from '..'

export const {proto: {ProxyService}} = loadPackageDefinition(loadSync(path.resolve(__dirname, '../proto/BespokeProxy.proto'))) as any
export const proxyService = new ProxyService(setting.proxyServiceUri, credentials.createInsecure()) as proto.ProxyService