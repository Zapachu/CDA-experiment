import {resolve} from 'path'
import {readFileSync} from 'fs'
import {Server, ServerCredentials} from 'grpc'
import {PhaseManager} from 'elf-protocol'
import {gameService} from '../../common/utils'
import {phaseService} from './service/QualtricsManager'
import {elfSetting as setting} from 'elf-setting'
import {routePrefix} from '../../common/config'
import {virtualJsRoute} from '../../otree/server/config'

export function serve() {
    const server = new Server()
    PhaseManager.setPhaseService(server, phaseService)
    const rpcPort = server.bind('0.0.0.0:0', ServerCredentials.createInsecure())
    server.start()
    registerPhases(rpcPort)
}

function registerPhases(rpcPort: number) {
    setInterval(() => {
        const manifest = JSON.parse(readFileSync(resolve(__dirname, '../../../../dist/manifest.json')).toString())
        const regPhase: PhaseManager.TPhaseRegInfo = {
            namespace: `qualtrics`,
            jsUrl: `${setting.qualtricsProxy}${manifest['qualtrics.js']}`,
            rpcPort
        }
        gameService.registerPhases({phases: [regPhase]}, err => err ? console.error(err) : null)
    }, 10000)
}

