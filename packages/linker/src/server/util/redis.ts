import * as IORedis from 'ioredis'
import {elfSetting} from 'elf-setting'

export const redisClient = new IORedis(elfSetting.redisPort, elfSetting.redisHost)
    .on('error', (err) => {
        console.error(err)
    })

export const RedisKey = {
    registeredPhaseSet: 'registeredPhaseSet',
    phaseRegInfo: (namespace: string) => `phaseRegInfo:${namespace}`,
    share_GameCode: (gameId: string) => `shareGameCode:${gameId}`,
    share_CodeGame: (code: string) => `shareCodeGame:${code}`
}

export const RedisLifetime = {
    phaseRegInfo: 60
}
