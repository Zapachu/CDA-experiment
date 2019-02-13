import {qiNiu} from '@dev/client/script/setting'

export default {
    port: 3009,
    rpcPort: 53009,
    proxyService:{
        host: '127.0.0.1',
        port: 58888
    },
    qiNiu,
    ocpApim: {
        gateWay: 'https://api.cognitive.azure.cn/face/v1.0/detect',
        subscriptionKey: '4210--------------------'
    }
}