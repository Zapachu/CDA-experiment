import {Document, Model, model, Schema} from 'mongoose'
import {getModels} from 'elf-protocol'
import {IGame, IGroupState, IPlayer, IUser} from '@common'

const {String} = Schema.Types

const models = getModels(model)

export type GameDoc = IGame & Document
export const GameModel: Model<GameDoc> = models.ElfGame

export type PlayerDoc = IPlayer & Document
export const PlayerModel: Model<PlayerDoc> = models.ElfPlayer

export type UserDoc = IUser & Document
export const UserModel: Model<UserDoc> = models.User

export type GroupStateDoc = {
    groupId: string,
    data: IGroupState
} & Document
export const GroupStateModel: Model<GroupStateDoc> = model('LinkerGroupState', new Schema({
    groupId: String,
    data: Object,
    createAt: {type: Date, default: Date.now},
    updateAt: {type: Date, default: Date.now}
}, {minimize: false}))
