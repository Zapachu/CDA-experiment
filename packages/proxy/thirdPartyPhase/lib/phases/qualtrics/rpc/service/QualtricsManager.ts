import {elfSetting as setting} from 'elf-setting'
import {ThirdPartPhase} from '../../../../core/server/models'
import {PhaseManager} from 'elf-protocol'

const {qualtricsProxy} = setting

const getUrlByNamespace = async (groupId, namespace, param) => {
    let paramJson = JSON.parse(param)
    const {qualtricsUrl: realQualtricsUrl} = paramJson
    console.log('paramJson', paramJson)
    paramJson.qualtricsHash = realQualtricsUrl.split('/jfe/form/')[1]
    const paramString = JSON.stringify(paramJson)
    try {
        const newQualtricsPhase = await new ThirdPartPhase({
            playHash: [],
            groupId: groupId,
            param: paramString,
            namespace: namespace,
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
    async newPhase({request: {groupId, namespace, param}}: { request: PhaseManager.TNewPhaseReq }, callback:PhaseManager.TNewPhaseCallback) {
        callback(null, {playUrl: await getUrlByNamespace(groupId, namespace, param)})
    }
}
