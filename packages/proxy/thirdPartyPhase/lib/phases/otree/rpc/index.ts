import { Server, ServerCredentials } from 'grpc'
import {phaseService } from './service/OtreeManager'
import {PhaseManager} from 'elf-proto'
import {gameService} from '../../common/utils'
import setting from '../../../config/settings'
import { resolve } from 'path'
import { readFileSync } from 'fs'

export function serve() {
    const server = new Server()
    PhaseManager.setPhaseService(server, phaseService)
    server.bind(`0.0.0.0:5${setting.otreePort}`, ServerCredentials.createInsecure())
    server.start()
    setInterval(() => registerPhases(), 10000)
}

/**
 * 注册 phase 提供的信息
 */
function getJsUrls(): Array<{ namespace: string, jsUrl: string }> {
    const otreePhase = []
    Object.entries(JSON.parse(readFileSync(resolve(__dirname, '../../../../dist/manifest.json')).toString())).map(([k, v]) => {
        if (k.replace('.js', '') === 'otree') {
            otreePhase.push({
                namespace: k.replace('.js', ''),
                jsUrl: `${setting.localOtreeRootUrl}${v}`,
                rpcUri: setting.localOtreePhaseServiceUri
            })
        }
    })
    return otreePhase
}

// 注册 Otree Phase
function registerPhases() {
    gameService.registerPhases({ phases: getJsUrls() }, (err) => {
        if (err) {
            console.log(err)
        }
    })
}