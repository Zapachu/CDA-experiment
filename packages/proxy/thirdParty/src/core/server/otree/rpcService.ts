import {Server, ServerCredentials} from 'grpc'
import {PhaseManager as P} from 'elf-proto'
import {registerPhases} from '../util/rpcService'
import setting from '../config/settings'
import {getUrlByNamespace} from './otreeApi'

export function serve() {
    const server = new Server()

    const phaseService = {
        async newPhase({request: {groupId, namespace, param}}: { request: P.TNewPhaseReq }, callback: P.TNewPhaseCallback) {
            callback(null, {playUrl: (await getUrlByNamespace(groupId, namespace, param)).playUrl})
        }
    }

    P.setPhaseService(server, phaseService)
    server.bind(`0.0.0.0:5${setting.otreePort}`, ServerCredentials.createInsecure())
    server.start()
    setInterval(() => registerPhases('otree', setting.localOtreeRootUrl, setting.localOtreePhaseServiceUri), 30000)
}