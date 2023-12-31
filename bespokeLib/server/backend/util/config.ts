import { LogLevel } from '@elf/util'

export const CONFIG = {
  shareCodeLifeTime: 3 * 24 * 60 * 60,
  memoryCacheLifetime: 3 * 60 * 1000,
  heartBeatSeconds: 3,
  logLevel: LogLevel.log
}
