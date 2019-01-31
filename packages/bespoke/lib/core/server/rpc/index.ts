//region AcademusBespoke
import {AcademusBespoke, academusBespoke} from './service/AcademusBespoke'

export {AcademusBespokeConsumer} from './service/AcademusBespoke'
//endregion

//region elf
export * from './proto/phaseManager'

export {gameService}
//endregion

//region proxy
export * from './proto/BespokeProxy'
export {proxyService} from './service/BespokeProxy'
//endregion

import {Server, ServerCredentials} from 'grpc'
import {gameService, PhaseService, phaseService} from './service/PhaseManager'
import {config} from '@common'
import {Log, setting} from '@server-util'

export function serve() {
    const server = new Server()
    server.addService(AcademusBespoke.service, academusBespoke)
    server.addService(PhaseService.service, phaseService)
    server.bind(setting.localServiceUri, ServerCredentials.createInsecure())
    server.start()
    setInterval(() => registerPhases(), config.gameRegisterInterval)
}

function registerPhases() {
    const phases = [{
        namespace: setting.namespace,
        jsUrl: `https://${setting.host}:${setting.port}/${setting.getClientPath()}`,
        rpcUri: setting.localServiceUri
    }]
    gameService.registerPhases({phases}, err => err && Log.e(err))
}