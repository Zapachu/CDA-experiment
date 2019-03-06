import {Server, ServerCredentials} from 'grpc'
import {phaseService} from './service/OtreeManager'
import {PhaseManager} from 'elf-protocol'
import {gameService} from '../../common/utils'
import setting from '../../../config/settings'
import {resolve} from 'path'
import {readFileSync} from 'fs'

export function serve() {
    const server = new Server()
    PhaseManager.setPhaseService(server, phaseService)
    server.bind(`0.0.0.0:5${setting.otreePort}`, ServerCredentials.createInsecure())
    server.start()
    setInterval(() => registerPhases(), 10000)
}


/**
 * Init: list
 * GET oTree List Functions / oTree List Cache
 * namespace: oTree + hash
 * data: {namespace, list}
 */
function getJsUrls() {
    const manifest = JSON.parse(readFileSync(resolve(__dirname, '../../../../dist/manifest.json')).toString())
    const regPhase = {
        type: PhaseManager.PhaseType.otree,
        namespace: `oTree-${Date.now()}`,
        jsUrl: `${setting.localOtreeRootUrl}${manifest['otree.js']}`,
        rpcUri: setting.localOtreePhaseServiceUri
    }

    return [regPhase]
}

// 注册 Otree Phase
function registerPhases() {
    gameService.registerPhases({phases: getJsUrls()}, (err) => {
        if (err) {
            console.log(err)
        }
    })
}
