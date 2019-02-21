import { resolve } from 'path'
import { loadPackageDefinition, credentials } from 'grpc'
import { loadSync } from '@grpc/proto-loader'
import { INewPhaseReq } from '../../../common/rpc/proto/phaseManager'
import { ThirdPartPhase } from '../../../../core/server/models'
const { GameService, PhaseService } = loadPackageDefinition(loadSync(resolve(__dirname, '../../../common/rpc/proto/phaseManager.proto'))) as any

import settings from '../../../../config/settings'

const {localWjxRootUrl} = settings

/**
 * 真实路由：  https://www.wjx.cn/jq/HASH.aspx
 * 初始化路由： /init/jq/PHASEID?hash=ELFHASH
 * @param groupId
 * @param namespace
 * @param param
 */

const getUrlByNamespace = async (groupId, namespace, param) => {
    let paramJson = JSON.parse(param)
    const {wjxUrl: realWjxUrl} = paramJson
    paramJson.wjxHash = realWjxUrl.split('/jq/')[1]
    const paramString = JSON.stringify(paramJson)
    try {
        const newWjxPhase = await new ThirdPartPhase({
            playHashs: [],
            groupId: groupId,
            param: paramString,
            namespace: namespace,
            prefixUrl: localWjxRootUrl
        }).save()
        return `${localWjxRootUrl}/init/jq/${newWjxPhase._id.toString()}`
    } catch (err) {
        if (err) {
            console.log(err)
            return 'Error'
        }
    }
}

const phaseService = {
    async newPhase({ request: { groupId, namespace, param } }: { request: INewPhaseReq }, callback) {
        callback(null, { playUrl: await getUrlByNamespace(groupId, namespace, param) })
    }
}

export { PhaseService, phaseService }

const gameService = new GameService(settings.elfGameServiceUri, credentials.createInsecure())
export { gameService }