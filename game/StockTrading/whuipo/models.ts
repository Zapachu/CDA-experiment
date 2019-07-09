import { Schema, model } from 'mongoose';
// const { ObjectId } = Schema.Types;
import { UserDoc } from './interfaces';
 
const UserSchema = new Schema({
  createAt: Date,
  updateAt: Date,

  unionId: { type: String, unique: true },
  unblockGamePhase: Number
});

UserSchema.pre<UserDoc>('save', function (next) {
  this.updateAt = Date.now();
  next();
})

export const User = model<UserDoc>('User', UserSchema);

