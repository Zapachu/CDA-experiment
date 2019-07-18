import {BaseRobot} from '@bespoke/robot'
import {Extractor, Wrapper} from '@extend/share'
import {IActor, IGameWithId} from '@bespoke/share'

export namespace Group {
    export class Robot<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, IRobotMeta = any> {
        constructor(private game: IGameWithId<ICreateParams>, private actor: IActor, private meta?: IRobotMeta) {
            //TODO
        }
    }
}

export class Robot<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, IRobotMeta = {}>
    extends BaseRobot<Wrapper.ICreateParams<ICreateParams>, Wrapper.IGameState<IGameState>, Wrapper.IPlayerState<IPlayerState>, Wrapper.MoveType<MoveType>, PushType, Wrapper.IMoveParams<IMoveParams>, IPushParams, IRobotMeta> {

    GroupRobot: new(game: IGameWithId<ICreateParams>, actor: IActor, meta?: IRobotMeta) => Group.Robot<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, IRobotMeta>

    groupRobot: Group.Robot<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, IRobotMeta>

    async init(): Promise<this> {
        await super.init()
        this.frameEmitter.emit(Wrapper.GroupMoveType.getGroup)
        const interval = setInterval(() => {
            if (this.playerState && this.playerState.groupIndex) {
                clearInterval(interval)
                this.groupRobot = new this.GroupRobot(Extractor.game(this.game, this.playerState.groupIndex), this.actor, this.meta)
            }
        }, 1e2)
        return this
    }
}