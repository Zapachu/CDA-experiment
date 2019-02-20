import {Server, ServerCredentials} from 'grpc'
import {PhaseManager as P} from 'elf-proto'
import {registerPhases, setting, ThirdPartPhase} from '@core/server'

/**
 * 真实路由：  https://www.wjx.cn/jq/HASH.aspx
 * 初始化路由： /init/jq/PHASEID?hash=ELFHASH
 * @param groupId
 * @param namespace
 * @param param
 */

export const getUrlByNamespace = async (groupId, namespace, param) => {
    let paramJson = JSON.parse(param)
    const {wjxUrl: realWjxUrl} = paramJson
    const wjxHash = realWjxUrl.split('/jq/')[1]
    paramJson.wjxHash = wjxHash
    const paramString = JSON.stringify(paramJson)

    try {
        const newWjxPhase = await new ThirdPartPhase({
            playHashs: [],
            groupId: groupId,
            param: paramString,
            namespace: namespace,
            prefixUrl: setting.WjxPhaseServerPrefix
        }).save()
        return `${setting.localWjxRootUrl}/init/jq/${newWjxPhase._id.toString()}`
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
    setInterval(() => registerPhases('wjx', setting.localWjxRootUrl, setting.localWjxServiceUri), 30000)
}