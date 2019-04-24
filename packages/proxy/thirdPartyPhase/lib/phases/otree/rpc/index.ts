import {Server, ServerCredentials} from 'grpc'
import {phaseService} from './service/OtreeManager'
import {PhaseManager} from 'elf-protocol'
import {gameService} from '../../common/utils'
import {routePrefix} from '../../common/config'
import {elfSetting as setting} from 'elf-setting'
import {resolve} from 'path'
import {readFileSync} from 'fs'
import {getDemoList} from './service/otreeApi'
import {virtualJsRoute} from '../server/config'

export function serve() {
    const server = new Server()
    PhaseManager.setPhaseService(server, phaseService)
    const rpcPort = server.bind('0.0.0.0:0', ServerCredentials.createInsecure())
    server.start()
    registerPhases(rpcPort)
    getDemoList(setting.oTreeNamespace).catch(err => err ? console.error(err) : null)
}

function registerPhases(rpcPort: number) {
    setInterval(() => {
        const manifest = JSON.parse(readFileSync(resolve(__dirname, '../../../../dist/manifest.json')).toString())
        const regPhase: PhaseManager.TPhaseRegInfo = {
            namespace: setting.oTreeNamespace,
            jsUrl: `${setting.oTreeProxy}${manifest['otree.js']};${setting.oTreeProxy}/${routePrefix.oTreeStaticPathNamespace}${virtualJsRoute}`,
            rpcPort
        }
        gameService.registerPhases({phases: [regPhase]}, err => err ? console.error(err) : null)
    }, 10000)
}
