import {elfSetting as setting} from 'elf-setting'
import {ThirdPartPhase} from '../../../../core/server/models'
import {gen32Token} from '../../../../core/server/util'

export const getUrlByNamespace = async ({elfGameId, namespace, param, owner}) => {
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
        return `${setting.qqwjProxy}/init/qqwj/${newqqwjPhase._id.toString()}`
    } catch (err) {
        if (err) {
            console.log(err)
            return 'Error'
        }
    }
}
