import {resolve} from 'path'
import {loadSync} from '@grpc/proto-loader'
import setting from '../../../../config/settings'
import {INewPhaseReq} from '../../../common/rpc/proto/phaseManager'
import {ThirdPartPhase} from '../../../../core/server/models'
import {loadPackageDefinition, credentials} from 'grpc'

const {GameService, PhaseService} = loadPackageDefinition(loadSync(resolve(__dirname, '../../../common/rpc/proto/phaseManager.proto'))) as any
const {localQualtricsRootUrl} = setting

const getUrlByNamespace = async (groupId, namespace, param) => {
    let paramJson = JSON.parse(param)
    const {qualtricsUrl: realQualtricsUrl} = paramJson
    console.log('paramJson', paramJson)
    paramJson.qualtricsHash = realQualtricsUrl.split('/jfe/form/')[1]
    const paramString = JSON.stringify(paramJson)
    try {
        const newQualtricsPhase = await new ThirdPartPhase({
            playHashs: [],
            groupId: groupId,
            param: paramString,
            namespace: namespace,
            prefixUrl: localQualtricsRootUrl
        }).save()
        return `${localQualtricsRootUrl}/init/jfe/form/${newQualtricsPhase._id.toString()}`
    } catch (err) {
        if (err) {
            console.log(err)
            return 'Error'
        }
    }
}

const phaseService = {
    async newPhase({request: {groupId, namespace, param}}: { request: INewPhaseReq }, callback) {
        callback(null, {playUrl: await getUrlByNamespace(groupId, namespace, param)})
    }
}

export {PhaseService, phaseService}

const gameService = new GameService(setting.elfGameServiceUri, credentials.createInsecure())
export {gameService}