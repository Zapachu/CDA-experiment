import { Server, ServerCredentials } from 'grpc'
import {phaseService } from './service/qqwjManager'
import {PhaseManager} from 'elf-protocol'
import setting from '../../../config/settings'
import {gameService} from '../../common/utils'
import { resolve } from 'path'
import { readFileSync } from 'fs'

export function serve() {
    const server = new Server()
    PhaseManager.setPhaseService(server, phaseService)
    server.bind(`0.0.0.0:5${setting.qqSurveyPort}`, ServerCredentials.createInsecure())
    server.start()
    setInterval(() => registerPhases(), 10000)
}

function getJsUrls(): Array<{ namespace: string, jsUrl: string }> {
    const phases = []
    Object.entries(JSON.parse(readFileSync(resolve(__dirname, '../../../../dist/manifest.json')).toString())).map(([k, v]) => {
        if (k.replace('.js', '') === 'qqwj') {
            phases.push({
                type:PhaseManager.PhaseType.qqwj,
                namespace: k.replace('.js', ''),
                jsUrl: `${setting.qqSurveyProxy}${v}`,
                rpcUri: setting.qqSurveyRpc
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
