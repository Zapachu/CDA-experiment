import {
    baseEnum,
    CorePhaseNamespace,
    IGameWithId,
    IPhaseConfig,
    IPhaseState,
    NFrame,
    IActor,
    IGameState
} from '@common'
import {getPhaseService} from '../rpc'
import {GameService} from './GameService'
import {GameStateDoc, GameStateModel, PhaseResultModel} from '@server-model'
import {EventDispatcher} from '../controller/eventDispatcher'
import {Log, RedisKey, redisClient} from '@server-util'
import {PhaseManager} from 'elf-protocol'

const stateManagers: { [gameId: string]: StateManager } = {}

export class StateManager {
    static async getManager(gameId: string) {
        if (!stateManagers[gameId]) {
            const group = await GameService.getGame(gameId)
            stateManagers[gameId] = await (new StateManager(group)).init()
        }
        return stateManagers[gameId]
    }

    gameState: IGameState

    constructor(public group: IGameWithId) {
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
                playerState: {}
            })
        }
        const regInfo = await redisClient.get(RedisKey.phaseRegInfo(phaseCfg.namespace))
        const {rpcUri} = JSON.parse(regInfo) as PhaseManager.IPhaseRegInfo
        return new Promise<IPhaseState>((resolve, reject) => {
            getPhaseService(rpcUri).newPhase({
                owner: this.group.owner,
                elfGameId: this.group.id,
                namespace: phaseCfg.namespace,
                param: JSON.stringify(phaseCfg.param)
            }, (err, res) => {
                if (err) {
                    return reject(err)
                }
                resolve({
                    key: phaseCfg.key,
                    status: baseEnum.PhaseStatus.playing,
                    playUrl: res.playUrl,
                    playerState: {}
                })
            })
        })
    }

    async init(): Promise<StateManager> {
        await this.initState()
        return this
    }

    async initState() {
        const gameStateDoc: GameStateDoc = await GameStateModel.findOne({gameId: this.group.id})
        if (gameStateDoc) {
            this.gameState = gameStateDoc.data
            return
        }
        this.gameState = {
            gameId: this.group.id,
            phaseStates: []
        }
        const startPhaseCfg = this.group.phaseConfigs.find(({namespace}) => namespace === CorePhaseNamespace.start)
        const phaseState = await this.newPhase(startPhaseCfg)
        this.gameState.phaseStates.push(phaseState)
        await new GameStateModel({gameId: this.group.id, data: this.gameState}).save()
    }

    async joinGroupRoom(actor: IActor): Promise<void> {
        const {gameState: {phaseStates}} = this
        if (phaseStates.length === 1 && phaseStates[0].playerState[actor.token] === undefined) {
            phaseStates[0].playerState[actor.token] = {
                actor,
                status: baseEnum.PlayerStatus.playing
            }
        }
    }

    async sendBackPlayer(playUrl: string, playerToken: string, nextPhaseKey: string, phaseResult: PhaseManager.TPhaseResult): Promise<void> {
        const {group: {phaseConfigs}, gameState: {phaseStates}} = this

        let nextPhaseState: IPhaseState
        const createNextPhase = async (phaseCfg: IPhaseConfig) => {
            nextPhaseState = await this.newPhase(phaseCfg)
            phaseStates.push(nextPhaseState)
        }
        const currentPhaseState = phaseStates.find(phaseState => phaseState.playUrl === playUrl),
            currentPhaseCfgIndex = phaseConfigs.findIndex(phaseCfg => phaseCfg.key === currentPhaseState.key),
            playerCurrentPhaseState = currentPhaseState.playerState[playerToken]
        playerCurrentPhaseState.status = baseEnum.PlayerStatus.left
        playerCurrentPhaseState.phaseResult = phaseResult
        await PhaseResultModel.create({
            gameId:this.group.id,
            playerId:playerCurrentPhaseState.actor.playerId,
            phaseName: phaseConfigs[currentPhaseCfgIndex].title,
            ...phaseResult
        })
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
        nextPhaseState.playerState[playerToken] = {
            actor: playerCurrentPhaseState.actor,
            status: baseEnum.PlayerStatus.playing
        }
    }

    broadcastState() {
        Log.d(JSON.stringify(this.gameState))
        EventDispatcher.socket.in(this.group.id)
            .emit(baseEnum.SocketEvent.downFrame, NFrame.DownFrame.syncGameState, this.gameState)
        GameStateModel.findOneAndUpdate({gameId: this.group.id}, {
            $set: {
                data: this.gameState,
                updateAt: Date.now()
            }
        }, {new: true}, err => err ? Log.e(err) : null)
    }
}
