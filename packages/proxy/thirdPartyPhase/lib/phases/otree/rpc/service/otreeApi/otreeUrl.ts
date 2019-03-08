import * as objectHash from 'object-hash'
import settings from '../../../../../config/settings'
import {ThirdPartPhase} from '../../../../../core/server/models'

const otreePlayUrl = settings.otreeServerRootUrl
const otreeDemoUrlPrefix = `${otreePlayUrl}/demo/`
const otreeParticipantUrl = 'InitializeParticipant/'
const localOtreeRootUrl = settings.localOtreeRootUrl

import * as rp from 'request-promise'
import {Response} from 'express'
import ListMap from '../../../server/utils/ListMap'

declare interface IGetUrlByNamespace {
    err: number,
    phaseId: string,
    playUrl: string
}

const gen32Token = (source) => {
    return objectHash(source, {algorithm: 'md5'})
}

// get demo list
const getDemoList = async (namespace) => {
    const list = ListMap.getList(namespace)
    if (list.length > 0) {
        return list
    }
    const options = {method: 'GET', uri: otreeDemoUrlPrefix, resolveWithFullResponse: true}
    const demoListRes = await rp(options)
    const demoBody = demoListRes.body
    const demoHrefList = demoBody.match(/ <a href="\/demo\/(\S*)\/" class="list-group-item" target="_blank">/g)
    const demoList = demoHrefList.map(item =>
        item.match(/ <a href="\/demo\/(\S*)\/" class="list-group-item" target="_blank">/)[1]
    )
    console.log(demoList)
    await ListMap.setList(namespace, demoList)
    return demoList
}

// get play link
const getUrlByNamespace = async (groupId, namespace, param, owner):Promise<any> => {
    let inited = false, doneResBody = '', handleBody = ''
    const syncWaitingForCreated= async (uri) => {
        while (!inited) {
            const options = {method: 'GET', uri, resolveWithFullResponse: true}
            const doneRes = await rp(options)
            console.log(doneRes.toJSON())
            if (doneRes.body.toString().indexOf(otreeParticipantUrl) !== -1) {
                doneResBody = doneRes.body
                inited = true
            }
            await sleep(1000)
        }
        return doneResBody
    }
    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    const playHashs = []
    const paramJson = JSON.parse(param)
    const ownerToken = gen32Token(owner.toString())
    const otreeDemoClickUrl = `${otreeDemoUrlPrefix}${paramJson.otreeName}`
    const initOptions = {method: 'GET', uri: otreeDemoClickUrl, resolveWithFullResponse: true}
    const initRes = await rp(initOptions)
    const waitingUrl = initRes.request.href
    console.log(waitingUrl)
    console.log(initRes.toJSON())
    if (waitingUrl.toString().indexOf('WaitUntilSessionCreated/') !== -1) {
        handleBody = await syncWaitingForCreated(waitingUrl)
    }
    let content = handleBody.split(otreeParticipantUrl)
    console.log(content)
    delete content[0]
    content.map(con => {
        if (playHashs.indexOf(con.slice(0, 8)) == -1) {
            playHashs.push(con.slice(0, 8))
        }
    })
    const playHashsConf: { hash: string, player: string }[] = []
    // 预设玩家 hash， 皆为未分配
    playHashs.map(hash => {
        playHashsConf.push({hash: hash, player: 'wait'})
    })
    const adminUrl = initRes.request.uri.path
    const newOtreePhase = await new ThirdPartPhase({
        param: param,
        groupId: groupId,
        namespace: namespace,
        playHashs: playHashsConf,
        adminUrl: adminUrl,
        prefixUrl: otreePlayUrl,
        ownerToken: ownerToken,
    }).save()

    const phaseId = newOtreePhase._id.toString()
    console.log(`initialPlayUrl: ${localOtreeRootUrl}/init/${otreeParticipantUrl}${phaseId}`)
    return {
        err: 0,
        phaseId: newOtreePhase._id.toString(),
        playUrl: `${localOtreeRootUrl}/init/${otreeParticipantUrl}${phaseId}`
    }
}

export {getUrlByNamespace, getDemoList}
