import {BaseRobot} from '@bespoke/robot';
import {GroupDecorator} from '@extend/share';
import {config, FrameEmitter, TPlayerState} from '@bespoke/share';

export namespace Group {
    export class Robot<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, IRobotMeta = any> {
        groupParams: ICreateParams;
        groupFrameEmitter: FrameEmitter<MoveType, PushType, IMoveParams, IPushParams>;

        constructor(private host: BaseRobot<GroupDecorator.ICreateParams<ICreateParams>, GroupDecorator.IGameState<IGameState>, GroupDecorator.TPlayerState<IPlayerState>, GroupDecorator.MoveType<MoveType>, PushType, GroupDecorator.IMoveParams<IMoveParams>, IPushParams, IRobotMeta>) {
            const {playerState: {groupIndex}, game, frameEmitter} = host;
            this.groupParams = game.params.groupsParams[groupIndex];
            this.groupFrameEmitter = GroupDecorator.groupFrameEmitter(frameEmitter, groupIndex);
        }

        get meta(): IRobotMeta {
            return this.host.meta;
        }

        get playerState(): TPlayerState<IPlayerState> {
            return this.host.playerState;
        }

        get groupGameState(): IGameState {
            const {host: {gameState, playerState: {groupIndex}}} = this;
            return gameState.groups[groupIndex].state;
        }

        async init(): Promise<this> {
            return this;
        }
    }
}

export class Robot<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, IRobotMeta = {}>
    extends BaseRobot<GroupDecorator.ICreateParams<ICreateParams>, GroupDecorator.IGameState<IGameState>, GroupDecorator.TPlayerState<IPlayerState>, GroupDecorator.MoveType<MoveType>, PushType, GroupDecorator.IMoveParams<IMoveParams>, IPushParams, IRobotMeta> {

    GroupRobot: new(host: Robot<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, IRobotMeta>) => Group.Robot<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, IRobotMeta>;

    groupRobot: Group.Robot<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, IRobotMeta>;

    async init(): Promise<this> {
        await super.init();
        this.frameEmitter.emit(GroupDecorator.GroupMoveType.getGroup);
        const interval = setInterval(async () => {
            if (this.playerState && this.playerState.groupIndex !== undefined) {
                clearInterval(interval);
                this.groupRobot = new this.GroupRobot(this);
                await this.groupRobot.init();
            }
        }, config.minMoveInterval);
        return this;
    }
}