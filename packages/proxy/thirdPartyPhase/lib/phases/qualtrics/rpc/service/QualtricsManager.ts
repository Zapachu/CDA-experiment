import {elfSetting as setting} from 'elf-setting'
import {ThirdPartPhase} from '../../../../core/server/models'
import {PhaseManager} from 'elf-protocol'
import * as objectHash from "object-hash"

const {qualtricsProxy} = setting

const gen32Token = (source) => {
    return objectHash(source, {algorithm: 'md5'})
}

const getUrlByNamespace = async (groupId, namespace, param, owner) => {
    let paramJson = JSON.parse(param)
    const {qualtricsUrl: realQualtricsUrl} = paramJson
    console.log('paramJson', paramJson)
    paramJson.qualtricsHash = realQualtricsUrl.split('/jfe/form/')[1]
    paramJson.adminUrl = `https://cessoxford.eu.qualtrics.com/responses/#/surveys/${paramJson.qualtricsHash}`
    const paramString = JSON.stringify(paramJson)
    try {
        const newQualtricsPhase = await new ThirdPartPhase({
            playHash: [],
            groupId: groupId,
            param: paramString,
            namespace: namespace,
            ownerToken: gen32Token(owner.toString()),
        }).save()
        return `${qualtricsProxy}/init/jfe/form/${newQualtricsPhase._id.toString()}`
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
