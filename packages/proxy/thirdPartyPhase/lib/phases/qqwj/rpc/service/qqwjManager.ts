import setting from '../../../../config/settings'
import { ThirdPartPhase } from '../../../../core/server/models'
import {PhaseManager} from 'elf-proto'

const {localqqwjRootUrl} = setting

const getUrlByNamespace = async (groupId, namespace, param) => {
    let paramJson = JSON.parse(param)
    const {qqwjUrl: realqqwjUrl} = paramJson
    paramJson.qqwjHash = realqqwjUrl.split('/s/')[1]
    const paramString = JSON.stringify(paramJson)

    try {
        const newqqwjPhase = await new ThirdPartPhase({
            playHashs: [],
            groupId: groupId,
            param: paramString,
            namespace: namespace,
            prefixUrl: localqqwjRootUrl
        }).save()
        return `${localqqwjRootUrl}/init/qqwj/${newqqwjPhase._id.toString()}`
    } catch (err) {
        if (err) {
            console.log(err)
            return 'Error'
        }
    }
}

export const phaseService = {
    async newPhase({ request: { groupId, namespace, param } }: { request: PhaseManager.TNewPhaseReq }, callback:PhaseManager.TNewPhaseCallback) {
        callback(null, { playUrl: await getUrlByNamespace(groupId, namespace, param) })
    }
}