import {elfSetting} from '@elf/setting'
import {ThirdPartPhase} from '../../../../core/server/models'
import {Token} from '@elf/util'
import {Linker} from '@elf/protocol'

export const NAMESPACE = 'qqwj'

export const getUrlByNamespace = async ({elfGameId, params, owner}:Linker.Create.IReq):Promise<string> => {
    const {qqwjUrl: realqqwjUrl} = params
    params.qqwjHash = realqqwjUrl.split('wj.qq.com')[1]
    const Id = params.qqwjHash.split('/')[2]
    params.adminUrl = `https://wj.qq.com/stat/overview.html?sid=${Id}`
    const paramString = JSON.stringify(params)

    try {
        const newqqwjPhase = await new ThirdPartPhase({
            playHash: [],
            elfGameId: elfGameId,
            param: paramString,
            namespace: NAMESPACE,
            ownerToken: Token.geneToken(owner)
        }).save()
        return `${elfSetting.qqwjProxy}/init/qqwj/${newqqwjPhase._id.toString()}`
    } catch (err) {
        if (err) {
            console.log(err)
            return 'Error'
        }
    }
}
