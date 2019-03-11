import * as objectHash from 'object-hash'
import settings from '../../../../../config/settings'
import {ThirdPartPhase} from '../../../../../core/server/models'

const otreeDemoUrlPrefix = `${settings.oTreeServer}/demo/`
const otreeParticipantUrl = 'InitializeParticipant/'
const oTreeProxy = settings.oTreeProxy

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
    let inited = false, doneRes:any = {}, options:any = {}, handleBody = ''
    const syncWaitingForCreated= async (uri) => {
        while (!inited) {
            options = {method: 'GET', uri, resolveWithFullResponse: true}
            doneRes = await rp(options)
            if (doneRes.body.toString().indexOf(otreeParticipantUrl) !== -1) {
                inited = true
            }
            await sleep(1000)
        }
        return doneRes.body
    }
    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    const playHash = []
    const paramJson = JSON.parse(param)
    const gameInitUrl = `${otreeDemoUrlPrefix}${paramJson.otreeName}`
    const initOptions = {method: 'GET', uri: gameInitUrl, resolveWithFullResponse: true}
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
        if (playHash.indexOf(con.slice(0, 8)) == -1) {
            playHash.push(con.slice(0, 8))
        }
    })
    const playHashConf: { hash: string, player: string }[] = []
    // 预设玩家 hash， 皆为未分配
    playHash.map(hash => {
        playHashConf.push({hash: hash, player: 'wait'})
    })
    paramJson.adminUrl = initRes.request.uri.path
    const newOTreePhase = await new ThirdPartPhase({
        param: JSON.stringify(paramJson),
        groupId: groupId,
        namespace: namespace,
        playHash: playHashConf,
        ownerToken: gen32Token(owner.toString()),
    }).save()

    const phaseId = newOTreePhase._id.toString()
    console.log(`initialPlayUrl: ${oTreeProxy}/init/${otreeParticipantUrl}${phaseId}`)
    return {
        err: 0,
        phaseId: newOTreePhase._id.toString(),
        playUrl: `${oTreeProxy}/init/${otreeParticipantUrl}${phaseId}`
    }
}

export {getUrlByNamespace, getDemoList}
