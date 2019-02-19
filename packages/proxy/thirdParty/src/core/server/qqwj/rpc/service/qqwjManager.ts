import { resolve } from 'path'
import { loadPackageDefinition, credentials } from 'grpc'
import { loadSync } from '@grpc/proto-loader'
import setting from '../../../config/settings'
import { INewPhaseReq } from '../proto/phaseManager'
import { ThirdPartPhase } from '../../../models'
import settings from '../../../config/settings'
const { GameService, PhaseService } = loadPackageDefinition(loadSync(resolve(__dirname, '../proto/phaseManager.proto'))) as any

const {qqwjPhaseServerPrefix, localqqwjRootUrl} = settings

/**
 * 真实路由：  https://wj.qq.com/s/HASH
 * 初始化路由： /init/qqwj/PHASEID?hash=ELFHASH
 * @param groupId
 * @param namespace
 * @param param
 */

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
            prefixUrl: qqwjPhaseServerPrefix
        }).save()
        return `${localqqwjRootUrl}/init/qqwj/${newqqwjPhase._id.toString()}`
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

const gameService = new GameService(setting.elfGameServiceUri, credentials.createInsecure())
export { gameService }