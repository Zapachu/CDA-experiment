//region AcademusBespoke
import {AcademusBespoke, academusBespoke} from './service/AcademusBespoke'

export {getAcademusService} from './service/AcademusBespoke'
//endregion

//region elf
export * from './proto/phaseManager'

export {getGameService}
//endregion

//region proxy
export * from './proto/BespokeProxy'
export {getProxyService} from './service/BespokeProxy'
//endregion

import {Server, ServerCredentials} from 'grpc'
import {getGameService, PhaseService, phaseService} from './service/PhaseManager'
import {config} from '@common'
import {Log, setting} from '@server-util'

export function serve() {
    const server = new Server()
    server.addService(AcademusBespoke.service, academusBespoke)
    server.addService(PhaseService.service, phaseService)
    server.bind(`0.0.0.0:${setting.rpcPort}`, ServerCredentials.createInsecure())
    server.start()
    setInterval(() => registerPhases(), config.gameRegisterInterval)
}

function registerPhases() {
    const {proxyService: {host, port}} = setting
    const phases = [{
        namespace: setting.namespace,
        jsUrl: `https://${host}:${port}/${setting.getClientPath()}`,
        rpcUri: setting.localServiceUri
      }]
    getGameService().registerPhases({phases}, err => err && Log.e(err))
}