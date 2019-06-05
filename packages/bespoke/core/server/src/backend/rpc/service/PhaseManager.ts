import {gameId2PlayUrl} from '../../util'
import {GameModel} from '../../model'
import {IGame} from 'bespoke-common'
import {Server} from 'grpc'
import {elfSetting} from 'elf-setting'
import {PhaseManager as P} from 'elf-protocol'

export function setPhaseService(server: Server) {
    function newPhase({request: {elfGameId, owner, namespace, param}}: { request: P.TNewPhaseReq }, callback: P.TNewPhaseCallback): void {
        new GameModel(<IGame<any>>{
            title: '',
            desc: '',
            owner,
            elfGameId,
            namespace,
            params: JSON.parse(param)
        }).save().then(({id}) => callback(null, {playUrl: gameId2PlayUrl(id)}))
    }

    P.setPhaseService(server, {newPhase})
}

export function getGameService() {
    return P.getGameService(elfSetting.linkerServiceUri)
}
