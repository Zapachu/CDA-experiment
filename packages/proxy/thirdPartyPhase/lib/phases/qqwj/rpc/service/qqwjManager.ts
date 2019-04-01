import {elfSetting as setting} from 'elf-setting'
import {ThirdPartPhase} from '../../../../core/server/models'
import {PhaseManager} from 'elf-protocol'
import * as objectHash from "object-hash"

const {qqwjProxy} = setting

const gen32Token = (source) => {
    return objectHash(source, {algorithm: 'md5'})
}

const getUrlByNamespace = async (elfGameId, namespace, param, owner) => {
    let paramJson = JSON.parse(param)
    const {qqwjUrl: realqqwjUrl} = paramJson
    paramJson.qqwjHash = realqqwjUrl.split('wj.qq.com')[1]
    const Id = paramJson.qqwjHash.split('/')[2]
    paramJson.adminUrl = `https://wj.qq.com/stat/overview.html?sid=${Id}`
    const paramString = JSON.stringify(paramJson)

    try {
        const newqqwjPhase = await new ThirdPartPhase({
            playHash: [],
            elfGameId: elfGameId,
            param: paramString,
            namespace: namespace,
            ownerToken: gen32Token(owner.toString())
        }).save()
        return `${qqwjProxy}/init/qqwj/${newqqwjPhase._id.toString()}`
    } catch (err) {
        if (err) {
            console.log(err)
            return 'Error'
        }
    }
}

export const phaseService = {
    async newPhase({request: {elfGameId, namespace, param, owner}}: { request: PhaseManager.TNewPhaseReq }, callback: PhaseManager.TNewPhaseCallback) {
        callback(null, {playUrl: await getUrlByNamespace(elfGameId, namespace, param, owner)})
    }
}
