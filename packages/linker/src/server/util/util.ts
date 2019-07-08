import {config} from '@common'
import {elfSetting} from '@elf/setting'

export const webpackHmr = process.env.HMR === 'true'

export function buildPlayUrl(gameId: string, playerToken: string) {
    const {linkerGatewayHost: host, linkerPort: port} = elfSetting
    return `${host.startsWith('http') ? host : `http://${host}:${port}`}/${config.rootName}/play/${gameId}?token=${playerToken}`
}
