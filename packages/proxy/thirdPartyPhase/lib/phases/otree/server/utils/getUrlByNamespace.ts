import * as objectHash from 'object-hash'
import {elfSetting as settings} from 'elf-setting'
import {ThirdPartPhase} from '../../../../core/server/models'
import * as rp from 'request-promise'
import ListMap from './ListMap'

const oTreeList = `${settings.oTreeServer}/demo/`
const playerUrl = 'InitializeParticipant/'
const oTreeProxy = settings.oTreeProxy

const gen32Token = (source) => {
    return objectHash(source, {algorithm: 'md5'})
}

// get demo list
export const getDemoList = async (namespace) => {
    const list = ListMap.getList(namespace)
    if (list.length > 0) {
        return list
    }
    const options = {method: 'GET', uri: oTreeList, resolveWithFullResponse: true}
    const demoListRes = await rp(options)
    const demoBody = demoListRes.body
    const demoHrefList = demoBody.match(/ <a href="\/demo\/(\S*)\/" class="list-group-item" target="_blank">/g)
    const demoList = demoHrefList.map(item =>
        item.match(/ <a href="\/demo\/(\S*)\/" class="list-group-item" target="_blank">/)[1]
    )
    await ListMap.setList(namespace, demoList)
    return demoList
}

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

const syncWaitingForCreated = async (uri) => {
    let inited = false, doneRes: any = {}, options: any = {}
    while (!inited) {
        options = {method: 'GET', uri, resolveWithFullResponse: true}
        doneRes = await rp(options)
        if (doneRes.body.toString().indexOf(playerUrl) !== -1) {
            inited = true
        }
        await sleep(1000)
    }
    return doneRes.body
}

// get play link
export const getUrlByNamespace = async ({elfGameId, namespace, param, owner}): Promise<any> => {
    let handleBody = ''
    const playHash = []
    const paramJson = JSON.parse(param)
    const initOptions = {
        method: 'GET',
        uri: `${oTreeList}${paramJson.otreeName}`,
        resolveWithFullResponse: true
    }
    const initRes = await rp(initOptions)
    const waitingUrl = initRes.request.href
    if (waitingUrl.toString().indexOf('WaitUntilSessionCreated/') !== -1) {
        handleBody = await syncWaitingForCreated(waitingUrl)
    } else if (waitingUrl.includes('SessionStartLinks')) {
        handleBody = initRes.body
    }
    let content = handleBody.split(playerUrl)
    delete content[0]
    content.map(con => {
        if (playHash.indexOf(con.slice(0, 8)) == -1) {
            playHash.push(con.slice(0, 8))
        }
    })
    const playHashConf = []
    playHash.map(hash => playHashConf.push({hash: hash, player: 'wait'}))
    paramJson.adminUrl = initRes.request.uri.path
    const newOTreePhase = await new ThirdPartPhase({
        param: JSON.stringify(paramJson),
        elfGameId: elfGameId,
        namespace: namespace,
        playHash: playHashConf,
        ownerToken: gen32Token(owner.toString())
    }).save()

    const phaseId = newOTreePhase._id.toString()
    return {
        err: 0,
        phaseId: newOTreePhase._id.toString(),
        playUrl: `${oTreeProxy}/init/${playerUrl}${phaseId}`
    }
}