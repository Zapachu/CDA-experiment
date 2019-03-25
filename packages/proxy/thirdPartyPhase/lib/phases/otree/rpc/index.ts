import {Server, ServerCredentials} from 'grpc'
import {phaseService} from './service/OtreeManager'
import {PhaseManager} from 'elf-protocol'
import {gameService} from '../../common/utils'
import {elfSetting as setting} from 'elf-setting'
import {resolve} from 'path'
import {readFileSync} from 'fs'
import {getDemoList} from './service/otreeApi'
import {virtualJsRoute} from '../server/config'

export function serve() {
    const server = new Server()
    PhaseManager.setPhaseService(server, phaseService)
    server.bind(`0.0.0.0:5${setting.oTreePort}`, ServerCredentials.createInsecure())
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
        namespace: setting.oTreeNamespace,
        jsUrl: `${setting.oTreeProxy}${manifest['otree.js']};${setting.oTreeProxy}/${setting.oTreeStaticPathNamespace}${virtualJsRoute}`,
        rpcUri: setting.oTreeRpc
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
