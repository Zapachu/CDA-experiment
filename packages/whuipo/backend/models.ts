import {model, Schema} from 'mongoose'
import {UserDoc} from './interfaces'

const UserSchema = new Schema({
  createAt: Date,
  updateAt: Date,
  mobile:   {type: String, unique: true}, // 手机号(11位)
  unionId: {type: String, unique: true},
  phaseScore: {type: Array, default:[]}
})

UserSchema.pre<UserDoc>('save', function (next) {
  this.updateAt = Date.now()
  next()
})

export const User = model<UserDoc>('User', UserSchema)


