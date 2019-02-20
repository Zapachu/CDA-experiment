import {Server, ServerCredentials} from 'grpc'
import {PhaseManager as P} from 'elf-proto'
import {registerPhases, setting, ThirdPartPhase} from '@core/server'

const getUrlByNamespace = async (groupId, namespace, param) => {
    let paramJson = JSON.parse(param)
    const {qqwjUrl: realqqwjUrl} = paramJson
    const qqwjHash = realqqwjUrl.split('/s/')[1]
    paramJson.qqwjHash = qqwjHash
    const paramString = JSON.stringify(paramJson)

    try {
        const newqqwjPhase = await new ThirdPartPhase({
            playHashs: [],
            groupId: groupId,
            param: paramString,
            namespace: namespace,
            prefixUrl: setting.qqwjPhaseServerPrefix
        }).save()
        return `${setting.localqqwjRootUrl}/init/qqwj/${newqqwjPhase._id.toString()}`
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
    setInterval(() => registerPhases('otree', setting.localqqwjRootUrl, setting.localqqwjServiceUri), 30000)
}