import * as IORedis from 'ioredis'
import {elfSetting} from 'elf-setting'
import {baseEnum} from 'bespoke-common'

export const redisClient = new IORedis(elfSetting.redisPort, elfSetting.redisHost)
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
    playerStates:(gameId:string)=>`playerState:${gameId}:*`,
}
