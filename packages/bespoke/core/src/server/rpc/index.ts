import {Server, ServerCredentials} from 'grpc'
import {setBespokeService} from './service/AcademusBespoke'
import {getGameService, setPhaseService} from './service/PhaseManager'
import {config} from '@dev/common'
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
    const {proxyService: {host, port}, rpcPort, getClientPath} = setting
    getGameService().registerPhases({
        phases: [{
            namespace: setting.namespace,
            jsUrl: `https://${host}:${port}/${getClientPath()}`,
            rpcPort
        }]
    }, err => err && Log.e(err))
    setTimeout(() => registerPhases(), config.gameRegisterInterval)
}

export {getGameService} from './service/PhaseManager'
export {getProxyService} from './service/BespokeProxy'