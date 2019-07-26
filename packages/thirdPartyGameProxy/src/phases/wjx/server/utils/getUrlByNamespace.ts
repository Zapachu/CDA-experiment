import {Linker} from '@elf/protocol'
import {elfSetting} from '@elf/setting'
import {Token} from '@elf/util'
import {ThirdPartPhase} from '../../../../core/server/models'

export const NAMESPACE = 'wjx'

export const getUrlByNamespace = async ({elfGameId, params, owner}: Linker.Create.IReq): Promise<string> => {
    const {wjxUrl: realWjxUrl} = params

    params.wjxHash = realWjxUrl.split('/jq/')[1].split('.aspx')[0]
    params.adminUrl = `https://www.wjx.cn/report/${params.wjxHash}.aspx`

    const paramString = JSON.stringify(params)
    try {
        const newWjxPhase = await new ThirdPartPhase({
            playHash: [],
            elfGameId: elfGameId,
            param: paramString,
            namespace: NAMESPACE,
            ownerToken: Token.geneToken(owner)
        }).save()
        return `${elfSetting.wjxProxy}/init/jq/${newWjxPhase._id.toString()}`
    } catch (err) {
        if (err) {
            console.trace(err)
            return 'Error'
        }
    }
}
