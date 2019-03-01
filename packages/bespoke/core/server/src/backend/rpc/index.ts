import {Server, ServerCredentials} from 'grpc'
import {setBespokeService} from './service/AcademusBespoke'
import {getGameService, setPhaseService} from './service/PhaseManager'
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
    const vendorPath = ''//TODO 提供bespoke-client-util的访问
    const {proxyService: p, host, rpcPort, getClientPath} = setting
    getGameService().registerPhases({
        phases: [{
            namespace: setting.namespace,
            jsUrl: `http://${p.host}:${p.port}${vendorPath};http://${p.host}:${p.port}${getClientPath()}`,
            rpcUri: `${host}:${rpcPort}`
        }]
    }, err => err && Log.e(err))
    setTimeout(() => registerPhases(), config.gameRegisterInterval)
}

export {getGameService} from './service/PhaseManager'
export {getProxyService} from './service/BespokeProxy'