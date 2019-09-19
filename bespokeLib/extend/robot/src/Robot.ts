import {BaseRobot} from '@bespoke/robot';
import {Extractor, Wrapper} from '@extend/share';
import {config, FrameEmitter, IGameWithId, TGameState, TPlayerState} from '@bespoke/share';

export namespace Group {
    export class Robot<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, IRobotMeta = any> {
        game: IGameWithId<ICreateParams>
        frameEmitter: FrameEmitter<MoveType, PushType, IMoveParams, IPushParams>

        constructor(private host: BaseRobot<Wrapper.ICreateParams<ICreateParams>, Wrapper.IGameState<IGameState>, Wrapper.TPlayerState<IPlayerState>, Wrapper.MoveType<MoveType>, PushType, Wrapper.IMoveParams<IMoveParams>, IPushParams, IRobotMeta>) {
            const {playerState: {groupIndex}, game, frameEmitter} = host
            this.game = Extractor.game(game, groupIndex)
            this.frameEmitter = Extractor.frameEmitter(frameEmitter, groupIndex)
        }

        get meta(): IRobotMeta {
            return this.host.meta
        }

        get playerState(): TPlayerState<IPlayerState> {
            return Extractor.playerState(this.host.playerState)
        }

        get gameState(): TGameState<IGameState> {
            return Extractor.gameState(this.host.gameState, this.host.playerState.groupIndex)
        }

        async init(): Promise<this> {
            return this
        }
    }
}

export class Robot<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, IRobotMeta = {}>
    extends BaseRobot<Wrapper.ICreateParams<ICreateParams>, Wrapper.IGameState<IGameState>, Wrapper.TPlayerState<IPlayerState>, Wrapper.MoveType<MoveType>, PushType, Wrapper.IMoveParams<IMoveParams>, IPushParams, IRobotMeta> {

    GroupRobot: new(host: Robot<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, IRobotMeta>) => Group.Robot<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, IRobotMeta>

    groupRobot: Group.Robot<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, IRobotMeta>

    async init(): Promise<this> {
        await super.init()
        this.frameEmitter.emit(Wrapper.GroupMoveType.getGroup)
        const interval = setInterval(async () => {
            if (this.playerState && this.playerState.groupIndex !== undefined) {
                clearInterval(interval)
                this.groupRobot = new this.GroupRobot(this)
                await this.groupRobot.init()
            }
        }, config.minMoveInterval)
        return this
    }
}