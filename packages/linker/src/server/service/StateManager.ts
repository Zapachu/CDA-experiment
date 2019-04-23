import {
    baseEnum,
    CorePhaseNamespace,
    IGameWithId,
    IPhaseConfig,
    IPhaseState,
    NFrame,
    IActor,
    IGameState,
    IPhaseRegInfo
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
            const game = await GameService.getGame(gameId)
            stateManagers[gameId] = await (new StateManager(game)).init()
        }
        return stateManagers[gameId]
    }

    gameState: IGameState

    constructor(public game: IGameWithId) {
    }

    private async newPhase(phaseCfg: IPhaseConfig): Promise<IPhaseState> {
        if (phaseCfg.namespace === CorePhaseNamespace.start) {
            const {firstPhaseKey} = phaseCfg.param as any,
                firstPhaseCfg = this.game.phaseConfigs.find(({key}) => key === firstPhaseKey)
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
        const {rpcUri} = JSON.parse(regInfo) as IPhaseRegInfo
        return new Promise<IPhaseState>((resolve, reject) => {
            getPhaseService(rpcUri).newPhase({
                owner: this.game.owner,
                elfGameId: this.game.id,
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
        const gameStateDoc: GameStateDoc = await GameStateModel.findOne({gameId: this.game.id})
        if (gameStateDoc) {
            this.gameState = gameStateDoc.data
            return
        }
        this.gameState = {
            gameId: this.game.id,
            phaseStates: []
        }
        const startPhaseCfg = this.game.phaseConfigs.find(({namespace}) => namespace === CorePhaseNamespace.start)
        const phaseState = await this.newPhase(startPhaseCfg)
        this.gameState.phaseStates.push(phaseState)
        await new GameStateModel({gameId: this.game.id, data: this.gameState}).save()
    }

    async joinRoom(actor: IActor): Promise<void> {
        const {gameState: {phaseStates}} = this
        if (phaseStates.length === 1 && phaseStates[0].playerState[actor.token] === undefined) {
            phaseStates[0].playerState[actor.token] = {
                actor,
                status: baseEnum.PlayerStatus.playing
            }
        }
    }

    async setPhaseResult(playUrl: string, playerToken: string, phaseResult: PhaseManager.TPhaseResult): Promise<void> {
        const {game: {phaseConfigs}, gameState: {phaseStates}} = this
        const curPhaseState = phaseStates.find(phaseState => phaseState.playUrl === playUrl),
            curPhaseCfgIndex = phaseConfigs.findIndex(phaseCfg => phaseCfg.key === curPhaseState.key),
            playerCurPhaseState = curPhaseState.playerState[playerToken]
        playerCurPhaseState.phaseResult = {...playerCurPhaseState.phaseResult, ...phaseResult}
        if (!playerCurPhaseState || playerCurPhaseState.status === baseEnum.PlayerStatus.left) {
            Log.w('玩家不在此环节中')
        }
        const query = {gameId: this.game.id, playerId: playerCurPhaseState.actor.playerId}
        await PhaseResultModel.findOneAndUpdate(query, {
            ...query,
            phaseName: phaseConfigs[curPhaseCfgIndex].title,
            ...playerCurPhaseState.phaseResult
        }, {
            upsert: true
        })
    }

    async sendBackPlayer(playUrl: string, playerToken: string, nextPhaseKey: string, phaseResult: PhaseManager.TPhaseResult): Promise<void> {
        const {game: {phaseConfigs}, gameState: {phaseStates}} = this

        let nextPhaseState: IPhaseState
        const createNextPhase = async (phaseCfg: IPhaseConfig) => {
            nextPhaseState = await this.newPhase(phaseCfg)
            phaseStates.push(nextPhaseState)
        }
        const curPhaseState = phaseStates.find(phaseState => phaseState.playUrl === playUrl),
            curPhaseCfgIndex = phaseConfigs.findIndex(phaseCfg => phaseCfg.key === curPhaseState.key),
            playerCurPhaseState = curPhaseState.playerState[playerToken]
        if (!playerCurPhaseState || playerCurPhaseState.status === baseEnum.PlayerStatus.left) {
            Log.w('玩家不在此环节中')
        }
        playerCurPhaseState.status = baseEnum.PlayerStatus.left
        await this.setPhaseResult(playUrl, playerToken, phaseResult)
        let nextPhaseCfg = phaseConfigs.find(phaseCfg => phaseCfg.key === nextPhaseKey)
        if (!nextPhaseCfg) {
            if (curPhaseCfgIndex === phaseConfigs.length - 1) {
                return
            }
            nextPhaseCfg = phaseConfigs[curPhaseCfgIndex + 1]
        }
        if (nextPhaseCfg.key === curPhaseState.key) {
            curPhaseState.status = baseEnum.PhaseStatus.closed
            await createNextPhase(nextPhaseCfg)
        } else {
            nextPhaseState = phaseStates.find(({key, status}) =>
                key === nextPhaseKey && status !== baseEnum.PhaseStatus.closed)
            if (!nextPhaseState) {
                await createNextPhase(nextPhaseCfg)
            }
        }
        nextPhaseState.playerState[playerToken] = {
            actor: playerCurPhaseState.actor,
            status: baseEnum.PlayerStatus.playing
        }
    }

    broadcastState() {
        Log.d(JSON.stringify(this.gameState))
        EventDispatcher.socket.in(this.game.id)
            .emit(baseEnum.SocketEvent.downFrame, NFrame.DownFrame.syncGameState, this.gameState)
        GameStateModel.findOneAndUpdate({gameId: this.game.id}, {
            $set: {
                data: this.gameState,
                updateAt: Date.now()
            }
        }, {new: true}, err => err ? Log.e(err) : null)
    }
}
