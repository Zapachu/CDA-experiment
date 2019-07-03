import * as Model from './model'

export {Model}
export * from '@bespoke/share'
export {RedisCall, redisClient} from 'elf-protocol'
export {gameId2PlayUrl} from './util'
export {Log} from '@bespoke/server-util'
export {Server} from './server'

import {BaseLogic} from './service'
export {BaseLogic, BaseLogic as BaseController}