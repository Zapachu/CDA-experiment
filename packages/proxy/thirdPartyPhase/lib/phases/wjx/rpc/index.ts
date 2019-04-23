import {Server, ServerCredentials} from 'grpc'
import {phaseService} from './service/WjxManager'
import {resolve} from 'path'
import {readFileSync} from 'fs'
import {PhaseManager} from 'elf-protocol'
import {elfSetting as setting} from 'elf-setting'
import {gameService} from '../../common/utils'

export function serve() {
    const server = new Server()
    PhaseManager.setPhaseService(server, phaseService)
    server.bind(`0.0.0.0:5${setting.wjxPort}`, ServerCredentials.createInsecure())
    server.start()
    setInterval(() => registerPhases(), 10000)
}

function getJsUrls(): Array<PhaseManager.TPhaseRegInfo> {
    const manifest = JSON.parse(readFileSync(resolve(__dirname, '../../../../dist/manifest.json')).toString())
    const regPhase: PhaseManager.TPhaseRegInfo = {
        namespace: `wjx`,
        jsUrl: `${setting.wjxProxy}${manifest['wjx.js']}`,
        rpcPort: setting.wjxRpcPort
    }
    return [regPhase]
}

function registerPhases() {
    gameService.registerPhases({phases: getJsUrls()}, (err) => {
        if (err) {
            console.log(err)
        }
    })
}
