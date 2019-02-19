import { Server, ServerCredentials } from 'grpc'
import { gameService, PhaseService, phaseService } from './service/qqwjManager'
import setting from '../../config/settings'
import { resolve } from 'path'
import { readFileSync } from 'fs'

export * from './proto/PhaseManager'

export { gameService }

export function serve() {
    const server = new Server()
    server.addService(PhaseService.service, phaseService)
    server.bind(`0.0.0.0:5${setting.qqwjPort}`, ServerCredentials.createInsecure())
    server.start()
    setInterval(() => registerPhases(), 30000)
}

function getJsUrls(): Array<{ namespace: string, jsUrl: string }> {
    const phases = []
    Object.entries(JSON.parse(readFileSync(resolve(__dirname, '../../../../../dist/manifest.json')).toString())).map(([k, v]) => {
        if (k.replace('.js', '') === 'qqwj') {
            phases.push({
                namespace: k.replace('.js', ''),
                jsUrl: `${setting.localqqwjRootUrl}${v}`,
                rpcUri: setting.localqqwjServiceUri
            })
        }
    })
    return phases
}

function registerPhases() {
    gameService.registerPhases({ phases: getJsUrls() }, (err) => {
        if (err) {
            console.log(err)
        }
    })
}