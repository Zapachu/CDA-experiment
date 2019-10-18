import {Document, Model, model, Schema} from 'mongoose';
import {getModels} from '@elf/protocol';
import {IGame, IGameState, IPlayer, IUser} from 'linker-share';

const {String} = Schema.Types;

const models = getModels(model);

export type GameDoc = IGame & Document & { createAt: number }
export const GameModel: Model<GameDoc> = models.ElfGame;

export type PlayerDoc = IPlayer & Document
export const PlayerModel: Model<PlayerDoc> = models.ElfPlayer;

export type UserDoc = IUser & Document
export const UserModel: Model<UserDoc> = models.User;

export type GameStateDoc = {
    gameId: string,
    data: IGameState
} & Document
export const GameStateModel: Model<GameStateDoc> = model('LinkerGameState', new Schema({
    gameId: String,
    data: Object,
    createAt: {type: Date, default: Date.now},
    updateAt: {type: Date, default: Date.now}
}, {minimize: false}));
