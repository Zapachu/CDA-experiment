import {resolve} from 'path'
import {readFileSync} from 'fs'
import {Server, ServerCredentials} from 'grpc'
import {PhaseManager} from 'elf-protocol'
import {gameService} from '../../common/utils'
import {phaseService} from './service/QualtricsManager'
import {elfSetting as setting} from 'elf-setting'

export function serve() {
    const server = new Server()
    PhaseManager.setPhaseService(server, phaseService)
    server.bind(`0.0.0.0:5${setting.qualtricsPort}`, ServerCredentials.createInsecure())
    server.start()
    setInterval(() => registerPhases(), 10000)
}

function getJsUrls(): Array<PhaseManager.TPhaseRegInfo> {
    const manifest = JSON.parse(readFileSync(resolve(__dirname, '../../../../dist/manifest.json')).toString())
    const regPhase: PhaseManager.TPhaseRegInfo = {
        namespace: `qualtrics`,
        jsUrl: `${setting.qualtricsProxy}${manifest['qualtrics.js']}`,
        rpcPort: setting.qualtricsRpcPort
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
