import {loadPackageDefinition, credentials, Server} from 'grpc'
import {loadSync} from '@grpc/proto-loader'
import {resolve} from 'path'
import {
    IGetOnlineTemplatesReq,
    IGetOnlineTemplatesRes,
    AdminService
} from './ElfAdmin'

export namespace ElfAdmin {
    let protoDef = loadPackageDefinition(loadSync(resolve(__dirname, './ElfAdmin.proto'))) as any

    let adminService: AdminService

    export function getAdminService(serviceURI: string): AdminService {
        if (!adminService) {
            try {
                adminService = new protoDef.AdminService(serviceURI, credentials.createInsecure())
            } catch (e) {
                console.error(e)
            }
        }
        return adminService
    }

    export type TGetOnlineTemplatesReq = IGetOnlineTemplatesReq
    export type TGetOnlineTemplatesCallback = (error?: Error, response?: IGetOnlineTemplatesRes) => void
    export type TElfService = {
        getOnlineTemplates(req: { request: TGetOnlineTemplatesReq }, callback: TGetOnlineTemplatesCallback): void
    }

    export function setElfService(server: Server, elfService: TElfService) {
        server.addService(protoDef.ElfService.service, elfService)
    }
}