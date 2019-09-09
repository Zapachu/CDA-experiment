import XJWT, {Type} from './XJWT';
import setting from './setting';

const token = encodeURIComponent(XJWT.encode(Type.JSON, {
    username:'test2',
    issuerId: setting.issuerId
}))
import {sendUserStatus, sendBackData} from './rpc'
/*console.log(token,XJWT.encode(Type.JSON, {
    username:'test2',
    issuerId: setting.issuerId
}), XJWT.decode(decodeURIComponent(token)))*/

const data = {
    username:'test',
    projectTitle:'projectTitle',
    status:'1',
    score:'94',
    startDate:Date.now() - 4000000,
    endDate:Date.now() - 1000000,
    timeUsed:'15',
    issuerId:'100400',
    attachmentId:'12',
}
sendUserStatus('test2')