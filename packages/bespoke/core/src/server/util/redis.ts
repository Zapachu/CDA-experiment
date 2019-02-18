import * as IORedis from 'ioredis'
import {setting} from './util'
import {baseEnum} from '@dev/common'

export const redisClient = new IORedis(setting.redisPort, setting.redisHost)
    .on('error', (err) => {
        console.error(err)
    })

export const RedisKey = {
    verifyCodeSendTimes: (nationCode: baseEnum.NationCode, phoneNumber: string) => `verifyCodeSendTimes:${nationCode}:${phoneNumber}`,
    verifyCode: (nationCode: baseEnum.NationCode, phoneNumber: string) => `verifyCode:${nationCode}:${phoneNumber}`,
    share_GameCode: (gameId:string)=>`shareCode:${gameId}`,
    share_CodeGame: (code:string)=>`shareCodeMapping:${code}`,
    gameState:(gameId:string)=>`gameState:${gameId}`,
    playerState:(gameId:string, token:string)=>`playerState:${gameId}:${token}`,
}