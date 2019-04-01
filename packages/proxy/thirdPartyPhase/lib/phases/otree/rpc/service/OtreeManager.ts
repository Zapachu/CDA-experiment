import {getUrlByNamespace} from './otreeApi'
import {PhaseManager} from 'elf-protocol'

export const phaseService = {
    async newPhase({request: {elfGameId, namespace, param, owner}}: { request: PhaseManager.TNewPhaseReq }, callback:PhaseManager.TNewPhaseCallback) {
        callback(null, {playUrl: (await getUrlByNamespace(elfGameId, namespace, param, owner)).playUrl})
    }
}

