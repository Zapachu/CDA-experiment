import {resolve} from 'path'
import {loadPackageDefinition, credentials} from 'grpc'
import {loadSync} from '@grpc/proto-loader'
import {INewPhaseReq, GameService as CGameService} from '..'
import {elfPhaseId2PlayUrl, setting} from '@server-util'
import {GameModel} from '@server-model'
import {IGame} from '@common'

const {GameService, PhaseService} = loadPackageDefinition(loadSync(resolve(__dirname, '../proto/phaseManager.proto'))) as any

const phaseService = {
    async newPhase({request: {groupId, owner, namespace, param}}: { request: INewPhaseReq }, callback) {
        const {id} = await new GameModel(<IGame<any>>{
            title:'',
            desc:'',
            owner,
            groupId,
            namespace,
            params: JSON.parse(param)
        }).save()
        callback(null, {playUrl: elfPhaseId2PlayUrl(id)})
    }
}

export {PhaseService, phaseService}

const gameService = new GameService(setting.elfGameServiceUri, credentials.createInsecure()) as CGameService
export {gameService}