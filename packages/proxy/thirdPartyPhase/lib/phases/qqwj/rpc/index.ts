import { Server, ServerCredentials } from 'grpc'
import {phaseService } from './service/qqwjManager'
import {PhaseManager} from 'elf-protocol'
import {elfSetting as setting} from 'elf-setting'
import {gameService} from '../../common/utils'
import { resolve } from 'path'
import { readFileSync } from 'fs'

export function serve() {
    const server = new Server()
    PhaseManager.setPhaseService(server, phaseService)
    server.bind(`0.0.0.0:5${setting.qqwjPort}`, ServerCredentials.createInsecure())
    server.start()
    setInterval(() => registerPhases(), 10000)
}

function getJsUrls(): Array<PhaseManager.TPhaseRegInfo> {
    const manifest = JSON.parse(readFileSync(resolve(__dirname, '../../../../dist/manifest.json')).toString())
    const regPhase: PhaseManager.TPhaseRegInfo = {
        namespace: `qqwj`,
        jsUrl: `${setting.qqwjProxy}${manifest['qqwj.js']}`,
        rpcPort: setting.qqwjRpcPort
    }
    return [regPhase]
}

function registerPhases() {
    gameService.registerPhases({ phases: getJsUrls() }, (err) => {
        if (err) {
            console.log(err)
        }
    })
}
