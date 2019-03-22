import {ThirdPartPhase} from '../../../../core/server/models'
import {elfSetting as settings} from 'elf-setting'
import {PhaseManager} from 'elf-protocol'
import * as objectHash from 'object-hash'

const {wjxProxy} = settings

const gen32Token = (source) => {
    return objectHash(source, {algorithm: 'md5'})
}

const getUrlByNamespace = async (groupId, namespace, param, owner) => {
    let paramJson = JSON.parse(param)
    const {wjxUrl: realWjxUrl} = paramJson
    paramJson.wjxHash = realWjxUrl.split('/jq/')[1]
    const paramString = JSON.stringify(paramJson)
    try {
        const newWjxPhase = await new ThirdPartPhase({
            playHash: [],
            groupId: groupId,
            param: paramString,
            namespace: namespace,
            ownerToken: gen32Token(owner.toString()),
        }).save()
        return `${wjxProxy}/init/jq/${newWjxPhase._id.toString()}`
    } catch (err) {
        if (err) {
            console.log(err)
            return 'Error'
        }
    }
}

export const phaseService = {
    async newPhase({request: {groupId, namespace, param, owner}}: { request: PhaseManager.TNewPhaseReq }, callback: PhaseManager.TNewPhaseCallback) {
        callback(null, {playUrl: await getUrlByNamespace(groupId, namespace, param, owner)})
    }
}
