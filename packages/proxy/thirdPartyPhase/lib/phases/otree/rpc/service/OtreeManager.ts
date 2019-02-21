import {getUrlByNamespace} from './otreeApi'
import {PhaseManager} from 'elf-proto'

export const phaseService = {
    async newPhase({request: {groupId, namespace, param, owner}}: { request: PhaseManager.TNewPhaseReq }, callback:PhaseManager.TNewPhaseCallback) {
        callback(null, {playUrl: (await getUrlByNamespace(groupId, namespace, param, owner)).playUrl})
    }
}

