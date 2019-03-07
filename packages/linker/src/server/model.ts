import {Document, Model, model} from 'mongoose'
import {getModels} from 'elf-protocol'
import {IGame, IPlayer, IUser} from '@common'

const models = getModels(model)

export type GameDoc = IGame & Document
export const GameModel: Model<GameDoc> = models.ElfGame

export type PlayerDoc = IPlayer & Document
export const PlayerModel: Model<PlayerDoc> = models.ElfPlayer

export type UserDoc = IUser & Document
export const UserModel: Model<UserDoc> = models.User