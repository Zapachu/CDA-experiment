import {loadPackageDefinition, credentials, Server} from 'grpc'
import {loadSync} from '@grpc/proto-loader'
import {resolve} from 'path'
import {proto} from './BespokeProxy'
import {
    GameService,
    PhaseService,
    INewPhaseReq,
    INewPhaseRes,
    IPhaseResult,
    IRegisterPhasesReq,
    RegisterPhasesReq,
    IRegisterPhasesRes,
    ISendBackPlayerReq,
    ISendBackPlayerRes,
    ISetPhaseResultReq,
    ISetPhaseResultRes
} from './PhaseManager'
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

export namespace BespokeProxy {
    let proxyServiceConsumer: proto.ProxyService

    export function getProxyService(serviceURI: string): proto.ProxyService {
        if (!proxyServiceConsumer) {
            try {
                const {proto: {ProxyService}} = loadPackageDefinition(loadSync(resolve(__dirname, './BespokeProxy.proto'))) as any
                proxyServiceConsumer = new ProxyService(serviceURI, credentials.createInsecure()) as proto.ProxyService
            } catch (e) {
                console.error(e)
            }
        }
        return proxyServiceConsumer
    }
}

export namespace PhaseManager {
    export enum PhaseType {
        bespoke = 'bespoke',
        otree = 'otree',
        quatrics = 'quatrics',
        qqwj = 'qqwj',
        wjx = 'wjx'
    }

    let protoDef = loadPackageDefinition(loadSync(resolve(__dirname, './PhaseManager.proto'))) as any

    let gameService: GameService

    export function getGameService(serviceURI: string): GameService {
        if (!gameService) {
            try {
                gameService = new protoDef.GameService(serviceURI, credentials.createInsecure())
            } catch (e) {
                console.error(e)
            }
        }
        return gameService
    }

    export type TNewPhaseReq = INewPhaseReq
    export type TNewPhaseCallback = (error?: Error, response?: INewPhaseRes) => void
    export type TPhaseServiceProvider = {
        newPhase(req: { request: TNewPhaseReq }, callback: TNewPhaseCallback): void
    }
    export type TPhaseServiceConsumer = PhaseService

    export function setPhaseService(server: Server, phaseService: TPhaseServiceProvider) {
        server.addService(protoDef.PhaseService.service, phaseService)
    }

    export function getPhaseService(serviceURI: string): TPhaseServiceConsumer {
        return new protoDef.PhaseService(serviceURI, credentials.createInsecure())
    }

    export type TRegisterPhasesReq = IRegisterPhasesReq
    export type IPhaseRegInfo = RegisterPhasesReq.IphaseRegInfo
    export type TRegisterPhasesCallBack = (error?: Error, response?: IRegisterPhasesRes) => void
    export type TPhaseResult = IPhaseResult
    export type TSetPhaseResultReq = ISetPhaseResultReq
    export type TSetPhaseResultCallback = (error?: Error, response?: ISetPhaseResultRes) => void
    export type TSendBackPlayerReq = ISendBackPlayerReq
    export type TSendBackPlayerCallback = (error?: Error, response?: ISendBackPlayerRes) => void
    export type TGameService = {
        registerPhases(req: { request: TRegisterPhasesReq }, callback: TRegisterPhasesCallBack): void
        setPhaseResult(req: { request: TSetPhaseResultReq }, callback: TSetPhaseResultCallback): void
        sendBackPlayer(req: { request: TSendBackPlayerReq }, callback: TSendBackPlayerCallback): void
    }

    export function setGameService(server: Server, gameService: TGameService) {
        server.addService(protoDef.GameService.service, gameService)
    }
}
