import {Server, ServerCredentials} from 'grpc'
import {getGameService, setPhaseService} from './service/PhaseManager'
import {config} from 'bespoke-common'
import {elfSetting} from 'elf-setting'
import {Log, Setting, heartBeat} from '../util'

export function serve() {
    const server = new Server()
    setPhaseService(server)
    const rpcPort = server.bind(`0.0.0.0:${Setting.rpcPort}`, ServerCredentials.createInsecure())
    Setting.setRpcPort(rpcPort)
    server.start()
    heartBeat(()=>
        getGameService().registerPhases({
            phases: [{
                namespace: Setting.namespace,
                jsUrl: `${elfSetting.proxyOrigin}/${config.rootName}/static/bespoke-client-util.min.js;${elfSetting.proxyOrigin}${Setting.getClientPath()}`,
                rpcPort: Setting.rpcPort
            }]
        }, err => err && Log.e(err)))
}

export {getGameService} from './service/PhaseManager'