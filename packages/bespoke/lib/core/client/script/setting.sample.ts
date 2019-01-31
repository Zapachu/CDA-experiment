import * as dateFormat from 'dateformat'
import {config} from '../../common'

export const qiNiu = {
    upload: {
        ACCESS_KEY: 'Cgc7------------------------------------',
        SECRET_KEY: 'QGyn------------------------------------',
        bucket: 'notes',
        path: `${config.rootName}/${dateFormat(Date.now(), 'yyyymmddHHMM')}`
    },
    download: {
        jsDomain: 'http://--------.bkt.clouddn.com'
    }
}