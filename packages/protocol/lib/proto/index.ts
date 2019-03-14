import {loadPackageDefinition, credentials, Server} from 'grpc'
import {loadSync} from '@grpc/proto-loader'
import {resolve} from 'path'

import {ICheckShareCodeReq, ICheckShareCodeRes} from './AcademusBespoke'
import {proto} from './BespokeProxy'
import {
    GameService,
    PhaseService,
    INewPhaseReq,
    INewPhaseRes,
    IRegisterPhasesReq,
    RegisterPhasesReq,
    IRegisterPhasesRes,
    ISendBackPlayerReq,
    ISendBackPlayerRes,
    SendBackPlayerReq
} from './PhaseManager'

export namespace AcademusBespoke {
    let protoDef = loadPackageDefinition(loadSync(resolve(__dirname, './AcademusBespoke.proto'))) as any

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
    export type TPhasePlayer = SendBackPlayerReq.IPhasePlayer
    export type TGameService = {
        registerPhases(req: { request: TRegisterPhasesReq }, callback: TRegisterPhasesCallBack): void
        sendBackPlayer(req: { request: TSendBackPlayerReq }, callback: TSendBackPlayerCallback): void
    }

    export function setGameService(server: Server, gameService: TGameService) {
        server.addService(protoDef.GameService.service, gameService)
    }
}
