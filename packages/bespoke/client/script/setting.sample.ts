import {config, IQiniuConfig} from 'bespoke-common'
import * as dateFormat from 'dateformat'

export const qiNiu:IQiniuConfig={
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