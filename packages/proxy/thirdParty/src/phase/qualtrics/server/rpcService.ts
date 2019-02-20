import {Server, ServerCredentials} from 'grpc'
import {PhaseManager as P} from 'elf-proto'
import {registerPhases, setting, ThirdPartPhase} from '@core/server'

const getUrlByNamespace = async (groupId, namespace, param) => {
    let paramJson = JSON.parse(param)
    const {qualtricsUrl: realQualtricsUrl} = paramJson
    const qualtricsHash = realQualtricsUrl.split('/jfe/form/')[1]
    paramJson.qualtricsHash = qualtricsHash
    const paramString = JSON.stringify(paramJson)

    try {
        const newQualtricsPhase = await new ThirdPartPhase({
            playHashs: [],
            groupId: groupId,
            param: paramString,
            namespace: namespace,
            prefixUrl: setting.qualtricsPhaseServerPrefix
        }).save()
        return `${setting.localQualtricsRootUrl}/init/jfe/form/${newQualtricsPhase._id.toString()}`
    } catch (err) {
        if (err) {
            console.log(err)
            return 'Error'
        }
    }
}

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