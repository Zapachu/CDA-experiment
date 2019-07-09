import {Document, Model, model} from 'mongoose'
import {getModels} from '@elf/protocol'
import {IUser} from '@bespoke/share'

const models = getModels(model)

export type UserDoc = IUser & Document
export const UserModel: Model<UserDoc> = models.User

export * from './Game'
export * from './MoveLog'
export * from './FreeStyle'
