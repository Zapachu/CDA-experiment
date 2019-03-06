import {Server, ServerCredentials} from 'grpc'
import {phaseService} from './service/OtreeManager'
import {PhaseManager} from 'elf-protocol'
import {gameService} from '../../common/utils'
import setting from '../../../config/settings'
import {resolve} from 'path'
import {readFileSync} from 'fs'
import {getDemoList} from './service/otreeApi/otreeUrl'

export async function serve() {
    const server = new Server()
    PhaseManager.setPhaseService(server, phaseService)
    server.bind(`0.0.0.0:5${setting.otreePort}`, ServerCredentials.createInsecure())
    server.start()
    setInterval(async () => await registerPhases(), 10000)
}


/**
 * Init: list
 * GET oTree List Functions / oTree List Cache
 * namespace: oTree + hash
 * data: {namespace, list}
 */
async function getJsUrls() {
    const manifest = JSON.parse(readFileSync(resolve(__dirname, '../../../../dist/manifest.json')).toString())
    const regPhase = {
        type: PhaseManager.PhaseType.otree,
        namespace: `oTree-${setting.otreeUser1}`,
        jsUrl: `${setting.localOtreeRootUrl}${manifest['otree.js']}`,
        rpcUri: setting.localOtreePhaseServiceUri
    }
    await getDemoList(regPhase.namespace)
    return [regPhase]
}

// 注册 Otree Phase
async function registerPhases() {
    gameService.registerPhases({phases: await getJsUrls()}, (err) => {
        if (err) {
            console.log(err)
        }
    })
}
