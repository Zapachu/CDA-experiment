export * from './setting'

import setting from './setting'

const {
    BESPOKE_NAMESPACE,
    BESPOKE_IP,
    BESPOKE_PORT,
    BESPOKE_RPC_PORT,
    BESPOKE_WITH_PROXY,
    BESPOKE_WITH_LINKER,
    OTREE_PORT,
    OTREE_RPC,
    OTREE_PROXY,
    OTREE_SERVER,
    OTREE_NAMESPACE
} = process.env

export const elfSetting = {
    ...setting,
    //region bespoke
    bespokeNamespace: BESPOKE_NAMESPACE,
    bespokeIp: BESPOKE_IP,
    bespokePort: +BESPOKE_PORT,
    bespokeRpcPort: +BESPOKE_RPC_PORT,
    bespokeWithProxy: BESPOKE_WITH_PROXY === 'true',
    bespokeWithLinker: BESPOKE_WITH_LINKER === 'true',
    //endregion
    //region otree
    oTreePort: +(OTREE_PORT || 3070),
    oTreeNamespace: OTREE_NAMESPACE || 'OtreeDefault',
    oTreeRpc: OTREE_RPC || '127.0.0.1:53070',
    oTreeProxy: OTREE_PROXY || 'http://127.0.0.1:3070',
    oTreeServer: OTREE_SERVER || 'http://127.0.0.1:8000',
    //endregion
}
