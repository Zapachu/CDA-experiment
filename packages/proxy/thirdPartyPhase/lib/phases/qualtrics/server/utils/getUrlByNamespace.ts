import {elfSetting as setting} from 'elf-setting'
import {ThirdPartPhase} from '../../../../core/server/models'
import {gen32Token} from '../../../../core/server/util'

export const getUrlByNamespace = async ({elfGameId, namespace, param, owner}) => {
    let paramJson = JSON.parse(param)
    const {qualtricsUrl: realQualtricsUrl} = paramJson
    console.log('paramJson', paramJson)
    paramJson.qualtricsHash = realQualtricsUrl.split('/jfe/form/')[1]
    paramJson.adminUrl = `https://cessoxford.eu.qualtrics.com/responses/#/surveys/${paramJson.qualtricsHash}`
    const paramString = JSON.stringify(paramJson)
    try {
        const newQualtricsPhase = await new ThirdPartPhase({
            playHash: [],
            elfGameId: elfGameId,
            param: paramString,
            namespace: namespace,
            ownerToken: gen32Token(owner.toString())
        }).save()
        return `${setting.qualtricsProxy}/init/jfe/form/${newQualtricsPhase._id.toString()}`
    } catch (err) {
        if (err) {
            console.log(err)
            return 'Error'
        }
    }
}