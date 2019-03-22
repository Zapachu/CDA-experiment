import {elfSetting} from 'elf-setting'
import {Server, ServerCredentials} from 'grpc'
import {setGameService} from './service/PhaseManager'

export {getPhaseService} from './service/PhaseManager'

export function serve() {
    const server = new Server()
    setGameService(server)
    server.bind(`0.0.0.0:5${elfSetting.linkerPort}`, ServerCredentials.createInsecure())
    server.start()
}


