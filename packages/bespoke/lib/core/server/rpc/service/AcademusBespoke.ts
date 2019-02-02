import * as path from 'path'
import {loadPackageDefinition, credentials} from 'grpc'
import {loadSync} from '@grpc/proto-loader'
import {RedisKey, redisClient, setting} from '@server-util'

export const {AcademusBespoke} = loadPackageDefinition(loadSync(path.resolve(__dirname, '../proto/AcademusBespoke.proto'))) as any
export const academusBespoke = {
    checkShareCode: (req, callback) => {
        const {code} = req.request
        redisClient.get(RedisKey.share_CodeGame(code)).then(gameId => {
            callback(null, {gameId})
        })
    }
}

let academusService

export function getAcademusService() {
    if (!academusService) {
        academusService = new AcademusBespoke(setting.academusServiceUri, credentials.createInsecure())
    }
    return academusService
}