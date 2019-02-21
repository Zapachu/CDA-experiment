import {resolve} from 'path'
import {loadPackageDefinition, credentials} from 'grpc'
import {loadSync} from '@grpc/proto-loader'
import setting from '../../../../config/settings'
import {INewPhaseReq} from '../../../common/rpc/proto/phaseManager'
import {getUrlByNamespace} from './otreeApi'
const {GameService, PhaseService} = loadPackageDefinition(loadSync(resolve(__dirname, '../../../common/rpc/proto/phaseManager.proto'))) as any


const phaseService = {
    async newPhase({request: {groupId, namespace, param, owner}}: { request: INewPhaseReq }, callback) {
        callback(null, {playUrl: (await getUrlByNamespace(groupId, namespace, param, owner)).playUrl})
    }
}

export {PhaseService, phaseService}

const gameService = new GameService(setting.elfGameServiceUri, credentials.createInsecure())
export {gameService}
