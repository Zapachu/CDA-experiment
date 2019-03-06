'use strict'

import {serve as RPCServe} from '../../rpc'

const RPCWork = async () => {
    await RPCServe()
}

export {
    RPCWork
}
