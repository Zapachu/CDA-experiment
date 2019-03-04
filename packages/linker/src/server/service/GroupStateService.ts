import {baseEnum, CorePhaseNamespace, IGroupState, IGameWithId, IPhaseConfig, IPhaseState, NFrame} from '@common'
import {getPhaseService} from '../rpc'
import {GameService} from './GameService'
import {EventDispatcher} from '../controller/eventDispatcher'
import {Log, RedisKey, redisClient} from '@server-util'
import {PhaseManager} from 'elf-protocol'

const groupStateServices: { [groupId: string]: GroupStateService } = {}

export class GroupStateService {
    static async getService(groupId: string) {
        if (!groupStateServices[groupId]) {
            const group = await GameService.getGame(groupId)
            groupStateServices[groupId] = await (new GroupStateService(group)).init()
        }
        return groupStateServices[groupId]
    }

    groupState: IGroupState

    constructor(public group: IGameWithId) {
        this.groupState = {
            groupId: group.id,
            phaseStates: []
        }
    }

    private async newPhase(phaseCfg: IPhaseConfig): Promise<IPhaseState> {
        if (phaseCfg.namespace === CorePhaseNamespace.start) {
            const {firstPhaseKey} = phaseCfg.param as any,
                firstPhaseCfg = this.group.phaseConfigs.find(({key}) => key === firstPhaseKey)
            return await this.newPhase(firstPhaseCfg)
        }
        if (phaseCfg.namespace === CorePhaseNamespace.end) {
            return Promise.resolve({
                key: phaseCfg.key,
                status: baseEnum.PhaseStatus.playing,
                playerStatus: {},
                playerPoint: {}
            })
        }
        const regInfo = await redisClient.get(RedisKey.phaseRegInfo(phaseCfg.namespace))
        const {rpcUri} = JSON.parse(regInfo) as PhaseManager.IPhaseRegInfo
        return new Promise<IPhaseState>((resolve, reject) => {
            getPhaseService(rpcUri).newPhase({
                owner: this.group.owner,
                groupId: this.group.id,
                namespace: phaseCfg.namespace,
                param: JSON.stringify(phaseCfg.param)
            }, (err, {playUrl}) => {
                if (err) {
                    return reject(err)
                }
                resolve({
                    key: phaseCfg.key,
                    status: baseEnum.PhaseStatus.playing,
                    playUrl,
                    playerStatus: {},
                    playerPoint: {}
                })
            })
        })
    }

    async init(): Promise<GroupStateService> {
        const startPhaseCfg = this.group.phaseConfigs.find(({namespace}) => namespace === CorePhaseNamespace.start)
        const phaseState = await this.newPhase(startPhaseCfg)
        this.groupState.phaseStates.push(phaseState)
        return this
    }

    async joinGroupRoom(token: string): Promise<void> {
        const {groupState: {phaseStates}} = this
        if (phaseStates.length === 1 && phaseStates[0].playerStatus[token] === undefined) {
            phaseStates[0].playerStatus[token] = baseEnum.PlayerStatus.playing
        }
    }

    async sendBackPlayer(playUrl: string, playerToken: string, nextPhaseKey: string, point: number): Promise<void> {
        const {group: {phaseConfigs}, groupState: {phaseStates}} = this

        let nextPhaseState
        const createNextPhase = async (phaseCfg: IPhaseConfig) => {
            nextPhaseState = await this.newPhase(phaseCfg)
            phaseStates.push(nextPhaseState)
        }
        const currentPhaseState = phaseStates.find(phaseState => phaseState.playUrl === playUrl),
            currentPhaseCfgIndex = phaseConfigs.findIndex(phaseCfg => phaseCfg.key === currentPhaseState.key)
        currentPhaseState.playerStatus[playerToken] = baseEnum.PlayerStatus.left
        currentPhaseState.playerPoint[playerToken] = point
        let phaseCfg = phaseConfigs.find(phaseCfg => phaseCfg.key === nextPhaseKey)
        if (!phaseCfg) {
            if (currentPhaseCfgIndex === phaseConfigs.length - 1) {
                return
            }
            phaseCfg = phaseConfigs[currentPhaseCfgIndex + 1]
        }
        if (phaseCfg.key === currentPhaseState.key) {
            currentPhaseState.status = baseEnum.PhaseStatus.closed
            await createNextPhase(phaseCfg)
        } else {
            nextPhaseState = phaseStates.find(
                ({key, status}) => key === nextPhaseKey && status !== baseEnum.PhaseStatus.closed
            )
            if (!nextPhaseState) {
                await createNextPhase(phaseCfg)
            }
        }
        nextPhaseState.playerStatus[playerToken] = baseEnum.PlayerStatus.playing
    }

    broadcastState() {
        Log.d(JSON.stringify(this.groupState))
        EventDispatcher.socket.in(this.group.id)
            .emit(baseEnum.SocketEvent.downFrame, NFrame.DownFrame.syncGroupState, this.groupState)
    }
}