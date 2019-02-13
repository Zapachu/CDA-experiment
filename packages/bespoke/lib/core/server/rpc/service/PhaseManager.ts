import {resolve} from 'path'
import {loadPackageDefinition, credentials} from 'grpc'
import {loadSync} from '@grpc/proto-loader'
import {INewPhaseReq, GameService as CGameService} from '..'
import {elfPhaseId2PlayUrl, setting} from '../../util'
import {GameModel} from '../../model'
import {IGame} from '@dev/common'

const {GameService, PhaseService} = loadPackageDefinition(loadSync(resolve(__dirname, '../proto/phaseManager.proto'))) as any

const phaseService = {
    async newPhase({request: {groupId, owner, namespace, param}}: { request: INewPhaseReq }, callback) {
        const {id} = await new GameModel(<IGame<any>>{
            title: '',
            desc: '',
            owner,
            groupId,
            namespace,
            params: JSON.parse(param)
        }).save()
        callback(null, {playUrl: elfPhaseId2PlayUrl(namespace, id)})
    }
}

export {PhaseService, phaseService}

let gameService: CGameService

export function getGameService() {
    if (!gameService) {
        gameService = new GameService(setting.elfGameServiceUri, credentials.createInsecure()) as CGameService
    }
    return gameService
}