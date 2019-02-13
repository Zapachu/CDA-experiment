import {Schema, Document, Model, model} from 'mongoose'
import {IUser} from '@dev/common'

const {Types: {String, Number}} = Schema

export interface UserDoc extends IUser, Document {
}

export const UserSchema = new Schema({
    mobile: {type: String, unique: true},
    role: {type: Number, default: 0},
    orgCode: {type: String, default: '1070'}
})

export const UserModel = <Model<UserDoc>>model<UserDoc>('User', UserSchema)