import {elfSetting} from '@elf/setting'
import {ThirdPartPhase} from '../../../../core/server/models'
import {Token} from '@elf/util'
import {Linker} from '@elf/protocol'

export const NAMESPACE = 'qualtrics'

export const getUrlByNamespace = async ({elfGameId, params, owner}:Linker.Create.IReq) => {
    const {qualtricsUrl: realQualtricsUrl} = params
    params.qualtricsHash = realQualtricsUrl.split('/jfe/form/')[1]
    params.adminUrl = `https://cessoxford.eu.qualtrics.com/responses/#/surveys/${params.qualtricsHash}`
    const paramString = JSON.stringify(params)
    try {
        const newQualtricsPhase = await new ThirdPartPhase({
            playHash: [],
            elfGameId: elfGameId,
            param: paramString,
            namespace: NAMESPACE,
            ownerToken: Token.geneToken(owner)
        }).save()
        return `${elfSetting.qualtricsProxy}/init/jfe/form/${newQualtricsPhase._id.toString()}`
    } catch (err) {
        if (err) {
            console.log(err)
            return 'Error'
        }
    }
}