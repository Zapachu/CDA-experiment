import {Server, ServerCredentials} from 'grpc'
import {PhaseManager as P} from 'elf-proto'
import {registerPhases} from '../util/rpcService'
import setting from '../config/settings'
import {getUrlByNamespace} from './QualtricsManager'

export function serve() {
    const server = new Server()

    const phaseService = {
        async newPhase({request: {groupId, namespace, param}}: { request: P.TNewPhaseReq }, callback: P.TNewPhaseCallback) {
            callback(null, {playUrl: await getUrlByNamespace(groupId, namespace, param)})
        }
    }

    P.setPhaseService(server, phaseService)
    server.bind(`0.0.0.0:5${setting.qqwjPort}`, ServerCredentials.createInsecure())
    server.start()
    setInterval(() => registerPhases('qualtrics', setting.localQualtricsRootUrl, setting.localQualtricsServiceUri), 30000)
}