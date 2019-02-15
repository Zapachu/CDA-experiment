import {loadPackageDefinition, credentials, Server} from 'grpc'
import {loadSync} from '@grpc/proto-loader'
import {resolve} from 'path'

import {ICheckShareCodeReq, ICheckShareCodeRes} from './def/AcademusBespoke'
import {proto} from './def/BespokeProxy'
import {
    GameService,
    PhaseService,
    INewPhaseReq,
    INewPhaseRes,
    IRegisterPhasesReq,
    RegisterPhasesReq,
    IRegisterPhasesRes,
    ISendBackPlayerReq,
    ISendBackPlayerRes
} from './def/phaseManager'

export namespace AcademusBespoke {
    let protoDef = loadPackageDefinition(loadSync(resolve(__dirname, './def/AcademusBespoke.proto'))) as any

    export type TCheckShareCodeReq = ICheckShareCodeReq
    export type TCheckShareCodeCallback = (error?: Error, response?: ICheckShareCodeRes) => void
    export type TBespokeService = {
        checkShareCode(req: { request: ICheckShareCodeReq }, callback: TCheckShareCodeCallback): void
    }

    export function setBespokeService(server: Server, bespokeService: TBespokeService) {
        server.addService(protoDef.BespokeService.service, bespokeService)
    }
}

export namespace BespokeProxy {
    let proxyServiceConsumer: proto.ProxyService

    export function getProxyService({host, port}: {
        host: string,
        port: number
    }): proto.ProxyService {
        if (!proxyServiceConsumer) {
            try {
                const {proto: {ProxyService}} = loadPackageDefinition(loadSync(resolve(__dirname, './BespokeProxy.proto'))) as any
                proxyServiceConsumer = new ProxyService(`${host}:${port}`, credentials.createInsecure()) as proto.ProxyService
            } catch (e) {
                console.error(e)
            }
        }
        return proxyServiceConsumer
    }
}

export namespace PhaseManager {
    let protoDef = loadPackageDefinition(loadSync(resolve(__dirname, './def/BespokeProxy.proto'))) as any

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

    let phaseService: TPhaseServiceConsumer

    export function getPhaseService(serviceURI: string): TPhaseServiceConsumer {
        if (!phaseService) {
            try {
                phaseService = new protoDef.PhaseService(serviceURI, credentials.createInsecure())
            } catch (e) {
                console.error(e)
            }
        }
        return phaseService
    }

    export type TRegisterPhasesReq = IRegisterPhasesReq
    export type IPhaseRegInfo = RegisterPhasesReq.IphaseRegInfo
    export type TRegisterPhasesCallBack = (error?: Error, response?: IRegisterPhasesRes) => void
    export type TSendBackPlayerReq = ISendBackPlayerReq
    export type TSendBackPlayerCallback = (error?: Error, response?: ISendBackPlayerRes) => void
    export type TGameService = {
        registerPhases(req: { request: TRegisterPhasesReq }, callback: TRegisterPhasesCallBack): void
        sendBackPlayer(req: { request: TSendBackPlayerReq }, callback: TSendBackPlayerCallback): void
    }

    export function setGameService(server: Server, gameService: TGameService) {
        server.addService(protoDef.GameService, gameService)
    }
}