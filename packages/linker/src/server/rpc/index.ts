import {elfSetting} from 'elf-setting'
import {Server, ServerCredentials} from 'grpc'
import {setGameService} from './service/PhaseManager'
import {setElfService} from './service/ElfAdmin'

export {getPhaseService} from './service/PhaseManager'
export {getAdminService} from './service/ElfAdmin'

export function serve() {
    const server = new Server()
    setGameService(server)
    setElfService(server)
    server.bind(`0.0.0.0:5${elfSetting.linkerPort}`, ServerCredentials.createInsecure())
    server.start()
}


