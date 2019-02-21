import { resolve } from 'path'
import { loadPackageDefinition, credentials } from 'grpc'
import { loadSync } from '@grpc/proto-loader'
import setting from '../../../../config/settings'
import { INewPhaseReq } from '../../../common/rpc/proto/phaseManager'
import { ThirdPartPhase } from '../../../../core/server/models'
const { GameService, PhaseService } = loadPackageDefinition(loadSync(resolve(__dirname, '../../../common/rpc/proto/phaseManager.proto'))) as any

const {localqqwjRootUrl} = setting

const getUrlByNamespace = async (groupId, namespace, param) => {
    let paramJson = JSON.parse(param)
    const {qqwjUrl: realqqwjUrl} = paramJson
    paramJson.qqwjHash = realqqwjUrl.split('/s/')[1]
    const paramString = JSON.stringify(paramJson)

    try {
        const newqqwjPhase = await new ThirdPartPhase({
            playHashs: [],
            groupId: groupId,
            param: paramString,
            namespace: namespace,
            prefixUrl: localqqwjRootUrl
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