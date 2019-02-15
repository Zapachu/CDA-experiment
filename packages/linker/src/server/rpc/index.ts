import setting from '../config/settings'
import {Server, ServerCredentials} from 'grpc'
import {setGameService} from './service/PhaseManager'

export {getPhaseService} from './service/PhaseManager'

export function serve() {
    const server = new Server()
    setGameService(server)
    server.bind(`0.0.0.0:5${setting.port}`, ServerCredentials.createInsecure())
    server.start()
}


