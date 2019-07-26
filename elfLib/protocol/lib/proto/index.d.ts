import { Server } from 'grpc';
import { IGetOnlineTemplatesReq, IGetOnlineTemplatesRes, AdminService } from './ElfAdmin';
export declare namespace ElfAdmin {
    function getAdminService(serviceURI: string): AdminService;
    type TGetOnlineTemplatesReq = IGetOnlineTemplatesReq;
    type TGetOnlineTemplatesCallback = (error?: Error, response?: IGetOnlineTemplatesRes) => void;
    type TElfService = {
        getOnlineTemplates(req: {
            request: TGetOnlineTemplatesReq;
        }, callback: TGetOnlineTemplatesCallback): void;
    };
    function setElfService(server: Server, elfService: TElfService): void;
}
