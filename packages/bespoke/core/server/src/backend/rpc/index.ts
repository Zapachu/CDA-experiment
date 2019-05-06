import {Server, ServerCredentials} from 'grpc'
import {getGameService, setPhaseService} from './service/PhaseManager'
import {config} from 'bespoke-common'
import {elfSetting} from 'elf-setting'
import {Log, Setting} from '../util'

export function serve() {
    const server = new Server()
    setPhaseService(server)
    const rpcPort = server.bind(`0.0.0.0:${Setting.rpcPort}`, ServerCredentials.createInsecure())
    Setting.setRpcPort(rpcPort)
    server.start()
    registerPhases()
}

function registerPhases() {
    const {proxyService: p} = elfSetting,
        domain = p.host.startsWith('http') ? p.host : `http://${p.host}:${p.port}`
    getGameService().registerPhases({
        phases: [{
            namespace: Setting.namespace,
            jsUrl: `${domain}/${config.rootName}/static/bespoke-client-util.min.js;${domain}${Setting.getClientPath()}`,
            rpcPort: Setting.rpcPort
        }]
    }, err => err && Log.e(err))
    setTimeout(() => registerPhases(), config.gameRegisterInterval)
}

export {getGameService} from './service/PhaseManager'
export {getProxyService} from './service/BespokeProxy'
