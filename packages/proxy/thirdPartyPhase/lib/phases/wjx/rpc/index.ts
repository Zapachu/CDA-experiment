import { Server, ServerCredentials } from 'grpc'
import { phaseService } from './service/WjxManager'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import {PhaseManager} from 'elf-proto'
import setting from '../../../config/settings'
import {gameService} from '../../common/utils'

export function serve() {
    const server = new Server()
    PhaseManager.setPhaseService(server, phaseService)
    server.bind(`0.0.0.0:5${setting.wjxPort}`, ServerCredentials.createInsecure())
    server.start()
    setInterval(() => registerPhases(), 10000)
}

function getJsUrls(): Array<{ namespace: string, jsUrl: string }> {
    const phases = []
    Object.entries(JSON.parse(readFileSync(resolve(__dirname, '../../../../dist/manifest.json')).toString())).map(([k, v]) => {
        if (k.replace('.js', '') === 'wjx') {
            phases.push({
                namespace: k.replace('.js', ''),
                jsUrl: `${setting.localWjxRootUrl}${v}`,
                rpcUri: setting.localWjxServiceUri
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