//region AcademusBespoke
import {AcademusBespoke, academusBespoke} from './service/AcademusBespoke'

export {AcademusBespokeConsumer} from './service/AcademusBespoke'
//endregion

//region elf
export * from './proto/phaseManager'

export {gameService}
//endregion

import {Server, ServerCredentials} from 'grpc'
import {gameService, PhaseService, phaseService} from './service/PhaseManager'
import {config} from '@common'
import {Log, setting} from '@server-util'
import {readFileSync} from 'fs'
import {resolve} from 'path'

export function serve() {
    const server = new Server()
    server.addService(AcademusBespoke.service, academusBespoke)
    server.addService(PhaseService.service, phaseService)
    server.bind(setting.localServiceUri, ServerCredentials.createInsecure())
    server.start()
    setInterval(() => registerPhases(), 30000)
}

function registerPhases() {
    const {[`${config.buildManifest.clientVendorLib}.js`]:vendorPath} = JSON.parse(
        readFileSync(resolve(__dirname, `../../../../dist/${config.buildManifest.coreFile}`)).toString()
    )
    const phases = Object.entries(
        JSON.parse(
            readFileSync(resolve(__dirname, `../../../../dist/${config.buildManifest.gameFile}`)).toString()
        )
    ).map(([nsp, path]) => ({
        namespace: nsp.replace('.js', ''),
        jsUrl: `${setting.localRootUrl}${vendorPath};${setting.localRootUrl}${path}`,
        rpcUri: setting.localServiceUri
    }))
    gameService.registerPhases({phases}, err => err && Log.e(err))
}