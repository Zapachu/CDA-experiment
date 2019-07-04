import {elfSetting as setting} from 'elf-setting'
import {ThirdPartPhase} from '../../../../core/server/models'
import {gen32Token} from '../../../../core/server/util'

export const getUrlByNamespace = async ({elfGameId, namespace, param, owner}):Promise<string> => {

    let paramJson = JSON.parse(param)
    const {wjxUrl: realWjxUrl} = paramJson

    paramJson.wjxHash = realWjxUrl.split('/jq/')[1].split('.aspx')[0]
    paramJson.adminUrl = `https://www.wjx.cn/report/${paramJson.wjxHash}.aspx`

    const paramString = JSON.stringify(paramJson)
    try {
        const newWjxPhase = await new ThirdPartPhase({
            playHash: [],
            elfGameId: elfGameId,
            param: paramString,
            namespace: namespace,
            ownerToken: gen32Token(owner.toString())
        }).save()
        return `${setting.wjxProxy}/init/jq/${newWjxPhase._id.toString()}`
    } catch (err) {
        if (err) {
            console.trace(err)
            return 'Error'
        }
    }
}
