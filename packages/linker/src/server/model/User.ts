import {IUser} from '@common'
import {Schema, Document, model} from 'mongoose'

const {String, Number} = Schema.Types

export interface UserDoc extends IUser, Document {
}

const UserSchema = new Schema({
    name: String,
    mobile : String,
    orgCode: String,
    password: String,
    role: Number
})

export const UserModel = model<UserDoc>('User', UserSchema)