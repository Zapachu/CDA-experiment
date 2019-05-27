import { Schema, model } from 'mongoose';
// const { ObjectId } = Schema.Types;
import { UserDoc } from './interfaces';
import {UserGameStatus} from './enums'
 
const UserSchema = new Schema({
  createAt: Date,
  updateAt: Date,

  unionId: { type: String, unique: true },
  status: {type: Number, default: UserGameStatus.beforeStart},
  nowJoinedGame: Number,
  playerUrl: String,
});

UserSchema.pre<UserDoc>('save', function (next) {
  this.updateAt = Date.now();
  next();
})

export const User = model<UserDoc>('User', UserSchema);


