import setting from '../config/settings'
import {Server, ServerCredentials} from 'grpc'
import {GameService, gameService} from './service/PhaseManager'

export {getPhaseService} from './service/PhaseManager'

export * from './proto/phaseManager'

export function serve() {
    const server = new Server()
    server.addService(GameService.service, gameService)
    server.bind(`0.0.0.0:5${setting.port}`, ServerCredentials.createInsecure())
    server.start()
}


