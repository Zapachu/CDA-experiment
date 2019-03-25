import {Server, ServerCredentials} from 'grpc'
import {setBespokeService} from './service/AcademusBespoke'
import {getGameService, setPhaseService} from './service/PhaseManager'
import {PhaseManager} from 'elf-protocol'
import {config} from 'bespoke-common'
import {Log, setting} from '../util'

export function serve() {
    const server = new Server()
    setPhaseService(server)
    setBespokeService(server)
    server.bind(`0.0.0.0:${setting.rpcPort}`, ServerCredentials.createInsecure())
    server.start()
    registerPhases()
}

function registerPhases() {
    const {proxyService: p, host, rpcPort, getClientPath} = setting,
        domain = p.host.startsWith('http')?p.host:`http://${p.host}:${p.port}`
    getGameService().registerPhases({
        phases: [{
            type:PhaseManager.PhaseType.bespoke,
            namespace: setting.namespace,
            jsUrl: `${domain}/${config.rootName}/static/bespoke-client-util.min.js;${domain}${getClientPath()}`,
            rpcUri: `${host}:${rpcPort}`
        }]
    }, err => err && Log.e(err))
    setTimeout(() => registerPhases(), config.gameRegisterInterval)
}

export {getGameService} from './service/PhaseManager'
export {getProxyService} from './service/BespokeProxy'
