import * as IORedis from 'ioredis'
import setting from '../config/settings'

export const redisClient = new IORedis(setting.redisPort, setting.redisHost)
    .on('error', (err) => {
        console.error(err)
    })