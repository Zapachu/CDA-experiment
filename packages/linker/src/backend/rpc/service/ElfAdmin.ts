import {Server} from 'grpc'
import {ElfAdmin} from '@elf/protocol'
import {elfSetting} from '@elf/setting'
import {GameService} from '../../service'

export function setElfService(server: Server) {

    function getOnlineTemplates(req: { request: ElfAdmin.TGetOnlineTemplatesReq }, callback: ElfAdmin.TGetOnlineTemplatesCallback) {
        GameService.getHeartBeats().then(phaseTemplates =>
            callback(null, {namespaces: phaseTemplates.map(({namespace}) => namespace)})
        )
    }

    ElfAdmin.setElfService(server, {getOnlineTemplates})
}

export function getAdminService() {
    return ElfAdmin.getAdminService(elfSetting.adminServiceUri)
}
