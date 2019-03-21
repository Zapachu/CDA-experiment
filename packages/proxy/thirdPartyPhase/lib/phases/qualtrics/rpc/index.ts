import { resolve } from 'path'
import { readFileSync } from 'fs'
import { Server, ServerCredentials } from 'grpc'
import {PhaseManager} from 'elf-protocol'
import {gameService} from '../../common/utils'
import {phaseService } from './service/QualtricsManager'
import {elfSetting as setting} from 'elf-setting'

export function serve() {
    const server = new Server()
    PhaseManager.setPhaseService(server, phaseService)
    server.bind(`0.0.0.0:5${setting.qualtricsPort}`, ServerCredentials.createInsecure())
    server.start()
    setInterval(() => registerPhases(), 10000)
}

function getJsUrls(): Array<{ namespace: string, jsUrl: string }> {
    const phases = []
    Object.entries(JSON.parse(readFileSync(resolve(__dirname, '../../../../dist/manifest.json')).toString())).map(([k, v]) => {
        if (k.replace('.js', '') === 'qualtrics') {
            phases.push({
                type:PhaseManager.PhaseType.quatrics,
                namespace: k.replace('.js', ''),
                jsUrl: `${setting.qualtricsProxy}${v}`,
                rpcUri: setting.qualtricsRpc
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
