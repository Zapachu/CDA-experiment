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
    const rpcPort = server.bind('0.0.0.0:0', ServerCredentials.createInsecure())
    server.start()
    registerPhases(rpcPort)
}

function registerPhases(rpcPort: number) {
    setInterval(() => {
        const manifest = JSON.parse(readFileSync(resolve(__dirname, '../../../../dist/manifest.json')).toString())
        const regPhase: PhaseManager.TPhaseRegInfo = {
            namespace: `wjx`,
            jsUrl: `${setting.wjxProxy}${manifest['wjx.js']}`,
            rpcPort
        }
        gameService.registerPhases({phases: [regPhase]}, err => err ? console.error(err) : null)
    }, 10000)
}
