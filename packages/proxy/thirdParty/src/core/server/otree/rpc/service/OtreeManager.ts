import {resolve} from 'path'
import {loadPackageDefinition, credentials} from 'grpc'
import {loadSync} from '@grpc/proto-loader'
import setting from '../../../config/settings'
import {INewPhaseReq} from '../proto/phaseManager'
import {getUrlByNamespace} from './otreeApi/index'
const {GameService, PhaseService} = loadPackageDefinition(loadSync(resolve(__dirname, '../proto/phaseManager.proto'))) as any


const phaseService = {
    async newPhase({request: {groupId, namespace, param}}: { request: INewPhaseReq }, callback) {
        callback(null, {playUrl: (await getUrlByNamespace(groupId, namespace, param)).playUrl})
    }
}

export {PhaseService, phaseService}

const gameService = new GameService(setting.elfGameServiceUri, credentials.createInsecure())
export {gameService}